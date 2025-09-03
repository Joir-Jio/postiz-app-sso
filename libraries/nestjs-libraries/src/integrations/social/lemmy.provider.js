"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LemmyProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const lodash_1 = require("lodash");
class LemmyProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 3;
        this.identifier = 'lemmy';
        this.name = 'Lemmy';
        this.isBetweenSteps = false;
        this.scopes = [];
        this.editor = 'normal';
    }
    async customFields() {
        return [
            {
                key: 'service',
                label: 'Service',
                defaultValue: 'https://lemmy.world',
                validation: `/^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$/`,
                type: 'text',
            },
            {
                key: 'identifier',
                label: 'Identifier',
                validation: `/^.{3,}$/`,
                type: 'text',
            },
            {
                key: 'password',
                label: 'Password',
                validation: `/^.{3,}$/`,
                type: 'password',
            },
        ];
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
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        return {
            url: '',
            codeVerifier: (0, make_is_1.makeId)(10),
            state,
        };
    }
    async authenticate(params) {
        var _a, _b;
        const body = JSON.parse(Buffer.from(params.code, 'base64').toString());
        const load = await fetch(body.service + '/api/v3/user/login', {
            body: JSON.stringify({
                username_or_email: body.identifier,
                password: body.password,
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (load.status === 401) {
            return 'Invalid credentials';
        }
        const { jwt } = await load.json();
        try {
            const user = await (await fetch(body.service + `/api/v3/user?username=${body.identifier}`, {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            })).json();
            return {
                refreshToken: jwt,
                expiresIn: (0, dayjs_1.default)().add(100, 'years').unix() - (0, dayjs_1.default)().unix(),
                accessToken: jwt,
                id: String(user.person_view.person.id),
                name: user.person_view.person.display_name ||
                    user.person_view.person.name ||
                    '',
                picture: ((_b = (_a = user === null || user === void 0 ? void 0 : user.person_view) === null || _a === void 0 ? void 0 : _a.person) === null || _b === void 0 ? void 0 : _b.avatar) || '',
                username: body.identifier || '',
            };
        }
        catch (e) {
            console.log(e);
            return 'Invalid credentials';
        }
    }
    async post(id, accessToken, postDetails, integration) {
        var _a;
        const [firstPost, ...restPosts] = postDetails;
        const body = JSON.parse(auth_service_1.AuthService.fixedDecryption(integration.customInstanceDetails));
        const { jwt } = await (await fetch(body.service + '/api/v3/user/login', {
            body: JSON.stringify({
                username_or_email: body.identifier,
                password: body.password,
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })).json();
        const valueArray = [];
        for (const lemmy of firstPost.settings.subreddit) {
            const _b = await (await fetch(body.service + '/api/v3/post', {
                body: JSON.stringify(Object.assign(Object.assign(Object.assign({ community_id: +lemmy.value.id, name: lemmy.value.title, body: firstPost.message }, (lemmy.value.url ? { url: lemmy.value.url } : {})), (((_a = firstPost.media) === null || _a === void 0 ? void 0 : _a.length)
                    ? { custom_thumbnail: firstPost.media[0].path }
                    : {})), { nsfw: false })),
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    'Content-Type': 'application/json',
                },
            })).json(), { post_view } = _b, all = tslib_1.__rest(_b, ["post_view"]);
            valueArray.push({
                postId: post_view.post.id,
                releaseURL: body.service + '/post/' + post_view.post.id,
                id: firstPost.id,
                status: 'published',
            });
            for (const comment of restPosts) {
                const { comment_view } = await (await fetch(body.service + '/api/v3/comment', {
                    body: JSON.stringify({
                        post_id: post_view.post.id,
                        content: comment.message,
                    }),
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                        'Content-Type': 'application/json',
                    },
                })).json();
                valueArray.push({
                    postId: comment_view.post.id,
                    releaseURL: body.service + '/comment/' + comment_view.comment.id,
                    id: comment.id,
                    status: 'published',
                });
            }
        }
        return Object.values((0, lodash_1.groupBy)(valueArray, (p) => p.id)).map((p) => ({
            id: p[0].id,
            postId: p.map((p) => String(p.postId)).join(','),
            releaseURL: p.map((p) => p.releaseURL).join(','),
            status: 'published',
        }));
    }
    async subreddits(accessToken, data, id, integration) {
        const body = JSON.parse(auth_service_1.AuthService.fixedDecryption(integration.customInstanceDetails));
        const { jwt } = await (await fetch(body.service + '/api/v3/user/login', {
            body: JSON.stringify({
                username_or_email: body.identifier,
                password: body.password,
            }),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })).json();
        const { communities } = await (await fetch(body.service +
            `/api/v3/search?type_=Communities&sort=Active&q=${data.word}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        })).json();
        return communities.map((p) => ({
            title: p.community.title,
            name: p.community.title,
            id: p.community.id,
        }));
    }
}
exports.LemmyProvider = LemmyProvider;
//# sourceMappingURL=lemmy.provider.js.map