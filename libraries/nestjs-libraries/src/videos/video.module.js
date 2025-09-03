"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const images_slides_1 = require("@gitroom/nestjs-libraries/videos/images-slides/images.slides");
const video_manager_1 = require("@gitroom/nestjs-libraries/videos/video.manager");
const veo3_1 = require("@gitroom/nestjs-libraries/videos/veo3/veo3");
let VideoModule = class VideoModule {
};
exports.VideoModule = VideoModule;
exports.VideoModule = VideoModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [images_slides_1.ImagesSlides, veo3_1.Veo3, video_manager_1.VideoManager],
        get exports() {
            return this.providers;
        },
    })
], VideoModule);
//# sourceMappingURL=video.module.js.map