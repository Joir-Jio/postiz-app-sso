/**
 * Seamless Auth Controller - Main SSO endpoints for zero-friction authentication
 * Provides the core endpoints for seamless user authentication flow
 * 
 * @fileoverview Controller for seamless authentication endpoints
 * @version 1.0.0
 * 
 * Key Endpoints:
 * - GET /seamless-login - Process seamless login with token
 * - POST /auth/sso/validate - Validate SSO tokens
 * - POST /auth/sso/refresh - Refresh access tokens
 * - POST /auth/sso/logout - Logout and cleanup SSO session
 * - GET /auth/sso/session - Get current SSO session info
 * - POST /auth/sso/preload - Preload publishing context
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Res,
  Req,
  HttpStatus,
  HttpException,
  Logger,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiHeader } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  SsoLoginResponseDto,
  SsoCallbackDto,
  SsoCallbackResponseDto,
  TokenValidationDto,
  TokenValidationResponseDto,
  TokenRefreshDto,
  TokenRefreshResponseDto,
  SsoLogoutDto,
  SsoLogoutResponseDto,
  UserContextRequestDto,
  UserContextResponseDto,
} from '@gitroom/nestjs-libraries/dtos/sso/sso-auth.dto';
import { UnifiedSsoService } from '@gitroom/backend/services/sso/unified-sso.service';
import { SeamlessAuthService } from '@gitroom/backend/services/sso/seamless-auth.service';
import { SsoSecurityMiddleware } from '@gitroom/nestjs-libraries/security/sso-security.middleware';
import { InputValidationService } from '@gitroom/nestjs-libraries/security/input-validation.service';
import { AuditLoggingService } from '@gitroom/nestjs-libraries/security/audit-logging.service';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';

interface SeamlessLoginRequest {
  token: string;
  challenge?: string;
  state?: string;
  redirect_url?: string;
}

interface ClientContext {
  ip: string;
  userAgent: string;
  fingerprint?: string;
  requestId: string;
}

@Controller()
@ApiTags('Seamless Authentication')
@UseGuards(SsoSecurityMiddleware)
export class SeamlessAuthController {
  private readonly logger = new Logger(SeamlessAuthController.name);

  constructor(
    private readonly unifiedSsoService: UnifiedSsoService,
    private readonly seamlessAuthService: SeamlessAuthService,
    private readonly inputValidation: InputValidationService,
    private readonly auditLogger: AuditLoggingService
  ) {}

  /**
   * Handle seamless login - the main zero-friction authentication endpoint
   * This is where users land when they click "publish" in external products
   */
  @Get('seamless-login')
  @ApiOperation({
    summary: 'Process seamless login',
    description: 'Handles zero-friction authentication from external products. Users are automatically logged in and redirected to the publishing interface.',
  })
  @ApiQuery({ name: 'token', description: 'Temporary authentication token', required: true })
  @ApiQuery({ name: 'challenge', description: 'Security challenge', required: false })
  @ApiQuery({ name: 'state', description: 'CSRF state parameter', required: false })
  @ApiQuery({ name: 'redirect_url', description: 'Post-login redirect URL', required: false })
  @ApiResponse({ status: 302, description: 'Redirect to Postiz dashboard with authentication' })
  @ApiResponse({ status: 400, description: 'Invalid token or parameters' })
  @ApiResponse({ status: 401, description: 'Authentication failed' })
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  async handleSeamlessLogin(
    @Query() query: SeamlessLoginRequest,
    @Req() request: Request,
    @Res() response: Response,
    @Headers('x-fingerprint') fingerprint?: string
  ): Promise<void> {
    const requestId = randomUUID();
    const startTime = Date.now();

    this.logger.log(`Seamless login request received`, {
      requestId,
      tokenPreview: query.token?.substring(0, 20) + '...',
      hasChallenge: !!query.challenge,
      hasState: !!query.state,
      hasRedirectUrl: !!query.redirect_url,
    });

    try {
      // Step 1: Extract and validate client context
      const clientContext = this.extractClientContext(request, requestId, fingerprint);

      // Step 2: Validate input parameters
      await this.validateSeamlessLoginInput(query, clientContext);

      // Step 3: Process seamless authentication
      const loginResult = await this.seamlessAuthService.processSeamlessLogin(
        query.token,
        clientContext,
        query.challenge,
        query.state
      );

      if (!loginResult.success || !loginResult.data) {
        throw new HttpException(
          loginResult.error?.message || 'Authentication failed',
          HttpStatus.UNAUTHORIZED
        );
      }

      // Step 4: Set authentication cookies and session
      await this.seamlessAuthService.setAuthenticationAndRedirect(
        response,
        loginResult.data,
        {
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        }
      );

      // Step 5: Log successful authentication
      await this.auditLogger.logEvent('seamless_login_success', {
        requestId,
        userId: loginResult.data.user.id,
        organizationId: loginResult.data.organization.id,
        sessionId: loginResult.data.sessionContext.sessionId,
        processingTime: Date.now() - startTime,
        clientIP: clientContext.ip,
        userAgent: clientContext.userAgent,
      });

      // Step 6: Redirect to the appropriate location
      const finalRedirectUrl = query.redirect_url || loginResult.data.redirectUrl;
      
      this.logger.log(`Seamless login successful, redirecting`, {
        requestId,
        userId: loginResult.data.user.id,
        redirectUrl: finalRedirectUrl,
        processingTime: Date.now() - startTime,
      });

      response.redirect(HttpStatus.FOUND, finalRedirectUrl);

    } catch (error) {
      this.logger.error(`Seamless login failed: ${(error instanceof Error ? error.message : String(error))}`, {
        requestId,
        tokenPreview: query.token?.substring(0, 20) + '...',
        error: (error instanceof Error ? error.stack : undefined),
        processingTime: Date.now() - startTime,
      });

      // Log failed authentication attempt
      await this.auditLogger.logEvent('seamless_login_failed', {
        requestId,
        error: (error instanceof Error ? error.message : String(error)),
        tokenPreview: query.token?.substring(0, 20) + '...',
        clientIP: request.ip,
        userAgent: request.get('User-Agent'),
      });

      // Redirect to error page with appropriate message
      const errorUrl = this.buildErrorRedirectUrl((error instanceof Error ? error.message : String(error)), query.state);
      response.redirect(HttpStatus.FOUND, errorUrl);
    }
  }

  /**
   * Validate SSO tokens for API access
   */
  @Post('auth/sso/validate')
  @ApiOperation({
    summary: 'Validate SSO token',
    description: 'Validates an SSO token and returns user context information.',
  })
  @ApiResponse({ status: 200, description: 'Token validation result', type: TokenValidationResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async validateToken(
    @Body() validationRequest: TokenValidationDto,
    @Req() request: Request
  ): Promise<TokenValidationResponseDto> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      const clientContext = this.extractClientContext(request, requestId);

      // Validate input
      await this.inputValidation.validateDto(validationRequest, TokenValidationDto);

      // Perform token validation
      const result = await this.unifiedSsoService.validateToken(
        validationRequest,
        clientContext
      );

      this.logger.debug(`Token validation completed`, {
        requestId,
        valid: result.data?.valid,
        expired: result.data?.expired,
        processingTime: Date.now() - startTime,
      });

      return result.data!;

    } catch (error) {
      this.logger.error(`Token validation failed: ${(error instanceof Error ? error.message : String(error))}`, {
        requestId,
        error: (error instanceof Error ? error.stack : undefined),
      });

      return {
        valid: false,
        error: (error instanceof Error ? error.message : String(error)),
        expired: false,
        notBefore: false,
      };
    }
  }

  /**
   * Refresh access tokens
   */
  @Post('auth/sso/refresh')
  @ApiOperation({
    summary: 'Refresh SSO tokens',
    description: 'Refreshes an expired access token using a refresh token.',
  })
  @ApiResponse({ status: 200, description: 'Token refresh result', type: TokenRefreshResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  async refreshToken(
    @Body() refreshRequest: TokenRefreshDto,
    @Req() request: Request
  ): Promise<TokenRefreshResponseDto> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      const clientContext = this.extractClientContext(request, requestId);

      // Validate input
      await this.inputValidation.validateDto(refreshRequest, TokenRefreshDto);

      // Perform token refresh
      const result = await this.unifiedSsoService.refreshToken(
        refreshRequest,
        clientContext
      );

      this.logger.debug(`Token refresh completed`, {
        requestId,
        success: result.data?.success,
        productKey: refreshRequest.productKey,
        processingTime: Date.now() - startTime,
      });

      return result.data!;

    } catch (error) {
      this.logger.error(`Token refresh failed: ${(error instanceof Error ? error.message : String(error))}`, {
        requestId,
        error: (error instanceof Error ? error.stack : undefined),
      });

      throw new HttpException(
        `Token refresh failed: ${(error instanceof Error ? error.message : String(error))}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Logout from SSO session
   */
  @Post('auth/sso/logout')
  @ApiOperation({
    summary: 'SSO logout',
    description: 'Logs out from SSO session and optionally from all connected products.',
  })
  @ApiResponse({ status: 200, description: 'Logout result', type: SsoLogoutResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async logout(
    @Body() logoutRequest: SsoLogoutDto,
    @Req() request: Request,
    @Res() response: Response
  ): Promise<SsoLogoutResponseDto> {
    const requestId = randomUUID();
    const startTime = Date.now();

    try {
      const clientContext = this.extractClientContext(request, requestId);

      // Validate input
      await this.inputValidation.validateDto(logoutRequest, SsoLogoutDto);

      // Extract session ID from token if possible
      const tokenValidation = await this.unifiedSsoService.validateToken(
        { token: logoutRequest.accessToken },
        clientContext
      );

      let sessionId = '';
      let productKey = '';
      if (tokenValidation.data?.valid && tokenValidation.data.userContext) {
        // Extract session info from token payload
        sessionId = (tokenValidation.data.payload as any)?.sessionId || '';
        productKey = (tokenValidation.data.payload as any)?.productKey || '';
      }

      // Perform logout
      if (sessionId && productKey) {
        const logoutResult = await this.seamlessAuthService.processSeamlessLogout(
          sessionId,
          productKey,
          clientContext
        );

        // Clear authentication cookies
        response.clearCookie('auth-token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
        response.clearCookie('sso-context', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
        response.clearCookie('user-prefs', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });

        // Log successful logout
        await this.auditLogger.logEvent('sso_logout_success', {
          requestId,
          sessionId,
          productKey,
          clientIP: clientContext.ip,
          userAgent: clientContext.userAgent,
        });

        const result: SsoLogoutResponseDto = {
          success: logoutResult.data?.success || true,
          redirectUrl: logoutRequest.redirectUrl,
          additionalLogoutUrls: logoutResult.data?.logoutUrls,
        };

        this.logger.log(`SSO logout completed`, {
          requestId,
          sessionId,
          productKey,
          processingTime: Date.now() - startTime,
        });

        return result;
      }

      // Simple logout if no session found
      response.clearCookie('auth-token');
      response.clearCookie('sso-context');
      response.clearCookie('user-prefs');

      return {
        success: true,
        redirectUrl: logoutRequest.redirectUrl,
      };

    } catch (error) {
      this.logger.error(`SSO logout failed: ${(error instanceof Error ? error.message : String(error))}`, {
        requestId,
        error: (error instanceof Error ? error.stack : undefined),
      });

      throw new HttpException(
        `Logout failed: ${(error instanceof Error ? error.message : String(error))}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Get current SSO session information
   */
  @Get('auth/sso/session')
  @ApiOperation({
    summary: 'Get SSO session',
    description: 'Returns information about the current SSO session.',
  })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiResponse({ status: 200, description: 'Session information' })
  @ApiResponse({ status: 401, description: 'Invalid or expired session' })
  async getSession(
    @Req() request: Request,
    @Headers('authorization') authorization?: string
  ): Promise<{
    valid: boolean;
    user?: { id: string; email: string; name?: string };
    organization?: { id: string; name: string };
    session?: { id: string; expiresAt: Date; scopes: string[] };
    productKey?: string;
  }> {
    const requestId = randomUUID();

    try {
      if (!authorization?.startsWith('Bearer ')) {
        return { valid: false };
      }

      const token = authorization.substring(7);
      const clientContext = this.extractClientContext(request, requestId);

      // Validate the token
      const validation = await this.unifiedSsoService.validateToken(
        { token },
        clientContext
      );

      if (!validation.data?.valid || !validation.data.userContext) {
        return { valid: false };
      }

      // Extract session information
      const sessionId = (validation.data.payload as any)?.sessionId;
      const productKey = (validation.data.payload as any)?.productKey;

      let sessionInfo = null;
      if (sessionId) {
        sessionInfo = await this.seamlessAuthService.getSeamlessSession(sessionId);
      }

      return {
        valid: true,
        user: sessionInfo?.user,
        organization: sessionInfo?.organization,
        session: sessionInfo?.valid ? {
          id: sessionId,
          expiresAt: sessionInfo.expiresAt!,
          scopes: sessionInfo.scopes || [],
        } : undefined,
        productKey: sessionInfo?.productKey || productKey,
      };

    } catch (error) {
      this.logger.error(`Session info retrieval failed: ${(error instanceof Error ? error.message : String(error))}`, { requestId });
      return { valid: false };
    }
  }

  /**
   * Preload publishing context for seamless experience
   */
  @Post('auth/sso/preload')
  @ApiOperation({
    summary: 'Preload publishing context',
    description: 'Preloads user content and context for seamless publishing experience.',
  })
  @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
  @ApiResponse({ status: 200, description: 'Preloaded content' })
  @ApiResponse({ status: 401, description: 'Invalid or expired session' })
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  async preloadContext(
    @Body() contextRequest: {
      productKey: string;
      contentHints?: {
        mediaIds?: string[];
        platforms?: string[];
        contentType?: 'text' | 'image' | 'video' | 'carousel';
      };
    },
    @Req() request: Request,
    @Headers('authorization') authorization?: string
  ): Promise<{
    success: boolean;
    preloadedContent?: any;
    error?: string;
  }> {
    const requestId = randomUUID();

    try {
      if (!authorization?.startsWith('Bearer ')) {
        return { success: false, error: 'Authentication required' };
      }

      const token = authorization.substring(7);
      const clientContext = this.extractClientContext(request, requestId);

      // Validate token and get user context
      const validation = await this.unifiedSsoService.validateToken(
        { token },
        clientContext
      );

      if (!validation.data?.valid || !validation.data.userContext) {
        return { success: false, error: 'Invalid or expired token' };
      }

      const userId = validation.data.userContext.userId;

      // Preload publishing context
      const preloadedContent = await this.seamlessAuthService.preloadPublishingContext(
        userId,
        contextRequest.productKey,
        contextRequest.contentHints
      );

      this.logger.debug(`Publishing context preloaded`, {
        requestId,
        userId,
        productKey: contextRequest.productKey,
        mediaFilesCount: preloadedContent.mediaFiles.length,
        integrationsCount: preloadedContent.userIntegrations.length,
      });

      return {
        success: true,
        preloadedContent,
      };

    } catch (error) {
      this.logger.error(`Context preloading failed: ${(error instanceof Error ? error.message : String(error))}`, { requestId });
      return {
        success: false,
        error: (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Private helper methods
   */

  private extractClientContext(
    request: Request,
    requestId: string,
    fingerprint?: string
  ): ClientContext {
    return {
      ip: request.ip || request.connection.remoteAddress || 'unknown',
      userAgent: request.get('User-Agent') || 'unknown',
      fingerprint,
      requestId,
    };
  }

  private async validateSeamlessLoginInput(
    query: SeamlessLoginRequest,
    clientContext: ClientContext
  ): Promise<void> {
    // Validate required parameters
    if (!query.token || typeof query.token !== 'string' || query.token.trim().length === 0) {
      throw new HttpException('Token parameter is required', HttpStatus.BAD_REQUEST);
    }

    // Validate token format (basic JWT check)
    const tokenParts = query.token.split('.');
    if (tokenParts.length !== 3) {
      throw new HttpException('Invalid token format', HttpStatus.BAD_REQUEST);
    }

    // Validate optional parameters
    if (query.challenge && (typeof query.challenge !== 'string' || query.challenge.length < 8)) {
      throw new HttpException('Invalid challenge format', HttpStatus.BAD_REQUEST);
    }

    if (query.state && (typeof query.state !== 'string' || query.state.length > 255)) {
      throw new HttpException('Invalid state parameter', HttpStatus.BAD_REQUEST);
    }

    if (query.redirect_url) {
      try {
        const url = new URL(query.redirect_url);
        // Only allow HTTPS URLs in production
        if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
          throw new Error('Only HTTPS URLs allowed in production');
        }
      } catch (error) {
        throw new HttpException('Invalid redirect URL', HttpStatus.BAD_REQUEST);
      }
    }
  }

  private buildErrorRedirectUrl(errorMessage: string, state?: string): string {
    const frontendUrl = process.env.FRONTEND_URL || 'https://postiz.com';
    const params = new URLSearchParams({
      error: 'sso_failed',
      error_description: errorMessage,
    });

    if (state) {
      params.set('state', state);
    }

    return `${frontendUrl}/auth/error?${params.toString()}`;
  }
}