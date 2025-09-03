"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicIntegrationsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const integration_service_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.service");
const permissions_ability_1 = require("@gitroom/backend/services/auth/permissions/permissions.ability");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
const platform_express_1 = require("@nestjs/platform-express");
const upload_factory_1 = require("@gitroom/nestjs-libraries/upload/upload.factory");
const media_service_1 = require("@gitroom/nestjs-libraries/database/prisma/media/media.service");
const get_posts_dto_1 = require("@gitroom/nestjs-libraries/dtos/posts/get.posts.dto");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
const video_dto_1 = require("@gitroom/nestjs-libraries/dtos/videos/video.dto");
const video_function_dto_1 = require("@gitroom/nestjs-libraries/dtos/videos/video.function.dto");
let PublicIntegrationsController = class PublicIntegrationsController {
    constructor(_integrationService, _postsService, _mediaService) {
        this._integrationService = _integrationService;
        this._postsService = _postsService;
        this._mediaService = _mediaService;
        this.storage = upload_factory_1.UploadFactory.createStorage();
    }
    async uploadSimple(org, file) {
        if (!file) {
            throw new common_1.HttpException({ msg: 'No file provided' }, 400);
        }
        const getFile = await this.storage.uploadFile(file);
        return this._mediaService.saveFile(org.id, getFile.originalname, getFile.path);
    }
    async getPosts(org, query) {
        const posts = await this._postsService.getPosts(org.id, query);
        return {
            posts,
        };
    }
    async createPost(org, rawBody) {
        const body = await this._postsService.mapTypeToPost(rawBody, org.id, rawBody.type === 'draft');
        body.type = rawBody.type;
        console.log(JSON.stringify(body, null, 2));
        return this._postsService.createPost(org.id, body);
    }
    async deletePost(org, body) {
        const getPostById = await this._postsService.getPost(org.id, body.id);
        return this._postsService.deletePost(org.id, getPostById.group);
    }
    async getActiveIntegrations(org) {
        return { connected: true };
    }
    async listIntegration(org) {
        return (await this._integrationService.getIntegrationsList(org.id)).map((org) => ({
            id: org.id,
            name: org.name,
            identifier: org.providerIdentifier,
            picture: org.picture,
            disabled: org.disabled,
            profile: org.profile,
            customer: org.customer
                ? {
                    id: org.customer.id,
                    name: org.customer.name,
                }
                : undefined,
        }));
    }
    generateVideo(org, body) {
        return this._mediaService.generateVideo(org, body);
    }
    videoFunction(body) {
        return this._mediaService.videoFunction(body.identifier, body.functionName, body.params);
    }
};
exports.PublicIntegrationsController = PublicIntegrationsController;
tslib_1.__decorate([
    (0, common_1.Post)('/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.UploadedFile)('file')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicIntegrationsController.prototype, "uploadSimple", null);
tslib_1.__decorate([
    (0, common_1.Get)('/posts'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, get_posts_dto_1.GetPostsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicIntegrationsController.prototype, "getPosts", null);
tslib_1.__decorate([
    (0, common_1.Post)('/posts'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.POSTS_PER_MONTH]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicIntegrationsController.prototype, "createPost", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/posts/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicIntegrationsController.prototype, "deletePost", null);
tslib_1.__decorate([
    (0, common_1.Get)('/is-connected'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicIntegrationsController.prototype, "getActiveIntegrations", null);
tslib_1.__decorate([
    (0, common_1.Get)('/integrations'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicIntegrationsController.prototype, "listIntegration", null);
tslib_1.__decorate([
    (0, common_1.Post)('/generate-video'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, video_dto_1.VideoDto]),
    tslib_1.__metadata("design:returntype", void 0)
], PublicIntegrationsController.prototype, "generateVideo", null);
tslib_1.__decorate([
    (0, common_1.Post)('/video/function'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [video_function_dto_1.VideoFunctionDto]),
    tslib_1.__metadata("design:returntype", void 0)
], PublicIntegrationsController.prototype, "videoFunction", null);
exports.PublicIntegrationsController = PublicIntegrationsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Public API'),
    (0, common_1.Controller)('/public/v1'),
    tslib_1.__metadata("design:paramtypes", [integration_service_1.IntegrationService,
        posts_service_1.PostsService,
        media_service_1.MediaService])
], PublicIntegrationsController);
//# sourceMappingURL=public.integrations.controller.js.map