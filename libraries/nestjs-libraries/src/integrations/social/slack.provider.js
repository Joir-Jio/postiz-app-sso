"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
class SlackProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 3;
        this.identifier = 'slack';
        this.name = 'Slack';
        this.isBetweenSteps = false;
        this.editor = 'normal';
        this.scopes = [
            'channels:read',
            'chat:write',
            'users:read',
            'groups:read',
            'channels:join',
            'chat:write.customize',
        ];
    }
    async refreshToken(refreshToken) {
        return {
            refreshToken: '',
            expiresIn: 1000000,
            accessToken: '',
            id: '',
            name: '',
            picture: '',
            username: '',
        };
    }
    async generateAuthUrl() {
        var _a, _b, _c;
        const state = (0, make_is_1.makeId)(6);
        return {
            url: `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_ID}&redirect_uri=${encodeURIComponent(`${((_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.FRONTEND_URL) === null || _b === void 0 ? void 0 : _b.indexOf('https')) === -1
                ? 'https://redirectmeto.com/'
                : ''}${(_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.FRONTEND_URL}/integrations/social/slack`)}&scope=channels:read,chat:write,users:read,groups:read,channels:join,chat:write.customize&state=${state}`,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        var _a, _b, _c, _d;
        const { access_token, team, bot_user_id, scope } = await (await this.fetch(`https://slack.com/api/oauth.v2.access`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.SLACK_ID,
                client_secret: process.env.SLACK_SECRET,
                code: params.code,
                redirect_uri: `${((_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.FRONTEND_URL) === null || _b === void 0 ? void 0 : _b.indexOf('https')) === -1
                    ? 'https://redirectmeto.com/'
                    : ''}${(_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.FRONTEND_URL}/integrations/social/slack${params.refresh ? `?refresh=${params.refresh}` : ''}`,
            }),
        })).json();
        this.checkScopes(this.scopes, scope.split(','));
        const { user } = await (await fetch(`https://slack.com/api/users.info?user=${bot_user_id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        return {
            id: team.id,
            name: user.real_name,
            accessToken: access_token,
            refreshToken: 'null',
            expiresIn: (0, dayjs_1.default)().add(100, 'years').unix() - (0, dayjs_1.default)().unix(),
            picture: ((_d = user === null || user === void 0 ? void 0 : user.profile) === null || _d === void 0 ? void 0 : _d.image_original) || '',
            username: user.name,
        };
    }
    async channels(accessToken, params, id) {
        const list = await (await fetch(`https://slack.com/api/conversations.list?types=public_channel,private_channel`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return list.channels.map((p) => ({
            id: p.id,
            name: p.name,
        }));
    }
    async post(id, accessToken, postDetails, integration) {
        var _a;
        await fetch(`https://slack.com/api/conversations.join`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                channel: postDetails[0].settings.channel,
            }),
        });
        let lastId = '';
        for (const post of postDetails) {
            const { ts } = await (await fetch(`https://slack.com/api/chat.postMessage`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.assign(Object.assign({ channel: postDetails[0].settings.channel, username: integration.name, icon_url: integration.picture }, (lastId ? { thread_ts: lastId } : {})), { blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: post.message,
                            },
                        },
                        ...(((_a = post.media) === null || _a === void 0 ? void 0 : _a.length)
                            ? post.media.map((m) => ({
                                type: 'image',
                                image_url: m.path,
                                alt_text: '',
                            }))
                            : []),
                    ] })),
            })).json();
            lastId = ts;
        }
        return [];
    }
    async changeProfilePicture(id, accessToken, url) {
        return {
            url,
        };
    }
    async changeNickname(id, accessToken, name) {
        return {
            name,
        };
    }
}
exports.SlackProvider = SlackProvider;
//# sourceMappingURL=slack.provider.js.map