"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiktokProvider = void 0;
const tslib_1 = require("tslib");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const timer_1 = require("@gitroom/helpers/utils/timer");
class TiktokProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'tiktok';
        this.name = 'Tiktok';
        this.isBetweenSteps = false;
        this.convertToJPEG = true;
        this.scopes = [
            'user.info.basic',
            'video.publish',
            'video.upload',
            'user.info.profile',
        ];
        this.maxConcurrentJob = 1;
        this.editor = 'normal';
    }
    handleErrors(body) {
        if (body.indexOf('access_token_invalid') > -1) {
            return {
                type: 'refresh-token',
                value: 'Access token invalid, please re-authenticate your TikTok account',
            };
        }
        if (body.indexOf('scope_not_authorized') > -1) {
            return {
                type: 'refresh-token',
                value: 'Missing required permissions, please re-authenticate with all scopes',
            };
        }
        if (body.indexOf('scope_permission_missed') > -1) {
            return {
                type: 'refresh-token',
                value: 'Additional permissions required, please re-authenticate',
            };
        }
        if (body.indexOf('rate_limit_exceeded') > -1) {
            return {
                type: 'bad-body',
                value: 'TikTok API rate limit exceeded, please try again later',
            };
        }
        if (body.indexOf('file_format_check_failed') > -1) {
            return {
                type: 'bad-body',
                value: 'File format is invalid, please check video specifications',
            };
        }
        if (body.indexOf('duration_check_failed') > -1) {
            return {
                type: 'bad-body',
                value: 'Video duration is invalid, please check video specifications',
            };
        }
        if (body.indexOf('frame_rate_check_failed') > -1) {
            return {
                type: 'bad-body',
                value: 'Video frame rate is invalid, please check video specifications',
            };
        }
        if (body.indexOf('video_pull_failed') > -1) {
            return {
                type: 'bad-body',
                value: 'Failed to pull video from URL, please check the URL',
            };
        }
        if (body.indexOf('photo_pull_failed') > -1) {
            return {
                type: 'bad-body',
                value: 'Failed to pull photo from URL, please check the URL',
            };
        }
        if (body.indexOf('spam_risk_user_banned_from_posting') > -1) {
            return {
                type: 'bad-body',
                value: 'Account banned from posting, please check TikTok account status',
            };
        }
        if (body.indexOf('spam_risk_text') > -1) {
            return {
                type: 'bad-body',
                value: 'TikTok detected potential spam in the post text',
            };
        }
        if (body.indexOf('spam_risk') > -1) {
            return {
                type: 'bad-body',
                value: 'TikTok detected potential spam',
            };
        }
        if (body.indexOf('spam_risk_too_many_posts') > -1) {
            return {
                type: 'bad-body',
                value: 'Daily post limit reached, please try again tomorrow',
            };
        }
        if (body.indexOf('spam_risk_user_banned_from_posting') > -1) {
            return {
                type: 'bad-body',
                value: 'Account banned from posting, please check TikTok account status',
            };
        }
        if (body.indexOf('reached_active_user_cap') > -1) {
            return {
                type: 'bad-body',
                value: 'Daily active user quota reached, please try again later',
            };
        }
        if (body.indexOf('unaudited_client_can_only_post_to_private_accounts') > -1) {
            return {
                type: 'bad-body',
                value: 'App not approved for public posting, contact support',
            };
        }
        if (body.indexOf('url_ownership_unverified') > -1) {
            return {
                type: 'bad-body',
                value: 'URL ownership not verified, please verify domain ownership',
            };
        }
        if (body.indexOf('privacy_level_option_mismatch') > -1) {
            return {
                type: 'bad-body',
                value: 'Privacy level mismatch, please check privacy settings',
            };
        }
        if (body.indexOf('invalid_file_upload') > -1) {
            return {
                type: 'bad-body',
                value: 'Invalid file format or specifications not met',
            };
        }
        if (body.indexOf('invalid_params') > -1) {
            return {
                type: 'bad-body',
                value: 'Invalid request parameters, please check content format',
            };
        }
        if (body.indexOf('internal') > -1) {
            return {
                type: 'bad-body',
                value: 'There is a problem with TikTok servers, please try again later',
            };
        }
        if (body.indexOf('picture_size_check_failed') > -1) {
            return {
                type: 'bad-body',
                value: 'Picture / Video size is invalid, must be at least 720p',
            };
        }
        if (body.indexOf('TikTok API error') > -1) {
            return {
                type: 'bad-body',
                value: 'TikTok API error, please try again',
            };
        }
        return undefined;
    }
    async refreshToken(refreshToken) {
        const value = {
            client_key: process.env.TIKTOK_CLIENT_ID,
            client_secret: process.env.TIKTOK_CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        };
        const _a = await (await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: new URLSearchParams(value).toString(),
        })).json(), { access_token, refresh_token } = _a, all = tslib_1.__rest(_a, ["access_token", "refresh_token"]);
        const { data: { user: { avatar_url, display_name, open_id, username }, }, } = await (await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,union_id,username', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        return {
            refreshToken: refresh_token,
            expiresIn: (0, dayjs_1.default)().add(23, 'hours').unix() - (0, dayjs_1.default)().unix(),
            accessToken: access_token,
            id: open_id.replace(/-/g, ''),
            name: display_name,
            picture: avatar_url || '',
            username: username,
        };
    }
    async generateAuthUrl() {
        var _a, _b, _c;
        const state = Math.random().toString(36).substring(2);
        return {
            url: 'https://www.tiktok.com/v2/auth/authorize/' +
                `?client_key=${process.env.TIKTOK_CLIENT_ID}` +
                `&redirect_uri=${encodeURIComponent(`${((_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.FRONTEND_URL) === null || _b === void 0 ? void 0 : _b.indexOf('https')) === -1
                    ? 'https://redirectmeto.com/'
                    : ''}${(_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.FRONTEND_URL}/integrations/social/tiktok`)}` +
                `&state=${state}` +
                `&response_type=code` +
                `&scope=${encodeURIComponent(this.scopes.join(','))}`,
            codeVerifier: state,
            state,
        };
    }
    async authenticate(params) {
        var _a, _b, _c;
        const value = {
            client_key: process.env.TIKTOK_CLIENT_ID,
            client_secret: process.env.TIKTOK_CLIENT_SECRET,
            code: params.code,
            grant_type: 'authorization_code',
            code_verifier: params.codeVerifier,
            redirect_uri: `${((_b = (_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.FRONTEND_URL) === null || _b === void 0 ? void 0 : _b.indexOf('https')) === -1
                ? 'https://redirectmeto.com/'
                : ''}${(_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.FRONTEND_URL}/integrations/social/tiktok`,
        };
        const { access_token, refresh_token, scope } = await (await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
            body: new URLSearchParams(value).toString(),
        })).json();
        console.log(this.scopes, scope);
        this.checkScopes(this.scopes, scope);
        const { data: { user: { avatar_url, display_name, open_id, username }, }, } = await (await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,union_id,username', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        return {
            id: open_id.replace(/-/g, ''),
            name: display_name,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: (0, dayjs_1.default)().add(23, 'hours').unix() - (0, dayjs_1.default)().unix(),
            picture: avatar_url,
            username: username,
        };
    }
    async maxVideoLength(accessToken) {
        const { data: { max_video_post_duration_sec }, } = await (await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return {
            maxDurationSeconds: max_video_post_duration_sec,
        };
    }
    async uploadedVideoSuccess(id, publishId, accessToken) {
        while (true) {
            const post = await (await this.fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    publish_id: publishId,
                }),
            }, '', 0, true)).json();
            const { status, publicaly_available_post_id } = post.data;
            if (status === 'PUBLISH_COMPLETE') {
                return {
                    url: !publicaly_available_post_id
                        ? `https://www.tiktok.com/@${id}`
                        : `https://www.tiktok.com/@${id}/video/` +
                            publicaly_available_post_id,
                    id: !publicaly_available_post_id
                        ? publishId
                        : publicaly_available_post_id === null || publicaly_available_post_id === void 0 ? void 0 : publicaly_available_post_id[0],
                };
            }
            if (status === 'FAILED') {
                const handleError = this.handleErrors(JSON.stringify(post));
                throw new social_abstract_1.BadBody('titok-error-upload', JSON.stringify(post), Buffer.from(JSON.stringify(post)), (handleError === null || handleError === void 0 ? void 0 : handleError.value) || '');
            }
            await (0, timer_1.timer)(10000);
        }
    }
    postingMethod(method, isPhoto) {
        switch (method) {
            case 'UPLOAD':
                return isPhoto ? '/content/init/' : '/inbox/video/init/';
            case 'DIRECT_POST':
            default:
                return isPhoto ? '/content/init/' : '/video/init/';
        }
    }
    async post(id, accessToken, postDetails, integration) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
        const [firstPost] = postDetails;
        const isPhoto = (((_c = (_b = (_a = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) === null || _c === void 0 ? void 0 : _c.indexOf('mp4')) || -1) === -1;
        const { data: { publish_id }, } = await (await this.fetch(`https://open.tiktokapis.com/v2/post/publish${this.postingMethod(firstPost.settings.content_posting_method, (((_f = (_e = (_d = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.path) === null || _f === void 0 ? void 0 : _f.indexOf('mp4')) || -1) === -1)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(Object.assign(Object.assign({}, ((((_g = firstPost === null || firstPost === void 0 ? void 0 : firstPost.settings) === null || _g === void 0 ? void 0 : _g.content_posting_method) ||
                'DIRECT_POST') === 'DIRECT_POST'
                ? {
                    post_info: Object.assign(Object.assign(Object.assign(Object.assign({}, ((((_h = firstPost === null || firstPost === void 0 ? void 0 : firstPost.settings) === null || _h === void 0 ? void 0 : _h.title) && isPhoto) ||
                        (firstPost.message && !isPhoto)
                        ? {
                            title: isPhoto
                                ? firstPost.settings.title
                                : firstPost.message,
                        }
                        : {})), (isPhoto ? { description: firstPost.message } : {})), { privacy_level: firstPost.settings.privacy_level || 'PUBLIC_TO_EVERYONE', disable_duet: !firstPost.settings.duet || false, disable_comment: !firstPost.settings.comment || false, disable_stitch: !firstPost.settings.stitch || false, is_aigc: firstPost.settings.video_made_with_ai || false, brand_content_toggle: firstPost.settings.brand_content_toggle || false, brand_organic_toggle: firstPost.settings.brand_organic_toggle || false }), ((((_l = (_k = (_j = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.path) === null || _l === void 0 ? void 0 : _l.indexOf('mp4')) || -1) ===
                        -1
                        ? {
                            auto_add_music: firstPost.settings.autoAddMusic === 'yes',
                        }
                        : {})),
                }
                : {})), ((((_p = (_o = (_m = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.path) === null || _p === void 0 ? void 0 : _p.indexOf('mp4')) || -1) > -1
                ? {
                    source_info: Object.assign({ source: 'PULL_FROM_URL', video_url: (_r = (_q = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.path }, (((_t = (_s = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _s === void 0 ? void 0 : _s[0]) === null || _t === void 0 ? void 0 : _t.thumbnailTimestamp)
                        ? {
                            video_cover_timestamp_ms: (_v = (_u = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _u === void 0 ? void 0 : _u[0]) === null || _v === void 0 ? void 0 : _v.thumbnailTimestamp,
                        }
                        : {})),
                }
                : {
                    source_info: {
                        source: 'PULL_FROM_URL',
                        photo_cover_index: 0,
                        photo_images: (_w = firstPost.media) === null || _w === void 0 ? void 0 : _w.map((p) => p.path),
                    },
                    post_mode: ((_x = firstPost === null || firstPost === void 0 ? void 0 : firstPost.settings) === null || _x === void 0 ? void 0 : _x.content_posting_method) ===
                        'DIRECT_POST'
                        ? 'DIRECT_POST'
                        : 'MEDIA_UPLOAD',
                    media_type: 'PHOTO',
                }))),
        })).json();
        const { url, id: videoId } = await this.uploadedVideoSuccess(integration.profile, publish_id, accessToken);
        return [
            {
                id: firstPost.id,
                releaseURL: url,
                postId: String(videoId),
                status: 'success',
            },
        ];
    }
}
exports.TiktokProvider = TiktokProvider;
//# sourceMappingURL=tiktok.provider.js.map