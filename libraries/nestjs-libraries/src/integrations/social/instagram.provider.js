"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const timer_1 = require("@gitroom/helpers/utils/timer");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
class InstagramProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'instagram';
        this.name = 'Instagram\n(Facebook Business)';
        this.isBetweenSteps = true;
        this.toolTip = 'Instagram must be business and connected to a Facebook page';
        this.scopes = [
            'instagram_basic',
            'pages_show_list',
            'pages_read_engagement',
            'business_management',
            'instagram_content_publish',
            'instagram_manage_comments',
            'instagram_manage_insights',
        ];
        this.maxConcurrentJob = 10;
        this.editor = 'normal';
    }
    async refreshToken(refresh_token) {
        return {
            refreshToken: '',
            expiresIn: 0,
            accessToken: '',
            id: '',
            name: '',
            picture: '',
            username: '',
        };
    }
    handleErrors(body) {
        if (body.indexOf('An unknown error occurred') > -1) {
            return {
                type: 'retry',
                value: 'An unknown error occurred, please try again later',
            };
        }
        if (body.indexOf('REVOKED_ACCESS_TOKEN') > -1) {
            return {
                type: 'refresh-token',
                value: 'Something is wrong with your connected user, please re-authenticate',
            };
        }
        if (body.toLowerCase().indexOf('the user is not an instagram business') > -1) {
            return {
                type: 'refresh-token',
                value: 'Your Instagram account is not a business account, please convert it to a business account',
            };
        }
        if (body.toLowerCase().indexOf('session has been invalidated') > -1) {
            return {
                type: 'refresh-token',
                value: 'Please re-authenticate your Instagram account',
            };
        }
        if (body.indexOf('2207050') > -1) {
            return {
                type: 'refresh-token',
                value: 'Instagram user is restricted',
            };
        }
        if (body.indexOf('2207003') > -1) {
            return {
                type: 'bad-body',
                value: 'Timeout downloading media, please try again',
            };
        }
        if (body.indexOf('2207020') > -1) {
            return {
                type: 'bad-body',
                value: 'Media expired, please upload again',
            };
        }
        if (body.indexOf('2207032') > -1) {
            return {
                type: 'bad-body',
                value: 'Failed to create media, please try again',
            };
        }
        if (body.indexOf('2207053') > -1) {
            return {
                type: 'bad-body',
                value: 'Unknown upload error, please try again',
            };
        }
        if (body.indexOf('2207052') > -1) {
            return {
                type: 'bad-body',
                value: 'Media fetch failed, please try again',
            };
        }
        if (body.indexOf('2207057') > -1) {
            return {
                type: 'bad-body',
                value: 'Invalid thumbnail offset for video',
            };
        }
        if (body.indexOf('2207026') > -1) {
            return {
                type: 'bad-body',
                value: 'Unsupported video format',
            };
        }
        if (body.indexOf('2207023') > -1) {
            return {
                type: 'bad-body',
                value: 'Unknown media type',
            };
        }
        if (body.indexOf('2207006') > -1) {
            return {
                type: 'bad-body',
                value: 'Media not found, please upload again',
            };
        }
        if (body.indexOf('2207008') > -1) {
            return {
                type: 'bad-body',
                value: 'Media builder expired, please try again',
            };
        }
        if (body.indexOf('2207028') > -1) {
            return {
                type: 'bad-body',
                value: 'Carousel validation failed',
            };
        }
        if (body.indexOf('2207010') > -1) {
            return {
                type: 'bad-body',
                value: 'Caption is too long',
            };
        }
        if (body.indexOf('2207035') > -1) {
            return {
                type: 'bad-body',
                value: 'Product tag positions not supported for videos',
            };
        }
        if (body.indexOf('2207036') > -1) {
            return {
                type: 'bad-body',
                value: 'Product tag positions required for photos',
            };
        }
        if (body.indexOf('2207037') > -1) {
            return {
                type: 'bad-body',
                value: 'Product tag validation failed',
            };
        }
        if (body.indexOf('2207040') > -1) {
            return {
                type: 'bad-body',
                value: 'Too many product tags',
            };
        }
        if (body.indexOf('2207004') > -1) {
            return {
                type: 'bad-body',
                value: 'Image is too large',
            };
        }
        if (body.indexOf('2207005') > -1) {
            return {
                type: 'bad-body',
                value: 'Unsupported image format',
            };
        }
        if (body.indexOf('2207009') > -1) {
            return {
                type: 'bad-body',
                value: 'Aspect ratio not supported, must be between 4:5 to 1.91:1',
            };
        }
        if (body.indexOf('Page request limit reached') > -1) {
            return {
                type: 'bad-body',
                value: 'Page posting for today is limited, please try again tomorrow',
            };
        }
        if (body.indexOf('2207042') > -1) {
            return {
                type: 'bad-body',
                value: 'You have reached the maximum of 25 posts per day, allowed for your account',
            };
        }
        if (body.indexOf('Not enough permissions to post') > -1) {
            return {
                type: 'bad-body',
                value: 'Not enough permissions to post',
            };
        }
        if (body.indexOf('36003') > -1) {
            return {
                type: 'bad-body',
                value: 'Aspect ratio not supported, must be between 4:5 to 1.91:1',
            };
        }
        if (body.indexOf('36001') > -1) {
            return {
                type: 'bad-body',
                value: 'Invalid Instagram image resolution max: 1920x1080px',
            };
        }
        if (body.indexOf('2207051') > -1) {
            return {
                type: 'bad-body',
                value: 'Instagram blocked your request',
            };
        }
        if (body.indexOf('2207001') > -1) {
            return {
                type: 'bad-body',
                value: 'Instagram detected that your post is spam, please try again with different content',
            };
        }
        if (body.indexOf('2207027') > -1) {
            return {
                type: 'bad-body',
                value: 'Unknown error, please try again later or contact support',
            };
        }
        console.log('err', body);
        return undefined;
    }
    async reConnect(id, requiredId, accessToken) {
        const findPage = (await this.pages(accessToken)).find((p) => p.id === requiredId);
        const information = await this.fetchPageInformation(accessToken, {
            id: requiredId,
            pageId: findPage === null || findPage === void 0 ? void 0 : findPage.pageId,
        });
        return {
            id: information.id,
            name: information.name,
            accessToken: information.access_token,
            refreshToken: information.access_token,
            expiresIn: (0, dayjs_1.default)().add(59, 'days').unix() - (0, dayjs_1.default)().unix(),
            picture: information.picture,
            username: information.username,
        };
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        return {
            url: 'https://www.facebook.com/v20.0/dialog/oauth' +
                `?client_id=${process.env.FACEBOOK_APP_ID}` +
                `&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/instagram`)}` +
                `&state=${state}` +
                `&scope=${encodeURIComponent(this.scopes.join(','))}`,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        var _a;
        const getAccessToken = await (await fetch('https://graph.facebook.com/v20.0/oauth/access_token' +
            `?client_id=${process.env.FACEBOOK_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/instagram${params.refresh ? `?refresh=${params.refresh}` : ''}`)}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&code=${params.code}`)).json();
        const _b = await (await fetch('https://graph.facebook.com/v20.0/oauth/access_token' +
            '?grant_type=fb_exchange_token' +
            `&client_id=${process.env.FACEBOOK_APP_ID}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&fb_exchange_token=${getAccessToken.access_token}`)).json(), { access_token, expires_in } = _b, all = tslib_1.__rest(_b, ["access_token", "expires_in"]);
        const { data } = await (await fetch(`https://graph.facebook.com/v20.0/me/permissions?access_token=${access_token}`)).json();
        const permissions = data
            .filter((d) => d.status === 'granted')
            .map((p) => p.permission);
        this.checkScopes(this.scopes, permissions);
        const { id, name, picture } = await (await fetch(`https://graph.facebook.com/v20.0/me?fields=id,name,picture&access_token=${access_token}`)).json();
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
    async pages(accessToken) {
        const { data } = await (await fetch(`https://graph.facebook.com/v20.0/me/accounts?fields=id,instagram_business_account,username,name,picture.type(large)&access_token=${accessToken}&limit=500`)).json();
        const onlyConnectedAccounts = await Promise.all(data
            .filter((f) => f.instagram_business_account)
            .map(async (p) => {
            return Object.assign(Object.assign({ pageId: p.id }, (await (await fetch(`https://graph.facebook.com/v20.0/${p.instagram_business_account.id}?fields=name,profile_picture_url&access_token=${accessToken}&limit=500`)).json())), { id: p.instagram_business_account.id });
        }));
        return onlyConnectedAccounts.map((p) => ({
            pageId: p.pageId,
            id: p.id,
            name: p.name,
            picture: { data: { url: p.profile_picture_url } },
        }));
    }
    async fetchPageInformation(accessToken, data) {
        const _a = await (await fetch(`https://graph.facebook.com/v20.0/${data.pageId}?fields=access_token,name,picture.type(large)&access_token=${accessToken}`)).json(), { access_token } = _a, all = tslib_1.__rest(_a, ["access_token"]);
        const { id, name, profile_picture_url, username } = await (await fetch(`https://graph.facebook.com/v20.0/${data.id}?fields=username,name,profile_picture_url&access_token=${accessToken}`)).json();
        return {
            id,
            name,
            picture: profile_picture_url,
            access_token,
            username,
        };
    }
    async post(id, accessToken, postDetails, integration, type = 'graph.facebook.com') {
        var _a;
        const [firstPost, ...theRest] = postDetails;
        console.log('in progress', id);
        const isStory = firstPost.settings.post_type === 'story';
        const medias = await Promise.all(((_a = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _a === void 0 ? void 0 : _a.map(async (m) => {
            var _a, _b, _c, _d, _e, _f;
            const caption = ((_a = firstPost.media) === null || _a === void 0 ? void 0 : _a.length) === 1
                ? `&caption=${encodeURIComponent(firstPost.message)}`
                : ``;
            const isCarousel = (((_b = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _b === void 0 ? void 0 : _b.length) || 0) > 1 ? `&is_carousel_item=true` : ``;
            const mediaType = m.path.indexOf('.mp4') > -1
                ? ((_c = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _c === void 0 ? void 0 : _c.length) === 1
                    ? isStory
                        ? `video_url=${m.path}&media_type=STORIES`
                        : `video_url=${m.path}&media_type=REELS&thumb_offset=${(m === null || m === void 0 ? void 0 : m.thumbnailTimestamp) || 0}`
                    : isStory
                        ? `video_url=${m.path}&media_type=STORIES`
                        : `video_url=${m.path}&media_type=VIDEO&thumb_offset=${(m === null || m === void 0 ? void 0 : m.thumbnailTimestamp) || 0}`
                : isStory
                    ? `image_url=${m.path}&media_type=STORIES`
                    : `image_url=${m.path}`;
            console.log('in progress1');
            const collaborators = ((_e = (_d = firstPost === null || firstPost === void 0 ? void 0 : firstPost.settings) === null || _d === void 0 ? void 0 : _d.collaborators) === null || _e === void 0 ? void 0 : _e.length) && !isStory
                ? `&collaborators=${JSON.stringify((_f = firstPost === null || firstPost === void 0 ? void 0 : firstPost.settings) === null || _f === void 0 ? void 0 : _f.collaborators.map((p) => p.label))}`
                : ``;
            console.log(collaborators);
            const { id: photoId } = await (await this.fetch(`https://${type}/v20.0/${id}/media?${mediaType}${isCarousel}${collaborators}&access_token=${accessToken}${caption}`, {
                method: 'POST',
            })).json();
            console.log('in progress2', id);
            let status = 'IN_PROGRESS';
            while (status === 'IN_PROGRESS') {
                const { status_code } = await (await this.fetch(`https://${type}/v20.0/${photoId}?access_token=${accessToken}&fields=status_code`, undefined, '', 0, true)).json();
                await (0, timer_1.timer)(30000);
                status = status_code;
            }
            console.log('in progress3', id);
            return photoId;
        })) || []);
        const arr = [];
        let containerIdGlobal = '';
        let linkGlobal = '';
        if (medias.length === 1) {
            const { id: mediaId } = await (await this.fetch(`https://${type}/v20.0/${id}/media_publish?creation_id=${medias[0]}&access_token=${accessToken}&field=id`, {
                method: 'POST',
            })).json();
            containerIdGlobal = mediaId;
            const { permalink } = await (await this.fetch(`https://${type}/v20.0/${mediaId}?fields=permalink&access_token=${accessToken}`)).json();
            arr.push({
                id: firstPost.id,
                postId: mediaId,
                releaseURL: permalink,
                status: 'success',
            });
            linkGlobal = permalink;
        }
        else {
            const _b = await (await this.fetch(`https://${type}/v20.0/${id}/media?caption=${encodeURIComponent(firstPost === null || firstPost === void 0 ? void 0 : firstPost.message)}&media_type=CAROUSEL&children=${encodeURIComponent(medias.join(','))}&access_token=${accessToken}`, {
                method: 'POST',
            })).json(), { id: containerId } = _b, all3 = tslib_1.__rest(_b, ["id"]);
            let status = 'IN_PROGRESS';
            while (status === 'IN_PROGRESS') {
                const { status_code } = await (await this.fetch(`https://${type}/v20.0/${containerId}?fields=status_code&access_token=${accessToken}`, undefined, '', 0, true)).json();
                await (0, timer_1.timer)(30000);
                status = status_code;
            }
            const _c = await (await this.fetch(`https://${type}/v20.0/${id}/media_publish?creation_id=${containerId}&access_token=${accessToken}&field=id`, {
                method: 'POST',
            })).json(), { id: mediaId } = _c, all4 = tslib_1.__rest(_c, ["id"]);
            containerIdGlobal = mediaId;
            const { permalink } = await (await this.fetch(`https://${type}/v20.0/${mediaId}?fields=permalink&access_token=${accessToken}`)).json();
            arr.push({
                id: firstPost.id,
                postId: mediaId,
                releaseURL: permalink,
                status: 'success',
            });
            linkGlobal = permalink;
        }
        for (const post of theRest) {
            const { id: commentId } = await (await this.fetch(`https://${type}/v20.0/${containerIdGlobal}/comments?message=${encodeURIComponent(post.message)}&access_token=${accessToken}`, {
                method: 'POST',
            })).json();
            arr.push({
                id: firstPost.id,
                postId: commentId,
                releaseURL: linkGlobal,
                status: 'success',
            });
        }
        return arr;
    }
    setTitle(name) {
        switch (name) {
            case "likes": {
                return 'Likes';
            }
            case "followers": {
                return 'Followers';
            }
            case "reach": {
                return 'Reach';
            }
            case "follower_count": {
                return 'Follower Count';
            }
            case "views": {
                return 'Views';
            }
            case "comments": {
                return 'Comments';
            }
            case "shares": {
                return 'Shares';
            }
            case "saves": {
                return 'Saves';
            }
            case "replies": {
                return 'Replies';
            }
        }
        return "";
    }
    async analytics(id, accessToken, date, type = 'graph.facebook.com') {
        const until = (0, dayjs_1.default)().endOf('day').unix();
        const since = (0, dayjs_1.default)().subtract(date, 'day').unix();
        const _a = await (await fetch(`https://${type}/v21.0/${id}/insights?metric=follower_count,reach&access_token=${accessToken}&period=day&since=${since}&until=${until}`)).json(), { data } = _a, all = tslib_1.__rest(_a, ["data"]);
        const _b = await (await fetch(`https://${type}/v21.0/${id}/insights?metric_type=total_value&metric=likes,views,comments,shares,saves,replies&access_token=${accessToken}&period=day&since=${since}&until=${until}`)).json(), { data: data2 } = _b, all2 = tslib_1.__rest(_b, ["data"]);
        const analytics = [];
        analytics.push(...((data === null || data === void 0 ? void 0 : data.map((d) => ({
            label: this.setTitle(d.name),
            percentageChange: 5,
            data: d.values.map((v) => ({
                total: v.value,
                date: (0, dayjs_1.default)(v.end_time).format('YYYY-MM-DD'),
            })),
        }))) || []));
        analytics.push(...data2.map((d) => ({
            label: this.setTitle(d.name),
            percentageChange: 5,
            data: [
                {
                    total: d.total_value.value,
                    date: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                },
                {
                    total: d.total_value.value,
                    date: (0, dayjs_1.default)().add(1, 'day').format('YYYY-MM-DD'),
                },
            ],
        })));
        return analytics;
    }
    music(accessToken, data) {
        return this.fetch(`https://graph.facebook.com/v20.0/music/search?q=${encodeURIComponent(data.q)}&access_token=${accessToken}`);
    }
}
exports.InstagramProvider = InstagramProvider;
//# sourceMappingURL=instagram.provider.js.map