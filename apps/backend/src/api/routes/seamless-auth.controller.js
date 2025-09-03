"use strict";
var SeamlessAuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeamlessAuthController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const sso_auth_dto_1 = require("@gitroom/nestjs-libraries/dtos/sso/sso-auth.dto");
const unified_sso_service_1 = require("@gitroom/backend/services/sso/unified-sso.service");
const seamless_auth_service_1 = require("@gitroom/backend/services/sso/seamless-auth.service");
const sso_security_middleware_1 = require("@gitroom/nestjs-libraries/security/sso-security.middleware");
const input_validation_service_1 = require("@gitroom/nestjs-libraries/security/input-validation.service");
const audit_logging_service_1 = require("@gitroom/nestjs-libraries/security/audit-logging.service");
const crypto_1 = require("crypto");
let SeamlessAuthController = SeamlessAuthController_1 = class SeamlessAuthController {
    constructor(unifiedSsoService, seamlessAuthService, inputValidation, auditLogger) {
        this.unifiedSsoService = unifiedSsoService;
        this.seamlessAuthService = seamlessAuthService;
        this.inputValidation = inputValidation;
        this.auditLogger = auditLogger;
        this.logger = new common_1.Logger(SeamlessAuthController_1.name);
    }
    async handleSeamlessLogin(query, request, response, fingerprint) {
        var _a, _b, _c, _d;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        this.logger.log(`Seamless login request received`, {
            requestId,
            tokenPreview: ((_a = query.token) === null || _a === void 0 ? void 0 : _a.substring(0, 20)) + '...',
            hasChallenge: !!query.challenge,
            hasState: !!query.state,
            hasRedirectUrl: !!query.redirect_url,
        });
        try {
            const clientContext = this.extractClientContext(request, requestId, fingerprint);
            await this.validateSeamlessLoginInput(query, clientContext);
            const loginResult = await this.seamlessAuthService.processSeamlessLogin(query.token, query.challenge, query.state, clientContext);
            if (!loginResult.success || !loginResult.data) {
                throw new common_1.HttpException(((_b = loginResult.error) === null || _b === void 0 ? void 0 : _b.message) || 'Authentication failed', common_1.HttpStatus.UNAUTHORIZED);
            }
            await this.seamlessAuthService.setAuthenticationAndRedirect(response, loginResult.data, {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000,
            });
            await this.auditLogger.logEvent('seamless_login_success', {
                requestId,
                userId: loginResult.data.user.id,
                organizationId: loginResult.data.organization.id,
                sessionId: loginResult.data.sessionContext.sessionId,
                processingTime: Date.now() - startTime,
                clientIP: clientContext.ip,
                userAgent: clientContext.userAgent,
            });
            const finalRedirectUrl = query.redirect_url || loginResult.data.redirectUrl;
            this.logger.log(`Seamless login successful, redirecting`, {
                requestId,
                userId: loginResult.data.user.id,
                redirectUrl: finalRedirectUrl,
                processingTime: Date.now() - startTime,
            });
            response.redirect(common_1.HttpStatus.FOUND, finalRedirectUrl);
        }
        catch (error) {
            this.logger.error(`Seamless login failed: ${(error instanceof Error ? error.message : String(error))}`, {
                requestId,
                tokenPreview: ((_c = query.token) === null || _c === void 0 ? void 0 : _c.substring(0, 20)) + '...',
                error: (error instanceof Error ? error.stack : undefined),
                processingTime: Date.now() - startTime,
            });
            await this.auditLogger.logEvent('seamless_login_failed', {
                requestId,
                error: (error instanceof Error ? error.message : String(error)),
                tokenPreview: ((_d = query.token) === null || _d === void 0 ? void 0 : _d.substring(0, 20)) + '...',
                clientIP: request.ip,
                userAgent: request.get('User-Agent'),
            });
            const errorUrl = this.buildErrorRedirectUrl((error instanceof Error ? error.message : String(error)), query.state);
            response.redirect(common_1.HttpStatus.FOUND, errorUrl);
        }
    }
    async validateToken(validationRequest, request) {
        var _a, _b;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        try {
            const clientContext = this.extractClientContext(request, requestId);
            await this.inputValidation.validateDto(validationRequest, sso_auth_dto_1.TokenValidationDto);
            const result = await this.unifiedSsoService.validateToken(validationRequest, clientContext);
            this.logger.debug(`Token validation completed`, {
                requestId,
                valid: (_a = result.data) === null || _a === void 0 ? void 0 : _a.valid,
                expired: (_b = result.data) === null || _b === void 0 ? void 0 : _b.expired,
                processingTime: Date.now() - startTime,
            });
            return result.data;
        }
        catch (error) {
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
    async refreshToken(refreshRequest, request) {
        var _a;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        try {
            const clientContext = this.extractClientContext(request, requestId);
            await this.inputValidation.validateDto(refreshRequest, sso_auth_dto_1.TokenRefreshDto);
            const result = await this.unifiedSsoService.refreshToken(refreshRequest, clientContext);
            this.logger.debug(`Token refresh completed`, {
                requestId,
                success: (_a = result.data) === null || _a === void 0 ? void 0 : _a.success,
                productKey: refreshRequest.productKey,
                processingTime: Date.now() - startTime,
            });
            return result.data;
        }
        catch (error) {
            this.logger.error(`Token refresh failed: ${(error instanceof Error ? error.message : String(error))}`, {
                requestId,
                error: (error instanceof Error ? error.stack : undefined),
            });
            throw new common_1.HttpException(`Token refresh failed: ${(error instanceof Error ? error.message : String(error))}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async logout(logoutRequest, request, response) {
        var _a, _b, _c, _d, _e;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        try {
            const clientContext = this.extractClientContext(request, requestId);
            await this.inputValidation.validateDto(logoutRequest, sso_auth_dto_1.SsoLogoutDto);
            const tokenValidation = await this.unifiedSsoService.validateToken({ token: logoutRequest.accessToken }, clientContext);
            let sessionId = '';
            let productKey = '';
            if (((_a = tokenValidation.data) === null || _a === void 0 ? void 0 : _a.valid) && tokenValidation.data.userContext) {
                sessionId = ((_b = tokenValidation.data.payload) === null || _b === void 0 ? void 0 : _b.sessionId) || '';
                productKey = ((_c = tokenValidation.data.payload) === null || _c === void 0 ? void 0 : _c.productKey) || '';
            }
            if (sessionId && productKey) {
                const logoutResult = await this.seamlessAuthService.processSeamlessLogout(sessionId, productKey, clientContext);
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
                await this.auditLogger.logEvent('sso_logout_success', {
                    requestId,
                    sessionId,
                    productKey,
                    clientIP: clientContext.ip,
                    userAgent: clientContext.userAgent,
                });
                const result = {
                    success: ((_d = logoutResult.data) === null || _d === void 0 ? void 0 : _d.success) || true,
                    redirectUrl: logoutRequest.redirectUrl,
                    additionalLogoutUrls: (_e = logoutResult.data) === null || _e === void 0 ? void 0 : _e.logoutUrls,
                };
                this.logger.log(`SSO logout completed`, {
                    requestId,
                    sessionId,
                    productKey,
                    processingTime: Date.now() - startTime,
                });
                return result;
            }
            response.clearCookie('auth-token');
            response.clearCookie('sso-context');
            response.clearCookie('user-prefs');
            return {
                success: true,
                redirectUrl: logoutRequest.redirectUrl,
            };
        }
        catch (error) {
            this.logger.error(`SSO logout failed: ${(error instanceof Error ? error.message : String(error))}`, {
                requestId,
                error: (error instanceof Error ? error.stack : undefined),
            });
            throw new common_1.HttpException(`Logout failed: ${(error instanceof Error ? error.message : String(error))}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getSession(request, authorization) {
        var _a, _b, _c;
        const requestId = (0, crypto_1.randomUUID)();
        try {
            if (!(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith('Bearer '))) {
                return { valid: false };
            }
            const token = authorization.substring(7);
            const clientContext = this.extractClientContext(request, requestId);
            const validation = await this.unifiedSsoService.validateToken({ token }, clientContext);
            if (!((_a = validation.data) === null || _a === void 0 ? void 0 : _a.valid) || !validation.data.userContext) {
                return { valid: false };
            }
            const sessionId = (_b = validation.data.payload) === null || _b === void 0 ? void 0 : _b.sessionId;
            const productKey = (_c = validation.data.payload) === null || _c === void 0 ? void 0 : _c.productKey;
            let sessionInfo = null;
            if (sessionId) {
                sessionInfo = await this.seamlessAuthService.getSeamlessSession(sessionId);
            }
            return {
                valid: true,
                user: sessionInfo === null || sessionInfo === void 0 ? void 0 : sessionInfo.user,
                organization: sessionInfo === null || sessionInfo === void 0 ? void 0 : sessionInfo.organization,
                session: (sessionInfo === null || sessionInfo === void 0 ? void 0 : sessionInfo.valid) ? {
                    id: sessionId,
                    expiresAt: sessionInfo.expiresAt,
                    scopes: sessionInfo.scopes || [],
                } : undefined,
                productKey: (sessionInfo === null || sessionInfo === void 0 ? void 0 : sessionInfo.productKey) || productKey,
            };
        }
        catch (error) {
            this.logger.error(`Session info retrieval failed: ${(error instanceof Error ? error.message : String(error))}`, { requestId });
            return { valid: false };
        }
    }
    async preloadContext(contextRequest, request, authorization) {
        var _a;
        const requestId = (0, crypto_1.randomUUID)();
        try {
            if (!(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith('Bearer '))) {
                return { success: false, error: 'Authentication required' };
            }
            const token = authorization.substring(7);
            const clientContext = this.extractClientContext(request, requestId);
            const validation = await this.unifiedSsoService.validateToken({ token }, clientContext);
            if (!((_a = validation.data) === null || _a === void 0 ? void 0 : _a.valid) || !validation.data.userContext) {
                return { success: false, error: 'Invalid or expired token' };
            }
            const userId = validation.data.userContext.userId;
            const preloadedContent = await this.seamlessAuthService.preloadPublishingContext(userId, contextRequest.productKey, contextRequest.contentHints);
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
        }
        catch (error) {
            this.logger.error(`Context preloading failed: ${(error instanceof Error ? error.message : String(error))}`, { requestId });
            return {
                success: false,
                error: (error instanceof Error ? error.message : String(error)),
            };
        }
    }
    extractClientContext(request, requestId, fingerprint) {
        return {
            ip: request.ip || request.connection.remoteAddress || 'unknown',
            userAgent: request.get('User-Agent') || 'unknown',
            fingerprint,
            requestId,
        };
    }
    async validateSeamlessLoginInput(query, clientContext) {
        if (!query.token || typeof query.token !== 'string' || query.token.trim().length === 0) {
            throw new common_1.HttpException('Token parameter is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const tokenParts = query.token.split('.');
        if (tokenParts.length !== 3) {
            throw new common_1.HttpException('Invalid token format', common_1.HttpStatus.BAD_REQUEST);
        }
        if (query.challenge && (typeof query.challenge !== 'string' || query.challenge.length < 8)) {
            throw new common_1.HttpException('Invalid challenge format', common_1.HttpStatus.BAD_REQUEST);
        }
        if (query.state && (typeof query.state !== 'string' || query.state.length > 255)) {
            throw new common_1.HttpException('Invalid state parameter', common_1.HttpStatus.BAD_REQUEST);
        }
        if (query.redirect_url) {
            try {
                const url = new URL(query.redirect_url);
                if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
                    throw new Error('Only HTTPS URLs allowed in production');
                }
            }
            catch (error) {
                throw new common_1.HttpException('Invalid redirect URL', common_1.HttpStatus.BAD_REQUEST);
            }
        }
    }
    buildErrorRedirectUrl(errorMessage, state) {
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
};
exports.SeamlessAuthController = SeamlessAuthController;
tslib_1.__decorate([
    (0, common_1.Get)('seamless-login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Process seamless login',
        description: 'Handles zero-friction authentication from external products. Users are automatically logged in and redirected to the publishing interface.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'token', description: 'Temporary authentication token', required: true }),
    (0, swagger_1.ApiQuery)({ name: 'challenge', description: 'Security challenge', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'state', description: 'CSRF state parameter', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'redirect_url', description: 'Post-login redirect URL', required: false }),
    (0, swagger_1.ApiResponse)({ status: 302, description: 'Redirect to Postiz dashboard with authentication' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid token or parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Authentication failed' }),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__param(3, (0, common_1.Headers)('x-fingerprint')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SeamlessAuthController.prototype, "handleSeamlessLogin", null);
tslib_1.__decorate([
    (0, common_1.Post)('auth/sso/validate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Validate SSO token',
        description: 'Validates an SSO token and returns user context information.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token validation result', type: sso_auth_dto_1.TokenValidationResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request' }),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [sso_auth_dto_1.TokenValidationDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SeamlessAuthController.prototype, "validateToken", null);
tslib_1.__decorate([
    (0, common_1.Post)('auth/sso/refresh'),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh SSO tokens',
        description: 'Refreshes an expired access token using a refresh token.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Token refresh result', type: sso_auth_dto_1.TokenRefreshResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' }),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [sso_auth_dto_1.TokenRefreshDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SeamlessAuthController.prototype, "refreshToken", null);
tslib_1.__decorate([
    (0, common_1.Post)('auth/sso/logout'),
    (0, swagger_1.ApiOperation)({
        summary: 'SSO logout',
        description: 'Logs out from SSO session and optionally from all connected products.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Logout result', type: sso_auth_dto_1.SsoLogoutResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request' }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [sso_auth_dto_1.SsoLogoutDto, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SeamlessAuthController.prototype, "logout", null);
tslib_1.__decorate([
    (0, common_1.Get)('auth/sso/session'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get SSO session',
        description: 'Returns information about the current SSO session.',
    }),
    (0, swagger_1.ApiHeader)({ name: 'Authorization', description: 'Bearer token', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session information' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired session' }),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Headers)('authorization')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SeamlessAuthController.prototype, "getSession", null);
tslib_1.__decorate([
    (0, common_1.Post)('auth/sso/preload'),
    (0, swagger_1.ApiOperation)({
        summary: 'Preload publishing context',
        description: 'Preloads user content and context for seamless publishing experience.',
    }),
    (0, swagger_1.ApiHeader)({ name: 'Authorization', description: 'Bearer token', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Preloaded content' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid or expired session' }),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Headers)('authorization')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SeamlessAuthController.prototype, "preloadContext", null);
exports.SeamlessAuthController = SeamlessAuthController = SeamlessAuthController_1 = tslib_1.__decorate([
    (0, common_1.Controller)(),
    (0, swagger_1.ApiTags)('Seamless Authentication'),
    (0, common_1.UseGuards)(sso_security_middleware_1.SsoSecurityMiddleware),
    tslib_1.__metadata("design:paramtypes", [unified_sso_service_1.UnifiedSsoService,
        seamless_auth_service_1.SeamlessAuthService,
        input_validation_service_1.InputValidationService,
        audit_logging_service_1.AuditLoggingService])
], SeamlessAuthController);
//# sourceMappingURL=seamless-auth.controller.js.map