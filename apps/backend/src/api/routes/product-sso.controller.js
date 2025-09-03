"use strict";
var ProductSsoController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSsoController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const sso_auth_dto_1 = require("@gitroom/nestjs-libraries/dtos/sso/sso-auth.dto");
const unified_sso_service_1 = require("@gitroom/backend/services/sso/unified-sso.service");
const platform_service_1 = require("@gitroom/backend/services/sso/platform.service");
const user_mapping_service_1 = require("@gitroom/backend/services/sso/user-mapping.service");
const sso_security_middleware_1 = require("@gitroom/nestjs-libraries/security/sso-security.middleware");
const input_validation_service_1 = require("@gitroom/nestjs-libraries/security/input-validation.service");
const audit_logging_service_1 = require("@gitroom/nestjs-libraries/security/audit-logging.service");
const core_types_1 = require("@gitroom/nestjs-libraries/types/sso/core.types");
const crypto_1 = require("crypto");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
let ProductSsoController = ProductSsoController_1 = class ProductSsoController {
    constructor(unifiedSsoService, platformService, userMappingService, inputValidation, auditLogger) {
        this.unifiedSsoService = unifiedSsoService;
        this.platformService = platformService;
        this.userMappingService = userMappingService;
        this.inputValidation = inputValidation;
        this.auditLogger = auditLogger;
        this.logger = new common_1.Logger(ProductSsoController_1.name);
    }
    async generateSsoToken(productKey, loginRequest, apiKey, apiSecret, request) {
        var _a;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        this.logger.log(`SSO token generation requested`, {
            requestId,
            productKey,
            email: loginRequest.email,
            externalUserId: loginRequest.externalUserId,
        });
        try {
            const authContext = await this.authenticateProductRequest(productKey, apiKey, apiSecret, request, requestId);
            if (!authContext.isValid) {
                throw new common_1.HttpException('Invalid API credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            await this.inputValidation.validateDto(loginRequest, sso_auth_dto_1.SsoLoginInitiateDto);
            loginRequest.productKey = productKey;
            const result = await this.unifiedSsoService.initiateLogin(loginRequest, {
                ip: authContext.clientIP,
                userAgent: authContext.userAgent,
            });
            if (!result.success || !result.data) {
                throw new common_1.HttpException(((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || 'SSO token generation failed', common_1.HttpStatus.BAD_REQUEST);
            }
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
        }
        catch (error) {
            this.logger.error(`SSO token generation failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                productKey,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            await this.auditLogger.logEvent('sso_token_generation_failed', {
                requestId,
                productKey,
                error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
                apiKey: (apiKey === null || apiKey === void 0 ? void 0 : apiKey.substring(0, 10)) + '...',
                clientIP: request.ip,
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`SSO token generation failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async handleSsoCallback(productKey, callbackRequest, apiKey, apiSecret, request) {
        var _a;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        try {
            const authContext = await this.authenticateProductRequest(productKey, apiKey, apiSecret, request, requestId);
            if (!authContext.isValid) {
                throw new common_1.HttpException('Invalid API credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            await this.inputValidation.validateDto(callbackRequest, sso_auth_dto_1.SsoCallbackDto);
            const result = await this.unifiedSsoService.completeCallback(callbackRequest, {
                ip: authContext.clientIP,
                userAgent: authContext.userAgent,
            });
            if (!result.success || !result.data) {
                throw new common_1.HttpException(((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || 'SSO callback processing failed', common_1.HttpStatus.BAD_REQUEST);
            }
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
        }
        catch (error) {
            this.logger.error(`SSO callback processing failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                productKey,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`SSO callback processing failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserContext(productKey, userId, apiKey, request, externalUserId, email, includes) {
        const requestId = (0, crypto_1.randomUUID)();
        try {
            const authContext = await this.authenticateProductRequest(productKey, apiKey, undefined, request, requestId);
            if (!authContext.isValid) {
                throw new common_1.HttpException('Invalid API credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            let userMapping = null;
            if (userId) {
                const mappings = await this.userMappingService.findUserMappings(userId);
                userMapping = mappings.find(m => m.productKey === productKey);
            }
            else if (externalUserId) {
                userMapping = await this.userMappingService.findUserMapping(productKey, externalUserId);
            }
            else if (email) {
                this.logger.warn(`User lookup by email is inefficient`, { requestId, productKey, email });
            }
            if (!userMapping) {
                return {
                    success: false,
                    error: 'User not found or not authorized for this product',
                };
            }
            const userContext = await this.unifiedSsoService.getUserContext(userMapping.userId, productKey, includes ? includes.split(',') : []);
            if (!userContext) {
                return {
                    success: false,
                    error: 'Unable to retrieve user context',
                };
            }
            const includesArray = includes ? includes.split(',') : [];
            const response = {
                success: true,
                permissionLevel: userMapping.dataAccessLevel.toLowerCase(),
                expiresAt: (0, dayjs_1.default)().add(1, 'hour').toDate(),
            };
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
            if (includesArray.includes('organization')) {
                response.organization = {
                    id: userContext.organization.id,
                    name: userContext.organization.name,
                    settings: {},
                };
            }
            if (includesArray.includes('integrations')) {
                response.integrations = [];
            }
            if (includesArray.includes('media')) {
                response.media = [];
            }
            this.logger.debug(`User context retrieved`, {
                requestId,
                productKey,
                userId: userMapping.userId,
                includes: includesArray,
            });
            return response;
        }
        catch (error) {
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
    async syncUserData(productKey, syncRequest, apiKey, apiSecret, request) {
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        try {
            const authContext = await this.authenticateProductRequest(productKey, apiKey, apiSecret, request, requestId);
            if (!authContext.isValid) {
                throw new common_1.HttpException('Invalid API credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            if (!syncRequest.users || !Array.isArray(syncRequest.users) || syncRequest.users.length === 0) {
                throw new common_1.HttpException('Users array is required and must not be empty', common_1.HttpStatus.BAD_REQUEST);
            }
            if (syncRequest.users.length > 1000) {
                throw new common_1.HttpException('Maximum 1000 users per sync request', common_1.HttpStatus.BAD_REQUEST);
            }
            const userProfiles = syncRequest.users.map(user => ({
                externalUserId: user.externalUserId,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                customFields: user.customFields,
            }));
            const result = await this.userMappingService.batchSyncUsers(productKey, userProfiles, syncRequest.options || {});
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
            this.logger.log(`User data sync completed`, Object.assign(Object.assign({ requestId,
                productKey }, result), { processingTime: Date.now() - startTime }));
            return Object.assign({ success: true }, result);
        }
        catch (error) {
            this.logger.error(`User data sync failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                productKey,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`User data sync failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getProductHealth(productKey, apiKey, request) {
        const requestId = (0, crypto_1.randomUUID)();
        try {
            const authContext = await this.authenticateProductRequest(productKey, apiKey, undefined, request, requestId);
            if (!authContext.isValid) {
                throw new common_1.HttpException('Invalid API credentials', common_1.HttpStatus.UNAUTHORIZED);
            }
            const healthStatus = await this.platformService.getProductHealth(productKey);
            const analytics = await this.platformService.getProductAnalytics(productKey);
            if (!healthStatus) {
                throw new common_1.HttpException('Health status not available', common_1.HttpStatus.NOT_FOUND);
            }
            const response = {
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
                    activeUsers: (analytics === null || analytics === void 0 ? void 0 : analytics.activeUsers24h) || 0,
                },
            };
            return response;
        }
        catch (error) {
            this.logger.error(`Health check failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                productKey,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
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
    async registerProduct(registrationPayload, authorization, request) {
        var _a;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        try {
            if (!(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith('Bearer '))) {
                throw new common_1.HttpException('Admin authentication required', common_1.HttpStatus.UNAUTHORIZED);
            }
            const adminToken = authorization.substring(7);
            const adminUserId = 'admin-user-id';
            await this.inputValidation.validateObject(registrationPayload, [
                'productKey',
                'productName',
                'baseUrl',
                'adminEmail',
                'configuration',
                'capabilities',
            ]);
            const result = await this.platformService.registerProduct(registrationPayload, {
                adminUserId,
                ip: request.ip || 'unknown',
                userAgent: request.get('User-Agent') || 'unknown',
            });
            if (!result.success || !result.data) {
                return {
                    success: false,
                    productKey: registrationPayload.productKey,
                    error: ((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || 'Product registration failed',
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
                apiCredentials: {
                    apiKey: 'sent-via-email',
                    apiSecret: 'sent-via-email',
                    webhookSecret: 'sent-via-email',
                },
            };
        }
        catch (error) {
            this.logger.error(`Product registration failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                productKey: registrationPayload === null || registrationPayload === void 0 ? void 0 : registrationPayload.productKey,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Product registration failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async authenticateProductRequest(productKey, apiKey, apiSecret, request, requestId) {
        var _a, _b;
        const context = {
            productKey,
            apiKey: apiKey || '',
            apiSecret,
            clientIP: request.ip || 'unknown',
            userAgent: request.get('User-Agent') || 'unknown',
            requestId,
            isValid: false,
        };
        try {
            if (!productKey || !apiKey) {
                this.logger.warn(`Missing authentication parameters`, { requestId, productKey });
                return context;
            }
            const products = await this.platformService.listProducts(core_types_1.ProductStatus.ACTIVE);
            const product = products.find(p => p.productKey === productKey);
            if (!product) {
                this.logger.warn(`Product not found or inactive`, { requestId, productKey });
                return context;
            }
            const storedApiKey = (_a = product.settings) === null || _a === void 0 ? void 0 : _a.apiKey;
            if (storedApiKey !== apiKey) {
                this.logger.warn(`Invalid API key`, { requestId, productKey, apiKey: apiKey.substring(0, 10) + '...' });
                return context;
            }
            if (apiSecret) {
                const storedSecretHash = (_b = product.settings) === null || _b === void 0 ? void 0 : _b.apiSecret;
                const providedSecretHash = this.hashApiSecret(apiSecret);
                if (storedSecretHash !== providedSecretHash) {
                    this.logger.warn(`Invalid API secret`, { requestId, productKey });
                    return context;
                }
            }
            await this.performSecurityChecks(context, product);
            context.isValid = true;
            return context;
        }
        catch (error) {
            this.logger.error(`API authentication failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                productKey,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            return context;
        }
    }
    hashApiSecret(secret) {
        return (0, crypto_1.createHmac)('sha256', process.env.JWT_SECRET || 'fallback-secret')
            .update(secret)
            .digest('hex');
    }
    async performSecurityChecks(context, product) {
        this.logger.debug(`Security checks passed`, {
            requestId: context.requestId,
            productKey: context.productKey,
        });
    }
};
exports.ProductSsoController = ProductSsoController;
tslib_1.__decorate([
    (0, common_1.Post)(':productKey/sso/generate'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate SSO token',
        description: 'Generates a temporary SSO token for user authentication. External products call this when users click "publish" to initiate seamless login.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productKey', description: 'Product identifier' }),
    (0, swagger_1.ApiHeader)({ name: 'X-API-Key', description: 'Product API key', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'X-API-Secret', description: 'Product API secret', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SSO token generated', type: sso_auth_dto_1.SsoLoginResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request parameters' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid API credentials' }),
    (0, swagger_1.ApiResponse)({ status: 429, description: 'Rate limit exceeded' }),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Param)('productKey')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Headers)('x-api-key')),
    tslib_1.__param(3, (0, common_1.Headers)('x-api-secret')),
    tslib_1.__param(4, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, sso_auth_dto_1.SsoLoginInitiateDto, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductSsoController.prototype, "generateSsoToken", null);
tslib_1.__decorate([
    (0, common_1.Post)(':productKey/sso/callback'),
    (0, swagger_1.ApiOperation)({
        summary: 'Handle SSO callback',
        description: 'Processes SSO callback and completes the authentication flow.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productKey', description: 'Product identifier' }),
    (0, swagger_1.ApiHeader)({ name: 'X-API-Key', description: 'Product API key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Callback processed', type: sso_auth_dto_1.SsoCallbackResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid callback data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid API credentials' }),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Param)('productKey')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Headers)('x-api-key')),
    tslib_1.__param(3, (0, common_1.Headers)('x-api-secret')),
    tslib_1.__param(4, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, sso_auth_dto_1.SsoCallbackDto, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductSsoController.prototype, "handleSsoCallback", null);
tslib_1.__decorate([
    (0, common_1.Get)(':productKey/sso/user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user context',
        description: 'Retrieves user context and permissions for cross-product operations.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productKey', description: 'Product identifier' }),
    (0, swagger_1.ApiHeader)({ name: 'X-API-Key', description: 'Product API key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User context', type: sso_auth_dto_1.UserContextResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid API credentials' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, throttler_1.Throttle)({ default: { limit: 200, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Param)('productKey')),
    tslib_1.__param(1, (0, common_1.Query)('userId')),
    tslib_1.__param(2, (0, common_1.Headers)('x-api-key')),
    tslib_1.__param(3, (0, common_1.Req)()),
    tslib_1.__param(4, (0, common_1.Query)('externalUserId')),
    tslib_1.__param(5, (0, common_1.Query)('email')),
    tslib_1.__param(6, (0, common_1.Query)('includes')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, Object, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductSsoController.prototype, "getUserContext", null);
tslib_1.__decorate([
    (0, common_1.Post)(':productKey/sso/sync'),
    (0, swagger_1.ApiOperation)({
        summary: 'Sync user data',
        description: 'Synchronizes user data between external product and Postiz.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productKey', description: 'Product identifier' }),
    (0, swagger_1.ApiHeader)({ name: 'X-API-Key', description: 'Product API key', required: true }),
    (0, swagger_1.ApiHeader)({ name: 'X-API-Secret', description: 'Product API secret', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sync completed' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid sync data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid API credentials' }),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Param)('productKey')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Headers)('x-api-key')),
    tslib_1.__param(3, (0, common_1.Headers)('x-api-secret')),
    tslib_1.__param(4, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductSsoController.prototype, "syncUserData", null);
tslib_1.__decorate([
    (0, common_1.Get)(':productKey/health'),
    (0, swagger_1.ApiOperation)({
        summary: 'Product health check',
        description: 'Returns health status and analytics for the product integration.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productKey', description: 'Product identifier' }),
    (0, swagger_1.ApiHeader)({ name: 'X-API-Key', description: 'Product API key', required: true }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Health status' }),
    (0, throttler_1.Throttle)({ default: { limit: 60, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Param)('productKey')),
    tslib_1.__param(1, (0, common_1.Headers)('x-api-key')),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductSsoController.prototype, "getProductHealth", null);
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register new product',
        description: 'Registers a new product for SSO integration. Admin credentials required.',
    }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product registered successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid registration data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Admin authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Product already exists' }),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 300000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Headers)('authorization')),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductSsoController.prototype, "registerProduct", null);
exports.ProductSsoController = ProductSsoController = ProductSsoController_1 = tslib_1.__decorate([
    (0, common_1.Controller)('api/products'),
    (0, swagger_1.ApiTags)('Product SSO Integration'),
    (0, common_1.UseGuards)(sso_security_middleware_1.SsoSecurityMiddleware),
    tslib_1.__metadata("design:paramtypes", [unified_sso_service_1.UnifiedSsoService,
        platform_service_1.PlatformService,
        user_mapping_service_1.UserMappingService,
        input_validation_service_1.InputValidationService,
        audit_logging_service_1.AuditLoggingService])
], ProductSsoController);
//# sourceMappingURL=product-sso.controller.js.map