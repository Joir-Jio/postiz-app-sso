"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinterestProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const axios_1 = tslib_1.__importDefault(require("axios"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const timer_1 = require("@gitroom/helpers/utils/timer");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
class PinterestProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'pinterest';
        this.name = 'Pinterest';
        this.isBetweenSteps = false;
        this.scopes = [
            'boards:read',
            'boards:write',
            'pins:read',
            'pins:write',
            'user_accounts:read',
        ];
        this.maxConcurrentJob = 3;
        this.editor = 'normal';
    }
    handleErrors(body) {
        if (body.indexOf('cover_image_url or cover_image_content_type') > -1) {
            return {
                type: 'bad-body',
                value: 'When uploading a video, you must add also an image to be used as a cover image.',
            };
        }
        return undefined;
    }
    async refreshToken(refreshToken) {
        const { access_token, expires_in } = await (await fetch('https://api.pinterest.com/v5/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                scope: this.scopes.join(','),
                redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/pinterest`,
            }),
        })).json();
        const { id, profile_image, username } = await (await fetch('https://api.pinterest.com/v5/user_account', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        return {
            id: id,
            name: username,
            accessToken: access_token,
            refreshToken: refreshToken,
            expiresIn: expires_in,
            picture: profile_image || '',
            username,
        };
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        return {
            url: `https://www.pinterest.com/oauth/?client_id=${process.env.PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/pinterest`)}&response_type=code&scope=${encodeURIComponent('boards:read,boards:write,pins:read,pins:write,user_accounts:read')}&state=${state}`,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        const { access_token, refresh_token, expires_in, scope } = await (await fetch('https://api.pinterest.com/v5/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: params.code,
                redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/pinterest`,
            }),
        })).json();
        this.checkScopes(this.scopes, scope);
        const { id, profile_image, username } = await (await fetch('https://api.pinterest.com/v5/user_account', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        return {
            id: id,
            name: username,
            accessToken: access_token,
            refreshToken: refresh_token,
            expiresIn: expires_in,
            picture: profile_image,
            username,
        };
    }
    async boards(accessToken) {
        const { items } = await (await fetch('https://api.pinterest.com/v5/boards', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return ((items === null || items === void 0 ? void 0 : items.map((item) => ({
            name: item.name,
            id: item.id,
        }))) || []);
    }
    async post(id, accessToken, postDetails) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        let mediaId = '';
        const findMp4 = (_b = (_a = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.find((p) => { var _a; return (((_a = p.path) === null || _a === void 0 ? void 0 : _a.indexOf('mp4')) || -1) > -1; });
        const picture = (_d = (_c = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _c === void 0 ? void 0 : _c.media) === null || _d === void 0 ? void 0 : _d.find((p) => { var _a; return (((_a = p.path) === null || _a === void 0 ? void 0 : _a.indexOf('mp4')) || -1) === -1; });
        if (findMp4) {
            const { upload_url, media_id, upload_parameters } = await (await this.fetch('https://api.pinterest.com/v5/media', {
                method: 'POST',
                body: JSON.stringify({
                    media_type: 'video',
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            })).json();
            const { data, status } = await axios_1.default.get((_g = (_f = (_e = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _e === void 0 ? void 0 : _e.media) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.path, {
                responseType: 'stream',
            });
            const formData = Object.keys(upload_parameters)
                .filter((f) => f)
                .reduce((acc, key) => {
                acc.append(key, upload_parameters[key]);
                return acc;
            }, new form_data_1.default());
            formData.append('file', data);
            await axios_1.default.post(upload_url, formData);
            let statusCode = '';
            while (statusCode !== 'succeeded') {
                const mediafile = await (await this.fetch('https://api.pinterest.com/v5/media/' + media_id, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }, '', 0, true)).json();
                await (0, timer_1.timer)(30000);
                statusCode = mediafile.status;
            }
            mediaId = media_id;
        }
        const mapImages = (_j = (_h = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _h === void 0 ? void 0 : _h.media) === null || _j === void 0 ? void 0 : _j.map((m) => ({
            path: m.path,
        }));
        const { id: pId } = await (await this.fetch('https://api.pinterest.com/v5/pins', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (((_k = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _k === void 0 ? void 0 : _k.settings.link)
                ? { link: (_l = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _l === void 0 ? void 0 : _l.settings.link }
                : {})), (((_m = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _m === void 0 ? void 0 : _m.settings.title)
                ? { title: (_o = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _o === void 0 ? void 0 : _o.settings.title }
                : {})), { description: (_p = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _p === void 0 ? void 0 : _p.message }), (((_q = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _q === void 0 ? void 0 : _q.settings.dominant_color)
                ? { dominant_color: (_r = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _r === void 0 ? void 0 : _r.settings.dominant_color }
                : {})), { board_id: (_s = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _s === void 0 ? void 0 : _s.settings.board, media_source: mediaId
                    ? {
                        source_type: 'video_id',
                        media_id: mediaId,
                        cover_image_url: picture === null || picture === void 0 ? void 0 : picture.path,
                    }
                    : (mapImages === null || mapImages === void 0 ? void 0 : mapImages.length) === 1
                        ? {
                            source_type: 'image_url',
                            url: (_t = mapImages === null || mapImages === void 0 ? void 0 : mapImages[0]) === null || _t === void 0 ? void 0 : _t.path,
                        }
                        : {
                            source_type: 'multiple_image_urls',
                            items: mapImages,
                        } })),
        })).json();
        return [
            {
                id: (_u = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _u === void 0 ? void 0 : _u.id,
                postId: pId,
                releaseURL: `https://www.pinterest.com/pin/${pId}`,
                status: 'success',
            },
        ];
    }
    async analytics(id, accessToken, date) {
        const until = (0, dayjs_1.default)().format('YYYY-MM-DD');
        const since = (0, dayjs_1.default)().subtract(date, 'day').format('YYYY-MM-DD');
        const { all: { daily_metrics }, } = await (await fetch(`https://api.pinterest.com/v5/user_account/analytics?start_date=${since}&end_date=${until}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        })).json();
        return daily_metrics.reduce((acc, item) => {
            if (typeof item.metrics.PIN_CLICK_RATE !== 'undefined') {
                acc[0].data.push({
                    date: item.date,
                    total: item.metrics.PIN_CLICK_RATE,
                });
                acc[1].data.push({
                    date: item.date,
                    total: item.metrics.IMPRESSION,
                });
                acc[2].data.push({
                    date: item.date,
                    total: item.metrics.PIN_CLICK,
                });
                acc[3].data.push({
                    date: item.date,
                    total: item.metrics.ENGAGEMENT,
                });
                acc[4].data.push({
                    date: item.date,
                    total: item.metrics.SAVE,
                });
            }
            return acc;
        }, [
            { label: 'Pin click rate', data: [] },
            { label: 'Impressions', data: [] },
            { label: 'Pin Clicks', data: [] },
            { label: 'Engagement', data: [] },
            { label: 'Saves', data: [] },
        ]);
    }
}
exports.PinterestProvider = PinterestProvider;
//# sourceMappingURL=pinterest.provider.js.map