"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XProvider = void 0;
const tslib_1 = require("tslib");
const twitter_api_v2_1 = require("twitter-api-v2");
const mime_types_1 = require("mime-types");
const sharp_1 = tslib_1.__importDefault(require("sharp"));
const read_or_fetch_1 = require("@gitroom/helpers/utils/read.or.fetch");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const plug_decorator_1 = require("@gitroom/helpers/decorators/plug.decorator");
const timer_1 = require("@gitroom/helpers/utils/timer");
const post_plug_1 = require("@gitroom/helpers/decorators/post.plug");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const lodash_1 = require("lodash");
const strip_html_validation_1 = require("@gitroom/helpers/utils/strip.html.validation");
class XProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.identifier = 'x';
        this.name = 'X';
        this.isBetweenSteps = false;
        this.scopes = [];
        this.maxConcurrentJob = 1;
        this.toolTip = 'You will be logged in into your current account, if you would like a different account, change it first on X';
        this.editor = 'normal';
        this.loadAllTweets = async (client, id, until, since, token = '') => {
            const tweets = await client.v2.userTimeline(id, Object.assign({ 'tweet.fields': ['id'], 'user.fields': [], 'poll.fields': [], 'place.fields': [], 'media.fields': [], exclude: ['replies', 'retweets'], start_time: since, end_time: until, max_results: 100 }, (token ? { pagination_token: token } : {})));
            return [
                ...tweets.data.data,
                ...(tweets.data.data.length === 100
                    ? await this.loadAllTweets(client, id, until, since, tweets.meta.next_token)
                    : []),
            ];
        };
    }
    handleErrors(body) {
        if (body.includes('usage-capped')) {
            return {
                type: 'refresh-token',
                value: 'Posting failed - capped reached. Please try again later',
            };
        }
        if (body.includes('duplicate-rules')) {
            return {
                type: 'refresh-token',
                value: 'You have already posted this post, please wait before posting again',
            };
        }
        if (body.includes('The Tweet contains an invalid URL.')) {
            return {
                type: 'bad-body',
                value: 'The Tweet contains a URL that is not allowed on X',
            };
        }
        if (body.includes('This user is not allowed to post a video longer than 2 minutes')) {
            return {
                type: 'bad-body',
                value: 'The video you are trying to post is longer than 2 minutes, which is not allowed for this account',
            };
        }
        return undefined;
    }
    async autoRepostPost(integration, id, fields) {
        const [accessTokenSplit, accessSecretSplit] = integration.token.split(':');
        const client = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
            accessToken: accessTokenSplit,
            accessSecret: accessSecretSplit,
        });
        if ((await client.v2.tweetLikedBy(id)).meta.result_count >=
            +fields.likesAmount) {
            await (0, timer_1.timer)(2000);
            await client.v2.retweet(integration.internalId, id);
            return true;
        }
        return false;
    }
    async repostPostUsers(integration, originalIntegration, postId, information) {
        const [accessTokenSplit, accessSecretSplit] = integration.token.split(':');
        const client = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
            accessToken: accessTokenSplit,
            accessSecret: accessSecretSplit,
        });
        const { data: { id }, } = await client.v2.me();
        try {
            await client.v2.retweet(id, postId);
        }
        catch (err) {
        }
    }
    async autoPlugPost(integration, id, fields) {
        const [accessTokenSplit, accessSecretSplit] = integration.token.split(':');
        const client = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
            accessToken: accessTokenSplit,
            accessSecret: accessSecretSplit,
        });
        if ((await client.v2.tweetLikedBy(id)).meta.result_count >=
            +fields.likesAmount) {
            await (0, timer_1.timer)(2000);
            await client.v2.tweet({
                text: (0, strip_html_validation_1.stripHtmlValidation)('normal', fields.post, true),
                reply: { in_reply_to_tweet_id: id },
            });
            return true;
        }
        return false;
    }
    async refreshToken() {
        return {
            id: '',
            name: '',
            accessToken: '',
            refreshToken: '',
            expiresIn: 0,
            picture: '',
            username: '',
        };
    }
    async generateAuthUrl() {
        const client = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
        });
        const { url, oauth_token, oauth_token_secret } = await client.generateAuthLink((process.env.X_URL || process.env.FRONTEND_URL) +
            `/integrations/social/x`, {
            authAccessType: 'write',
            linkMode: 'authenticate',
            forceLogin: false,
        });
        return {
            url,
            codeVerifier: oauth_token + ':' + oauth_token_secret,
            state: oauth_token,
        };
    }
    async authenticate(params) {
        const { code, codeVerifier } = params;
        const [oauth_token, oauth_token_secret] = codeVerifier.split(':');
        const startingClient = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
            accessToken: oauth_token,
            accessSecret: oauth_token_secret,
        });
        const { accessToken, client, accessSecret } = await startingClient.login(code);
        const { data: { username, verified, profile_image_url, name, id }, } = await client.v2.me({
            'user.fields': [
                'username',
                'verified',
                'verified_type',
                'profile_image_url',
                'name',
            ],
        });
        return {
            id: String(id),
            accessToken: accessToken + ':' + accessSecret,
            name,
            refreshToken: '',
            expiresIn: 999999999,
            picture: profile_image_url || '',
            username,
            additionalSettings: [
                {
                    title: 'Verified',
                    description: 'Is this a verified user? (Premium)',
                    type: 'checkbox',
                    value: verified,
                },
            ],
        };
    }
    async post(id, accessToken, postDetails) {
        var _a, _b;
        const [accessTokenSplit, accessSecretSplit] = accessToken.split(':');
        const client = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
            accessToken: accessTokenSplit,
            accessSecret: accessSecretSplit,
        });
        const { data: { username }, } = await this.runInConcurrent(async () => client.v2.me({
            'user.fields': 'username',
        }));
        const uploadAll = (await Promise.all(postDetails.flatMap((p) => {
            var _a;
            return (_a = p === null || p === void 0 ? void 0 : p.media) === null || _a === void 0 ? void 0 : _a.flatMap(async (m) => {
                return {
                    id: await this.runInConcurrent(async () => client.v1.uploadMedia(m.path.indexOf('mp4') > -1
                        ? Buffer.from(await (0, read_or_fetch_1.readOrFetch)(m.path))
                        : await (0, sharp_1.default)(await (0, read_or_fetch_1.readOrFetch)(m.path), {
                            animated: (0, mime_types_1.lookup)(m.path) === 'image/gif',
                        })
                            .resize({
                            width: 1000,
                        })
                            .gif()
                            .toBuffer(), {
                        mimeType: (0, mime_types_1.lookup)(m.path) || '',
                    }), true),
                    postId: p.id,
                };
            });
        }))).reduce((acc, val) => {
            if (!(val === null || val === void 0 ? void 0 : val.id)) {
                return acc;
            }
            acc[val.postId] = acc[val.postId] || [];
            acc[val.postId].push(val.id);
            return acc;
        }, {});
        const ids = [];
        for (const post of postDetails) {
            const media_ids = (uploadAll[post.id] || []).filter((f) => f);
            const { data } = await this.runInConcurrent(async () => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                return client.v2.tweet(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (!((_b = (_a = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.who_can_reply_post) ||
                    ((_d = (_c = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _c === void 0 ? void 0 : _c.settings) === null || _d === void 0 ? void 0 : _d.who_can_reply_post) === 'everyone'
                    ? {}
                    : {
                        reply_settings: (_f = (_e = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _e === void 0 ? void 0 : _e.settings) === null || _f === void 0 ? void 0 : _f.who_can_reply_post,
                    })), (((_h = (_g = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _g === void 0 ? void 0 : _g.settings) === null || _h === void 0 ? void 0 : _h.community)
                    ? {
                        community_id: ((_l = (_k = (_j = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _j === void 0 ? void 0 : _j.settings) === null || _k === void 0 ? void 0 : _k.community) === null || _l === void 0 ? void 0 : _l.split('/').pop()) ||
                            '',
                    }
                    : {})), { text: post.message }), (media_ids.length ? { media: { media_ids } } : {})), (ids.length
                    ? { reply: { in_reply_to_tweet_id: ids[ids.length - 1].postId } }
                    : {})));
            });
            ids.push({
                postId: data.id,
                id: post.id,
                releaseURL: `https://twitter.com/${username}/status/${data.id}`,
            });
        }
        if ((_b = (_a = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.active_thread_finisher) {
            try {
                await this.runInConcurrent(async () => {
                    var _a, _b;
                    return client.v2.tweet({
                        text: ((_b = (_a = postDetails === null || postDetails === void 0 ? void 0 : postDetails[0]) === null || _a === void 0 ? void 0 : _a.settings) === null || _b === void 0 ? void 0 : _b.thread_finisher) +
                            '\n' +
                            ids[0].releaseURL,
                        reply: { in_reply_to_tweet_id: ids[ids.length - 1].postId },
                    });
                });
            }
            catch (err) { }
        }
        return ids.map((p) => (Object.assign(Object.assign({}, p), { status: 'posted' })));
    }
    async analytics(id, accessToken, date) {
        if (process.env.DISABLE_X_ANALYTICS) {
            return [];
        }
        const until = (0, dayjs_1.default)().endOf('day');
        const since = (0, dayjs_1.default)().subtract(date, 'day');
        const [accessTokenSplit, accessSecretSplit] = accessToken.split(':');
        const client = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
            accessToken: accessTokenSplit,
            accessSecret: accessSecretSplit,
        });
        try {
            const tweets = (0, lodash_1.uniqBy)(await this.loadAllTweets(client, id, until.format('YYYY-MM-DDTHH:mm:ssZ'), since.format('YYYY-MM-DDTHH:mm:ssZ')), (p) => p.id);
            if (tweets.length === 0) {
                return [];
            }
            const data = await client.v2.tweets(tweets.map((p) => p.id), {
                'tweet.fields': ['public_metrics'],
            });
            const metrics = data.data.reduce((all, current) => {
                all.impression_count =
                    (all.impression_count || 0) +
                        +current.public_metrics.impression_count;
                all.bookmark_count =
                    (all.bookmark_count || 0) + +current.public_metrics.bookmark_count;
                all.like_count =
                    (all.like_count || 0) + +current.public_metrics.like_count;
                all.quote_count =
                    (all.quote_count || 0) + +current.public_metrics.quote_count;
                all.reply_count =
                    (all.reply_count || 0) + +current.public_metrics.reply_count;
                all.retweet_count =
                    (all.retweet_count || 0) + +current.public_metrics.retweet_count;
                return all;
            }, {
                impression_count: 0,
                bookmark_count: 0,
                like_count: 0,
                quote_count: 0,
                reply_count: 0,
                retweet_count: 0,
            });
            return Object.entries(metrics).map(([key, value]) => ({
                label: key.replace('_count', '').replace('_', ' ').toUpperCase(),
                percentageChange: 5,
                data: [
                    {
                        total: String(0),
                        date: since.format('YYYY-MM-DD'),
                    },
                    {
                        total: String(value),
                        date: until.format('YYYY-MM-DD'),
                    },
                ],
            }));
        }
        catch (err) {
            console.log(err);
        }
        return [];
    }
    async mention(token, d) {
        var _a;
        const [accessTokenSplit, accessSecretSplit] = token.split(':');
        const client = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.X_API_KEY,
            appSecret: process.env.X_API_SECRET,
            accessToken: accessTokenSplit,
            accessSecret: accessSecretSplit,
        });
        try {
            const data = await client.v2.userByUsername(d.query, {
                'user.fields': ['username', 'name', 'profile_image_url'],
            });
            if (!((_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.username)) {
                return [];
            }
            return [
                {
                    id: data.data.username,
                    image: data.data.profile_image_url,
                    label: data.data.name,
                },
            ];
        }
        catch (err) {
            console.log(err);
        }
        return [];
    }
    mentionFormat(idOrHandle, name) {
        return `@${idOrHandle}`;
    }
}
exports.XProvider = XProvider;
tslib_1.__decorate([
    (0, plug_decorator_1.Plug)({
        identifier: 'x-autoRepostPost',
        title: 'Auto Repost Posts',
        disabled: !!process.env.DISABLE_X_ANALYTICS,
        description: 'When a post reached a certain number of likes, repost it to increase engagement (1 week old posts)',
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
        ],
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], XProvider.prototype, "autoRepostPost", null);
tslib_1.__decorate([
    (0, post_plug_1.PostPlug)({
        identifier: 'x-repost-post-users',
        title: 'Add Re-posters',
        description: 'Add accounts to repost your post',
        pickIntegration: ['x'],
        fields: [],
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], XProvider.prototype, "repostPostUsers", null);
tslib_1.__decorate([
    (0, plug_decorator_1.Plug)({
        identifier: 'x-autoPlugPost',
        title: 'Auto plug post',
        disabled: !!process.env.DISABLE_X_ANALYTICS,
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
], XProvider.prototype, "autoPlugPost", null);
//# sourceMappingURL=x.provider.js.map