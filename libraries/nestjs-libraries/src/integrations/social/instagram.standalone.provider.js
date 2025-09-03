"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramStandaloneProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const instagram_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/instagram.provider");
const instagramProvider = new instagram_provider_1.InstagramProvider();
class InstagramStandaloneProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'instagram-standalone';
        this.name = 'Instagram\n(Standalone)';
        this.isBetweenSteps = false;
        this.scopes = [
            'instagram_business_basic',
            'instagram_business_content_publish',
            'instagram_business_manage_comments',
            'instagram_business_manage_insights',
        ];
        this.maxConcurrentJob = 10;
        this.editor = 'normal';
    }
    handleErrors(body) {
        return instagramProvider.handleErrors(body);
    }
    async refreshToken(refresh_token) {
        const { access_token } = await (await fetch(`https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${refresh_token}`)).json();
        const { user_id, name, username, profile_picture_url = '' } = await (await fetch(`https://graph.instagram.com/v21.0/me?fields=user_id,username,name,profile_picture_url&access_token=${access_token}`)).json();
        return {
            id: user_id,
            name,
            accessToken: access_token,
            refreshToken: access_token,
            expiresIn: (0, dayjs_1.default)().add(59, 'days').unix() - (0, dayjs_1.default)().unix(),
            picture: profile_picture_url || '',
            username,
        };
    }
    async generateAuthUrl() {
        var _a;
        const state = (0, make_is_1.makeId)(6);
        return {
            url: `https://www.instagram.com/oauth/authorize?enable_fb_login=0&client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(`${((_a = process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL) === null || _a === void 0 ? void 0 : _a.indexOf('https')) == -1
                ? `https://redirectmeto.com/${process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL}`
                : `${process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL}`}/integrations/social/instagram-standalone`)}&response_type=code&scope=${encodeURIComponent(this.scopes.join(','))}` + `&state=${state}`,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        var _a;
        const formData = new FormData();
        formData.append('client_id', process.env.INSTAGRAM_APP_ID);
        formData.append('client_secret', process.env.INSTAGRAM_APP_SECRET);
        formData.append('grant_type', 'authorization_code');
        formData.append('redirect_uri', `${((_a = process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL) === null || _a === void 0 ? void 0 : _a.indexOf('https')) == -1
            ? `https://redirectmeto.com/${process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL}`
            : `${process === null || process === void 0 ? void 0 : process.env.FRONTEND_URL}`}/integrations/social/instagram-standalone`);
        formData.append('code', params.code);
        const getAccessToken = await (await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            body: formData,
        })).json();
        const _b = await (await fetch('https://graph.instagram.com/access_token' +
            '?grant_type=ig_exchange_token' +
            `&client_id=${process.env.INSTAGRAM_APP_ID}` +
            `&client_secret=${process.env.INSTAGRAM_APP_SECRET}` +
            `&access_token=${getAccessToken.access_token}`)).json(), { access_token, expires_in } = _b, all = tslib_1.__rest(_b, ["access_token", "expires_in"]);
        this.checkScopes(this.scopes, getAccessToken.permissions);
        const { user_id, name, username, profile_picture_url } = await (await fetch(`https://graph.instagram.com/v21.0/me?fields=user_id,username,name,profile_picture_url&access_token=${access_token}`)).json();
        return {
            id: user_id,
            name,
            accessToken: access_token,
            refreshToken: access_token,
            expiresIn: (0, dayjs_1.default)().add(59, 'days').unix() - (0, dayjs_1.default)().unix(),
            picture: profile_picture_url,
            username,
        };
    }
    async post(id, accessToken, postDetails, integration) {
        return instagramProvider.post(id, accessToken, postDetails, integration, 'graph.instagram.com');
    }
    async analytics(id, accessToken, date) {
        return instagramProvider.analytics(id, accessToken, date, 'graph.instagram.com');
    }
}
exports.InstagramStandaloneProvider = InstagramStandaloneProvider;
//# sourceMappingURL=instagram.standalone.provider.js.map