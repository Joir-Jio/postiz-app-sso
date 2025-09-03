"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacebookProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
class FacebookProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'facebook';
        this.name = 'Facebook Page';
        this.isBetweenSteps = true;
        this.scopes = [
            'pages_show_list',
            'business_management',
            'pages_manage_posts',
            'pages_manage_engagement',
            'pages_read_engagement',
            'read_insights',
        ];
        this.maxConcurrentJob = 3;
        this.editor = 'normal';
    }
    handleErrors(body) {
        if (body.indexOf('Error validating access token') > -1) {
            return {
                type: 'refresh-token',
                value: 'Please re-authenticate your Facebook account',
            };
        }
        if (body.indexOf('490') > -1) {
            return {
                type: 'refresh-token',
                value: 'Access token expired, please re-authenticate',
            };
        }
        if (body.indexOf('REVOKED_ACCESS_TOKEN') > -1) {
            return {
                type: 'refresh-token',
                value: 'Access token has been revoked, please re-authenticate',
            };
        }
        if (body.indexOf('1366046') > -1) {
            return {
                type: 'bad-body',
                value: 'Photos should be smaller than 4 MB and saved as JPG, PNG',
            };
        }
        if (body.indexOf('1390008') > -1) {
            return {
                type: 'bad-body',
                value: 'You are posting too fast, please slow down',
            };
        }
        if (body.indexOf('1346003') > -1) {
            return {
                type: 'bad-body',
                value: 'Content flagged as abusive by Facebook',
            };
        }
        if (body.indexOf('1404006') > -1) {
            return {
                type: 'bad-body',
                value: "We couldn't post your comment, A security check in facebook required to proceed.",
            };
        }
        if (body.indexOf('1404102') > -1) {
            return {
                type: 'bad-body',
                value: 'Content violates Facebook Community Standards',
            };
        }
        if (body.indexOf('1404078') > -1) {
            return {
                type: 'refresh-token',
                value: 'Page publishing authorization required, please re-authenticate',
            };
        }
        if (body.indexOf('1609008') > -1) {
            return {
                type: 'bad-body',
                value: 'Cannot post Facebook.com links',
            };
        }
        if (body.indexOf('2061006') > -1) {
            return {
                type: 'bad-body',
                value: 'Invalid URL format in post content',
            };
        }
        if (body.indexOf('1349125') > -1) {
            return {
                type: 'bad-body',
                value: 'Invalid content format',
            };
        }
        if (body.indexOf('Name parameter too long') > -1) {
            return {
                type: 'bad-body',
                value: 'Post content is too long',
            };
        }
        if (body.indexOf('1363047') > -1) {
            return {
                type: 'bad-body',
                value: 'Facebook service temporarily unavailable',
            };
        }
        if (body.indexOf('1609010') > -1) {
            return {
                type: 'bad-body',
                value: 'Facebook service temporarily unavailable',
            };
        }
        return undefined;
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
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        return {
            url: 'https://www.facebook.com/v20.0/dialog/oauth' +
                `?client_id=${process.env.FACEBOOK_APP_ID}` +
                `&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/facebook`)}` +
                `&state=${state}` +
                `&scope=${this.scopes.join(',')}`,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async reConnect(id, requiredId, accessToken) {
        const information = await this.fetchPageInformation(accessToken, requiredId);
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
    async authenticate(params) {
        var _a;
        const getAccessToken = await (await fetch('https://graph.facebook.com/v20.0/oauth/access_token' +
            `?client_id=${process.env.FACEBOOK_APP_ID}` +
            `&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/facebook${params.refresh ? `?refresh=${params.refresh}` : ''}`)}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&code=${params.code}`)).json();
        const { access_token } = await (await fetch('https://graph.facebook.com/v20.0/oauth/access_token' +
            '?grant_type=fb_exchange_token' +
            `&client_id=${process.env.FACEBOOK_APP_ID}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&fb_exchange_token=${getAccessToken.access_token}&fields=access_token,expires_in`)).json();
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
        const { data } = await (await fetch(`https://graph.facebook.com/v20.0/me/accounts?fields=id,username,name,picture.type(large)&access_token=${accessToken}`)).json();
        return data;
    }
    async fetchPageInformation(accessToken, pageId) {
        const { id, name, access_token, username, picture: { data: { url }, }, } = await (await fetch(`https://graph.facebook.com/v20.0/${pageId}?fields=username,access_token,name,picture.type(large)&access_token=${accessToken}`)).json();
        return {
            id,
            name,
            access_token,
            picture: url,
            username,
        };
    }
    async post(id, accessToken, postDetails) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const [firstPost, ...comments] = postDetails;
        let finalId = '';
        let finalUrl = '';
        if ((((_c = (_b = (_a = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c.indexOf('mp4')) || -2) > -1) {
            const _j = await (await this.fetch(`https://graph.facebook.com/v20.0/${id}/videos?access_token=${accessToken}&fields=id,permalink_url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file_url: (_e = (_d = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.path,
                    description: firstPost.message,
                    published: true,
                }),
            }, 'upload mp4')).json(), { id: videoId, permalink_url } = _j, all = tslib_1.__rest(_j, ["id", "permalink_url"]);
            finalUrl = 'https://www.facebook.com/reel/' + videoId;
            finalId = videoId;
        }
        else {
            const uploadPhotos = !((_f = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _f === void 0 ? void 0 : _f.length)
                ? []
                : await Promise.all(firstPost.media.map(async (media) => {
                    const { id: photoId } = await (await this.fetch(`https://graph.facebook.com/v20.0/${id}/photos?access_token=${accessToken}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            url: media.path,
                            published: false,
                        }),
                    }, 'upload images slides')).json();
                    return { media_fbid: photoId };
                }));
            const _k = await (await this.fetch(`https://graph.facebook.com/v20.0/${id}/feed?access_token=${accessToken}&fields=id,permalink_url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.assign(Object.assign(Object.assign({}, ((uploadPhotos === null || uploadPhotos === void 0 ? void 0 : uploadPhotos.length) ? { attached_media: uploadPhotos } : {})), (((_g = firstPost === null || firstPost === void 0 ? void 0 : firstPost.settings) === null || _g === void 0 ? void 0 : _g.url)
                    ? { link: firstPost.settings.url }
                    : {})), { message: firstPost.message, published: true })),
            }, 'finalize upload')).json(), { id: postId, permalink_url } = _k, all = tslib_1.__rest(_k, ["id", "permalink_url"]);
            finalUrl = permalink_url;
            finalId = postId;
        }
        const postsArray = [];
        let commentId = finalId;
        for (const comment of comments) {
            const data = await (await this.fetch(`https://graph.facebook.com/v20.0/${commentId}/comments?access_token=${accessToken}&fields=id,permalink_url`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Object.assign(Object.assign({}, (((_h = comment.media) === null || _h === void 0 ? void 0 : _h.length)
                    ? { attachment_url: comment.media[0].path }
                    : {})), { message: comment.message })),
            }, 'add comment')).json();
            commentId = data.id;
            postsArray.push({
                id: comment.id,
                postId: data.id,
                releaseURL: data.permalink_url,
                status: 'success',
            });
        }
        return [
            {
                id: firstPost.id,
                postId: finalId,
                releaseURL: finalUrl,
                status: 'success',
            },
            ...postsArray,
        ];
    }
    async analytics(id, accessToken, date) {
        const until = (0, dayjs_1.default)().endOf('day').unix();
        const since = (0, dayjs_1.default)().subtract(date, 'day').unix();
        const { data } = await (await fetch(`https://graph.facebook.com/v20.0/${id}/insights?metric=page_impressions_unique,page_posts_impressions_unique,page_post_engagements,page_daily_follows,page_video_views&access_token=${accessToken}&period=day&since=${since}&until=${until}`)).json();
        return ((data === null || data === void 0 ? void 0 : data.map((d) => {
            var _a;
            return ({
                label: d.name === 'page_impressions_unique'
                    ? 'Page Impressions'
                    : d.name === 'page_post_engagements'
                        ? 'Posts Engagement'
                        : d.name === 'page_daily_follows'
                            ? 'Page followers'
                            : d.name === 'page_video_views'
                                ? 'Videos views'
                                : 'Posts Impressions',
                percentageChange: 5,
                data: (_a = d === null || d === void 0 ? void 0 : d.values) === null || _a === void 0 ? void 0 : _a.map((v) => ({
                    total: v.value,
                    date: (0, dayjs_1.default)(v.end_time).format('YYYY-MM-DD'),
                })),
            });
        })) || []);
    }
}
exports.FacebookProvider = FacebookProvider;
//# sourceMappingURL=facebook.provider.js.map