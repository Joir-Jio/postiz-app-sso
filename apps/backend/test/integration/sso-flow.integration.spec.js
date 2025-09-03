"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const testing_1 = require("@nestjs/testing");
const event_emitter_1 = require("@nestjs/event-emitter");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const unified_sso_service_1 = require("../../src/services/sso/unified-sso.service");
const seamless_auth_service_1 = require("../../src/services/sso/seamless-auth.service");
const media_reference_service_1 = require("../../src/services/media/media-reference.service");
const enhanced_jwt_service_1 = require("@gitroom/nestjs-libraries/security/enhanced-jwt.service");
const sso_1 = require("@gitroom/nestjs-libraries/types/sso");
const test_environment_1 = require("@test-utils/test-environment");
describe('SSO Flow Integration Tests', () => {
    let app;
    let prisma;
    let unifiedSsoService;
    let seamlessAuthService;
    let mediaReferenceService;
    let jwtService;
    let eventEmitter;
    let testUser;
    let testOrganization;
    let testProduct;
    let testProductUser;
    beforeAll(async () => {
        const moduleRef = await testing_1.Test.createTestingModule({
            imports: [],
        }).compile();
        app = moduleRef.createNestApplication();
        prisma = moduleRef.get(prisma_service_1.PrismaService);
        unifiedSsoService = moduleRef.get(unified_sso_service_1.UnifiedSsoService);
        seamlessAuthService = moduleRef.get(seamless_auth_service_1.SeamlessAuthService);
        mediaReferenceService = moduleRef.get(media_reference_service_1.MediaReferenceService);
        jwtService = moduleRef.get(enhanced_jwt_service_1.EnhancedJwtService);
        eventEmitter = moduleRef.get(event_emitter_1.EventEmitter2);
        await app.init();
        test_environment_1.testEnv.registerTestModule('SSO Integration', moduleRef);
    });
    afterAll(async () => {
        await app.close();
    });
    beforeEach(async () => {
        testUser = await test_environment_1.testEnv.createTestUser({
            email: 'integration-test@example.com',
            name: 'Integration Test User',
        });
        testOrganization = await test_environment_1.testEnv.createTestOrganization({
            name: 'Integration Test Organization',
        });
        testProduct = await test_environment_1.testEnv.createTestProduct({
            productKey: 'integration-test-product',
            productName: 'Integration Test Product',
            status: sso_1.ProductStatus.ACTIVE,
            gcsBucketName: 'integration-test-bucket',
        });
        testProductUser = await test_environment_1.testEnv.createTestProductUser({
            userId: testUser.id,
            organizationId: testOrganization.id,
            productId: testProduct.id,
            externalUserId: 'external-integration-user',
        });
    });
    describe('Complete SSO Authentication Flow', () => {
        it('should complete full SSO flow from initiation to callback', async () => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const clientContext = {
                ip: '127.0.0.1',
                userAgent: 'IntegrationTestClient/1.0',
            };
            const initiationResult = await unifiedSsoService.initiateLogin({
                productKey: testProduct.productKey,
                email: testUser.email,
                externalUserId: testProductUser.externalUserId,
                name: testUser.name,
                autoCreateUser: false,
                scopes: [sso_1.TrustDomainScope.SSO_LOGIN, sso_1.TrustDomainScope.MEDIA_ACCESS],
                metadata: { source: 'integration-test' },
            }, clientContext);
            expect(initiationResult.success).toBe(true);
            expect((_a = initiationResult.data) === null || _a === void 0 ? void 0 : _a.temporaryToken).toBeDefined();
            expect((_b = initiationResult.data) === null || _b === void 0 ? void 0 : _b.challenge).toBeDefined();
            expect((_c = initiationResult.data) === null || _c === void 0 ? void 0 : _c.authUrl).toContain('/seamless-login');
            const callbackResult = await unifiedSsoService.completeCallback({
                temporaryToken: initiationResult.data.temporaryToken,
                challenge: initiationResult.data.challenge,
                state: 'integration-test-state',
            }, clientContext);
            expect(callbackResult.success).toBe(true);
            expect((_d = callbackResult.data) === null || _d === void 0 ? void 0 : _d.accessToken).toBeDefined();
            expect((_e = callbackResult.data) === null || _e === void 0 ? void 0 : _e.refreshToken).toBeDefined();
            expect((_f = callbackResult.data) === null || _f === void 0 ? void 0 : _f.user.id).toBe(testUser.id);
            expect((_g = callbackResult.data) === null || _g === void 0 ? void 0 : _g.organization.id).toBe(testOrganization.id);
            const validationResult = await unifiedSsoService.validateToken({
                token: callbackResult.data.accessToken,
                expectedProduct: testProduct.productKey,
            }, clientContext);
            expect(validationResult.success).toBe(true);
            expect((_h = validationResult.data) === null || _h === void 0 ? void 0 : _h.valid).toBe(true);
            expect((_k = (_j = validationResult.data) === null || _j === void 0 ? void 0 : _j.userContext) === null || _k === void 0 ? void 0 : _k.userId).toBe(testUser.id);
        });
        it('should handle seamless login with token', async () => {
            var _a, _b, _c, _d;
            const clientContext = {
                ip: '127.0.0.1',
                userAgent: 'IntegrationTestClient/1.0',
                fingerprint: 'integration-test-fingerprint',
            };
            const tokenPayload = {
                productKey: testProduct.productKey,
                userId: testUser.id,
                organizationId: testOrganization.id,
                externalUserId: testProductUser.externalUserId,
                redirectUrl: '/dashboard?source=integration-test',
                mediaReferences: [],
                preloadContent: {},
            };
            const temporaryToken = await jwtService.createSsoAccessToken({
                productKey: testProduct.productKey,
                userId: testUser.id,
                organizationId: testOrganization.id,
                externalUserId: testProductUser.externalUserId,
                email: testUser.email,
                name: testUser.name,
                sessionId: 'integration-session',
                scopes: [sso_1.TrustDomainScope.SSO_LOGIN],
                metadata: tokenPayload,
                clientIP: clientContext.ip,
                userAgent: clientContext.userAgent,
            }, { customExpiry: 300 });
            const seamlessResult = await seamlessAuthService.processSeamlessLogin(temporaryToken.accessToken, 'integration-challenge', 'integration-state', clientContext);
            expect(seamlessResult.success).toBe(true);
            expect((_a = seamlessResult.data) === null || _a === void 0 ? void 0 : _a.success).toBe(true);
            expect((_b = seamlessResult.data) === null || _b === void 0 ? void 0 : _b.user.id).toBe(testUser.id);
            expect((_c = seamlessResult.data) === null || _c === void 0 ? void 0 : _c.accessToken).toBeDefined();
            expect((_d = seamlessResult.data) === null || _d === void 0 ? void 0 : _d.preloadedContent).toBeDefined();
            const preloaded = seamlessResult.data.preloadedContent;
            expect(preloaded.mediaFiles).toBeDefined();
            expect(preloaded.userIntegrations).toBeDefined();
            expect(preloaded.recentPosts).toBeDefined();
            expect(preloaded.settings).toBeDefined();
            expect(preloaded.settings.timezone).toBeDefined();
        });
    });
    describe('API Endpoint Integration', () => {
        it('should handle SSO initiation via API endpoint', async () => {
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/sso/initiate')
                .send({
                productKey: testProduct.productKey,
                email: testUser.email,
                externalUserId: testProductUser.externalUserId,
                name: testUser.name,
                autoCreateUser: false,
                scopes: [sso_1.TrustDomainScope.SSO_LOGIN],
            })
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.authUrl).toBeDefined();
            expect(response.body.data.temporaryToken).toBeDefined();
            expect(response.body.data.challenge).toBeDefined();
        });
        it('should handle SSO callback via API endpoint', async () => {
            const initResponse = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/sso/initiate')
                .send({
                productKey: testProduct.productKey,
                email: testUser.email,
                externalUserId: testProductUser.externalUserId,
                autoCreateUser: false,
            });
            const { temporaryToken, challenge } = initResponse.body.data;
            const callbackResponse = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/sso/callback')
                .send({
                temporaryToken,
                challenge,
                state: 'test-state',
            })
                .expect(200);
            expect(callbackResponse.body.success).toBe(true);
            expect(callbackResponse.body.data.accessToken).toBeDefined();
            expect(callbackResponse.body.data.user).toBeDefined();
        });
        it('should handle token validation via API endpoint', async () => {
            const initResult = await unifiedSsoService.initiateLogin({
                productKey: testProduct.productKey,
                email: testUser.email,
                externalUserId: testProductUser.externalUserId,
                autoCreateUser: false,
            }, { ip: '127.0.0.1', userAgent: 'test' });
            const callbackResult = await unifiedSsoService.completeCallback({
                temporaryToken: initResult.data.temporaryToken,
                challenge: initResult.data.challenge,
            }, { ip: '127.0.0.1', userAgent: 'test' });
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .post('/api/sso/validate')
                .send({
                token: callbackResult.data.accessToken,
                expectedProduct: testProduct.productKey,
            })
                .expect(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.valid).toBe(true);
            expect(response.body.data.userContext).toBeDefined();
        });
        it('should handle seamless login page', async () => {
            const tokenPayload = await jwtService.createSsoAccessToken({
                productKey: testProduct.productKey,
                userId: testUser.id,
                organizationId: testOrganization.id,
                externalUserId: testProductUser.externalUserId,
                email: testUser.email,
                name: testUser.name,
                sessionId: 'test-session',
                scopes: [sso_1.TrustDomainScope.SSO_LOGIN],
                metadata: {},
                clientIP: '127.0.0.1',
                userAgent: 'test',
            }, { customExpiry: 300 });
            const response = await (0, supertest_1.default)(app.getHttpServer())
                .get(`/seamless-login?token=${tokenPayload.accessToken}&challenge=test-challenge`)
                .expect(200);
            expect(response.text).toContain('postiz');
        });
    });
    describe('Media Reference Integration', () => {
        it('should create and access media references through SSO', async () => {
            var _a;
            const mediaRef = await mediaReferenceService.createMediaReference({
                productUser: testProductUser,
                product: testProduct,
                externalMediaId: 'integration-test-media',
                gcsPath: '/integration-test/test-file.jpg',
                metadata: { source: 'integration-test' },
                processingOptions: {
                    generateThumbnail: true,
                    extractMetadata: true,
                },
            });
            expect(mediaRef).toBeDefined();
            expect(mediaRef.externalMediaId).toBe('integration-test-media');
            const accessResult = await mediaReferenceService.getMediaReferencesWithAccess(testProductUser, testProduct, 1, 10);
            expect(accessResult.references).toHaveLength(1);
            expect(accessResult.references[0].id).toBe(mediaRef.id);
            expect(accessResult.references[0].accessUrl).toContain('/api/media/proxy/');
            const batchAccessResult = await mediaReferenceService.handleMediaAccessRequest({
                mediaIds: [mediaRef.id],
                accessLevel: 'read',
                expiresIn: 3600,
                includeThumbnails: true,
            }, testProductUser, testProduct);
            expect(batchAccessResult.success).toBe(true);
            expect(batchAccessResult.accessToken).toBeDefined();
            expect(batchAccessResult.media).toHaveLength(1);
            expect((_a = batchAccessResult.bucketAccess) === null || _a === void 0 ? void 0 : _a.bucketName).toBe(testProduct.gcsBucketName);
        });
        it('should handle media references in seamless login preloading', async () => {
            var _a, _b;
            const mediaRef1 = await test_environment_1.testEnv.createTestMediaReference({
                productUserId: testProductUser.id,
                productId: testProduct.id,
                organizationId: testOrganization.id,
                externalMediaId: 'preload-media-1',
            });
            const mediaRef2 = await test_environment_1.testEnv.createTestMediaReference({
                productUserId: testProductUser.id,
                productId: testProduct.id,
                organizationId: testOrganization.id,
                externalMediaId: 'preload-media-2',
            });
            const tokenPayload = await jwtService.createSsoAccessToken({
                productKey: testProduct.productKey,
                userId: testUser.id,
                organizationId: testOrganization.id,
                externalUserId: testProductUser.externalUserId,
                email: testUser.email,
                name: testUser.name,
                sessionId: 'media-preload-session',
                scopes: [sso_1.TrustDomainScope.SSO_LOGIN, sso_1.TrustDomainScope.MEDIA_ACCESS],
                metadata: {
                    mediaReferences: [mediaRef1.id, mediaRef2.id],
                },
                clientIP: '127.0.0.1',
                userAgent: 'test',
            }, { customExpiry: 300 });
            const seamlessResult = await seamlessAuthService.processSeamlessLogin(tokenPayload.accessToken, 'media-challenge', 'media-state', {
                ip: '127.0.0.1',
                userAgent: 'test',
                fingerprint: 'media-fingerprint',
            });
            expect(seamlessResult.success).toBe(true);
            expect((_b = (_a = seamlessResult.data) === null || _a === void 0 ? void 0 : _a.preloadedContent) === null || _b === void 0 ? void 0 : _b.mediaFiles).toHaveLength(2);
            const preloadedMedia = seamlessResult.data.preloadedContent.mediaFiles;
            expect(preloadedMedia.map(m => m.id)).toContain(mediaRef1.id);
            expect(preloadedMedia.map(m => m.id)).toContain(mediaRef2.id);
        });
    });
    describe('Event System Integration', () => {
        it('should emit events throughout SSO flow', async () => {
            const eventSpy = jest.spyOn(eventEmitter, 'emitAsync');
            eventSpy.mockResolvedValue([]);
            const clientContext = { ip: '127.0.0.1', userAgent: 'test' };
            const initResult = await unifiedSsoService.initiateLogin({
                productKey: testProduct.productKey,
                email: testUser.email,
                externalUserId: testProductUser.externalUserId,
                autoCreateUser: false,
            }, clientContext);
            expect(eventSpy).toHaveBeenCalledWith('sso.login.initiated', expect.any(Object));
            const callbackResult = await unifiedSsoService.completeCallback({
                temporaryToken: initResult.data.temporaryToken,
                challenge: initResult.data.challenge,
            }, clientContext);
            expect(eventSpy).toHaveBeenCalledWith('sso.login.completed', expect.any(Object));
            const tokenPayload = await jwtService.createSsoAccessToken({
                productKey: testProduct.productKey,
                userId: testUser.id,
                organizationId: testOrganization.id,
                externalUserId: testProductUser.externalUserId,
                email: testUser.email,
                name: testUser.name,
                sessionId: 'event-session',
                scopes: [sso_1.TrustDomainScope.SSO_LOGIN],
                metadata: {},
                clientIP: clientContext.ip,
                userAgent: clientContext.userAgent,
            });
            await seamlessAuthService.processSeamlessLogin(tokenPayload.accessToken, 'event-challenge', 'event-state', {
                ip: clientContext.ip,
                userAgent: clientContext.userAgent,
                fingerprint: 'event-fingerprint',
            });
            expect(eventSpy).toHaveBeenCalledWith('seamless.login.completed', expect.any(Object));
        });
        it('should handle event listeners for session management', async () => {
            const sessionRevokeSpy = jest.spyOn(unifiedSsoService, 'revokeSession');
            sessionRevokeSpy.mockResolvedValue(true);
            await eventEmitter.emitAsync('user.updated', {
                userId: testUser.id,
                changes: ['email'],
            });
            await eventEmitter.emitAsync('organization.updated', {
                organizationId: testOrganization.id,
                changes: ['name'],
            });
            await eventEmitter.emitAsync('product.deactivated', {
                productKey: testProduct.productKey,
            });
        });
    });
    describe('Error Handling and Edge Cases', () => {
        it('should handle non-existent product gracefully', async () => {
            var _a;
            const result = await unifiedSsoService.initiateLogin({
                productKey: 'non-existent-product',
                email: testUser.email,
                externalUserId: 'test-external',
                autoCreateUser: false,
            }, { ip: '127.0.0.1', userAgent: 'test' });
            expect(result.success).toBe(false);
            expect((_a = result.error) === null || _a === void 0 ? void 0 : _a.code).toBeDefined();
        });
        it('should handle expired tokens gracefully', async () => {
            var _a;
            const expiredToken = await jwtService.createSsoAccessToken({
                productKey: testProduct.productKey,
                userId: testUser.id,
                organizationId: testOrganization.id,
                externalUserId: testProductUser.externalUserId,
                email: testUser.email,
                name: testUser.name,
                sessionId: 'expired-session',
                scopes: [sso_1.TrustDomainScope.SSO_LOGIN],
                metadata: {},
                clientIP: '127.0.0.1',
                userAgent: 'test',
            }, { customExpiry: -1 });
            const result = await seamlessAuthService.processSeamlessLogin(expiredToken.accessToken, 'expired-challenge', 'expired-state', { ip: '127.0.0.1', userAgent: 'test' });
            expect(result.success).toBe(false);
            expect((_a = result.error) === null || _a === void 0 ? void 0 : _a.message).toContain('expired');
        });
        it('should handle concurrent requests safely', async () => {
            const concurrentRequests = Array(10).fill(null).map(() => unifiedSsoService.initiateLogin({
                productKey: testProduct.productKey,
                email: testUser.email,
                externalUserId: testProductUser.externalUserId,
                autoCreateUser: false,
            }, { ip: '127.0.0.1', userAgent: 'test' }));
            const results = await Promise.all(concurrentRequests);
            results.forEach(result => {
                expect(result.success).toBe(true);
            });
            const challenges = results.map(r => { var _a; return (_a = r.data) === null || _a === void 0 ? void 0 : _a.challenge; });
            const uniqueChallenges = new Set(challenges);
            expect(uniqueChallenges.size).toBe(10);
        });
        it('should maintain data isolation between organizations', async () => {
            const otherOrg = await test_environment_1.testEnv.createTestOrganization({
                name: 'Other Organization',
            });
            const otherUser = await test_environment_1.testEnv.createTestUser({
                email: 'other-user@example.com',
                name: 'Other User',
            });
            const otherProductUser = await test_environment_1.testEnv.createTestProductUser({
                userId: otherUser.id,
                organizationId: otherOrg.id,
                productId: testProduct.id,
                externalUserId: 'other-external-user',
            });
            const userMedia = await test_environment_1.testEnv.createTestMediaReference({
                productUserId: testProductUser.id,
                organizationId: testOrganization.id,
                externalMediaId: 'user-media',
            });
            const otherUserMedia = await test_environment_1.testEnv.createTestMediaReference({
                productUserId: otherProductUser.id,
                organizationId: otherOrg.id,
                externalMediaId: 'other-user-media',
            });
            const userAccess = await mediaReferenceService.getMediaReferencesWithAccess(testProductUser, testProduct);
            expect(userAccess.references).toHaveLength(1);
            expect(userAccess.references[0].id).toBe(userMedia.id);
            expect(userAccess.references[0].id).not.toBe(otherUserMedia.id);
        });
    });
    describe('Performance Integration Tests', () => {
        it('should complete full SSO flow within performance targets', async () => {
            const { duration } = await test_environment_1.testEnv.measurePerformance('complete-sso-flow', async () => {
                const initResult = await unifiedSsoService.initiateLogin({
                    productKey: testProduct.productKey,
                    email: testUser.email,
                    externalUserId: testProductUser.externalUserId,
                    autoCreateUser: false,
                }, { ip: '127.0.0.1', userAgent: 'test' });
                await unifiedSsoService.completeCallback({
                    temporaryToken: initResult.data.temporaryToken,
                    challenge: initResult.data.challenge,
                }, { ip: '127.0.0.1', userAgent: 'test' });
            }, 3000);
            expect(duration).toBeLessThan(3000);
        });
        it('should handle media preloading efficiently', async () => {
            const mediaReferences = await Promise.all(Array(20).fill(null).map((_, index) => test_environment_1.testEnv.createTestMediaReference({
                productUserId: testProductUser.id,
                organizationId: testOrganization.id,
                externalMediaId: `perf-media-${index}`,
            })));
            const { duration } = await test_environment_1.testEnv.measurePerformance('media-preloading', () => seamlessAuthService.preloadPublishingContext(testUser.id, testProduct.productKey, { mediaIds: mediaReferences.map(m => m.id) }), 1000);
            expect(duration).toBeLessThan(1000);
        });
        it('should handle concurrent user sessions efficiently', async () => {
            const { duration } = await test_environment_1.testEnv.measurePerformance('concurrent-sessions', async () => {
                const concurrentLogins = Array(5).fill(null).map(() => unifiedSsoService.initiateLogin({
                    productKey: testProduct.productKey,
                    email: testUser.email,
                    externalUserId: testProductUser.externalUserId,
                    autoCreateUser: false,
                }, { ip: '127.0.0.1', userAgent: 'test' }));
                await Promise.all(concurrentLogins);
            }, 2000);
            expect(duration).toBeLessThan(2000);
        });
    });
});
//# sourceMappingURL=sso-flow.integration.spec.js.map