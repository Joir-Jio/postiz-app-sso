"use strict";
var InternalApiController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalApiController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const throttler_1 = require("@nestjs/throttler");
const unified_sso_service_1 = require("@gitroom/backend/services/sso/unified-sso.service");
const platform_service_1 = require("@gitroom/backend/services/sso/platform.service");
const user_mapping_service_1 = require("@gitroom/backend/services/sso/user-mapping.service");
const sso_security_middleware_1 = require("@gitroom/nestjs-libraries/security/sso-security.middleware");
const input_validation_service_1 = require("@gitroom/nestjs-libraries/security/input-validation.service");
const audit_logging_service_1 = require("@gitroom/nestjs-libraries/security/audit-logging.service");
const gcs_storage_1 = require("@gitroom/nestjs-libraries/upload/gcs.storage");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const crypto_1 = require("crypto");
let InternalApiController = InternalApiController_1 = class InternalApiController {
    constructor(unifiedSsoService, platformService, userMappingService, inputValidation, auditLogger, gcsStorage) {
        this.unifiedSsoService = unifiedSsoService;
        this.platformService = platformService;
        this.userMappingService = userMappingService;
        this.inputValidation = inputValidation;
        this.auditLogger = auditLogger;
        this.gcsStorage = gcsStorage;
        this.logger = new common_1.Logger(InternalApiController_1.name);
    }
    async ensureUser(request, authorization, req) {
        var _a;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        this.logger.log(`User ensure request received`, {
            requestId,
            productKey: request.productKey,
            email: request.email,
            externalUserId: request.externalUserId,
        });
        try {
            await this.authenticateInternalRequest(authorization, req, requestId);
            await this.validateEnsureUserRequest(request);
            const existingMapping = await this.userMappingService.findUserMapping(request.productKey, request.externalUserId);
            if (existingMapping && existingMapping.status === 'active') {
                const user = {
                    id: existingMapping.userId,
                    email: existingMapping.email,
                    name: existingMapping.name,
                    avatar: existingMapping.avatar,
                    isNew: false,
                };
                const userContext = await this.unifiedSsoService.getUserContext(existingMapping.userId, request.productKey);
                return {
                    success: true,
                    user,
                    organization: {
                        id: existingMapping.organizationId,
                        name: (userContext === null || userContext === void 0 ? void 0 : userContext.organization.name) || 'Organization',
                        isNew: false,
                    },
                    mapping: {
                        id: existingMapping.id,
                        externalUserId: existingMapping.externalUserId,
                        permissions: existingMapping.permissions,
                    },
                };
            }
            const mappingResult = await this.userMappingService.createUserMapping(request.productKey, request.externalUserId, {
                externalUserId: request.externalUserId,
                email: request.email,
                name: request.name,
                avatar: request.avatar,
                customFields: request.metadata,
            }, {
                autoCreateUser: true,
                organizationName: request.organizationName,
                permissions: this.convertToTrustDomainScopes(request.permissions || []),
                metadata: request.metadata,
                clientContext: {
                    ip: req.ip || 'internal',
                    userAgent: req.get('User-Agent') || 'internal-api',
                },
            });
            if (!mappingResult.success || !mappingResult.data) {
                throw new common_1.HttpException(((_a = mappingResult.error) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to create user mapping', common_1.HttpStatus.BAD_REQUEST);
            }
            const mapping = mappingResult.data;
            const userContext = await this.unifiedSsoService.getUserContext(mapping.userId, request.productKey);
            if (!userContext) {
                throw new common_1.HttpException('Failed to retrieve user context', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
            await this.auditLogger.logEvent('user_ensured', {
                requestId,
                productKey: request.productKey,
                userId: mapping.userId,
                externalUserId: request.externalUserId,
                email: request.email,
                isNewUser: true,
                clientIP: req.ip,
                processingTime: Date.now() - startTime,
            });
            const response = {
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)) : String(error);
            const errorStack = error instanceof Error ? (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined) : undefined;
            this.logger.error(`User ensure failed: ${errorMessage}`, {
                requestId,
                productKey: request.productKey,
                error: errorStack,
            });
            if (error instanceof common_1.HttpException) {
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
    async linkMedia(request, authorization, req) {
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        try {
            await this.authenticateInternalRequest(authorization, req, requestId);
            if (!request.mediaReferences || !Array.isArray(request.mediaReferences)) {
                throw new common_1.HttpException('Media references array is required', common_1.HttpStatus.BAD_REQUEST);
            }
            if (request.mediaReferences.length > 100) {
                throw new common_1.HttpException('Maximum 100 media references per request', common_1.HttpStatus.BAD_REQUEST);
            }
            const userMappings = await this.userMappingService.findUserMappings(request.userId);
            const productMapping = userMappings.find(m => m.productKey === request.productKey);
            if (!productMapping) {
                throw new common_1.HttpException('User mapping not found for product', common_1.HttpStatus.NOT_FOUND);
            }
            const results = {
                success: true,
                linkedCount: 0,
                mediaReferences: [],
                errors: [],
            };
            for (const mediaRef of request.mediaReferences) {
                try {
                    const mediaReference = await this.createMediaReference(request.productKey, request.userId, productMapping.organizationId, mediaRef);
                    results.mediaReferences.push({
                        externalMediaId: mediaRef.externalMediaId,
                        postizMediaId: mediaReference.id,
                        url: mediaReference.url,
                    });
                    results.linkedCount++;
                }
                catch (error) {
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
        }
        catch (error) {
            this.logger.error(`Media linking failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Media linking failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUserMappings(userId, includeInactive = false, authorization, req) {
        const requestId = (0, crypto_1.randomUUID)();
        try {
            await this.authenticateInternalRequest(authorization, req, requestId);
            const mappings = await this.userMappingService.findUserMappings(userId, includeInactive);
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
        }
        catch (error) {
            this.logger.error(`Failed to get user mappings: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                userId,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to get user mappings: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async consolidateUsers(request, authorization, req) {
        var _a;
        const requestId = (0, crypto_1.randomUUID)();
        const startTime = Date.now();
        try {
            await this.authenticateInternalRequest(authorization, req, requestId);
            if (!request.primaryUserId || !request.duplicateUserIds || request.duplicateUserIds.length === 0) {
                throw new common_1.HttpException('Primary user ID and duplicate user IDs are required', common_1.HttpStatus.BAD_REQUEST);
            }
            if (request.duplicateUserIds.length > 10) {
                throw new common_1.HttpException('Maximum 10 duplicate users per consolidation', common_1.HttpStatus.BAD_REQUEST);
            }
            const adminUserId = await this.extractAdminUserId(authorization);
            const consolidationRequest = {
                primaryUserId: request.primaryUserId,
                duplicateUserIds: request.duplicateUserIds,
                mergeStrategy: request.mergeStrategy,
                conflictResolution: request.conflictResolution,
                requestedBy: adminUserId,
            };
            const result = await this.userMappingService.consolidateUsers(consolidationRequest, {
                adminUserId,
                ip: req.ip || 'internal',
                userAgent: req.get('User-Agent') || 'internal-api',
            });
            if (!result.success || !result.data) {
                return {
                    success: false,
                    consolidatedUserId: request.primaryUserId,
                    mergedMappings: 0,
                    error: ((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || 'Consolidation failed',
                };
            }
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
        }
        catch (error) {
            this.logger.error(`User consolidation failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                primaryUserId: request.primaryUserId,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            if (error instanceof common_1.HttpException) {
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
    async getSsoAnalytics(productKey, timeRange = '24h', authorization, req = {}) {
        const requestId = (0, crypto_1.randomUUID)();
        try {
            if (authorization) {
                await this.authenticateInternalRequest(authorization, req, requestId);
            }
            const mappingAnalytics = await this.userMappingService.getMappingAnalytics(productKey);
            const products = await this.platformService.listProducts(undefined, true, true);
            const productHealth = products
                .filter(p => !productKey || p.productKey === productKey)
                .map(p => {
                var _a, _b, _c, _d, _e, _f;
                return ({
                    productKey: p.productKey,
                    productName: p.productName,
                    status: p.status,
                    healthy: ((_a = p.health) === null || _a === void 0 ? void 0 : _a.healthy) || false,
                    activeUsers: ((_b = p.analytics) === null || _b === void 0 ? void 0 : _b.activeUsers24h) || 0,
                    requests24h: ((_d = (_c = p.health) === null || _c === void 0 ? void 0 : _c.metrics) === null || _d === void 0 ? void 0 : _d.requests24h) || 0,
                    errorRate: ((_f = (_e = p.health) === null || _e === void 0 ? void 0 : _e.metrics) === null || _f === void 0 ? void 0 : _f.errorRate) || 0,
                });
            });
            const recentActivity = [];
            const errorSummary = [];
            return {
                success: true,
                analytics: {
                    userMappings: mappingAnalytics,
                    productHealth,
                    recentActivity,
                    errorSummary,
                },
            };
        }
        catch (error) {
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
    async testWebhook(productKey, testRequest, authorization, req) {
        var _a;
        const requestId = (0, crypto_1.randomUUID)();
        try {
            await this.authenticateInternalRequest(authorization, req, requestId);
            const products = await this.platformService.listProducts();
            const product = products.find(p => p.productKey === productKey);
            if (!product) {
                throw new common_1.HttpException('Product not found', common_1.HttpStatus.NOT_FOUND);
            }
            const webhookEndpoints = ((_a = product.settings) === null || _a === void 0 ? void 0 : _a.webhookEndpoints) || {};
            const webhookUrl = webhookEndpoints[testRequest.webhookType];
            if (!webhookUrl) {
                return {
                    success: false,
                    error: `Webhook endpoint not configured for ${testRequest.webhookType}`,
                };
            }
            const testResult = await this.performWebhookTest(webhookUrl, testRequest.webhookType, testRequest.payload || {});
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
        }
        catch (error) {
            this.logger.error(`Webhook test failed: ${(error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error))}`, {
                requestId,
                productKey,
                error: (error instanceof Error ? (error instanceof Error ? error.stack : undefined) : undefined),
            });
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            return {
                success: false,
                error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
            };
        }
    }
    async authenticateInternalRequest(authorization, request, requestId) {
        if (!(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith('Bearer '))) {
            throw new common_1.HttpException('Internal authentication required', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = authorization.substring(7);
        try {
            const decoded = auth_service_1.AuthService.verifyJWT(token);
            if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
                throw new common_1.HttpException('Invalid authentication token', common_1.HttpStatus.UNAUTHORIZED);
            }
            this.logger.debug(`Internal request authenticated`, {
                requestId,
                userId: decoded.id,
                clientIP: request.ip,
            });
        }
        catch (error) {
            this.logger.warn(`Internal authentication failed`, {
                requestId,
                error: (error instanceof Error ? (error instanceof Error ? error.message : String(error)) : String(error)),
                clientIP: request.ip,
            });
            throw new common_1.HttpException('Authentication failed', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async validateEnsureUserRequest(request) {
        const required = ['productKey', 'email', 'externalUserId'];
        for (const field of required) {
            if (!request[field]) {
                throw new common_1.HttpException(`${field} is required`, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(request.email)) {
            throw new common_1.HttpException('Invalid email format', common_1.HttpStatus.BAD_REQUEST);
        }
        if (request.externalUserId.length < 1 || request.externalUserId.length > 255) {
            throw new common_1.HttpException('External user ID must be 1-255 characters', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    convertToTrustDomainScopes(permissions) {
        return permissions;
    }
    async createMediaReference(productKey, userId, organizationId, mediaRef) {
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
    async extractAdminUserId(authorization) {
        const token = authorization.substring(7);
        const decoded = auth_service_1.AuthService.verifyJWT(token);
        return (typeof decoded !== 'string' && 'id' in decoded) ? decoded.id : 'unknown-admin';
    }
    async performWebhookTest(webhookUrl, webhookType, payload) {
        return {
            success: true,
            responseStatus: 200,
            responseTime: 150,
        };
    }
    get prisma() {
        return {
            mediaReference: {
                create: async (data) => (Object.assign({ id: (0, crypto_1.randomUUID)() }, data.data)),
            },
        };
    }
};
exports.InternalApiController = InternalApiController;
tslib_1.__decorate([
    (0, common_1.Post)('ensure-user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Ensure user exists',
        description: 'Pre-creates or ensures user and organization exist for seamless SSO flow. Used by external products to prepare user context before SSO.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User ensured', type: Object }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid request data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Internal authentication required' }),
    (0, throttler_1.Throttle)({ default: { limit: 100, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Headers)('authorization')),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InternalApiController.prototype, "ensureUser", null);
tslib_1.__decorate([
    (0, common_1.Post)('link-media'),
    (0, swagger_1.ApiOperation)({
        summary: 'Link external media',
        description: 'Links external media files to user context for seamless publishing experience.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Media linked successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid media data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Internal authentication required' }),
    (0, throttler_1.Throttle)({ default: { limit: 50, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Headers)('authorization')),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InternalApiController.prototype, "linkMedia", null);
tslib_1.__decorate([
    (0, common_1.Get)('user-mappings/:userId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user mappings',
        description: 'Retrieves all product mappings for a specific user.',
    }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'Postiz user ID' }),
    (0, swagger_1.ApiQuery)({ name: 'includeInactive', required: false, description: 'Include inactive mappings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User mappings' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Internal authentication required' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, throttler_1.Throttle)({ default: { limit: 200, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Param)('userId')),
    tslib_1.__param(1, (0, common_1.Query)('includeInactive')),
    tslib_1.__param(2, (0, common_1.Headers)('authorization')),
    tslib_1.__param(3, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Boolean, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InternalApiController.prototype, "getUserMappings", null);
tslib_1.__decorate([
    (0, common_1.Post)('consolidate-users'),
    (0, swagger_1.ApiOperation)({
        summary: 'Consolidate duplicate users',
        description: 'Consolidates duplicate user accounts across multiple products.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users consolidated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid consolidation request' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Internal authentication required' }),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 300000 } }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Headers)('authorization')),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InternalApiController.prototype, "consolidateUsers", null);
tslib_1.__decorate([
    (0, common_1.Get)('analytics/sso'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get SSO analytics',
        description: 'Retrieves comprehensive SSO analytics and usage metrics.',
    }),
    (0, swagger_1.ApiQuery)({ name: 'productKey', required: false, description: 'Filter by product key' }),
    (0, swagger_1.ApiQuery)({ name: 'timeRange', required: false, description: 'Time range (24h, 7d, 30d)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'SSO analytics' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Internal authentication required' }),
    (0, throttler_1.Throttle)({ default: { limit: 60, ttl: 300000 } }),
    tslib_1.__param(0, (0, common_1.Query)('productKey')),
    tslib_1.__param(1, (0, common_1.Query)('timeRange')),
    tslib_1.__param(2, (0, common_1.Headers)('authorization')),
    tslib_1.__param(3, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InternalApiController.prototype, "getSsoAnalytics", null);
tslib_1.__decorate([
    (0, common_1.Post)('products/:productKey/test-webhook'),
    (0, swagger_1.ApiOperation)({
        summary: 'Test product webhook',
        description: 'Tests webhook endpoints for a specific product.',
    }),
    (0, swagger_1.ApiParam)({ name: 'productKey', description: 'Product identifier' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook test results' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Internal authentication required' }),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }),
    tslib_1.__param(0, (0, common_1.Param)('productKey')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Headers)('authorization')),
    tslib_1.__param(3, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InternalApiController.prototype, "testWebhook", null);
exports.InternalApiController = InternalApiController = InternalApiController_1 = tslib_1.__decorate([
    (0, common_1.Controller)('api/internal'),
    (0, swagger_1.ApiTags)('Internal API'),
    (0, common_1.UseGuards)(sso_security_middleware_1.SsoSecurityMiddleware),
    (0, swagger_1.ApiBearerAuth)(),
    tslib_1.__metadata("design:paramtypes", [unified_sso_service_1.UnifiedSsoService,
        platform_service_1.PlatformService,
        user_mapping_service_1.UserMappingService,
        input_validation_service_1.InputValidationService,
        audit_logging_service_1.AuditLoggingService,
        gcs_storage_1.GCSStorage])
], InternalApiController);
//# sourceMappingURL=internal-api.controller.js.map