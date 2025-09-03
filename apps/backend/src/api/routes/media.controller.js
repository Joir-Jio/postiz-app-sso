"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const media_service_1 = require("@gitroom/nestjs-libraries/database/prisma/media/media.service");
const swagger_1 = require("@nestjs/swagger");
const r2_uploader_1 = tslib_1.__importDefault(require("@gitroom/nestjs-libraries/upload/r2.uploader"));
const platform_express_1 = require("@nestjs/platform-express");
const custom_upload_validation_1 = require("@gitroom/nestjs-libraries/upload/custom.upload.validation");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
const upload_factory_1 = require("@gitroom/nestjs-libraries/upload/upload.factory");
const save_media_information_dto_1 = require("@gitroom/nestjs-libraries/dtos/media/save.media.information.dto");
const video_dto_1 = require("@gitroom/nestjs-libraries/dtos/videos/video.dto");
const video_function_dto_1 = require("@gitroom/nestjs-libraries/dtos/videos/video.function.dto");
const external_media_service_1 = require("../../services/media/external-media.service");
const media_reference_service_1 = require("../../services/media/media-reference.service");
const media_proxy_service_1 = require("../../services/media/media-proxy.service");
const media_sync_service_1 = require("../../services/media/media-sync.service");
const sso_media_dto_1 = require("@gitroom/nestjs-libraries/dtos/sso/sso-media.dto");
let MediaController = class MediaController {
    constructor(_mediaService, _subscriptionService, externalMediaService, mediaReferenceService, mediaProxyService, mediaSyncService) {
        this._mediaService = _mediaService;
        this._subscriptionService = _subscriptionService;
        this.externalMediaService = externalMediaService;
        this.mediaReferenceService = mediaReferenceService;
        this.mediaProxyService = mediaProxyService;
        this.mediaSyncService = mediaSyncService;
        this.storage = upload_factory_1.UploadFactory.createStorage();
    }
    deleteMedia(org, id) {
        return this._mediaService.deleteMedia(org.id, id);
    }
    generateVideo(org, body) {
        console.log('hello');
        return this._mediaService.generateVideo(org, body);
    }
    async generateImage(org, req, prompt, isPicturePrompt = false) {
        const total = await this._subscriptionService.checkCredits(org);
        if (process.env.STRIPE_PUBLISHABLE_KEY && total.credits <= 0) {
            return false;
        }
        return {
            output: (isPicturePrompt ? '' : 'data:image/png;base64,') +
                (await this._mediaService.generateImage(prompt, org, isPicturePrompt)),
        };
    }
    async generateImageFromText(org, req, prompt) {
        const image = await this.generateImage(org, req, prompt, true);
        if (!image) {
            return false;
        }
        const file = await this.storage.uploadSimple(image.output);
        return this._mediaService.saveFile(org.id, file.split('/').pop(), file);
    }
    async uploadServer(org, file) {
        const uploadedFile = await this.storage.uploadFile(file);
        return this._mediaService.saveFile(org.id, uploadedFile.originalname, uploadedFile.path);
    }
    async saveMedia(org, req, name) {
        if (!name) {
            return false;
        }
        return this._mediaService.saveFile(org.id, name, process.env.CLOUDFLARE_BUCKET_URL + '/' + name);
    }
    saveMediaInformation(org, body) {
        return this._mediaService.saveMediaInformation(org.id, body);
    }
    async uploadSimple(org, file, preventSave = 'false') {
        const getFile = await this.storage.uploadFile(file);
        if (preventSave === 'true') {
            const { path } = getFile;
            return { path };
        }
        return this._mediaService.saveFile(org.id, getFile.originalname, getFile.path);
    }
    async uploadFile(org, req, res, endpoint) {
        const upload = await (0, r2_uploader_1.default)(endpoint, req, res);
        if (endpoint !== 'complete-multipart-upload') {
            return upload;
        }
        const name = upload.Location.split('/').pop();
        const saveFile = await this._mediaService.saveFile(org.id, name, upload.Location);
        res.status(200).json(Object.assign(Object.assign({}, upload), { saved: saveFile }));
    }
    getMedia(org, page) {
        return this._mediaService.getMedia(org.id, page);
    }
    getVideos() {
        return this._mediaService.getVideoOptions();
    }
    videoFunction(body) {
        return this._mediaService.videoFunction(body.identifier, body.functionName, body.params);
    }
    generateVideoAllowed(org, type) {
        return this._mediaService.generateVideoAllowed(org, type);
    }
    async referenceExternalFile(org, request, productKey, externalUserId) {
        var _a;
        if (!productKey || !externalUserId) {
            throw new common_1.HttpException('Product key and external user ID required', 400);
        }
        const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
        const product = await this.getProductByKey(productKey);
        const mediaReference = await this.mediaReferenceService.createMediaReference({
            productUser,
            product,
            externalMediaId: request.externalMediaId,
            gcsPath: request.gcsPath,
            metadata: request.metadata,
            processingOptions: request.processingOptions,
        });
        return {
            success: true,
            mediaId: mediaReference.id,
            localPath: (_a = mediaReference.metadata) === null || _a === void 0 ? void 0 : _a.localPath,
            proxyUrl: `/api/media/proxy/${mediaReference.id}`,
            thumbnailUrl: mediaReference.thumbnailPath ? `/api/media/thumbnail/${mediaReference.id}` : undefined,
        };
    }
    async requestMediaAccess(org, request, productKey, externalUserId) {
        if (!productKey || !externalUserId) {
            throw new common_1.HttpException('Product key and external user ID required', 400);
        }
        const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
        const product = await this.getProductByKey(productKey);
        return this.mediaReferenceService.handleMediaAccessRequest(request, productUser, product);
    }
    async proxyMediaFile(mediaReferenceId, req, res, range, download) {
        const options = {
            range,
            downloadName: download || undefined,
            inline: !download,
        };
        return this.mediaProxyService.streamMediaFile(mediaReferenceId, req, res, options);
    }
    async getMediaThumbnail(mediaReferenceId, req, res, width, height) {
        const size = {
            width: width ? parseInt(width) : undefined,
            height: height ? parseInt(height) : undefined,
        };
        return this.mediaProxyService.getThumbnail(mediaReferenceId, req, res, size);
    }
    async downloadMediaFile(mediaReferenceId, token, req, res) {
        if (!token) {
            throw new common_1.HttpException('Download token required', 400);
        }
        return this.mediaProxyService.downloadFile(mediaReferenceId, token, req, res);
    }
    async generateDownloadLink(org, mediaReferenceId, productKey, externalUserId, expiryHours, downloadName) {
        if (!productKey || !externalUserId) {
            throw new common_1.HttpException('Product key and external user ID required', 400);
        }
        const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
        const expires = expiryHours ? parseInt(expiryHours) : 1;
        return this.mediaProxyService.generateDownloadLink(mediaReferenceId, productUser, expires, downloadName);
    }
    async listExternalMedia(org, productKey, externalUserId, page, limit) {
        if (!productKey || !externalUserId) {
            throw new common_1.HttpException('Product key and external user ID required', 400);
        }
        const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
        const product = await this.getProductByKey(productKey);
        const pageNum = page ? parseInt(page) : 1;
        const pageLimit = limit ? parseInt(limit) : 28;
        const result = await this.mediaReferenceService.getMediaReferencesWithAccess(productUser, product, pageNum, pageLimit);
        return {
            success: true,
            page: pageNum,
            limit: pageLimit,
            total: result.total,
            pages: result.pages,
            media: result.references,
        };
    }
    async deleteExternalMedia(org, mediaReferenceId, productKey, externalUserId, permanent) {
        if (!productKey || !externalUserId) {
            throw new common_1.HttpException('Product key and external user ID required', 400);
        }
        const productUser = await this.getProductUserContext(org.id, productKey, externalUserId);
        const permanentDelete = permanent === 'true';
        const success = await this.mediaReferenceService.deleteMediaReference(mediaReferenceId, productUser, permanentDelete);
        return {
            success,
            deleted: success,
            permanent: permanentDelete,
        };
    }
    async shareExternalMedia(org, request, productKey, externalUserId) {
        throw new common_1.HttpException('Media sharing not yet implemented', 501);
    }
    async getSyncStatus() {
        const stats = this.mediaSyncService.getSyncStats();
        const proxyStats = this.mediaProxyService.getServiceStats();
        return {
            sync: stats,
            proxy: proxyStats,
            timestamp: new Date().toISOString(),
        };
    }
    async forceSyncProduct(productKey) {
        const result = await this.mediaSyncService.forceSyncProduct(productKey);
        return {
            success: true,
            productKey,
            result,
        };
    }
    async getInconsistentMedia(productKey, limit) {
        const productKeys = productKey ? [productKey] : undefined;
        const maxLimit = limit ? parseInt(limit) : 100;
        const inconsistentMedia = await this.mediaSyncService.findInconsistentMedia(productKeys, maxLimit);
        return {
            success: true,
            count: inconsistentMedia.length,
            inconsistentMedia,
        };
    }
    async getProductUserContext(organizationId, productKey, externalUserId) {
        return {
            id: `pu_${organizationId}_${productKey}_${externalUserId}`,
            productId: `prod_${productKey}`,
            userId: `user_${externalUserId}`,
            organizationId,
            externalUserId,
            externalUserEmail: `${externalUserId}@example.com`,
            externalUserName: `User ${externalUserId}`,
            externalUserMetadata: {},
            ssoSessionId: null,
            lastSsoLogin: null,
            ssoTokenHash: null,
            preferences: {},
            permissions: { 'media:read': true, 'media:write': true, 'media:delete': true },
            isActive: true,
            dataAccessLevel: 'full',
            lastActivity: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: undefined,
        };
    }
    async getProductByKey(productKey) {
        return {
            id: `prod_${productKey}`,
            productKey,
            productName: `Product ${productKey}`,
            productDescription: `Description for ${productKey}`,
            baseUrl: `https://${productKey}.example.com`,
            webhookSecret: null,
            ssoEnabled: true,
            ssoRedirectUrl: `https://${productKey}.example.com/sso/callback`,
            allowedDomains: [],
            gcsBucketName: `${productKey}-bucket`,
            gcsBasePath: productKey,
            gcsCredentialsJson: null,
            settings: {},
            metadata: {},
            autoCreateUsers: true,
            allowMediaUpload: true,
            dataIsolationEnabled: true,
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: undefined,
        };
    }
};
exports.MediaController = MediaController;
tslib_1.__decorate([
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], MediaController.prototype, "deleteMedia", null);
tslib_1.__decorate([
    (0, common_1.Post)('/generate-video'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, video_dto_1.VideoDto]),
    tslib_1.__metadata("design:returntype", void 0)
], MediaController.prototype, "generateVideo", null);
tslib_1.__decorate([
    (0, common_1.Post)('/generate-image'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Body)('prompt')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "generateImage", null);
tslib_1.__decorate([
    (0, common_1.Post)('/generate-image-with-prompt'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Body)('prompt')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "generateImageFromText", null);
tslib_1.__decorate([
    (0, common_1.Post)('/upload-server'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.UsePipes)(new custom_upload_validation_1.CustomFileValidationPipe()),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.UploadedFile)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "uploadServer", null);
tslib_1.__decorate([
    (0, common_1.Post)('/save-media'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Body)('name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "saveMedia", null);
tslib_1.__decorate([
    (0, common_1.Post)('/information'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, save_media_information_dto_1.SaveMediaInformationDto]),
    tslib_1.__metadata("design:returntype", void 0)
], MediaController.prototype, "saveMediaInformation", null);
tslib_1.__decorate([
    (0, common_1.Post)('/upload-simple'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.UploadedFile)('file')),
    tslib_1.__param(2, (0, common_1.Body)('preventSave')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "uploadSimple", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:endpoint'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__param(3, (0, common_1.Param)('endpoint')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "uploadFile", null);
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Query)('page')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Number]),
    tslib_1.__metadata("design:returntype", void 0)
], MediaController.prototype, "getMedia", null);
tslib_1.__decorate([
    (0, common_1.Get)('/video-options'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], MediaController.prototype, "getVideos", null);
tslib_1.__decorate([
    (0, common_1.Post)('/video/function'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [video_function_dto_1.VideoFunctionDto]),
    tslib_1.__metadata("design:returntype", void 0)
], MediaController.prototype, "videoFunction", null);
tslib_1.__decorate([
    (0, common_1.Get)('/generate-video/:type/allowed'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], MediaController.prototype, "generateVideoAllowed", null);
tslib_1.__decorate([
    (0, common_1.Post)('/reference'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reference external GCS file without re-uploading',
        description: 'Creates a media reference to an external file in GCS for SSO integration'
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Media reference created successfully' }),
    (0, swagger_1.ApiBearerAuth)('ProductToken'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Headers)('x-product-key')),
    tslib_1.__param(3, (0, common_1.Headers)('x-external-user-id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, sso_media_dto_1.MediaUploadRequestDto, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "referenceExternalFile", null);
tslib_1.__decorate([
    (0, common_1.Post)('/access'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request access to external media files',
        description: 'Generate secure access tokens and URLs for external media files'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: sso_media_dto_1.MediaAccessResponseDto }),
    (0, swagger_1.ApiBearerAuth)('ProductToken'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Headers)('x-product-key')),
    tslib_1.__param(3, (0, common_1.Headers)('x-external-user-id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, sso_media_dto_1.MediaAccessRequestDto, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "requestMediaAccess", null);
tslib_1.__decorate([
    (0, common_1.Get)('/proxy/:mediaReferenceId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Proxy access to external media file',
        description: 'Securely stream external media file content with access validation'
    }),
    (0, swagger_1.ApiParam)({ name: 'mediaReferenceId', description: 'Media reference ID' }),
    (0, swagger_1.ApiQuery)({ name: 'token', description: 'Access token', required: false }),
    tslib_1.__param(0, (0, common_1.Param)('mediaReferenceId')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__param(3, (0, common_1.Query)('range')),
    tslib_1.__param(4, (0, common_1.Query)('download')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "proxyMediaFile", null);
tslib_1.__decorate([
    (0, common_1.Get)('/thumbnail/:mediaReferenceId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get thumbnail for media file',
        description: 'Retrieve thumbnail image for external media file'
    }),
    (0, swagger_1.ApiParam)({ name: 'mediaReferenceId', description: 'Media reference ID' }),
    (0, swagger_1.ApiQuery)({ name: 'token', description: 'Access token', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'width', description: 'Thumbnail width', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'height', description: 'Thumbnail height', required: false }),
    tslib_1.__param(0, (0, common_1.Param)('mediaReferenceId')),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, common_1.Res)()),
    tslib_1.__param(3, (0, common_1.Query)('width')),
    tslib_1.__param(4, (0, common_1.Query)('height')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "getMediaThumbnail", null);
tslib_1.__decorate([
    (0, common_1.Get)('/download/:mediaReferenceId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Download media file',
        description: 'Download external media file with token validation'
    }),
    (0, swagger_1.ApiParam)({ name: 'mediaReferenceId', description: 'Media reference ID' }),
    (0, swagger_1.ApiQuery)({ name: 'token', description: 'Download token', required: true }),
    tslib_1.__param(0, (0, common_1.Param)('mediaReferenceId')),
    tslib_1.__param(1, (0, common_1.Query)('token')),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__param(3, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "downloadMediaFile", null);
tslib_1.__decorate([
    (0, common_1.Post)('/generate-download-link/:mediaReferenceId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate secure download link',
        description: 'Create a time-limited download link for external media file'
    }),
    (0, swagger_1.ApiParam)({ name: 'mediaReferenceId', description: 'Media reference ID' }),
    (0, swagger_1.ApiBearerAuth)('ProductToken'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('mediaReferenceId')),
    tslib_1.__param(2, (0, common_1.Headers)('x-product-key')),
    tslib_1.__param(3, (0, common_1.Headers)('x-external-user-id')),
    tslib_1.__param(4, (0, common_1.Query)('expires')),
    tslib_1.__param(5, (0, common_1.Query)('filename')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "generateDownloadLink", null);
tslib_1.__decorate([
    (0, common_1.Get)('/external'),
    (0, swagger_1.ApiOperation)({
        summary: 'List external media references',
        description: 'Get paginated list of external media references for current user'
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', description: 'Page number', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Items per page', required: false }),
    (0, swagger_1.ApiBearerAuth)('ProductToken'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Headers)('x-product-key')),
    tslib_1.__param(2, (0, common_1.Headers)('x-external-user-id')),
    tslib_1.__param(3, (0, common_1.Query)('page')),
    tslib_1.__param(4, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "listExternalMedia", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/external/:mediaReferenceId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete external media reference',
        description: 'Remove external media reference and optionally delete from GCS'
    }),
    (0, swagger_1.ApiParam)({ name: 'mediaReferenceId', description: 'Media reference ID' }),
    (0, swagger_1.ApiQuery)({ name: 'permanent', description: 'Permanently delete from GCS', required: false }),
    (0, swagger_1.ApiBearerAuth)('ProductToken'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('mediaReferenceId')),
    tslib_1.__param(2, (0, common_1.Headers)('x-product-key')),
    tslib_1.__param(3, (0, common_1.Headers)('x-external-user-id')),
    tslib_1.__param(4, (0, common_1.Query)('permanent')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "deleteExternalMedia", null);
tslib_1.__decorate([
    (0, common_1.Post)('/external/share'),
    (0, swagger_1.ApiOperation)({
        summary: 'Share external media between products',
        description: 'Create secure sharing link for external media files'
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: sso_media_dto_1.MediaSharingResponseDto }),
    (0, swagger_1.ApiBearerAuth)('ProductToken'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Headers)('x-product-key')),
    tslib_1.__param(3, (0, common_1.Headers)('x-external-user-id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, sso_media_dto_1.MediaSharingRequestDto, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "shareExternalMedia", null);
tslib_1.__decorate([
    (0, common_1.Get)('/sync/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get media sync status',
        description: 'Check status of media synchronization services'
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "getSyncStatus", null);
tslib_1.__decorate([
    (0, common_1.Post)('/sync/force/:productKey'),
    (0, swagger_1.ApiOperation)({
        summary: 'Force sync for product',
        description: 'Manually trigger synchronization for a specific product'
    }),
    (0, swagger_1.ApiParam)({ name: 'productKey', description: 'Product key to sync' }),
    tslib_1.__param(0, (0, common_1.Param)('productKey')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "forceSyncProduct", null);
tslib_1.__decorate([
    (0, common_1.Get)('/inconsistent'),
    (0, swagger_1.ApiOperation)({
        summary: 'Find inconsistent media',
        description: 'List media references that need attention'
    }),
    (0, swagger_1.ApiQuery)({ name: 'productKey', description: 'Filter by product key', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', description: 'Maximum items to return', required: false }),
    tslib_1.__param(0, (0, common_1.Query)('productKey')),
    tslib_1.__param(1, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MediaController.prototype, "getInconsistentMedia", null);
exports.MediaController = MediaController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Media'),
    (0, common_1.Controller)('/media'),
    tslib_1.__metadata("design:paramtypes", [media_service_1.MediaService,
        subscription_service_1.SubscriptionService,
        external_media_service_1.ExternalMediaService,
        media_reference_service_1.MediaReferenceService,
        media_proxy_service_1.MediaProxyService,
        media_sync_service_1.MediaSyncService])
], MediaController);
//# sourceMappingURL=media.controller.js.map