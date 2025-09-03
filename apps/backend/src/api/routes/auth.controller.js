"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const create_org_user_dto_1 = require("@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto");
const login_user_dto_1 = require("@gitroom/nestjs-libraries/dtos/auth/login.user.dto");
const auth_service_1 = require("@gitroom/backend/services/auth/auth.service");
const forgot_return_password_dto_1 = require("@gitroom/nestjs-libraries/dtos/auth/forgot-return.password.dto");
const forgot_password_dto_1 = require("@gitroom/nestjs-libraries/dtos/auth/forgot.password.dto");
const swagger_1 = require("@nestjs/swagger");
const subdomain_management_1 = require("@gitroom/helpers/subdomain/subdomain.management");
const email_service_1 = require("@gitroom/nestjs-libraries/services/email.service");
const nestjs_real_ip_1 = require("nestjs-real-ip");
const user_agent_1 = require("@gitroom/nestjs-libraries/user/user.agent");
const client_1 = require("@prisma/client");
let AuthController = class AuthController {
    constructor(_authService, _emailService) {
        this._authService = _authService;
        this._emailService = _emailService;
    }
    async canRegister() {
        return {
            register: await this._authService.canRegister(client_1.Provider.LOCAL),
        };
    }
    async register(req, body, response, ip, userAgent) {
        var _a;
        try {
            const getOrgFromCookie = this._authService.getOrgFromCookie((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.org);
            const { jwt, addedOrg } = await this._authService.routeAuth(body.provider, body, ip, userAgent, getOrgFromCookie);
            const activationRequired = body.provider === 'LOCAL' && this._emailService.hasProvider();
            if (activationRequired) {
                response.header('activate', 'true');
                response.status(200).json({ activate: true });
                return;
            }
            response.cookie('auth', jwt, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
                ? {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'none',
                }
                : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
            if (process.env.NOT_SECURED) {
                response.header('auth', jwt);
            }
            if (typeof addedOrg !== 'boolean' && (addedOrg === null || addedOrg === void 0 ? void 0 : addedOrg.organizationId)) {
                response.cookie('showorg', addedOrg.organizationId, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
                    ? {
                        secure: true,
                        httpOnly: true,
                        sameSite: 'none',
                    }
                    : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
                if (process.env.NOT_SECURED) {
                    response.header('showorg', addedOrg.organizationId);
                }
            }
            response.header('onboarding', 'true');
            response.status(200).json({
                register: true,
            });
        }
        catch (e) {
            response.status(400).send(e.message);
        }
    }
    async login(req, body, response, ip, userAgent) {
        var _a;
        try {
            const getOrgFromCookie = this._authService.getOrgFromCookie((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.org);
            const { jwt, addedOrg } = await this._authService.routeAuth(body.provider, body, ip, userAgent, getOrgFromCookie);
            response.cookie('auth', jwt, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
                ? {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'none',
                }
                : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
            if (process.env.NOT_SECURED) {
                response.header('auth', jwt);
            }
            if (typeof addedOrg !== 'boolean' && (addedOrg === null || addedOrg === void 0 ? void 0 : addedOrg.organizationId)) {
                response.cookie('showorg', addedOrg.organizationId, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
                    ? {
                        secure: true,
                        httpOnly: true,
                        sameSite: 'none',
                    }
                    : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
                if (process.env.NOT_SECURED) {
                    response.header('showorg', addedOrg.organizationId);
                }
            }
            response.header('reload', 'true');
            response.status(200).json({
                login: true,
            });
        }
        catch (e) {
            response.status(400).send(e.message);
        }
    }
    async forgot(body) {
        try {
            await this._authService.forgot(body.email);
            return {
                forgot: true,
            };
        }
        catch (e) {
            return {
                forgot: false,
            };
        }
    }
    async forgotReturn(body) {
        const reset = await this._authService.forgotReturn(body);
        return {
            reset: !!reset,
        };
    }
    async oauthLink(provider, query) {
        return this._authService.oauthLink(provider, query);
    }
    async activate(code, response) {
        const activate = await this._authService.activate(code);
        if (!activate) {
            return response.status(200).json({ can: false });
        }
        response.cookie('auth', activate, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'none',
            }
            : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
        if (process.env.NOT_SECURED) {
            response.header('auth', activate);
        }
        response.header('onboarding', 'true');
        return response.status(200).json({ can: true });
    }
    async oauthExists(code, provider, response) {
        const { jwt, token } = await this._authService.checkExists(provider, code);
        if (token) {
            return response.json({ token });
        }
        response.cookie('auth', jwt, Object.assign(Object.assign({ domain: (0, subdomain_management_1.getCookieUrlFromDomain)(process.env.FRONTEND_URL) }, (!process.env.NOT_SECURED
            ? {
                secure: true,
                httpOnly: true,
                sameSite: 'none',
            }
            : {})), { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) }));
        if (process.env.NOT_SECURED) {
            response.header('auth', jwt);
        }
        response.header('reload', 'true');
        response.status(200).json({
            login: true,
        });
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Get)('/can-register'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "canRegister", null);
tslib_1.__decorate([
    (0, common_1.Post)('/register'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Res)({ passthrough: false })),
    tslib_1.__param(3, (0, nestjs_real_ip_1.RealIP)()),
    tslib_1.__param(4, (0, user_agent_1.UserAgent)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, create_org_user_dto_1.CreateOrgUserDto, Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.Post)('/login'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Res)({ passthrough: false })),
    tslib_1.__param(3, (0, nestjs_real_ip_1.RealIP)()),
    tslib_1.__param(4, (0, user_agent_1.UserAgent)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, login_user_dto_1.LoginUserDto, Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Post)('/forgot'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "forgot", null);
tslib_1.__decorate([
    (0, common_1.Post)('/forgot-return'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [forgot_return_password_dto_1.ForgotReturnPasswordDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "forgotReturn", null);
tslib_1.__decorate([
    (0, common_1.Get)('/oauth/:provider'),
    tslib_1.__param(0, (0, common_1.Param)('provider')),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "oauthLink", null);
tslib_1.__decorate([
    (0, common_1.Post)('/activate'),
    tslib_1.__param(0, (0, common_1.Body)('code')),
    tslib_1.__param(1, (0, common_1.Res)({ passthrough: false })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "activate", null);
tslib_1.__decorate([
    (0, common_1.Post)('/oauth/:provider/exists'),
    tslib_1.__param(0, (0, common_1.Body)('code')),
    tslib_1.__param(1, (0, common_1.Param)('provider')),
    tslib_1.__param(2, (0, common_1.Res)({ passthrough: false })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "oauthExists", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('/auth'),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService,
        email_service_1.EmailService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map