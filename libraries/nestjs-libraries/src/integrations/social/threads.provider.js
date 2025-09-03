"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadsProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const timer_1 = require("@gitroom/helpers/utils/timer");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const lodash_1 = require("lodash");
const plug_decorator_1 = require("@gitroom/helpers/decorators/plug.decorator");
const strip_html_validation_1 = require("@gitroom/helpers/utils/strip.html.validation");
class ThreadsProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'threads';
        this.name = 'Threads';
        this.isBetweenSteps = false;
        this.scopes = [
            'threads_basic',
            'threads_content_publish',
            'threads_manage_replies',
            'threads_manage_insights',
        ];
        this.maxConcurrentJob = 2;
        this.editor = 'normal';
    }
    async refreshToken(refresh_token) {
        var _a;
        const { access_token } = await (await this.fetch(`https://graph.threads.net/refresh_access_token?grant_type=th_refresh_token&access_token=${refresh_token}`)).json();
        const { id, name, username, picture } = await this.fetchPageInformation(access_token);
        return {
            id,
            name,
            accessToken: access_token,
            refreshToken: access_token,
            expiresIn: (0, dayjs_1.default)().add(59, 'days').unix() - (0, dayjs_1.default)().unix(),
            picture: ((_a = picture === null || picture === void 0 ? void 0 : picture.data) === null || _a === void 0 ? void 0 : _a.url) || '',
            username: '',
        };
    }
    async generateAuthUrl() {
        var _a;
        const state = (0, make_is_1.makeId)(6);
        return {
            url: 'https://threads.net/oauth/authorize' +
                `?client_id=${process.env.THREADS_APP_ID}` +
                `&redirect_uri=${encodeURIComponent(`${((_a = process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL) === null || _a === void 0 ? void 0 : _a.indexOf('https')) == -1
                    ? `https://redirectmeto.com/${process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL}`
                    : `${process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL}`}/integrations/social/threads`)}` +
                `&state=${state}` +
                `&scope=${encodeURIComponent(this.scopes.join(','))}`,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        var _a, _b;
        const getAccessToken = await (await this.fetch('https://graph.threads.net/oauth/access_token' +
            `?client_id=${process.env.THREADS_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(`${((_a = process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL) === null || _a === void 0 ? void 0 : _a.indexOf('https')) == -1
                ? `https://redirectmeto.com/${process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL}`
                : `${process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL}`}/integrations/social/threads`)}` +
            `&grant_type=authorization_code` +
            `&client_secret=${process.env.THREADS_APP_SECRET}` +
            `&code=${params.code}`)).json();
        const { access_token } = await (await this.fetch('https://graph.threads.net/access_token' +
            '?grant_type=th_exchange_token' +
            `&client_secret=${process.env.THREADS_APP_SECRET}` +
            `&access_token=${getAccessToken.access_token}&fields=access_token,expires_in`)).json();
        const { id, name, username, picture, } = await this.fetchPageInformation(access_token);
        return {
            id,
            name,
            accessToken: access_token,
            refreshToken: access_token,
            expiresIn: (0, dayjs_1.default)().add(59, 'days').unix() - (0, dayjs_1.default)().unix(),
            picture: ((_b = picture === null || picture === void 0 ? void 0 : picture.data) === null || _b === void 0 ? void 0 : _b.url) || '',
            username: username,
        };
    }
    async checkLoaded(mediaContainerId, accessToken) {
        const { status, id, error_message } = await (await this.fetch(`https://graph.threads.net/v1.0/${mediaContainerId}?fields=status,error_message&access_token=${accessToken}`)).json();
        if (status === 'ERROR') {
            throw new Error(id);
        }
        if (status === 'FINISHED') {
            await (0, timer_1.timer)(2000);
            return true;
        }
        await (0, timer_1.timer)(2200);
        return this.checkLoaded(mediaContainerId, accessToken);
    }
    async fetchPageInformation(accessToken) {
        const { id, username, threads_profile_picture_url, access_token } = await (await this.fetch(`https://graph.threads.net/v1.0/me?fields=id,username,threads_profile_picture_url&access_token=${accessToken}`)).json();
        return {
            id,
            name: username,
            access_token,
            picture: { data: { url: threads_profile_picture_url } },
            username,
        };
    }
    async createSingleMediaContent(userId, accessToken, media, message, isCarouselItem = false, replyToId) {
        const mediaType = media.path.indexOf('.mp4') > -1 ? 'video_url' : 'image_url';
        const mediaParams = new URLSearchParams(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (mediaType === 'video_url' ? { video_url: media.path } : {})), (mediaType === 'image_url' ? { image_url: media.path } : {})), (isCarouselItem ? { is_carousel_item: 'true' } : {})), (replyToId ? { reply_to_id: replyToId } : {})), { media_type: mediaType === 'video_url' ? 'VIDEO' : 'IMAGE', text: message, access_token: accessToken }));
        const { id: mediaId } = await (await this.fetch(`https://graph.threads.net/v1.0/${userId}/threads?${mediaParams.toString()}`, {
            method: 'POST',
        })).json();
        return mediaId;
    }
    async createCarouselContent(userId, accessToken, media, message, replyToId) {
        const mediaIds = [];
        for (const mediaItem of media) {
            const mediaId = await this.createSingleMediaContent(userId, accessToken, mediaItem, message, true);
            mediaIds.push(mediaId);
        }
        await Promise.all(mediaIds.map((id) => this.checkLoaded(id, accessToken)));
        const params = new URLSearchParams(Object.assign(Object.assign({ text: message, media_type: 'CAROUSEL', children: mediaIds.join(',') }, (replyToId ? { reply_to_id: replyToId } : {})), { access_token: accessToken }));
        const { id: containerId } = await (await this.fetch(`https://graph.threads.net/v1.0/${userId}/threads?${params.toString()}`, {
            method: 'POST',
        })).json();
        return containerId;
    }
    async createTextContent(userId, accessToken, message, replyToId, quoteId) {
        const form = new FormData();
        form.append('media_type', 'TEXT');
        form.append('text', message);
        form.append('access_token', accessToken);
        if (replyToId) {
            form.append('reply_to_id', replyToId);
        }
        if (quoteId) {
            form.append('quote_post_id', quoteId);
        }
        const { id: contentId } = await (await this.fetch(`https://graph.threads.net/v1.0/${userId}/threads`, {
            method: 'POST',
            body: form,
        })).json();
        return contentId;
    }
    async publishThread(userId, accessToken, creationId) {
        await this.checkLoaded(creationId, accessToken);
        const { id: threadId } = await (await this.fetch(`https://graph.threads.net/v1.0/${userId}/threads_publish?creation_id=${creationId}&access_token=${accessToken}`, {
            method: 'POST',
        })).json();
        const { permalink } = await (await this.fetch(`https://graph.threads.net/v1.0/${threadId}?fields=id,permalink&access_token=${accessToken}`)).json();
        return { threadId, permalink };
    }
    async createThreadContent(userId, accessToken, postDetails, replyToId, quoteId) {
        if (!postDetails.media || postDetails.media.length === 0) {
            return await this.createTextContent(userId, accessToken, postDetails.message, replyToId, quoteId);
        }
        else if (postDetails.media.length === 1) {
            return await this.createSingleMediaContent(userId, accessToken, postDetails.media[0], postDetails.message, false, replyToId);
        }
        else {
            return await this.createCarouselContent(userId, accessToken, postDetails.media, postDetails.message, replyToId);
        }
    }
    async post(userId, accessToken, postDetails) {
        var _a, _b, _c, _d;
        if (!postDetails.length) {
            return [];
        }
        const [firstPost, ...replies] = postDetails;
        const initialContentId = await this.createThreadContent(userId, accessToken, firstPost);
        const { threadId, permalink } = await this.publishThread(userId, accessToken, initialContentId);
        const responses = [
            {
                id: firstPost.id,
                postId: threadId,
                status: 'success',
                releaseURL: permalink,
            },
        ];
        let lastReplyId = threadId;
        for (const reply of replies) {
            const replyContentId = await this.createThreadContent(userId, accessToken, reply, lastReplyId);
            const { threadId: replyThreadId } = await this.publishThread(userId, accessToken, replyContentId);
            lastReplyId = replyThreadId;
            responses.push({
                id: reply.id,
                postId: threadId,
                status: 'success',
                releaseURL: permalink,
            });
        }
        if ((_b = (_a = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.active_thread_finisher) {
            try {
                const replyContentId = await this.createThreadContent(userId, accessToken, {
                    id: (0, make_is_1.makeId)(10),
                    media: [],
                    message: (_d = (_c = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _c === void 0 ? void 0 : _c.settings) === null || _d === void 0 ? void 0 : _d.thread_finisher,
                    settings: {},
                }, lastReplyId, threadId);
                await this.publishThread(userId, accessToken, replyContentId);
            }
            catch (err) {
                console.log(err);
            }
        }
        return responses;
    }
    async analytics(id, accessToken, date) {
        const until = (0, dayjs_1.default)().endOf('day').unix();
        const since = (0, dayjs_1.default)().subtract(date, 'day').unix();
        const _a = await (await fetch(`https://graph.threads.net/v1.0/${id}/threads_insights?metric=views,likes,replies,reposts,quotes&access_token=${accessToken}&period=day&since=${since}&until=${until}`)).json(), { data } = _a, all = tslib_1.__rest(_a, ["data"]);
        return ((data === null || data === void 0 ? void 0 : data.map((d) => ({
            label: (0, lodash_1.capitalize)(d.name),
            percentageChange: 5,
            data: d.total_value
                ? [{ total: d.total_value.value, date: (0, dayjs_1.default)().format('YYYY-MM-DD') }]
                : d.values.map((v) => ({
                    total: v.value,
                    date: (0, dayjs_1.default)(v.end_time).format('YYYY-MM-DD'),
                })),
        }))) || []);
    }
    async autoPlugPost(integration, id, fields) {
        const { data } = await (await fetch(`https://graph.threads.net/v1.0/${id}/insights?metric=likes&access_token=${integration.token}`)).json();
        const { values: [value], } = data.find((p) => p.name === 'likes');
        if (value.value >= fields.likesAmount) {
            await (0, timer_1.timer)(2000);
            const form = new FormData();
            form.append('media_type', 'TEXT');
            form.append('text', (0, strip_html_validation_1.stripHtmlValidation)('normal', fields.post, true));
            form.append('reply_to_id', id);
            form.append('access_token', integration.token);
            const { id: replyId } = await (await this.fetch('https://graph.threads.net/v1.0/me/threads', {
                method: 'POST',
                body: form,
            })).json();
            await (await this.fetch(`https://graph.threads.net/v1.0/${integration.internalId}/threads_publish?creation_id=${replyId}&access_token=${integration.token}`, {
                method: 'POST',
            })).json();
            return true;
        }
        return false;
    }
}
exports.ThreadsProvider = ThreadsProvider;
tslib_1.__decorate([
    (0, plug_decorator_1.Plug)({
        identifier: 'threads-autoPlugPost',
        title: 'Auto plug post',
        description: 'When a post reached a certain number of likes, add another post to it so you followers get a notification about your promotion',
        runEveryMilliseconds: 21600000,
        totalRuns: 3,
        fields: [
            {
                name: 'likesAmount',
                type: 'number',
                placeholder: 'Amount of likes',
                description: 'The amount of likes to trigger the repost',
                validation: /^\d+$/,
            },
            {
                name: 'post',
                type: 'richtext',
                placeholder: 'Post to plug',
                description: 'Message content to plug',
                validation: /^[\s\S]{3,}$/g,
            },
        ],
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ThreadsProvider.prototype, "autoPlugPost", null);
//# sourceMappingURL=threads.provider.js.map