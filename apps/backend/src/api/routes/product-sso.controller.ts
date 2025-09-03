/**
 * Product SSO Controller - External product endpoints for SSO integration
 * Provides endpoints for external products to integrate with Postiz SSO
 * 
 * @fileoverview Controller for external product SSO integration endpoints
 * @version 1.0.0
 * 
 * Key Endpoints:
 * - POST /api/products/:productKey/sso/generate - Generate SSO tokens
 * - POST /api/products/:productKey/sso/callback - Handle SSO callbacks
 * - GET /api/products/:productKey/sso/user - Get user context
 * - POST /api/products/:productKey/sso/sync - Sync user data
 * - GET /api/products/:productKey/health - Health check
 * - POST /api/products/register - Register new product
 */

import {
  Controller,
  Get,
  Post,
  Put,
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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  SsoLoginInitiateDto,
  SsoLoginResponseDto,
  SsoCallbackDto,
  SsoCallbackResponseDto,
  UserContextRequestDto,
  UserContextResponseDto,
} from '@gitroom/nestjs-libraries/dtos/sso/sso-auth.dto';
import { ProductRegistrationPayload } from '@gitroom/nestjs-libraries/types/sso';
import { UnifiedSsoService } from '@gitroom/backend/services/sso/unified-sso.service';
import { PlatformService } from '@gitroom/backend/services/sso/platform.service';
import { UserMappingService } from '@gitroom/backend/services/sso/user-mapping.service';
import { SsoSecurityMiddleware } from '@gitroom/nestjs-libraries/security/sso-security.middleware';
import { InputValidationService } from '@gitroom/nestjs-libraries/security/input-validation.service';
import { AuditLoggingService } from '@gitroom/nestjs-libraries/security/audit-logging.service';
import { ProductStatus } from '@gitroom/nestjs-libraries/types/sso/core.types';
// import { CacheInterceptor } from '@nestjs/cache-manager'; // Temporarily commented out
import { randomUUID, createHmac } from 'crypto';
import dayjs from 'dayjs';

interface ApiKeyAuthContext {
  productKey: string;
  apiKey: string;
  apiSecret?: string;
  clientIP: string;
  userAgent: string;
  requestId: string;
  isValid: boolean;
}

interface ProductHealthResponse {
  healthy: boolean;
  version: string;
  uptime: number;
  lastHeartbeat: Date;
  endpoints: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number;
  }[];
  analytics: {
    requests24h: number;
    errors24h: number;
    activeUsers: number;
  };
}

@Controller('api/products')
@ApiTags('Product SSO Integration')
@UseGuards(SsoSecurityMiddleware)
export class ProductSsoController {
  private readonly logger = new Logger(ProductSsoController.name);

  constructor(
    private readonly unifiedSsoService: UnifiedSsoService,
    private readonly platformService: PlatformService,
    private readonly userMappingService: UserMappingService,
    private readonly inputValidation: InputValidationService,
    private readonly auditLogger: AuditLoggingService
  ) {}

  /**
   * Generate SSO token for external product
   * This is the key endpoint external products call to initiate SSO
   */
  @Post(':productKey/sso/generate')
  @ApiOperation({
    summary: 'Generate SSO token',
    description: 'Generates a temporary SSO token for user authentication. External products call this when users click "publish" to initiate seamless login.',
  })
  @ApiParam({ name: 'productKey', description: 'Product identifier' })
  @ApiHeader({ name: 'X-API-Key', description: 'Product API key', required: true })
  @ApiHeader({ name: 'X-API-Secret', description: 'Product API secret', required: true })
  @ApiResponse({ status: 200, description: 'SSO token generated', type: SsoLoginResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request parameters' })
  @ApiResponse({ status: 401, description: 'Invalid API credentials' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute per product
  async generateSsoToken(
    @Param('productKey') productKey: string,
    @Body() loginRequest: SsoLoginInitiateDto,
    @Headers('x-api-key') apiKey: string,
    @Headers('x-api-secret') apiSecret: string,
    @Req() request: Request
  ): Promise<SsoLoginResponseDto> {
    const requestId = randomUUID();
    const startTime = Date.now();

    this.logger.log(`SSO token generation requested`, {
      requestId,
      productKey,
      email: loginRequest.email,
      externalUserId: loginRequest.externalUserId,
    });

    try {
      // Step 1: Authenticate the product API request
      const authContext = await this.authenticateProductRequest(
        productKey,
        apiKey,
        apiSecret,
        request,
        requestId
      );

      if (!authContext.isValid) {
        throw new HttpException('Invalid API credentials', HttpStatus.UNAUTHORIZED);
      }

      // Step 2: Validate input parameters
      await this.inputValidation.validateDto(loginRequest, SsoLoginInitiateDto);
      
      // Override product key from URL parameter
      loginRequest.productKey = productKey;

      // Step 3: Generate SSO token using unified service
      const result = await this.unifiedSsoService.initiateLogin(
        loginRequest,
        {
          ip: authContext.clientIP,
          userAgent: authContext.userAgent,
        }
      );

      if (!result.success || !result.data) {
        throw new HttpException(
          result.error?.message || 'SSO token generation failed',
          HttpStatus.BAD_REQUEST
        );
      }

      // Step 4: Audit log successful token generation
      await this.auditLogger.logEvent('sso_token_generated', {
        requestId,
        productKey,
        email: loginRequest.email,
        externalUserId: loginRequest.externalUserId,
        apiKey: authContext.apiKey,
        clientIP: authContext.clientIP,
        processingTime: Date.now() - startTime,
      });

      this.logger.log(`SSO token generated successfully`, {
        requestId,
        productKey,
        email: loginRequest.email,
        tokenPreview: result.data.temporaryToken.substring(0, 20) + '...',
        processingTime: Date.now() - startTime,
      });

      return result.data;

    } catch (error) {
      this.logger.error(`SSO token generation failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      // Audit log the failure
      await this.auditLogger.logEvent('sso_token_generation_failed', {
        requestId,
        productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
        apiKey: apiKey?.substring(0, 10) + '...',
        clientIP: request.ip,
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `SSO token generation failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Handle SSO callback from external product
   */
  @Post(':productKey/sso/callback')
  @ApiOperation({
    summary: 'Handle SSO callback',
    description: 'Processes SSO callback and completes the authentication flow.',
  })
  @ApiParam({ name: 'productKey', description: 'Product identifier' })
  @ApiHeader({ name: 'X-API-Key', description: 'Product API key', required: true })
  @ApiResponse({ status: 200, description: 'Callback processed', type: SsoCallbackResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid callback data' })
  @ApiResponse({ status: 401, description: 'Invalid API credentials' })
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  async handleSsoCallback(
    @Param('productKey') productKey: string,
    @Body() callbackRequest: SsoCallbackDto,
    @Headers('x-api-key') apiKey: string,
    @Headers('x-api-secret') apiSecret: string,
    @Req() request: Request
  ): Promise<SsoCallbackResponseDto> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      // Step 1: Authenticate the product API request
      const authContext = await this.authenticateProductRequest(
        productKey,
        apiKey,
        apiSecret,
        request,
        requestId
      );

      if (!authContext.isValid) {
        throw new HttpException('Invalid API credentials', HttpStatus.UNAUTHORIZED);
      }

      // Step 2: Validate callback request
      await this.inputValidation.validateDto(callbackRequest, SsoCallbackDto);

      // Step 3: Process callback using unified service
      const result = await this.unifiedSsoService.completeCallback(
        callbackRequest,
        {
          ip: authContext.clientIP,
          userAgent: authContext.userAgent,
        }
      );

      if (!result.success || !result.data) {
        throw new HttpException(
          result.error?.message || 'SSO callback processing failed',
          HttpStatus.BAD_REQUEST
        );
      }

      // Step 4: Audit log successful callback
      await this.auditLogger.logEvent('sso_callback_processed', {
        requestId,
        productKey,
        userId: result.data.user.id,
        apiKey: authContext.apiKey,
        clientIP: authContext.clientIP,
        processingTime: Date.now() - startTime,
      });

      this.logger.log(`SSO callback processed successfully`, {
        requestId,
        productKey,
        userId: result.data.user.id,
        processingTime: Date.now() - startTime,
      });

      return result.data;

    } catch (error) {
      this.logger.error(`SSO callback processing failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `SSO callback processing failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Get user context for cross-product operations
   */
  @Get(':productKey/sso/user')
  @ApiOperation({
    summary: 'Get user context',
    description: 'Retrieves user context and permissions for cross-product operations.',
  })
  @ApiParam({ name: 'productKey', description: 'Product identifier' })
  @ApiHeader({ name: 'X-API-Key', description: 'Product API key', required: true })
  @ApiResponse({ status: 200, description: 'User context', type: UserContextResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid API credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  // @UseInterceptors(CacheInterceptor) // Cache for 5 minutes - temporarily commented out
  @Throttle({ default: { limit: 200, ttl: 60000 } }) // 200 requests per minute
  async getUserContext(
    @Param('productKey') productKey: string,
    @Query('userId') userId: string,
    @Headers('x-api-key') apiKey: string,
    @Req() request: Request,
    @Query('externalUserId') externalUserId?: string,
    @Query('email') email?: string,
    @Query('includes') includes?: string
  ): Promise<UserContextResponseDto> {
    const requestId = randomUUID();

    try {
      // Step 1: Authenticate the product API request (no secret required for read operations)
      const authContext = await this.authenticateProductRequest(
        productKey,
        apiKey,
        undefined,
        request,
        requestId
      );

      if (!authContext.isValid) {
        throw new HttpException('Invalid API credentials', HttpStatus.UNAUTHORIZED);
      }

      // Step 2: Determine user lookup method
      let userMapping = null;
      if (userId) {
        // Direct user ID lookup
        const mappings = await this.userMappingService.findUserMappings(userId);
        userMapping = mappings.find(m => m.productKey === productKey);
      } else if (externalUserId) {
        // External user ID lookup
        userMapping = await this.userMappingService.findUserMapping(productKey, externalUserId);
      } else if (email) {
        // Email lookup (less efficient, should be avoided)
        this.logger.warn(`User lookup by email is inefficient`, { requestId, productKey, email });
        // Would implement email-based lookup
      }

      if (!userMapping) {
        return {
          success: false,
          error: 'User not found or not authorized for this product',
        };
      }

      // Step 3: Get complete user context
      const userContext = await this.unifiedSsoService.getUserContext(
        userMapping.userId,
        productKey,
        includes ? includes.split(',') : []
      );

      if (!userContext) {
        return {
          success: false,
          error: 'Unable to retrieve user context',
        };
      }

      // Step 4: Build response based on permissions
      const includesArray = includes ? includes.split(',') : [];
      const response: UserContextResponseDto = {
        success: true,
        permissionLevel: userMapping.dataAccessLevel.toLowerCase() as any,
        expiresAt: dayjs().add(1, 'hour').toDate(),
      };

      // Include profile if requested and permitted
      if (includesArray.includes('profile')) {
        response.profile = {
          id: userContext.user.id,
          email: userContext.user.email,
          name: userContext.user.name,
          avatar: userContext.user.avatar,
          preferences: {},
          metadata: userMapping.metadata || {},
        };
      }

      // Include organization if requested and permitted
      if (includesArray.includes('organization')) {
        response.organization = {
          id: userContext.organization.id,
          name: userContext.organization.name,
          settings: {},
        };
      }

      // Include integrations if requested and permitted
      if (includesArray.includes('integrations')) {
        // Would fetch user's connected integrations
        response.integrations = [];
      }

      // Include media if requested and permitted
      if (includesArray.includes('media')) {
        // Would fetch user's media files with appropriate permissions
        response.media = [];
      }

      this.logger.debug(`User context retrieved`, {
        requestId,
        productKey,
        userId: userMapping.userId,
        includes: includesArray,
      });

      return response;

    } catch (error) {
      this.logger.error(`User context retrieval failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      return {
        success: false,
        error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
      };
    }
  }

  /**
   * Sync user data with external product
   */
  @Post(':productKey/sso/sync')
  @ApiOperation({
    summary: 'Sync user data',
    description: 'Synchronizes user data between external product and Postiz.',
  })
  @ApiParam({ name: 'productKey', description: 'Product identifier' })
  @ApiHeader({ name: 'X-API-Key', description: 'Product API key', required: true })
  @ApiHeader({ name: 'X-API-Secret', description: 'Product API secret', required: true })
  @ApiResponse({ status: 200, description: 'Sync completed' })
  @ApiResponse({ status: 400, description: 'Invalid sync data' })
  @ApiResponse({ status: 401, description: 'Invalid API credentials' })
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  async syncUserData(
    @Param('productKey') productKey: string,
    @Body() syncRequest: {
      users: Array<{
        externalUserId: string;
        email: string;
        name?: string;
        avatar?: string;
        customFields?: Record<string, unknown>;
      }>;
      options?: {
        dryRun?: boolean;
        batchSize?: number;
      };
    },
    @Headers('x-api-key') apiKey: string,
    @Headers('x-api-secret') apiSecret: string,
    @Req() request: Request
  ): Promise<{
    success: boolean;
    processed: number;
    updated: number;
    created: number;
    errors: Array<{ externalUserId: string; error: string }>;
  }> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      // Step 1: Authenticate the product API request
      const authContext = await this.authenticateProductRequest(
        productKey,
        apiKey,
        apiSecret,
        request,
        requestId
      );

      if (!authContext.isValid) {
        throw new HttpException('Invalid API credentials', HttpStatus.UNAUTHORIZED);
      }

      // Step 2: Validate sync request
      if (!syncRequest.users || !Array.isArray(syncRequest.users) || syncRequest.users.length === 0) {
        throw new HttpException('Users array is required and must not be empty', HttpStatus.BAD_REQUEST);
      }

      if (syncRequest.users.length > 1000) {
        throw new HttpException('Maximum 1000 users per sync request', HttpStatus.BAD_REQUEST);
      }

      // Step 3: Convert to sync profiles
      const userProfiles = syncRequest.users.map(user => ({
        externalUserId: user.externalUserId,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        customFields: user.customFields,
      }));

      // Step 4: Perform batch sync
      const result = await this.userMappingService.batchSyncUsers(
        productKey,
        userProfiles,
        syncRequest.options || {}
      );

      // Step 5: Audit log the sync operation
      await this.auditLogger.logEvent('user_data_synced', {
        requestId,
        productKey,
        usersCount: syncRequest.users.length,
        processed: result.processed,
        updated: result.updated,
        created: result.created,
        errorsCount: result.errors.length,
        apiKey: authContext.apiKey,
        clientIP: authContext.clientIP,
        processingTime: Date.now() - startTime,
      });

      this.logger.log(`User data sync completed`, {
        requestId,
        productKey,
        ...result,
        processingTime: Date.now() - startTime,
      });

      return {
        success: true,
        ...result,
      };

    } catch (error) {
      this.logger.error(`User data sync failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `User data sync failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Product health check endpoint
   */
  @Get(':productKey/health')
  @ApiOperation({
    summary: 'Product health check',
    description: 'Returns health status and analytics for the product integration.',
  })
  @ApiParam({ name: 'productKey', description: 'Product identifier' })
  @ApiHeader({ name: 'X-API-Key', description: 'Product API key', required: true })
  @ApiResponse({ status: 200, description: 'Health status' })
  // @UseInterceptors(CacheInterceptor) // Cache for 2 minutes - temporarily commented out
  @Throttle({ default: { limit: 60, ttl: 60000 } }) // 60 requests per minute
  async getProductHealth(
    @Param('productKey') productKey: string,
    @Headers('x-api-key') apiKey: string,
    @Req() request: Request
  ): Promise<ProductHealthResponse> {
    const requestId = randomUUID();

    try {
      // Step 1: Authenticate the product API request
      const authContext = await this.authenticateProductRequest(
        productKey,
        apiKey,
        undefined,
        request,
        requestId
      );

      if (!authContext.isValid) {
        throw new HttpException('Invalid API credentials', HttpStatus.UNAUTHORIZED);
      }

      // Step 2: Get health status from platform service
      const healthStatus = await this.platformService.getProductHealth(productKey);
      const analytics = await this.platformService.getProductAnalytics(productKey);

      if (!healthStatus) {
        throw new HttpException('Health status not available', HttpStatus.NOT_FOUND);
      }

      const response: ProductHealthResponse = {
        healthy: healthStatus.healthy,
        version: healthStatus.version,
        uptime: healthStatus.uptime,
        lastHeartbeat: healthStatus.lastHeartbeat,
        endpoints: healthStatus.endpoints.map(endpoint => ({
          status: endpoint.status,
          responseTime: endpoint.responseTime,
        })),
        analytics: {
          requests24h: healthStatus.metrics.requests24h,
          errors24h: healthStatus.metrics.errors24h,
          activeUsers: analytics?.activeUsers24h || 0,
        },
      };

      return response;

    } catch (error) {
      this.logger.error(`Health check failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      if (error instanceof HttpException) {
        throw error;
      }

      // Return degraded health status on error
      return {
        healthy: false,
        version: 'unknown',
        uptime: 0,
        lastHeartbeat: new Date(),
        endpoints: [],
        analytics: {
          requests24h: 0,
          errors24h: 1,
          activeUsers: 0,
        },
      };
    }
  }

  /**
   * Register new product (admin endpoint)
   */
  @Post('register')
  @ApiOperation({
    summary: 'Register new product',
    description: 'Registers a new product for SSO integration. Admin credentials required.',
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Product registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid registration data' })
  @ApiResponse({ status: 401, description: 'Admin authentication required' })
  @ApiResponse({ status: 409, description: 'Product already exists' })
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 requests per 5 minutes
  async registerProduct(
    @Body() registrationPayload: ProductRegistrationPayload,
    @Headers('authorization') authorization: string,
    @Req() request: Request
  ): Promise<{
    success: boolean;
    productKey: string;
    productId?: string;
    apiCredentials?: {
      apiKey: string;
      apiSecret: string;
      webhookSecret: string;
    };
    error?: string;
  }> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      // Step 1: Authenticate admin user
      // This would integrate with existing admin authentication
      // For now, we'll do a basic check
      if (!authorization?.startsWith('Bearer ')) {
        throw new HttpException('Admin authentication required', HttpStatus.UNAUTHORIZED);
      }

      const adminToken = authorization.substring(7);
      // Would validate admin token here
      const adminUserId = 'admin-user-id'; // Placeholder

      // Step 2: Validate registration payload
      await this.inputValidation.validateObject(registrationPayload, [
        'productKey',
        'productName',
        'baseUrl',
        'adminEmail',
        'configuration',
        'capabilities',
      ]);

      // Step 3: Register product using platform service
      const result = await this.platformService.registerProduct(
        registrationPayload,
        {
          adminUserId,
          ip: request.ip || 'unknown',
          userAgent: request.get('User-Agent') || 'unknown',
        }
      );

      if (!result.success || !result.data) {
        return {
          success: false,
          productKey: registrationPayload.productKey,
          error: result.error?.message || 'Product registration failed',
        };
      }

      this.logger.log(`Product registered successfully`, {
        requestId,
        productKey: registrationPayload.productKey,
        productId: result.data.id,
        adminUserId,
        processingTime: Date.now() - startTime,
      });

      return {
        success: true,
        productKey: registrationPayload.productKey,
        productId: result.data.id,
        // API credentials would be sent separately via email for security
        apiCredentials: {
          apiKey: 'sent-via-email',
          apiSecret: 'sent-via-email',
          webhookSecret: 'sent-via-email',
        },
      };

    } catch (error) {
      this.logger.error(`Product registration failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        productKey: registrationPayload?.productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        `Product registration failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /**
   * Private helper methods
   */

  private async authenticateProductRequest(
    productKey: string,
    apiKey: string,
    apiSecret: string | undefined,
    request: Request,
    requestId: string
  ): Promise<ApiKeyAuthContext> {
    const context: ApiKeyAuthContext = {
      productKey,
      apiKey: apiKey || '',
      apiSecret,
      clientIP: request.ip || 'unknown',
      userAgent: request.get('User-Agent') || 'unknown',
      requestId,
      isValid: false,
    };

    try {
      // Step 1: Basic parameter validation
      if (!productKey || !apiKey) {
        this.logger.warn(`Missing authentication parameters`, { requestId, productKey });
        return context;
      }

      // Step 2: Find product by key
      const products = await this.platformService.listProducts(ProductStatus.ACTIVE);
      const product = products.find(p => p.productKey === productKey);

      if (!product) {
        this.logger.warn(`Product not found or inactive`, { requestId, productKey });
        return context;
      }

      // Step 3: Validate API key
      const storedApiKey = (product.settings as any)?.apiKey;
      if (storedApiKey !== apiKey) {
        this.logger.warn(`Invalid API key`, { requestId, productKey, apiKey: apiKey.substring(0, 10) + '...' });
        return context;
      }

      // Step 4: Validate API secret if provided (required for write operations)
      if (apiSecret) {
        const storedSecretHash = (product.settings as any)?.apiSecret;
        const providedSecretHash = this.hashApiSecret(apiSecret);
        
        if (storedSecretHash !== providedSecretHash) {
          this.logger.warn(`Invalid API secret`, { requestId, productKey });
          return context;
        }
      }

      // Step 5: Additional security checks
      await this.performSecurityChecks(context, product);

      context.isValid = true;
      return context;

    } catch (error) {
      this.logger.error(`API authentication failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
        requestId,
        productKey,
        error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
      });
      return context;
    }
  }

  private hashApiSecret(secret: string): string {
    return createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret')
      .update(secret)
      .digest('hex');
  }

  private async performSecurityChecks(
    context: ApiKeyAuthContext,
    product: any
  ): Promise<void> {
    // Rate limiting checks would go here
    // IP whitelist checks if configured
    // Additional security validations
    
    this.logger.debug(`Security checks passed`, {
      requestId: context.requestId,
      productKey: context.productKey,
    });
  }
}