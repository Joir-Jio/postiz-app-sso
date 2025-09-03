"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = exports.removeAuth = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const organization_service_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.service");
const users_service_1 = require("@gitroom/nestjs-libraries/database/prisma/users/users.service");
const subdomain_management_1 = require("@gitroom/helpers/subdomain/subdomain.management");
const exception_filter_1 = require("@gitroom/nestjs-libraries/services/exception.filter");
const removeAuth = (res) => {
    res.cookie('auth', '', Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
        ? {
            secure: true,
            httpOnly: true,
            sameSite: 'none',
        }
        : {})), { expires: new Date(0), maxAge: -1 }));
    res.header('logout', 'true');
};
exports.removeAuth = removeAuth;
let AuthMiddleware = class AuthMiddleware {
    constructor(_organizationService, _userService) {
        this._organizationService = _organizationService;
        this._userService = _userService;
    }
    async use(req, res, next) {
        const auth = req.headers.auth || req.cookies.auth;
        if (!auth) {
            throw new exception_filter_1.HttpForbiddenException();
        }
        try {
            let user = auth_service_1.AuthService.verifyJWT(auth);
            const orgHeader = req.cookies.showorg || req.headers.showorg;
            if (!user) {
                throw new exception_filter_1.HttpForbiddenException();
            }
            if (!user.activated) {
                throw new exception_filter_1.HttpForbiddenException();
            }
            const impersonate = req.cookies.impersonate || req.headers.impersonate;
            if ((user === null || user === void 0 ? void 0 : user.isSuperAdmin) && impersonate) {
                const loadImpersonate = await this._organizationService.getUserOrg(impersonate);
                if (loadImpersonate) {
                    user = loadImpersonate.user;
                    user.isSuperAdmin = true;
                    delete user.password;
                    req.user = user;
                    loadImpersonate.organization.users =
                        loadImpersonate.organization.users.filter((f) => f.userId === user.id);
                    req.org = loadImpersonate.organization;
                    next();
                    return;
                }
            }
            delete user.password;
            const organization = (await this._organizationService.getOrgsByUserId(user.id)).filter((f) => !f.users[0].disabled);
            const setOrg = organization.find((org) => org.id === orgHeader) || organization[0];
            if (!organization) {
                throw new exception_filter_1.HttpForbiddenException();
            }
            if (!setOrg.apiKey) {
                await this._organizationService.updateApiKey(setOrg.id);
            }
            req.user = user;
            req.org = setOrg;
        }
        catch (err) {
            throw new exception_filter_1.HttpForbiddenException();
        }
        next();
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [organization_service_1.OrganizationService,
        users_service_1.UsersService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map