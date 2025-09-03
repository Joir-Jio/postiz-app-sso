"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const googleapis_1 = require("googleapis");
const axios_1 = tslib_1.__importDefault(require("axios"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const process = tslib_1.__importStar(require("node:process"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const clientAndYoutube = () => {
    const client = new googleapis_1.google.auth.OAuth2({
        clientId: process.env.YOUTUBE_CLIENT_ID,
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET,
        redirectUri: `${process.env.FRONTEND_URL}/integrations/social/youtube`,
    });
    const youtube = (newClient) => googleapis_1.google.youtube({
        version: 'v3',
        auth: newClient,
    });
    const youtubeAnalytics = (newClient) => googleapis_1.google.youtubeAnalytics({
        version: 'v2',
        auth: newClient,
    });
    const oauth2 = (newClient) => googleapis_1.google.oauth2({
        version: 'v2',
        auth: newClient,
    });
    return { client, youtube, oauth2, youtubeAnalytics };
};
class YoutubeProvider extends social_abstract_1.SocialAbstract {
    constructor() {
        super(...arguments);
        this.maxConcurrentJob = 1;
        this.identifier = 'youtube';
        this.name = 'YouTube';
        this.isBetweenSteps = false;
        this.scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/youtube',
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtubepartner',
            'https://www.googleapis.com/auth/yt-analytics.readonly',
        ];
        this.editor = 'normal';
    }
    handleErrors(body) {
        if (body.includes('invalidTitle')) {
            return {
                type: 'bad-body',
                value: 'We have uploaded your video but we could not set the title. Title is too long.',
            };
        }
        if (body.includes('failedPrecondition')) {
            return {
                type: 'bad-body',
                value: 'We have uploaded your video but we could not set the thumbnail. Thumbnail size is too large.',
            };
        }
        if (body.includes('uploadLimitExceeded')) {
            return {
                type: 'bad-body',
                value: 'You have reached your daily upload limit, please try again tomorrow.',
            };
        }
        if (body.includes('youtubeSignupRequired')) {
            return {
                type: 'bad-body',
                value: 'You have to link your youtube account to your google account first.',
            };
        }
        if (body.includes('youtube.thumbnail')) {
            return {
                type: 'bad-body',
                value: 'Your account is not verified, we have uploaded your video but we could not set the thumbnail. Please verify your account and try again.',
            };
        }
        return undefined;
    }
    async refreshToken(refresh_token) {
        const { client, oauth2 } = clientAndYoutube();
        client.setCredentials({ refresh_token });
        const { credentials } = await client.refreshAccessToken();
        const user = oauth2(client);
        const expiryDate = new Date(credentials.expiry_date);
        const unixTimestamp = Math.floor(expiryDate.getTime() / 1000) -
            Math.floor(new Date().getTime() / 1000);
        const { data } = await user.userinfo.get();
        return {
            accessToken: credentials.access_token,
            expiresIn: unixTimestamp,
            refreshToken: credentials.refresh_token,
            id: data.id,
            name: data.name,
            picture: (data === null || data === void 0 ? void 0 : data.picture) || '',
            username: '',
        };
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(7);
        const { client } = clientAndYoutube();
        return {
            url: client.generateAuthUrl({
                access_type: 'offline',
                prompt: 'consent',
                state,
                redirect_uri: `${process.env.FRONTEND_URL}/integrations/social/youtube`,
                scope: this.scopes.slice(0),
            }),
            codeVerifier: (0, make_is_1.makeId)(11),
            state,
        };
    }
    async authenticate(params) {
        const { client, oauth2 } = clientAndYoutube();
        const { tokens } = await client.getToken(params.code);
        client.setCredentials(tokens);
        const { scopes } = await client.getTokenInfo(tokens.access_token);
        this.checkScopes(this.scopes, scopes);
        const user = oauth2(client);
        const { data } = await user.userinfo.get();
        const expiryDate = new Date(tokens.expiry_date);
        const unixTimestamp = Math.floor(expiryDate.getTime() / 1000) -
            Math.floor(new Date().getTime() / 1000);
        return {
            accessToken: tokens.access_token,
            expiresIn: unixTimestamp,
            refreshToken: tokens.refresh_token,
            id: data.id,
            name: data.name,
            picture: (data === null || data === void 0 ? void 0 : data.picture) || '',
            username: '',
        };
    }
    async post(id, accessToken, postDetails) {
        var _a, _b, _c, _d, _e;
        const [firstPost, ...comments] = postDetails;
        const { client, youtube } = clientAndYoutube();
        client.setCredentials({ access_token: accessToken });
        const youtubeClient = youtube(client);
        const { settings } = firstPost;
        const response = await (0, axios_1.default)({
            url: (_b = (_a = firstPost === null || firstPost === void 0 ? void 0 : firstPost.media) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path,
            method: 'GET',
            responseType: 'stream',
        });
        const all = await this.runInConcurrent(async () => {
            var _a;
            return youtubeClient.videos.insert({
                part: ['id', 'snippet', 'status'],
                notifySubscribers: true,
                requestBody: {
                    snippet: Object.assign({ title: settings.title, description: firstPost === null || firstPost === void 0 ? void 0 : firstPost.message }, (((_a = settings === null || settings === void 0 ? void 0 : settings.tags) === null || _a === void 0 ? void 0 : _a.length)
                        ? { tags: settings.tags.map((p) => p.label) }
                        : {})),
                    status: {
                        privacyStatus: settings.type,
                    },
                },
                media: {
                    body: response.data,
                },
            });
        }, true);
        if ((_c = settings === null || settings === void 0 ? void 0 : settings.thumbnail) === null || _c === void 0 ? void 0 : _c.path) {
            await this.runInConcurrent(async () => {
                var _a, _b;
                return youtubeClient.thumbnails.set({
                    videoId: (_a = all === null || all === void 0 ? void 0 : all.data) === null || _a === void 0 ? void 0 : _a.id,
                    media: {
                        body: (await (0, axios_1.default)({
                            url: (_b = settings === null || settings === void 0 ? void 0 : settings.thumbnail) === null || _b === void 0 ? void 0 : _b.path,
                            method: 'GET',
                            responseType: 'stream',
                        })).data,
                    },
                });
            });
        }
        return [
            {
                id: firstPost.id,
                releaseURL: `https://www.youtube.com/watch?v=${(_d = all === null || all === void 0 ? void 0 : all.data) === null || _d === void 0 ? void 0 : _d.id}`,
                postId: (_e = all === null || all === void 0 ? void 0 : all.data) === null || _e === void 0 ? void 0 : _e.id,
                status: 'success',
            },
        ];
    }
    async analytics(id, accessToken, date) {
        var _a, _b;
        try {
            const endDate = (0, dayjs_1.default)().format('YYYY-MM-DD');
            const startDate = (0, dayjs_1.default)().subtract(date, 'day').format('YYYY-MM-DD');
            const { client, youtubeAnalytics } = clientAndYoutube();
            client.setCredentials({ access_token: accessToken });
            const youtubeClient = youtubeAnalytics(client);
            const { data } = await youtubeClient.reports.query({
                ids: 'channel==MINE',
                startDate,
                endDate,
                metrics: 'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,likes,subscribersLost',
                dimensions: 'day',
                sort: 'day',
            });
            const columns = (_a = data === null || data === void 0 ? void 0 : data.columnHeaders) === null || _a === void 0 ? void 0 : _a.map((p) => p.name);
            const mappedData = (_b = data === null || data === void 0 ? void 0 : data.rows) === null || _b === void 0 ? void 0 : _b.map((p) => {
                return columns.reduce((acc, curr, index) => {
                    acc[curr] = p[index];
                    return acc;
                }, {});
            });
            const acc = [];
            acc.push({
                label: 'Estimated Minutes Watched',
                data: mappedData === null || mappedData === void 0 ? void 0 : mappedData.map((p) => ({
                    total: p.estimatedMinutesWatched,
                    date: p.day,
                })),
            });
            acc.push({
                label: 'Average View Duration',
                average: true,
                data: mappedData === null || mappedData === void 0 ? void 0 : mappedData.map((p) => ({
                    total: p.averageViewDuration,
                    date: p.day,
                })),
            });
            acc.push({
                label: 'Average View Percentage',
                average: true,
                data: mappedData === null || mappedData === void 0 ? void 0 : mappedData.map((p) => ({
                    total: p.averageViewPercentage,
                    date: p.day,
                })),
            });
            acc.push({
                label: 'Subscribers Gained',
                data: mappedData === null || mappedData === void 0 ? void 0 : mappedData.map((p) => ({
                    total: p.subscribersGained,
                    date: p.day,
                })),
            });
            acc.push({
                label: 'Subscribers Lost',
                data: mappedData === null || mappedData === void 0 ? void 0 : mappedData.map((p) => ({
                    total: p.subscribersLost,
                    date: p.day,
                })),
            });
            acc.push({
                label: 'Likes',
                data: mappedData === null || mappedData === void 0 ? void 0 : mappedData.map((p) => ({
                    total: p.likes,
                    date: p.day,
                })),
            });
            return acc;
        }
        catch (err) {
            return [];
        }
    }
}
exports.YoutubeProvider = YoutubeProvider;
//# sourceMappingURL=youtube.provider.js.map