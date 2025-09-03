"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeygenProvider = void 0;
const tslib_1 = require("tslib");
const thirdparty_interface_1 = require("@gitroom/nestjs-libraries/3rdparties/thirdparty.interface");
const openai_service_1 = require("@gitroom/nestjs-libraries/openai/openai.service");
const timer_1 = require("@gitroom/helpers/utils/timer");
let HeygenProvider = class HeygenProvider extends thirdparty_interface_1.ThirdPartyAbstract {
    constructor(_openaiService) {
        super();
        this._openaiService = _openaiService;
    }
    async checkConnection(apiKey) {
        const list = await fetch('https://api.heygen.com/v1/user/me', {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': apiKey,
            },
        });
        if (!list.ok) {
            return false;
        }
        const { data } = await list.json();
        return {
            name: data.first_name + ' ' + data.last_name,
            username: data.username,
            id: data.username,
        };
    }
    async generateVoice(apiKey, data) {
        return {
            voice: await this._openaiService.generateVoiceFromText(data.text),
        };
    }
    async voices(apiKey) {
        const { data: { voices }, } = await (await fetch('https://api.heygen.com/v2/voices', {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': apiKey,
            },
        })).json();
        return voices.slice(0, 20);
    }
    async avatars(apiKey) {
        const { data: { avatar_group_list }, } = await (await fetch('https://api.heygen.com/v2/avatar_group.list?include_public=false', {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'x-api-key': apiKey,
            },
        })).json();
        const loadedAvatars = [];
        for (const avatar of avatar_group_list) {
            const { data: { avatar_list }, } = await (await fetch(`https://api.heygen.com/v2/avatar_group/${avatar.id}/avatars`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'x-api-key': apiKey,
                },
            })).json();
            loadedAvatars.push(...avatar_list);
        }
        return loadedAvatars;
    }
    async sendData(apiKey, data) {
        const { data: { video_id }, } = await (await fetch(`https://api.heygen.com/v2/video/generate`, {
            method: 'POST',
            body: JSON.stringify({
                caption: data.captions === 'yes',
                video_inputs: [
                    Object.assign(Object.assign({}, (data.type === 'avatar'
                        ? {
                            character: {
                                type: 'avatar',
                                avatar_id: data.avatar,
                            },
                        }
                        : {
                            character: {
                                type: 'talking_photo',
                                talking_photo_id: data.avatar,
                            },
                        })), { voice: {
                            type: 'text',
                            input_text: data.voice,
                            voice_id: data.selectedVoice,
                        } }),
                ],
                dimension: data.aspect_ratio === 'story'
                    ? {
                        width: 720,
                        height: 1280,
                    }
                    : {
                        width: 1280,
                        height: 720,
                    },
            }),
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'x-api-key': apiKey,
            },
        })).json();
        while (true) {
            const { data: { status, video_url }, } = await (await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${video_id}`, {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'x-api-key': apiKey,
                },
            })).json();
            if (status === 'completed') {
                return video_url;
            }
            else if (status === 'failed') {
                throw new Error('Video generation failed');
            }
            await (0, timer_1.timer)(3000);
        }
    }
};
exports.HeygenProvider = HeygenProvider;
exports.HeygenProvider = HeygenProvider = tslib_1.__decorate([
    (0, thirdparty_interface_1.ThirdParty)({
        identifier: 'heygen',
        title: 'HeyGen',
        description: 'HeyGen is a platform for creating AI-generated avatars videos.',
        position: 'media',
        fields: [],
    }),
    tslib_1.__metadata("design:paramtypes", [openai_service_1.OpenaiService])
], HeygenProvider);
//# sourceMappingURL=heygen.provider.js.map