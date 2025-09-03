"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agencies_service_1 = require("@gitroom/nestjs-libraries/database/prisma/agencies/agencies.service");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
const track_service_1 = require("@gitroom/nestjs-libraries/track/track.service");
const nestjs_real_ip_1 = require("nestjs-real-ip");
const user_agent_1 = require("@gitroom/nestjs-libraries/user/user.agent");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const subdomain_management_1 = require("@gitroom/helpers/subdomain/subdomain.management");
const agent_graph_insert_service_1 = require("@gitroom/nestjs-libraries/agent/agent.graph.insert.service");
const nowpayments_1 = require("@gitroom/nestjs-libraries/crypto/nowpayments");
let PublicController = class PublicController {
    constructor(_agenciesService, _trackService, _agentGraphInsertService, _postsService, _nowpayments) {
        this._agenciesService = _agenciesService;
        this._trackService = _trackService;
        this._agentGraphInsertService = _agentGraphInsertService;
        this._postsService = _postsService;
        this._nowpayments = _nowpayments;
    }
    async createAgent(body) {
        if (!body.apiKey ||
            !process.env.AGENT_API_KEY ||
            body.apiKey !== process.env.AGENT_API_KEY) {
            return;
        }
        return this._agentGraphInsertService.newPost(body.text);
    }
    async getAgencyByUser() {
        return this._agenciesService.getAllAgencies();
    }
    async getAgencySlug() {
        return this._agenciesService.getAllAgenciesSlug();
    }
    async getAgencyInformation(agency) {
        return this._agenciesService.getAgencyInformation(agency);
    }
    async getAgenciesCount() {
        return this._agenciesService.getCount();
    }
    async getPreview(id) {
        return (await this._postsService.getPostsRecursively(id, true)).map((_a) => {
            var { childrenPost } = _a, p = tslib_1.__rest(_a, ["childrenPost"]);
            return (Object.assign(Object.assign({}, p), (p.integration
                ? {
                    integration: {
                        id: p.integration.id,
                        name: p.integration.name,
                        picture: p.integration.picture,
                        providerIdentifier: p.integration.providerIdentifier,
                        profile: p.integration.profile,
                    },
                }
                : {})));
        });
    }
    async getComments(postId) {
        return { comments: await this._postsService.getComments(postId) };
    }
    async trackEvent(res, req, ip, userAgent, body) {
        var _a, _b;
        const uniqueId = ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.track) || (0, make_is_1.makeId)(10);
        const fbclid = ((_b = req === null || req === void 0 ? void 0 : req.cookies) === null || _b === void 0 ? void 0 : _b.fbclid) || body.fbclid;
        await this._trackService.track(uniqueId, ip, userAgent, body.tt, body.additional, fbclid);
        if (!req.cookies.track) {
            res.cookie('track', uniqueId, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
                ? {
                    secure: true,
                    httpOnly: true,
                }
                : {})), { sameSite: 'none', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
        }
        if (body.fbclid && !req.cookies.fbclid) {
            res.cookie('fbclid', body.fbclid, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
                ? {
                    secure: true,
                    httpOnly: true,
                }
                : {})), { sameSite: 'none', expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
        }
        res.status(200).json({
            track: uniqueId,
        });
    }
    async cryptoPost(body, path) {
        console.log('cryptoPost', body, path);
        return this._nowpayments.processPayment(path, body);
    }
};
exports.PublicController = PublicController;
tslib_1.__decorate([
    (0, common_1.Post)('/agent'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "createAgent", null);
tslib_1.__decorate([
    (0, common_1.Get)('/agencies-list'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "getAgencyByUser", null);
tslib_1.__decorate([
    (0, common_1.Get)('/agencies-list-slug'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "getAgencySlug", null);
tslib_1.__decorate([
    (0, common_1.Get)('/agencies-information/:agency'),
    tslib_1.__param(0, (0, common_1.Param)('agency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "getAgencyInformation", null);
tslib_1.__decorate([
    (0, common_1.Get)('/agencies-list-count'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "getAgenciesCount", null);
tslib_1.__decorate([
    (0, common_1.Get)(`/posts/:id`),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "getPreview", null);
tslib_1.__decorate([
    (0, common_1.Get)(`/posts/:id/comments`),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "getComments", null);
tslib_1.__decorate([
    (0, common_1.Post)('/t'),
    tslib_1.__param(0, (0, common_1.Res)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, nestjs_real_ip_1.RealIP)()),
    tslib_1.__param(3, (0, user_agent_1.UserAgent)()),
    tslib_1.__param(4, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "trackEvent", null);
tslib_1.__decorate([
    (0, common_1.Post)('/crypto/:path'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Param)('path')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicController.prototype, "cryptoPost", null);
exports.PublicController = PublicController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Public'),
    (0, common_1.Controller)('/public'),
    tslib_1.__metadata("design:paramtypes", [agencies_service_1.AgenciesService,
        track_service_1.TrackService,
        agent_graph_insert_service_1.AgentGraphInsertService,
        posts_service_1.PostsService,
        nowpayments_1.Nowpayments])
], PublicController);
//# sourceMappingURL=public.controller.js.map