"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagesSlides = void 0;
const tslib_1 = require("tslib");
const openai_service_1 = require("@gitroom/nestjs-libraries/openai/openai.service");
const video_interface_1 = require("@gitroom/nestjs-libraries/videos/video.interface");
const lodash_1 = require("lodash");
const transloadit_1 = tslib_1.__importDefault(require("transloadit"));
const upload_factory_1 = require("@gitroom/nestjs-libraries/upload/upload.factory");
const stream_1 = require("stream");
const music_metadata_1 = require("music-metadata");
const subtitle_1 = require("subtitle");
const p_limit_1 = tslib_1.__importDefault(require("p-limit"));
const fal_service_1 = require("@gitroom/nestjs-libraries/openai/fal.service");
const class_validator_1 = require("class-validator");
const limit = (0, p_limit_1.default)(2);
const transloadit = new transloadit_1.default({
    authKey: process.env.TRANSLOADIT_AUTH || 'just empty text',
    authSecret: process.env.TRANSLOADIT_SECRET || 'just empty text',
});
async function getAudioDuration(buffer) {
    const metadata = await (0, music_metadata_1.parseBuffer)(buffer, 'audio/mpeg');
    return metadata.format.duration || 0;
}
class Params {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], Params.prototype, "voice", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], Params.prototype, "prompt", void 0);
let ImagesSlides = class ImagesSlides extends video_interface_1.VideoAbstract {
    constructor(_openaiService, _falService) {
        super();
        this._openaiService = _openaiService;
        this._falService = _falService;
        this.dto = Params;
        this.storage = upload_factory_1.UploadFactory.createStorage();
    }
    async process(output, customParams) {
        const list = await this._openaiService.generateSlidesFromText(customParams.prompt);
        const generated = await Promise.all(list.reduce((all, current) => {
            all.push(new Promise(async (res) => {
                res({
                    len: 0,
                    url: await this._falService.generateImageFromText('ideogram/v2', current.imagePrompt, output === 'vertical'),
                });
            }));
            all.push(new Promise(async (res) => {
                const buffer = Buffer.from(await (await limit(() => fetch(`https://api.elevenlabs.io/v1/text-to-speech/${customParams.voice}?output_format=mp3_44100_128`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'xi-api-key': process.env.ELEVENSLABS_API_KEY || '',
                    },
                    body: JSON.stringify({
                        text: current.voiceText,
                        model_id: 'eleven_multilingual_v2',
                    }),
                }))).arrayBuffer());
                const { path } = await this.storage.uploadFile({
                    buffer,
                    mimetype: 'audio/mp3',
                    size: buffer.length,
                    path: '',
                    fieldname: '',
                    destination: '',
                    stream: new stream_1.Readable(),
                    filename: '',
                    originalname: '',
                    encoding: '',
                });
                res({
                    len: await getAudioDuration(buffer),
                    url: path.indexOf('http') === -1
                        ? process.env.FRONTEND_URL +
                            '/' +
                            process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY +
                            path
                        : path,
                });
            }));
            return all;
        }, []));
        const split = (0, lodash_1.chunk)(generated, 2);
        const srt = (0, subtitle_1.stringifySync)(list
            .reduce((all, current, index) => {
            const start = all.length ? all[all.length - 1].end : 0;
            const end = start + split[index][1].len * 1000 + 1000;
            all.push({
                start: start,
                end: end,
                text: current.voiceText,
            });
            return all;
        }, [])
            .map((item) => ({
            type: 'cue',
            data: item,
        })), { format: 'SRT' });
        const { results } = await transloadit.createAssembly({
            uploads: {
                'subtitles.srt': srt,
            },
            waitForCompletion: true,
            params: {
                steps: Object.assign(Object.assign({}, split.reduce((all, current, index) => {
                    all[`image${index}`] = {
                        robot: '/http/import',
                        url: current[0].url,
                    };
                    all[`audio${index}`] = {
                        robot: '/http/import',
                        url: current[1].url,
                    };
                    all[`merge${index}`] = {
                        use: [
                            {
                                name: `image${index}`,
                                as: 'image',
                            },
                            {
                                name: `audio${index}`,
                                as: 'audio',
                            },
                        ],
                        robot: '/video/merge',
                        duration: current[1].len + 1,
                        audio_delay: 0.5,
                        preset: 'hls-1080p',
                        resize_strategy: 'min_fit',
                        loop: true,
                    };
                    return all;
                }, {})), { concatenated: {
                        robot: '/video/concat',
                        result: false,
                        video_fade_seconds: 0.5,
                        use: split.map((p, index) => ({
                            name: `merge${index}`,
                            as: `video_${index + 1}`,
                        })),
                    }, subtitled: {
                        robot: '/video/subtitle',
                        result: true,
                        preset: 'hls-1080p',
                        use: {
                            bundle_steps: true,
                            steps: [
                                {
                                    name: 'concatenated',
                                    as: 'video',
                                },
                                {
                                    name: ':original',
                                    as: 'subtitles',
                                },
                            ],
                        },
                        position: 'center',
                        font_size: 8,
                        subtitles_type: 'burned',
                    } }),
            },
        });
        return results.subtitled[0].url;
    }
    async loadVoices(data) {
        const { voices } = await (await fetch('https://api.elevenlabs.io/v2/voices?page_size=40&category=premade', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENSLABS_API_KEY || '',
            },
        })).json();
        return {
            voices: voices.map((voice) => ({
                id: voice.voice_id,
                name: voice.name,
                preview_url: voice.preview_url,
            })),
        };
    }
};
exports.ImagesSlides = ImagesSlides;
tslib_1.__decorate([
    (0, video_interface_1.ExposeVideoFunction)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ImagesSlides.prototype, "loadVoices", null);
exports.ImagesSlides = ImagesSlides = tslib_1.__decorate([
    (0, video_interface_1.Video)({
        identifier: 'image-text-slides',
        title: 'Image Text Slides',
        description: 'Generate videos slides from images and text',
        placement: 'text-to-image',
        trial: true,
        available: !!process.env.ELEVENSLABS_API_KEY &&
            !!process.env.TRANSLOADIT_AUTH &&
            !!process.env.TRANSLOADIT_SECRET &&
            !!process.env.OPENAI_API_KEY &&
            !!process.env.FAL_KEY,
    }),
    tslib_1.__metadata("design:paramtypes", [openai_service_1.OpenaiService,
        fal_service_1.FalService])
], ImagesSlides);
//# sourceMappingURL=images.slides.js.map