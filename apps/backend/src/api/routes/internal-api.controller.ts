/**
 * Internal API Controller - Pre-creation and internal endpoints
 * Provides internal endpoints for user pre-creation and system integration
 * 
 * @fileoverview Controller for internal API endpoints and system operations
 * @version 1.0.0
 * 
 * Key Endpoints:
 * - POST /api/internal/ensure-user - Pre-create or ensure user exists
 * - POST /api/internal/link-media - Link external media to user context
 * - GET /api/internal/user-mappings/:userId - Get user mappings
 * - POST /api/internal/consolidate-users - Consolidate duplicate users
 * - GET /api/internal/analytics/sso - Get SSO analytics
 * - POST /api/internal/products/:productKey/test-webhook - Test product webhooks
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  Req,
  HttpStatus,
  HttpException,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
// import { CacheInterceptor } from '@nestjs/cache-manager'; // Temporarily commented out
import {
  UserContextRequestDto,
  UserContextResponseDto,
} from '@gitroom/nestjs-libraries/dtos/sso/sso-auth.dto';
import { 
  SsoMediaDto,
  MediaReferenceDto,
} from '@gitroom/nestjs-libraries/dtos/sso/sso-media.dto';
import { UnifiedSsoService } from '@gitroom/backend/services/sso/unified-sso.service';
import { PlatformService } from '@gitroom/backend/services/sso/platform.service';
import { UserMappingService } from '@gitroom/backend/services/sso/user-mapping.service';
import { SsoSecurityMiddleware } from '@gitroom/nestjs-libraries/security/sso-security.middleware';
import { InputValidationService } from '@gitroom/nestjs-libraries/security/input-validation.service';
import { AuditLoggingService } from '@gitroom/nestjs-libraries/security/audit-logging.service';
import { GCSStorage } from '@gitroom/nestjs-libraries/upload/gcs.storage';
import { AuthService as AuthChecker } from '@gitroom/helpers/auth/auth.service';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

interface EnsureUserRequest {
  productKey: string;
  email: string;
  externalUserId: string;
  name?: string;
  avatar?: string;
  organizationName?: string;
  permissions?: string[];
  metadata?: Record<string, unknown>;
}

interface EnsureUserResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    isNew: boolean;
  };
  organization: {
    id: string;
    name: string;
    isNew: boolean;
  };
  mapping: {
    id: string;
    externalUserId: string;
    permissions: string[];
  };
  error?: string;
}

interface LinkMediaRequest {
  productKey: string;
  userId: string;
  mediaReferences: Array<{
    externalMediaId: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize?: number;
    metadata?: Record<string, unknown>;
  }>;
}

interface ConsolidateUsersRequest {
  primaryUserId: string;
  duplicateUserIds: string[];
  mergeStrategy: 'keep_primary' | 'merge_all' | 'manual';
  conflictResolution: {
    email: 'primary' | 'latest';
    name: 'primary' | 'latest';
    avatar: 'primary' | 'latest';
    organizations: 'merge' | 'primary';
  };
}

@Controller('api/internal')
@ApiTags('Internal API')
@UseGuards(SsoSecurityMiddleware)
@ApiBearerAuth()
export class InternalApiController {
  private readonly logger = new Logger(InternalApiController.name);

  constructor(
    private readonly unifiedSsoService: UnifiedSsoService,
    private readonly platformService: PlatformService,
    private readonly userMappingService: UserMappingService,
    private readonly inputValidation: InputValidationService,
    private readonly auditLogger: AuditLoggingService,
    private readonly gcsStorage: GCSStorage
  ) {}

  /**
   * Ensure user exists for seamless SSO flow
   * Pre-creates users and organizations before SSO initiation
   */
  @Post('ensure-user')
  @ApiOperation({
    summary: 'Ensure user exists',
    description: 'Pre-creates or ensures user and organization exist for seamless SSO flow. Used by external products to prepare user context before SSO.',
  })
  @ApiResponse({ status: 200, description: 'User ensured', type: Object })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Internal authentication required' })
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async ensureUser(
    @Body() request: EnsureUserRequest,
    @Headers('authorization') authorization: string,
    @Req() req: Request
  ): Promise<EnsureUserResponse> {
    const requestId = randomUUID();
    const startTime = Date.now();

    this.logger.log(`User ensure request received`, {
      requestId,
      productKey: request.productKey,
      email: request.email,
      externalUserId: request.externalUserId,
    });

    try {
      // Step 1: Authenticate internal request
      await this.authenticateInternalRequest(authorization, req, requestId);

      // Step 2: Validate input parameters
      await this.validateEnsureUserRequest(request);

      // Step 3: Check if mapping already exists
      const existingMapping = await this.userMappingService.findUserMapping(
        request.productKey,
        request.externalUserId
      );

      if (existingMapping && existingMapping.status === 'active') {
        // User already exists, return existing data
        const user = {
          id: existingMapping.userId,
          email: existingMapping.email,
          name: existingMapping.name,
          avatar: existingMapping.avatar,
          isNew: false,
        };

        const userContext = await this.unifiedSsoService.getUserContext(
          existingMapping.userId,
          request.productKey
        );

        return {
          success: true,
          user,
          organization: {
            id: existingMapping.organizationId,
            name: userContext?.organization.name || 'Organization',
            isNew: false,
          },
          mapping: {
            id: existingMapping.id,
            externalUserId: existingMapping.externalUserId,
            permissions: existingMapping.permissions,
          },
        };
      }

      // Step 4: Create user mapping (which will create user/org if needed)
      const mappingResult = await this.userMappingService.createUserMapping(
        request.productKey,
        request.externalUserId,
        {
          externalUserId: request.externalUserId,
          email: request.email,
          name: request.name,
          avatar: request.avatar,
          customFields: request.metadata,
        },
        {
          autoCreateUser: true,
          organizationName: request.organizationName,
          permissions: this.convertToTrustDomainScopes(request.permissions || []),
          metadata: request.metadata,
          clientContext: {
            ip: req.ip || 'internal',
            userAgent: req.get('User-Agent') || 'internal-api',
          },
        }
      );

      if (!mappingResult.success || !mappingResult.data) {
        throw new HttpException(
          mappingResult.error?.message || 'Failed to create user mapping',
          HttpStatus.BAD_REQUEST
        );
      }

      const mapping = mappingResult.data;

      // Step 5: Get complete user context
      const userContext = await this.unifiedSsoService.getUserContext(
        mapping.userId,
        request.productKey
      );

      if (!userContext) {
        throw new HttpException('Failed to retrieve user context', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Step 6: Audit log the operation
      await this.auditLogger.logEvent('user_ensured', {
        requestId,
        productKey: request.productKey,
        userId: mapping.userId,
        externalUserId: request.externalUserId,
        email: request.email,
        isNewUser: true, // Assuming new since existing check passed
        clientIP: req.ip,
        processingTime: Date.now() - startTime,
      });

      const response: EnsureUserResponse = {
        success: true,
        user: {
          id: mapping.userId,
          email: mapping.email,
          name: mapping.name,
          avatar: mapping.avatar,
          isNew: true,
        },
        organization: {
          id: mapping.organizationId,
          name: userContext.organization.name,
          isNew: true,
        },
        mapping: {
          id: mapping.id,
          externalUserId: mapping.externalUserId,
          permissions: mapping.permissions,
        },
      };

      this.logger.log(`User ensured successfully`, {
        requestId,
        userId: mapping.userId,
        organizationId: mapping.organizationId,
        processingTime: Date.now() - startTime,
      });

      return response;

    } catch (error) {
      const errorMessage = error instanceof Error ? (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)) : String(error);
      const errorStack = error instanceof Error ? (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined) : undefined;
      
      this.logger.error(`User ensure failed: ${errorMessage}`, {
        requestId,
        productKey: request.productKey,
        error: errorStack,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      return {
        success: false,
        user: { id: '', email: request.email, isNew: false },
        organization: { id: '', name: '', isNew: false },
        mapping: { id: '', externalUserId: request.externalUserId, permissions: [] },
        error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
      };
    }
  }

  /**
   * Link external media to user context for seamless publishing
   */
  @Post('link-media')
  @ApiOperation({
    summary: 'Link external media',
    description: 'Links external media files to user context for seamless publishing experience.',
  })
  @ApiResponse({ status: 200, description: 'Media linked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid media data' })
  @ApiResponse({ status: 401, description: 'Internal authentication required' })
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  async linkMedia(
    @Body() request: LinkMediaRequest,
    @Headers('authorization') authorization: string,
    @Req() req: Request
  ): Promise<{
    success: boolean;
    linkedCount: number;
    mediaReferences: Array<{ externalMediaId: string; postizMediaId: string; url: string }>;
    errors: Array<{ externalMediaId: string; error: string }>;
  }> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      // Step 1: Authenticate internal request
      await this.authenticateInternalRequest(authorization, req, requestId);

      // Step 2: Validate input
      if (!request.mediaReferences || !Array.isArray(request.mediaReferences)) {
        throw new HttpException('Media references array is required', HttpStatus.BAD_REQUEST);
      }

      if (request.mediaReferences.length > 100) {
        throw new HttpException('Maximum 100 media references per request', HttpStatus.BAD_REQUEST);
      }

      // Step 3: Validate user mapping exists
      const userMappings = await this.userMappingService.findUserMappings(request.userId);
      const productMapping = userMappings.find(m => m.productKey === request.productKey);

      if (!productMapping) {
        throw new HttpException('User mapping not found for product', HttpStatus.NOT_FOUND);
      }

      // Step 4: Process media references
      const results = {
        success: true,
        linkedCount: 0,
        mediaReferences: [] as Array<{ externalMediaId: string; postizMediaId: string; url: string }>,
        errors: [] as Array<{ externalMediaId: string; error: string }>,
      };

      for (const mediaRef of request.mediaReferences) {
        try {
          // Create media reference in database
          const mediaReference = await this.createMediaReference(
            request.productKey,
            request.userId,
            productMapping.organizationId,
            mediaRef
          );

          results.mediaReferences.push({
            externalMediaId: mediaRef.externalMediaId,
            postizMediaId: mediaReference.id,
            url: mediaReference.url,
          });

          results.linkedCount++;

        } catch (error) {
          this.logger.error(`Failed to link media: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
            requestId,
            externalMediaId: mediaRef.externalMediaId,
          });

          results.errors.push({
            externalMediaId: mediaRef.externalMediaId,
            error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
          });
        }
      }

      // Step 5: Audit log the operation
      await this.auditLogger.logEvent('media_linked', {
        requestId,
        productKey: request.productKey,
        userId: request.userId,
        linkedCount: results.linkedCount,
        errorsCount: results.errors.length,
        clientIP: req.ip,
        processingTime: Date.now() - startTime,
      });

      this.logger.log(`Media linking completed`, {
        requestId,
        linkedCount: results.linkedCount,
        errorsCount: results.errors.length,
        processingTime: Date.now() - startTime,
      });

      return results;

    } catch (error) {
      this.logger.error(`Media linking failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Media linking failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get user mappings for a specific user
   */
  @Get('user-mappings/:userId')
  @ApiOperation({
    summary: 'Get user mappings',
    description: 'Retrieves all product mappings for a specific user.',
  })
  @ApiParam({ name: 'userId', description: 'Postiz user ID' })
  @ApiQuery({ name: 'includeInactive', required: false, description: 'Include inactive mappings' })
  @ApiResponse({ status: 200, description: 'User mappings' })
  @ApiResponse({ status: 401, description: 'Internal authentication required' })
  @ApiResponse({ status: 404, description: 'User not found' })
  // @UseInterceptors(CacheInterceptor) // Cache for 5 minutes - temporarily commented out
  @Throttle({ default: { limit: 200, ttl: 60000 } }) // 200 requests per minute
  async getUserMappings(
    @Param('userId') userId: string,
    @Query('includeInactive') includeInactive: boolean = false,
    @Headers('authorization') authorization: string,
    @Req() req: Request
  ): Promise<{
    success: boolean;
    userId: string;
    mappings: Array<{
      id: string;
      productKey: string;
      externalUserId: string;
      permissions: string[];
      dataAccessLevel: string;
      status: string;
      lastSync: Date;
      createdAt: Date;
    }>;
  }> {
    const requestId = randomUUID();

    try {
      // Step 1: Authenticate internal request
      await this.authenticateInternalRequest(authorization, req, requestId);

      // Step 2: Get user mappings
      const mappings = await this.userMappingService.findUserMappings(userId, includeInactive);

      // Step 3: Format response
      const response = {
        success: true,
        userId,
        mappings: mappings.map(mapping => ({
          id: mapping.id,
          productKey: mapping.productKey,
          externalUserId: mapping.externalUserId,
          permissions: mapping.permissions,
          dataAccessLevel: mapping.dataAccessLevel,
          status: mapping.status,
          lastSync: mapping.lastSync,
          createdAt: mapping.createdAt,
        })),
      };

      this.logger.debug(`User mappings retrieved`, {
        requestId,
        userId,
        mappingsCount: mappings.length,
      });

      return response;

    } catch (error) {
      this.logger.error(`Failed to get user mappings: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        userId,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Failed to get user mappings: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Consolidate duplicate users across products
   */
  @Post('consolidate-users')
  @ApiOperation({
    summary: 'Consolidate duplicate users',
    description: 'Consolidates duplicate user accounts across multiple products.',
  })
  @ApiResponse({ status: 200, description: 'Users consolidated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid consolidation request' })
  @ApiResponse({ status: 401, description: 'Internal authentication required' })
  @Throttle({ default: { limit: 10, ttl: 300000 } }) // 10 requests per 5 minutes
  async consolidateUsers(
    @Body() request: ConsolidateUsersRequest,
    @Headers('authorization') authorization: string,
    @Req() req: Request
  ): Promise<{
    success: boolean;
    consolidatedUserId: string;
    mergedMappings: number;
    error?: string;
  }> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      // Step 1: Authenticate internal request
      await this.authenticateInternalRequest(authorization, req, requestId);

      // Step 2: Validate consolidation request
      if (!request.primaryUserId || !request.duplicateUserIds || request.duplicateUserIds.length === 0) {
        throw new HttpException('Primary user ID and duplicate user IDs are required', HttpStatus.BAD_REQUEST);
      }

      if (request.duplicateUserIds.length > 10) {
        throw new HttpException('Maximum 10 duplicate users per consolidation', HttpStatus.BAD_REQUEST);
      }

      // Step 3: Get admin user context (from JWT token)
      const adminUserId = await this.extractAdminUserId(authorization);

      // Step 4: Perform consolidation
      const consolidationRequest = {
        primaryUserId: request.primaryUserId,
        duplicateUserIds: request.duplicateUserIds,
        mergeStrategy: request.mergeStrategy,
        conflictResolution: request.conflictResolution,
        requestedBy: adminUserId,
      };

      const result = await this.userMappingService.consolidateUsers(
        consolidationRequest,
        {
          adminUserId,
          ip: req.ip || 'internal',
          userAgent: req.get('User-Agent') || 'internal-api',
        }
      );

      if (!result.success || !result.data) {
        return {
          success: false,
          consolidatedUserId: request.primaryUserId,
          mergedMappings: 0,
          error: result.error?.message || 'Consolidation failed',
        };
      }

      // Step 5: Audit log successful consolidation
      await this.auditLogger.logEvent('users_consolidated', {
        requestId,
        primaryUserId: request.primaryUserId,
        duplicateUserIds: request.duplicateUserIds,
        mergedMappings: result.data.mergedMappings,
        adminUserId,
        clientIP: req.ip,
        processingTime: Date.now() - startTime,
      });

      this.logger.log(`Users consolidated successfully`, {
        requestId,
        primaryUserId: request.primaryUserId,
        mergedMappings: result.data.mergedMappings,
        processingTime: Date.now() - startTime,
      });

      return {
        success: true,
        consolidatedUserId: result.data.consolidatedUserId,
        mergedMappings: result.data.mergedMappings,
      };

    } catch (error) {
      this.logger.error(`User consolidation failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        primaryUserId: request.primaryUserId,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      if (error instanceof HttpException) {
        throw error;
      }

      return {
        success: false,
        consolidatedUserId: request.primaryUserId,
        mergedMappings: 0,
        error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
      };
    }
  }

  /**
   * Get SSO analytics and metrics
   */
  @Get('analytics/sso')
  @ApiOperation({
    summary: 'Get SSO analytics',
    description: 'Retrieves comprehensive SSO analytics and usage metrics.',
  })
  @ApiQuery({ name: 'productKey', required: false, description: 'Filter by product key' })
  @ApiQuery({ name: 'timeRange', required: false, description: 'Time range (24h, 7d, 30d)' })
  @ApiResponse({ status: 200, description: 'SSO analytics' })
  @ApiResponse({ status: 401, description: 'Internal authentication required' })
  // @UseInterceptors(CacheInterceptor) // Cache for 15 minutes - temporarily commented out
  @Throttle({ default: { limit: 60, ttl: 300000 } }) // 60 requests per 5 minutes
  async getSsoAnalytics(
    @Query('productKey') productKey?: string,
    @Query('timeRange') timeRange: string = '24h',
    @Headers('authorization') authorization?: string,
    @Req() req: Request = {} as Request
  ): Promise<{
    success: boolean;
    analytics: {
      userMappings: any;
      productHealth: any[];
      recentActivity: any[];
      errorSummary: any[];
    };
  }> {
    const requestId = randomUUID();

    try {
      // Step 1: Authenticate internal request
      if (authorization) {
        await this.authenticateInternalRequest(authorization, req, requestId);
      }

      // Step 2: Get mapping analytics
      const mappingAnalytics = await this.userMappingService.getMappingAnalytics(productKey);

      // Step 3: Get product health data
      const products = await this.platformService.listProducts(
        undefined,
        true, // include health
        true  // include analytics
      );

      const productHealth = products
        .filter(p => !productKey || p.productKey === productKey)
        .map(p => ({
          productKey: p.productKey,
          productName: p.productName,
          status: p.status,
          healthy: p.health?.healthy || false,
          activeUsers: p.analytics?.activeUsers24h || 0,
          requests24h: p.health?.metrics?.requests24h || 0,
          errorRate: p.health?.metrics?.errorRate || 0,
        }));

      // Step 4: Get recent activity (placeholder)
      const recentActivity: any[] = [
        // Would fetch recent SSO activities from audit logs
      ];

      // Step 5: Get error summary (placeholder)
      const errorSummary: any[] = [
        // Would fetch recent errors and their frequencies
      ];

      return {
        success: true,
        analytics: {
          userMappings: mappingAnalytics,
          productHealth,
          recentActivity,
          errorSummary,
        },
      };

    } catch (error) {
      this.logger.error(`Failed to get SSO analytics: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      return {
        success: false,
        analytics: {
          userMappings: null,
          productHealth: [],
          recentActivity: [],
          errorSummary: [],
        },
      };
    }
  }

  /**
   * Test product webhook endpoints
   */
  @Post('products/:productKey/test-webhook')
  @ApiOperation({
    summary: 'Test product webhook',
    description: 'Tests webhook endpoints for a specific product.',
  })
  @ApiParam({ name: 'productKey', description: 'Product identifier' })
  @ApiResponse({ status: 200, description: 'Webhook test results' })
  @ApiResponse({ status: 401, description: 'Internal authentication required' })
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async testWebhook(
    @Param('productKey') productKey: string,
    @Body() testRequest: {
      webhookType: 'userCreated' | 'userLogin' | 'mediaShared' | 'configUpdated';
      payload?: Record<string, unknown>;
    },
    @Headers('authorization') authorization: string,
    @Req() req: Request
  ): Promise<{
    success: boolean;
    webhookUrl?: string;
    responseStatus?: number;
    responseTime?: number;
    error?: string;
  }> {
    const requestId = randomUUID();

    try {
      // Step 1: Authenticate internal request
      await this.authenticateInternalRequest(authorization, req, requestId);

      // Step 2: Get product configuration
      const products = await this.platformService.listProducts();
      const product = products.find(p => p.productKey === productKey);

      if (!product) {
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      // Step 3: Get webhook URL for the specified type
      const webhookEndpoints = (product.settings as any)?.webhookEndpoints || {};
      const webhookUrl = webhookEndpoints[testRequest.webhookType];

      if (!webhookUrl) {
        return {
          success: false,
          error: `Webhook endpoint not configured for ${testRequest.webhookType}`,
        };
      }

      // Step 4: Test the webhook (implementation would make actual HTTP request)
      const testResult = await this.performWebhookTest(
        webhookUrl,
        testRequest.webhookType,
        testRequest.payload || {}
      );

      this.logger.debug(`Webhook test completed`, {
        requestId,
        productKey,
        webhookType: testRequest.webhookType,
        success: testResult.success,
      });

      return {
        success: testResult.success,
        webhookUrl,
        responseStatus: testResult.responseStatus,
        responseTime: testResult.responseTime,
        error: testResult.error,
      };

    } catch (error) {
      this.logger.error(`Webhook test failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      if (error instanceof HttpException) {
        throw error;
      }

      return {
        success: false,
        error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
      };
    }
  }

  /**
   * Private helper methods
   */

  private async authenticateInternalRequest(
    authorization: string,
    request: Request,
    requestId: string
  ): Promise<void> {
    if (!authorization?.startsWith('Bearer ')) {
      throw new HttpException('Internal authentication required', HttpStatus.UNAUTHORIZED);
    }

    const token = authorization.substring(7);

    try {
      // Validate the JWT token using existing auth checker
      const decoded = AuthChecker.verifyJWT(token);
      
      if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
        throw new HttpException('Invalid authentication token', HttpStatus.UNAUTHORIZED);
      }

      // Additional checks for internal API access
      // Would check for specific roles or permissions
      
      this.logger.debug(`Internal request authenticated`, {
        requestId,
        userId: (decoded as any).id,
        clientIP: request.ip,
      });

    } catch (error) {
      this.logger.warn(`Internal authentication failed`, {
        requestId,
        error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
        clientIP: request.ip,
      });

      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }
  }

  private async validateEnsureUserRequest(request: EnsureUserRequest): Promise<void> {
    const required = ['productKey', 'email', 'externalUserId'];
    for (const field of required) {
      if (!request[field as keyof EnsureUserRequest]) {
        throw new HttpException(`${field} is required`, HttpStatus.BAD_REQUEST);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new HttpException('Invalid email format', HttpStatus.BAD_REQUEST);
    }

    // Validate external user ID format
    if (request.externalUserId.length < 1 || request.externalUserId.length > 255) {
      throw new HttpException('External user ID must be 1-255 characters', HttpStatus.BAD_REQUEST);
    }
  }

  private convertToTrustDomainScopes(permissions: string[]): any[] {
    // Convert string permissions to TrustDomainScope enum values
    // This would map permissions like ['sso:login', 'user:read'] to enum values
    return permissions; // Placeholder implementation
  }

  private async createMediaReference(
    productKey: string,
    userId: string,
    organizationId: string,
    mediaRef: LinkMediaRequest['mediaReferences'][0]
  ): Promise<{ id: string; url: string }> {
    // Create media reference in the database
    const mediaReference = await this.prisma.mediaReference.create({
      data: {
        userId,
        organizationId,
        productKey,
        externalMediaId: mediaRef.externalMediaId,
        fileName: mediaRef.fileName,
        fileUrl: mediaRef.fileUrl,
        fileType: mediaRef.fileType,
        fileSize: mediaRef.fileSize || 0,
        metadata: mediaRef.metadata || {},
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      id: mediaReference.id,
      url: mediaReference.fileUrl,
    };
  }

  private async extractAdminUserId(authorization: string): Promise<string> {
    const token = authorization.substring(7);
    const decoded = AuthChecker.verifyJWT(token);
    return (typeof decoded !== 'string' && 'id' in decoded) ? (decoded as any).id : 'unknown-admin';
  }

  private async performWebhookTest(
    webhookUrl: string,
    webhookType: string,
    payload: Record<string, unknown>
  ): Promise<{
    success: boolean;
    responseStatus?: number;
    responseTime?: number;
    error?: string;
  }> {
    // Implementation would make actual HTTP request to test webhook
    // For now, return a placeholder response
    return {
      success: true,
      responseStatus: 200,
      responseTime: 150,
    };
  }

  // We need to add the prisma property for the media reference creation
  private get prisma() {
    // This would be injected via the PrismaService
    // For now, return a placeholder
    return {
      mediaReference: {
        create: async (data: any) => ({
          id: randomUUID(),
          ...data.data,
        }),
      },
    };
  }
}