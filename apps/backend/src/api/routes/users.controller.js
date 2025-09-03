"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_from_request_1 = require("@gitroom/nestjs-libraries/user/user.from.request");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const stripe_service_1 = require("@gitroom/nestjs-libraries/services/stripe.service");
const auth_service_1 = require("@gitroom/backend/services/auth/auth.service");
const organization_service_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.service");
const permissions_ability_1 = require("@gitroom/backend/services/auth/permissions/permissions.ability");
const subdomain_management_1 = require("@gitroom/helpers/subdomain/subdomain.management");
const pricing_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("@gitroom/nestjs-libraries/database/prisma/users/users.service");
const user_details_dto_1 = require("@gitroom/nestjs-libraries/dtos/users/user.details.dto");
const exception_filter_1 = require("@gitroom/nestjs-libraries/services/exception.filter");
const nestjs_real_ip_1 = require("nestjs-real-ip");
const user_agent_1 = require("@gitroom/nestjs-libraries/user/user.agent");
const track_service_1 = require("@gitroom/nestjs-libraries/track/track.service");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
let UsersController = class UsersController {
    constructor(_subscriptionService, _stripeService, _authService, _orgService, _userService, _trackService) {
        this._subscriptionService = _subscriptionService;
        this._stripeService = _stripeService;
        this._authService = _authService;
        this._orgService = _orgService;
        this._userService = _userService;
        this._trackService = _trackService;
    }
    async getSelf(user, organization, req) {
        var _a, _b, _c, _d, _e, _f;
        if (!organization) {
            throw new exception_filter_1.HttpForbiddenException();
        }
        const impersonate = req.cookies.impersonate || req.headers.impersonate;
        return Object.assign(Object.assign({}, user), { orgId: organization.id, totalChannels: !process.env.STRIPE_PUBLISHABLE_KEY ? 10000 : ((_a = organization === null || organization === void 0 ? void 0 : organization.subscription) === null || _a === void 0 ? void 0 : _a.totalChannels) || pricing_1.pricing.FREE.channel, tier: ((_b = organization === null || organization === void 0 ? void 0 : organization.subscription) === null || _b === void 0 ? void 0 : _b.subscriptionTier) || (!process.env.STRIPE_PUBLISHABLE_KEY ? 'ULTIMATE' : 'FREE'), role: (_c = organization === null || organization === void 0 ? void 0 : organization.users[0]) === null || _c === void 0 ? void 0 : _c.role, isLifetime: !!((_d = organization === null || organization === void 0 ? void 0 : organization.subscription) === null || _d === void 0 ? void 0 : _d.isLifetime), admin: !!user.isSuperAdmin, impersonate: !!impersonate, isTrailing: !process.env.STRIPE_PUBLISHABLE_KEY ? false : organization === null || organization === void 0 ? void 0 : organization.isTrailing, allowTrial: organization === null || organization === void 0 ? void 0 : organization.allowTrial, publicApi: ((_e = organization === null || organization === void 0 ? void 0 : organization.users[0]) === null || _e === void 0 ? void 0 : _e.role) === 'SUPERADMIN' || ((_f = organization === null || organization === void 0 ? void 0 : organization.users[0]) === null || _f === void 0 ? void 0 : _f.role) === 'ADMIN' ? organization === null || organization === void 0 ? void 0 : organization.apiKey : '' });
    }
    async getPersonal(user) {
        return this._userService.getPersonal(user.id);
    }
    async getImpersonate(user, name) {
        if (!user.isSuperAdmin) {
            throw new common_1.HttpException('Unauthorized', 400);
        }
        return this._userService.getImpersonateUser(name);
    }
    async setImpersonate(user, id, response) {
        if (!user.isSuperAdmin) {
            throw new common_1.HttpException('Unauthorized', 400);
        }
        response.cookie('impersonate', id, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'none',
            }
            : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
        if (process.env.NOT_SECURED) {
            response.header('impersonate', id);
        }
    }
    async changePersonal(user, body) {
        return this._userService.changePersonal(user.id, body);
    }
    async getSubscription(organization) {
        const subscription = await this._subscriptionService.getSubscriptionByOrganizationId(organization.id);
        return subscription ? { subscription } : { subscription: undefined };
    }
    async tiers() {
        return this._stripeService.getPackages();
    }
    async joinOrg(user, org, response) {
        const getOrgFromCookie = this._authService.getOrgFromCookie(org);
        if (!getOrgFromCookie) {
            return response.status(200).json({ id: null });
        }
        const addedOrg = await this._orgService.addUserToOrg(user.id, getOrgFromCookie.id, getOrgFromCookie.orgId, getOrgFromCookie.role);
        response.status(200).json({
            id: typeof addedOrg !== 'boolean' ? addedOrg.organizationId : null,
        });
    }
    async getOrgs(user) {
        return (await this._orgService.getOrgsByUserId(user.id)).filter((f) => !f.users[0].disabled);
    }
    changeOrg(id, response) {
        response.cookie('showorg', id, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'none',
            }
            : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
        if (process.env.NOT_SECURED) {
            response.header('showorg', id);
        }
        response.status(200).send();
    }
    logout(response) {
        response.cookie('auth', '', Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'none',
            }
            : {})), { maxAge: -1, expires: new Date(0) }));
        response.cookie('showorg', '', Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'none',
            }
            : {})), { maxAge: -1, expires: new Date(0) }));
        response.cookie('impersonate', '', Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'none',
            }
            : {})), { maxAge: -1, expires: new Date(0) }));
        response.status(200).send();
    }
    async trackEvent(res, req, user, ip, userAgent, body) {
        var _a, _b;
        const uniqueId = ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.track) || (0, make_is_1.makeId)(10);
        const fbclid = ((_b = req === null || req === void 0 ? void 0 : req.cookies) === null || _b === void 0 ? void 0 : _b.fbclid) || body.fbclid;
        await this._trackService.track(uniqueId, ip, userAgent, body.tt, body.additional, fbclid, user);
        if (!req.cookies.track) {
            res.cookie('track', uniqueId, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
                ? {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'none',
                }
                : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
        }
        res.status(200).json({
            track: uniqueId,
        });
    }
};
exports.UsersController = UsersController;
tslib_1.__decorate([
    (0, common_1.Get)('/self'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "getSelf", null);
tslib_1.__decorate([
    (0, common_1.Get)('/personal'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "getPersonal", null);
tslib_1.__decorate([
    (0, common_1.Get)('/impersonate'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Query)('name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "getImpersonate", null);
tslib_1.__decorate([
    (0, common_1.Post)('/impersonate'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)('id')),
    tslib_1.__param(2, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "setImpersonate", null);
tslib_1.__decorate([
    (0, common_1.Post)('/personal'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, user_details_dto_1.UserDetailDto]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "changePersonal", null);
tslib_1.__decorate([
    (0, common_1.Get)('/subscription'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "getSubscription", null);
tslib_1.__decorate([
    (0, common_1.Get)('/subscription/tiers'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.ADMIN]),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "tiers", null);
tslib_1.__decorate([
    (0, common_1.Post)('/join-org'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)('org')),
    tslib_1.__param(2, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "joinOrg", null);
tslib_1.__decorate([
    (0, common_1.Get)('/organizations'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "getOrgs", null);
tslib_1.__decorate([
    (0, common_1.Post)('/change-org'),
    tslib_1.__param(0, (0, common_1.Body)('id')),
    tslib_1.__param(1, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "changeOrg", null);
tslib_1.__decorate([
    (0, common_1.Post)('/logout'),
    tslib_1.__param(0, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], UsersController.prototype, "logout", null);
tslib_1.__decorate([
    (0, common_1.Post)('/t'),
    tslib_1.__param(0, (0, common_1.Res)({ passthrough: true })),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__param(2, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(3, (0, nestjs_real_ip_1.RealIP)()),
    tslib_1.__param(4, (0, user_agent_1.UserAgent)()),
    tslib_1.__param(5, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object, String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UsersController.prototype, "trackEvent", null);
exports.UsersController = UsersController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('/user'),
    tslib_1.__metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        stripe_service_1.StripeService,
        auth_service_1.AuthService,
        organization_service_1.OrganizationService,
        users_service_1.UsersService,
        track_service_1.TrackService])
], UsersController);
//# sourceMappingURL=users.controller.js.map