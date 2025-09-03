"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DribbbleProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const axios_1 = tslib_1.__importDefault(require("axios"));
const form_data_1 = tslib_1.__importDefault(require("form-data"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const mime_types_1 = tslib_1.__importDefault(require("mime-types"));
class DribbbleProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 3;
        this.identifier = 'dribbble';
        this.name = 'Dribbble';
        this.isBetweenSteps = false;
        this.scopes = ['public', 'upload'];
        this.editor = 'normal';
    }
    async refreshToken(refreshToken) {
        const { access_token, expires_in } = await (await this.fetch('https://api-sandbox.pinterest.com/v5/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${process.env.PINTEREST_CLIENT_ID}:${process.env.PINTEREST_CLIENT_SECRET}`).toString('base64')}`,
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
                scope: `${this.scopes.join(',')}`,
                redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/pinterest`,
            }),
        })).json();
        const { id, profile_image, username } = await (await this.fetch('https://api-sandbox.pinterest.com/v5/user_account', {
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
    async teams(accessToken) {
        const { teams } = await (await this.fetch('https://api.dribbble.com/v2/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return ((teams === null || teams === void 0 ? void 0 : teams.map((team) => ({
            id: team.id,
            name: team.name,
        }))) || []);
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        return {
            url: `https://dribbble.com/oauth/authorize?client_id=${process.env.DRIBBBLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/dribbble`)}&response_type=code&scope=${this.scopes.join('+')}&state=${state}`,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        const { access_token, scope } = await (await this.fetch(`https://dribbble.com/oauth/token?client_id=${process.env.DRIBBBLE_CLIENT_ID}&client_secret=${process.env.DRIBBBLE_CLIENT_SECRET}&code=${params.code}&redirect_uri=${process.env.FRONTEND_URL}/integrations/social/dribbble`, {
            method: 'POST',
        })).json();
        this.checkScopes(this.scopes, scope);
        const { id, name, avatar_url, login } = await (await this.fetch('https://api.dribbble.com/v2/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })).json();
        return {
            id: id,
            name,
            accessToken: access_token,
            refreshToken: '',
            expiresIn: 999999999,
            picture: avatar_url,
            username: login,
        };
    }
    async post(id, accessToken, postDetails) {
        var _a, _b, _c, _d, _e, _f, _g;
        const { data, status } = await axios_1.default.get((_c = (_b = (_a = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.path, {
            responseType: 'stream',
        });
        const slash = (_f = (_e = (_d = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _d === void 0 ? void 0 : _d.media) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.path.split('/').at(-1);
        const formData = new form_data_1.default();
        formData.append('image', data, {
            filename: slash,
            contentType: mime_types_1.default.lookup(slash) || '',
        });
        formData.append('title', postDetails[0].settings.title);
        formData.append('description', postDetails[0].message);
        const data2 = await axios_1.default.post('https://api.dribbble.com/v2/shots', formData, {
            headers: Object.assign(Object.assign({}, formData.getHeaders()), { Authorization: `Bearer ${accessToken}` }),
        });
        const location = data2.headers['location'];
        const newId = location.split('/').at(-1);
        return [
            {
                id: (_g = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _g === void 0 ? void 0 : _g.id,
                status: 'completed',
                postId: newId,
                releaseURL: `https://dribbble.com/shots/${newId}`,
            },
        ];
    }
    analytics(id, accessToken, date) {
        return Promise.resolve([]);
    }
}
exports.DribbbleProvider = DribbbleProvider;
//# sourceMappingURL=dribbble.provider.js.map