"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedditProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const timer_1 = require("@gitroom/helpers/utils/timer");
const lodash_1 = require("lodash");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const mime_types_1 = require("mime-types");
const axios_1 = tslib_1.__importDefault(require("axios"));
const ws_1 = tslib_1.__importDefault(require("ws"));
global.WebSocket = ws_1.default;
class RedditProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 1;
        this.identifier = 'reddit';
        this.name = 'Reddit';
        this.isBetweenSteps = false;
        this.scopes = ['read', 'identity', 'submit', 'flair'];
        this.editor = 'normal';
    }
    async refreshToken(refreshToken) {
        var _a, _b;
        const { access_token: accessToken, refresh_token: newRefreshToken, expires_in: expiresIn, } = await (await this.fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        })).json();
        const { name, id, icon_img } = await (await this.fetch('https://oauth.reddit.com/api/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return {
            id,
            name,
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn,
            picture: ((_b = (_a = icon_img === null || icon_img === void 0 ? void 0 : icon_img.split) === null || _a === void 0 ? void 0 : _a.call(icon_img, '?')) === null || _b === void 0 ? void 0 : _b[0]) || '',
            username: name,
        };
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        const codeVerifier = (0, make_is_1.makeId)(30);
        const url = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_CLIENT_ID}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/reddit`)}&duration=permanent&scope=${encodeURIComponent(this.scopes.join(' '))}`;
        return {
            url,
            codeVerifier,
            state,
        };
    }
    async authenticate(params) {
        var _a, _b;
        const { access_token: accessToken, refresh_token: refreshToken, expires_in: expiresIn, scope, } = await (await this.fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: params.code,
                redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/reddit`,
            }),
        })).json();
        this.checkScopes(this.scopes, scope);
        const { name, id, icon_img } = await (await this.fetch('https://oauth.reddit.com/api/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return {
            id,
            name,
            accessToken,
            refreshToken,
            expiresIn,
            picture: ((_b = (_a = icon_img === null || icon_img === void 0 ? void 0 : icon_img.split) === null || _a === void 0 ? void 0 : _a.call(icon_img, '?')) === null || _b === void 0 ? void 0 : _b[0]) || '',
            username: name,
        };
    }
    async uploadFileToReddit(accessToken, path) {
        const mimeType = (0, mime_types_1.lookup)(path);
        const formData = new FormData();
        formData.append('filepath', path.split('/').pop());
        formData.append('mimetype', mimeType || 'application/octet-stream');
        const { args: { action, fields }, } = await (await this.fetch('https://oauth.reddit.com/api/media/asset', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        }, 'reddit', 0, true)).json();
        const { data } = await axios_1.default.get(path, {
            responseType: 'arraybuffer',
        });
        const upload = fields.reduce((acc, value) => {
            acc.append(value.name, value.value);
            return acc;
        }, new FormData());
        upload.append('file', new Blob([Buffer.from(data)], { type: mimeType }));
        const d = await fetch('https:' + action, {
            method: 'POST',
            body: upload,
        });
        return [...(await d.text()).matchAll(/<Location>(.*?)<\/Location>/g)][0][1];
    }
    async post(id, accessToken, postDetails) {
        const [post, ...rest] = postDetails;
        const valueArray = [];
        for (const firstPostSettings of post.settings.subreddit) {
            const postData = Object.assign(Object.assign(Object.assign(Object.assign({ api_type: 'json', title: firstPostSettings.value.title || '', kind: firstPostSettings.value.type === 'media'
                    ? post.media[0].path.indexOf('mp4') > -1
                        ? 'video'
                        : 'image'
                    : firstPostSettings.value.type }, (firstPostSettings.value.flair
                ? { flair_id: firstPostSettings.value.flair.id }
                : {})), (firstPostSettings.value.type === 'link'
                ? {
                    url: firstPostSettings.value.url,
                }
                : {})), (firstPostSettings.value.type === 'media'
                ? Object.assign({ url: await this.uploadFileToReddit(accessToken, post.media[0].path) }, (post.media[0].path.indexOf('mp4') > -1
                    ? {
                        video_poster_url: await this.uploadFileToReddit(accessToken, post.media[0].thumbnail),
                    }
                    : {})) : {})), { text: post.message, sr: firstPostSettings.value.subreddit });
            const all = await (await this.fetch('https://oauth.reddit.com/api/submit', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(postData),
            })).json();
            const { id, name, url } = await new Promise((res) => {
                var _a, _b;
                if ((_b = (_a = all === null || all === void 0 ? void 0 : all.json) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.id) {
                    res(all.json.data);
                }
                const ws = new ws_1.default(all.json.data.websocket_url);
                ws.on('message', (data) => {
                    var _a, _b, _c;
                    setTimeout(() => {
                        res({ id: '', name: '', url: '' });
                        ws.close();
                    }, 30000);
                    try {
                        const parsedData = JSON.parse(data.toString());
                        if ((_a = parsedData === null || parsedData === void 0 ? void 0 : parsedData.payload) === null || _a === void 0 ? void 0 : _a.redirect) {
                            const onlyId = (_b = parsedData === null || parsedData === void 0 ? void 0 : parsedData.payload) === null || _b === void 0 ? void 0 : _b.redirect.replace(/https:\/\/www\.reddit\.com\/r\/.*?\/comments\/(.*?)\/.*/g, '$1');
                            res({
                                id: onlyId,
                                name: `t3_${onlyId}`,
                                url: (_c = parsedData === null || parsedData === void 0 ? void 0 : parsedData.payload) === null || _c === void 0 ? void 0 : _c.redirect,
                            });
                        }
                    }
                    catch (err) { }
                });
            });
            valueArray.push({
                postId: id,
                releaseURL: url,
                id: post.id,
                status: 'published',
            });
            for (const comment of rest) {
                const { json: { data: { things: [{ data: { id: commentId, permalink }, },], }, }, } = await (await this.fetch('https://oauth.reddit.com/api/comment', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        text: comment.message,
                        thing_id: name,
                        api_type: 'json',
                    }),
                })).json();
                valueArray.push({
                    postId: commentId,
                    releaseURL: 'https://www.reddit.com' + permalink,
                    id: comment.id,
                    status: 'published',
                });
                if (rest.length > 1) {
                    await (0, timer_1.timer)(5000);
                }
            }
            if (post.settings.subreddit.length > 1) {
                await (0, timer_1.timer)(5000);
            }
        }
        return Object.values((0, lodash_1.groupBy)(valueArray, (p) => p.id)).map((p) => ({
            id: p[0].id,
            postId: p.map((p) => p.postId).join(','),
            releaseURL: p.map((p) => p.releaseURL).join(','),
            status: 'published',
        }));
    }
    async subreddits(accessToken, data) {
        const { data: { children }, } = await (await this.fetch(`https://oauth.reddit.com/subreddits/search?show=public&q=${data.word}&sort=activity&show_users=false&limit=10`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }, 'reddit', 0, false)).json();
        return children
            .filter(({ data }) => data.subreddit_type === 'public' && data.submission_type !== 'image')
            .map(({ data: { title, url, id } }) => ({
            title,
            name: url,
            id,
        }));
    }
    getPermissions(submissionType, allow_images) {
        const permissions = [];
        if (['any', 'self'].indexOf(submissionType) > -1) {
            permissions.push('self');
        }
        if (['any', 'link'].indexOf(submissionType) > -1) {
            permissions.push('link');
        }
        if (allow_images) {
            permissions.push('media');
        }
        return permissions;
    }
    async restrictions(accessToken, data) {
        var _a;
        const _b = (await (await this.fetch(`https://oauth.reddit.com/${data.subreddit}/about`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }, 'reddit', 0, false)).json()).data, { submission_type, allow_images } = _b, all2 = tslib_1.__rest(_b, ["submission_type", "allow_images"]);
        const _c = await (await this.fetch(`https://oauth.reddit.com/api/v1/${data.subreddit.split('/r/')[1]}/post_requirements`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }, 'reddit', 0, false)).json(), { is_flair_required } = _c, all = tslib_1.__rest(_c, ["is_flair_required"]);
        const newData = await new Promise(async (res) => {
            try {
                const flair = await (await this.fetch(`https://oauth.reddit.com/${data.subreddit}/api/link_flair_v2`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }, 'reddit', 0, false)).json();
                res(flair);
            }
            catch (err) {
                return res([]);
            }
        });
        return {
            subreddit: data.subreddit,
            allow: this.getPermissions(submission_type, allow_images),
            is_flair_required: is_flair_required && newData.length > 0,
            flairs: ((_a = newData === null || newData === void 0 ? void 0 : newData.map) === null || _a === void 0 ? void 0 : _a.call(newData, (p) => ({
                id: p.id,
                name: p.text,
            }))) || [],
        };
    }
}
exports.RedditProvider = RedditProvider;
//# sourceMappingURL=reddit.provider.js.map