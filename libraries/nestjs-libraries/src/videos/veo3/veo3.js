"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Veo3 = void 0;
const tslib_1 = require("tslib");
const video_interface_1 = require("@gitroom/nestjs-libraries/videos/video.interface");
const timer_1 = require("@gitroom/helpers/utils/timer");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class Image {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], Image.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], Image.prototype, "path", void 0);
class Params {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], Params.prototype, "prompt", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Image),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(3),
    tslib_1.__metadata("design:type", Array)
], Params.prototype, "images", void 0);
let Veo3 = class Veo3 extends video_interface_1.VideoAbstract {
    constructor() {
        super(...arguments);
        this.dto = Params;
    }
    async process(output, customParams) {
        var _a, _b, _c;
        const value = await (await fetch('https://api.kie.ai/api/v1/veo/generate', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.KIEAI_API_KEY}`,
            },
            method: 'POST',
            body: JSON.stringify({
                prompt: customParams.prompt,
                imageUrls: ((_a = customParams === null || customParams === void 0 ? void 0 : customParams.images) === null || _a === void 0 ? void 0 : _a.map((p) => p.path)) || [],
                model: 'veo3_fast',
                aspectRatio: output === 'horizontal' ? '16:9' : '9:16',
            }),
        })).json();
        if (value.code !== 200 && value.code !== 201) {
            throw new Error(`Failed to generate video`);
        }
        const taskId = value.data.taskId;
        let videoUrl = [];
        while (videoUrl.length === 0) {
            console.log('waiting for video to be ready');
            const data = await (await fetch('https://api.kie.ai/api/v1/veo/record-info?taskId=' + taskId, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.KIEAI_API_KEY}`,
                },
            })).json();
            if (data.code !== 200 && data.code !== 400) {
                throw new Error(`Failed to get video info`);
            }
            videoUrl = ((_c = (_b = data === null || data === void 0 ? void 0 : data.data) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.resultUrls) || [];
            await (0, timer_1.timer)(10000);
        }
        return videoUrl[0];
    }
};
exports.Veo3 = Veo3;
exports.Veo3 = Veo3 = tslib_1.__decorate([
    (0, video_interface_1.Video)({
        identifier: 'veo3',
        title: 'Veo3 (Audio + Video)',
        description: 'Generate videos with the most advanced video model.',
        placement: 'text-to-image',
        trial: false,
        available: !!process.env.KIEAI_API_KEY,
    })
], Veo3);
//# sourceMappingURL=veo3.js.map