"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MastodonProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
class MastodonProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 5;
        this.identifier = 'mastodon';
        this.name = 'Mastodon';
        this.isBetweenSteps = false;
        this.scopes = ['write:statuses', 'profile', 'write:media'];
        this.editor = 'normal';
    }
    async refreshToken(refreshToken) {
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
    generateUrlDynamic(customUrl, state, clientId, url) {
        return `${customUrl}/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(`${url}/integrations/social/mastodon`)}&scope=${this.scopes.join('+')}&state=${state}`;
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        const url = this.generateUrlDynamic(process.env.MASTODON_URL || 'https://mastodon.social', state, process.env.MASTODON_CLIENT_ID, process.env.FRONTEND_URL);
        return {
            url,
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async dynamicAuthenticate(clientId, clientSecret, url, code) {
        const form = new FormData();
        form.append('client_id', clientId);
        form.append('client_secret', clientSecret);
        form.append('code', code);
        form.append('grant_type', 'authorization_code');
        form.append('redirect_uri', `${process.env.FRONTEND_URL}/integrations/social/mastodon`);
        form.append('scope', this.scopes.join(' '));
        const tokenInformation = await (await this.fetch(`${url}/oauth/token`, {
            method: 'POST',
            body: form,
        })).json();
        const personalInformation = await (await this.fetch(`${url}/api/v1/accounts/verify_credentials`, {
            headers: {
                Authorization: `Bearer ${tokenInformation.access_token}`,
            },
        })).json();
        return {
            id: personalInformation.id,
            name: personalInformation.display_name || personalInformation.acct,
            accessToken: tokenInformation.access_token,
            refreshToken: 'null',
            expiresIn: (0, dayjs_1.default)().add(100, 'years').unix() - (0, dayjs_1.default)().unix(),
            picture: (personalInformation === null || personalInformation === void 0 ? void 0 : personalInformation.avatar) || '',
            username: personalInformation.username,
        };
    }
    async authenticate(params) {
        return this.dynamicAuthenticate(process.env.MASTODON_CLIENT_ID, process.env.MASTODON_CLIENT_SECRET, process.env.MASTODON_URL || 'https://mastodon.social', params.code);
    }
    async uploadFile(instanceUrl, fileUrl, accessToken) {
        const form = new FormData();
        form.append('file', await fetch(fileUrl).then((r) => r.blob()));
        const media = await (await this.fetch(`${instanceUrl}/api/v1/media`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: form,
        })).json();
        return media.id;
    }
    async dynamicPost(id, accessToken, url, postDetails) {
        var _a;
        let loadId = '';
        const ids = [];
        for (const getPost of postDetails) {
            const uploadFiles = await Promise.all(((_a = getPost === null || getPost === void 0 ? void 0 : getPost.media) === null || _a === void 0 ? void 0 : _a.map((media) => this.uploadFile(url, media.path, accessToken))) || []);
            const form = new FormData();
            form.append('status', getPost.message);
            form.append('visibility', 'public');
            if (loadId) {
                form.append('in_reply_to_id', loadId);
            }
            if (uploadFiles.length) {
                for (const file of uploadFiles) {
                    form.append('media_ids[]', file);
                }
            }
            const post = await (await this.fetch(`${url}/api/v1/statuses`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: form,
            })).json();
            ids.push(post.id);
            loadId = loadId || post.id;
        }
        return postDetails.map((p, i) => ({
            id: p.id,
            postId: ids[i],
            releaseURL: `${url}/statuses/${ids[i]}`,
            status: 'completed',
        }));
    }
    async post(id, accessToken, postDetails) {
        return this.dynamicPost(id, accessToken, process.env.MASTODON_URL || 'https://mastodon.social', postDetails);
    }
}
exports.MastodonProvider = MastodonProvider;
//# sourceMappingURL=mastodon.provider.js.map