"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedinPageProvider = void 0;
const tslib_1 = require("tslib");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const linkedin_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/linkedin.provider");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const plug_decorator_1 = require("@gitroom/helpers/decorators/plug.decorator");
const timer_1 = require("@gitroom/helpers/utils/timer");
class LinkedinPageProvider extends linkedin_provider_1.LinkedinProvider {
    constructor() {
        super(...arguments);
        this.identifier = 'linkedin-page';
        this.name = 'LinkedIn Page';
        this.isBetweenSteps = true;
        this.refreshWait = true;
        this.maxConcurrentJob = 2;
        this.scopes = [
            'openid',
            'profile',
            'w_member_social',
            'r_basicprofile',
            'rw_organization_admin',
            'w_organization_social',
            'r_organization_social',
        ];
        this.editor = 'normal';
    }
    async refreshToken(refresh_token) {
        const { access_token: accessToken, expires_in, refresh_token: refreshToken, } = await (await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            }),
        })).json();
        const { vanityName } = await (await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        const { name, sub: id, picture, } = await (await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return {
            id,
            accessToken,
            refreshToken,
            expiresIn: expires_in,
            name,
            picture,
            username: vanityName,
        };
    }
    async repostPostUsers(integration, originalIntegration, postId, information) {
        return super.repostPostUsers(integration, originalIntegration, postId, information, false);
    }
    async generateAuthUrl() {
        const state = (0, make_is_1.makeId)(6);
        const codeVerifier = (0, make_is_1.makeId)(30);
        const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&prompt=none&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.FRONTEND_URL}/integrations/social/linkedin-page`)}&state=${state}&scope=${encodeURIComponent(this.scopes.join(' '))}`;
        return {
            url,
            codeVerifier,
            state,
        };
    }
    async companies(accessToken) {
        const _a = await (await fetch('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organizationalTarget~(localizedName,vanityName,logoV2(original~:playableStreams))))', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'X-Restli-Protocol-Version': '2.0.0',
                'LinkedIn-Version': '202501',
            },
        })).json(), { elements } = _a, all = tslib_1.__rest(_a, ["elements"]);
        return (elements || []).map((e) => {
            var _a, _b, _c, _d, _e, _f;
            return ({
                id: e.organizationalTarget.split(':').pop(),
                page: e.organizationalTarget.split(':').pop(),
                username: e['organizationalTarget~'].vanityName,
                name: e['organizationalTarget~'].localizedName,
                picture: (_f = (_e = (_d = (_c = (_b = (_a = e['organizationalTarget~'].logoV2) === null || _a === void 0 ? void 0 : _a['original~']) === null || _b === void 0 ? void 0 : _b.elements) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.identifiers) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.identifier,
            });
        });
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
    async fetchPageInformation(accessToken, pageId) {
        var _a, _b, _c, _d, _e;
        const data = await (await fetch(`https://api.linkedin.com/v2/organizations/${pageId}?projection=(id,localizedName,vanityName,logoV2(original~:playableStreams))`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return {
            id: data.id,
            name: data.localizedName,
            access_token: accessToken,
            picture: (_e = (_d = (_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.logoV2) === null || _a === void 0 ? void 0 : _a['original~']) === null || _b === void 0 ? void 0 : _b.elements) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.identifiers) === null || _e === void 0 ? void 0 : _e[0].identifier,
            username: data.vanityName,
        };
    }
    async authenticate(params) {
        const body = new URLSearchParams();
        body.append('grant_type', 'authorization_code');
        body.append('code', params.code);
        body.append('redirect_uri', `${process.env.FRONTEND_URL}/integrations/social/linkedin-page`);
        body.append('client_id', process.env.LINKEDIN_CLIENT_ID);
        body.append('client_secret', process.env.LINKEDIN_CLIENT_SECRET);
        const { access_token: accessToken, expires_in: expiresIn, refresh_token: refreshToken, scope, } = await (await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body,
        })).json();
        this.checkScopes(this.scopes, scope);
        const { name, sub: id, picture, } = await (await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        const { vanityName } = await (await fetch('https://api.linkedin.com/v2/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })).json();
        return {
            id: `p_${id}`,
            accessToken,
            refreshToken,
            expiresIn,
            name,
            picture,
            username: vanityName,
        };
    }
    async post(id, accessToken, postDetails, integration) {
        return super.post(id, accessToken, postDetails, integration, 'company');
    }
    async analytics(id, accessToken, date) {
        const endDate = (0, dayjs_1.default)().unix() * 1000;
        const startDate = (0, dayjs_1.default)().subtract(date, 'days').unix() * 1000;
        const { elements } = await (await fetch(`https://api.linkedin.com/v2/organizationPageStatistics?q=organization&organization=${encodeURIComponent(`urn:li:organization:${id}`)}&timeIntervals=(timeRange:(start:${startDate},end:${endDate}),timeGranularityType:DAY)`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Linkedin-Version': '202405',
                'X-Restli-Protocol-Version': '2.0.0',
            },
        })).json();
        const { elements: elements2 } = await (await fetch(`https://api.linkedin.com/v2/organizationalEntityFollowerStatistics?q=organizationalEntity&organizationalEntity=${encodeURIComponent(`urn:li:organization:${id}`)}&timeIntervals=(timeRange:(start:${startDate},end:${endDate}),timeGranularityType:DAY)`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Linkedin-Version': '202405',
                'X-Restli-Protocol-Version': '2.0.0',
            },
        })).json();
        const { elements: elements3 } = await (await fetch(`https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${encodeURIComponent(`urn:li:organization:${id}`)}&timeIntervals=(timeRange:(start:${startDate},end:${endDate}),timeGranularityType:DAY)`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Linkedin-Version': '202405',
                'X-Restli-Protocol-Version': '2.0.0',
            },
        })).json();
        const analytics = [...elements2, ...elements, ...elements3].reduce((all, current) => {
            var _a, _b, _c, _d, _e, _f, _g;
            if (typeof ((_c = (_b = (_a = current === null || current === void 0 ? void 0 : current.totalPageStatistics) === null || _a === void 0 ? void 0 : _a.views) === null || _b === void 0 ? void 0 : _b.allPageViews) === null || _c === void 0 ? void 0 : _c.pageViews) !== 'undefined') {
                all['Page Views'].push({
                    total: current.totalPageStatistics.views.allPageViews.pageViews,
                    date: (0, dayjs_1.default)(current.timeRange.start).format('YYYY-MM-DD'),
                });
            }
            if (typeof ((_d = current === null || current === void 0 ? void 0 : current.followerGains) === null || _d === void 0 ? void 0 : _d.organicFollowerGain) !== 'undefined') {
                all['Organic Followers'].push({
                    total: (_e = current === null || current === void 0 ? void 0 : current.followerGains) === null || _e === void 0 ? void 0 : _e.organicFollowerGain,
                    date: (0, dayjs_1.default)(current.timeRange.start).format('YYYY-MM-DD'),
                });
            }
            if (typeof ((_f = current === null || current === void 0 ? void 0 : current.followerGains) === null || _f === void 0 ? void 0 : _f.paidFollowerGain) !== 'undefined') {
                all['Paid Followers'].push({
                    total: (_g = current === null || current === void 0 ? void 0 : current.followerGains) === null || _g === void 0 ? void 0 : _g.paidFollowerGain,
                    date: (0, dayjs_1.default)(current.timeRange.start).format('YYYY-MM-DD'),
                });
            }
            if (typeof (current === null || current === void 0 ? void 0 : current.totalShareStatistics) !== 'undefined') {
                all['Clicks'].push({
                    total: current === null || current === void 0 ? void 0 : current.totalShareStatistics.clickCount,
                    date: (0, dayjs_1.default)(current.timeRange.start).format('YYYY-MM-DD'),
                });
                all['Shares'].push({
                    total: current === null || current === void 0 ? void 0 : current.totalShareStatistics.shareCount,
                    date: (0, dayjs_1.default)(current.timeRange.start).format('YYYY-MM-DD'),
                });
                all['Engagement'].push({
                    total: current === null || current === void 0 ? void 0 : current.totalShareStatistics.engagement,
                    date: (0, dayjs_1.default)(current.timeRange.start).format('YYYY-MM-DD'),
                });
                all['Comments'].push({
                    total: current === null || current === void 0 ? void 0 : current.totalShareStatistics.commentCount,
                    date: (0, dayjs_1.default)(current.timeRange.start).format('YYYY-MM-DD'),
                });
            }
            return all;
        }, {
            'Page Views': [],
            Clicks: [],
            Shares: [],
            Engagement: [],
            Comments: [],
            'Organic Followers': [],
            'Paid Followers': [],
        });
        return Object.keys(analytics).map((key) => ({
            label: key,
            data: analytics[key],
            percentageChange: 5,
        }));
    }
    async autoRepostPost(integration, id, fields) {
        const { likesSummary: { totalLikes }, } = await (await this.fetch(`https://api.linkedin.com/v2/socialActions/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202501',
                Authorization: `Bearer ${integration.token}`,
            },
        })).json();
        if (totalLikes >= +fields.likesAmount) {
            await (0, timer_1.timer)(2000);
            await this.fetch(`https://api.linkedin.com/rest/posts`, {
                body: JSON.stringify({
                    author: `urn:li:organization:${integration.internalId}`,
                    commentary: '',
                    visibility: 'PUBLIC',
                    distribution: {
                        feedDistribution: 'MAIN_FEED',
                        targetEntities: [],
                        thirdPartyDistributionChannels: [],
                    },
                    lifecycleState: 'PUBLISHED',
                    isReshareDisabledByAuthor: false,
                    reshareContext: {
                        parent: id,
                    },
                }),
                method: 'POST',
                headers: {
                    'X-Restli-Protocol-Version': '2.0.0',
                    'Content-Type': 'application/json',
                    'LinkedIn-Version': '202504',
                    Authorization: `Bearer ${integration.token}`,
                },
            });
            return true;
        }
        return false;
    }
    async autoPlugPost(integration, id, fields) {
        const { likesSummary: { totalLikes }, } = await (await this.fetch(`https://api.linkedin.com/v2/socialActions/${encodeURIComponent(id)}`, {
            method: 'GET',
            headers: {
                'X-Restli-Protocol-Version': '2.0.0',
                'Content-Type': 'application/json',
                'LinkedIn-Version': '202501',
                Authorization: `Bearer ${integration.token}`,
            },
        })).json();
        if (totalLikes >= fields.likesAmount) {
            await (0, timer_1.timer)(2000);
            await this.fetch(`https://api.linkedin.com/v2/socialActions/${decodeURIComponent(id)}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${integration.token}`,
                },
                body: JSON.stringify({
                    actor: `urn:li:organization:${integration.internalId}`,
                    object: id,
                    message: {
                        text: this.fixText(fields.post),
                    },
                }),
            });
            return true;
        }
        return false;
    }
}
exports.LinkedinPageProvider = LinkedinPageProvider;
tslib_1.__decorate([
    (0, plug_decorator_1.Plug)({
        identifier: 'linkedin-page-autoRepostPost',
        title: 'Auto Repost Posts',
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
], LinkedinPageProvider.prototype, "autoRepostPost", null);
tslib_1.__decorate([
    (0, plug_decorator_1.Plug)({
        identifier: 'linkedin-page-autoPlugPost',
        title: 'Auto plug post',
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
], LinkedinPageProvider.prototype, "autoPlugPost", null);
//# sourceMappingURL=linkedin.page.provider.js.map