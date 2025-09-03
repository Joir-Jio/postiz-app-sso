"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const media_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/media/media.repository");
const openai_service_1 = require("@gitroom/nestjs-libraries/openai/openai.service");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
const video_manager_1 = require("@gitroom/nestjs-libraries/videos/video.manager");
const upload_factory_1 = require("@gitroom/nestjs-libraries/upload/upload.factory");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
let MediaService = class MediaService {
    constructor(_mediaRepository, _openAi, _subscriptionService, _videoManager) {
        this._mediaRepository = _mediaRepository;
        this._openAi = _openAi;
        this._subscriptionService = _subscriptionService;
        this._videoManager = _videoManager;
        this.storage = upload_factory_1.UploadFactory.createStorage();
    }
    async deleteMedia(org, id) {
        return this._mediaRepository.deleteMedia(org, id);
    }
    getMediaById(id) {
        return this._mediaRepository.getMediaById(id);
    }
    async generateImage(prompt, org, generatePromptFirst) {
        return await this._subscriptionService.useCredit(org, 'ai_images', async () => {
            if (generatePromptFirst) {
                prompt = await this._openAi.generatePromptForPicture(prompt);
                console.log('Prompt:', prompt);
            }
            return this._openAi.generateImage(prompt, !!generatePromptFirst);
        });
    }
    saveFile(org, fileName, filePath) {
        return this._mediaRepository.saveFile(org, fileName, filePath);
    }
    getMedia(org, page) {
        return this._mediaRepository.getMedia(org, page);
    }
    saveMediaInformation(org, data) {
        return this._mediaRepository.saveMediaInformation(org, data);
    }
    getVideoOptions() {
        return this._videoManager.getAllVideos();
    }
    async generateVideoAllowed(org, type) {
        const video = this._videoManager.getVideoByName(type);
        if (!video) {
            throw new Error(`Video type ${type} not found`);
        }
        if (!video.trial && org.isTrailing) {
            throw new common_1.HttpException('This video is not available in trial mode', 406);
        }
        return true;
    }
    async generateVideo(org, body) {
        const totalCredits = await this._subscriptionService.checkCredits(org, 'ai_videos');
        if (totalCredits.credits <= 0) {
            throw new permission_exception_class_1.SubscriptionException({
                action: permission_exception_class_1.AuthorizationActions.Create,
                section: permission_exception_class_1.Sections.VIDEOS_PER_MONTH,
            });
        }
        const video = this._videoManager.getVideoByName(body.type);
        if (!video) {
            throw new Error(`Video type ${body.type} not found`);
        }
        if (!video.trial && org.isTrailing) {
            throw new common_1.HttpException('This video is not available in trial mode', 406);
        }
        await video.instance.processAndValidate(body.customParams);
        return await this._subscriptionService.useCredit(org, 'ai_videos', async () => {
            const loadedData = await video.instance.process(body.output, body.customParams);
            const file = await this.storage.uploadSimple(loadedData);
            return this.saveFile(org.id, file.split('/').pop(), file);
        });
    }
    async videoFunction(identifier, functionName, body) {
        const video = this._videoManager.getVideoByName(identifier);
        if (!video) {
            throw new Error(`Video with identifier ${identifier} not found`);
        }
        const functionToCall = video.instance[functionName];
        if (typeof functionToCall !== 'function' || this._videoManager.checkAvailableVideoFunction(functionToCall)) {
            throw new common_1.HttpException(`Function ${functionName} not found on video instance`, 400);
        }
        return functionToCall(body);
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [media_repository_1.MediaRepository,
        openai_service_1.OpenaiService,
        subscription_service_1.SubscriptionService,
        video_manager_1.VideoManager])
], MediaService);
//# sourceMappingURL=media.service.js.map