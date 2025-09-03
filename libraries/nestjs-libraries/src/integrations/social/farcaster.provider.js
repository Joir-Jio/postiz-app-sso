"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarcasterProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const nodejs_sdk_1 = require("@neynar/nodejs-sdk");
const lodash_1 = require("lodash");
const client = new nodejs_sdk_1.NeynarAPIClient({
    apiKey: process.env.NEYNAR_SECRET_KEY || '00000000-000-0000-000-000000000000',
});
class FarcasterProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'wrapcast';
        this.name = 'Warpcast';
        this.isBetweenSteps = false;
        this.isWeb3 = true;
        this.scopes = [];
        this.maxConcurrentJob = 3;
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
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(17);
        return {
            url: `${process.env.NEYNAR_CLIENT_ID}||${state}` || '',
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        const data = JSON.parse(Buffer.from(params.code, 'base64').toString());
        return {
            id: String(data.fid),
            name: data.display_name,
            accessToken: data.signer_uuid,
            refreshToken: '',
            expiresIn: (0, dayjs_1.default)().add(200, 'year').unix() - (0, dayjs_1.default)().unix(),
            picture: (data === null || data === void 0 ? void 0 : data.pfp_url) || '',
            username: data.username,
        };
    }
    async post(id, accessToken, postDetails) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const ids = [];
        const subreddit = !((_b = (_a = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.subreddit) ||
            ((_d = (_c = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _c === void 0 ? void 0 : _c.settings) === null || _d === void 0 ? void 0 : _d.subreddit.length) === 0
            ? [undefined]
            : (_f = (_e = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _e === void 0 ? void 0 : _e.settings) === null || _f === void 0 ? void 0 : _f.subreddit;
        for (const channel of subreddit) {
            let idHash = '';
            for (const post of postDetails) {
                const data = await client.publishCast(Object.assign(Object.assign({ embeds: ((_g = post === null || post === void 0 ? void 0 : post.media) === null || _g === void 0 ? void 0 : _g.map((media) => ({
                        url: media.path,
                    }))) || [], signerUuid: accessToken, text: post.message }, (idHash ? { parent: idHash } : {})), (((_h = channel === null || channel === void 0 ? void 0 : channel.value) === null || _h === void 0 ? void 0 : _h.id) ? { channelId: (_j = channel === null || channel === void 0 ? void 0 : channel.value) === null || _j === void 0 ? void 0 : _j.id } : {})));
                idHash = data.cast.hash;
                ids.push({
                    releaseURL: `https://warpcast.com/${data.cast.author.username}/${idHash}`,
                    status: 'success',
                    id: post.id,
                    postId: data.cast.hash,
                    author: data.cast.author.username,
                });
            }
        }
        const list = Object.values((0, lodash_1.groupBy)(ids, (p) => p.id)).map((p) => ({
            id: p[0].id,
            postId: p.map((p) => String(p.postId)).join(','),
            releaseURL: p.map((p) => p.releaseURL).join(','),
            status: 'published',
        }));
        return list;
    }
    async subreddits(accessToken, data, id, integration) {
        const search = await client.searchChannels({
            q: data.word,
            limit: 10,
        });
        return search.channels.map((p) => {
            return {
                title: p.name,
                name: p.name,
                id: p.id,
            };
        });
    }
}
exports.FarcasterProvider = FarcasterProvider;
//# sourceMappingURL=farcaster.provider.js.map