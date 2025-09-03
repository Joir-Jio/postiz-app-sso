"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const create_org_user_dto_1 = require("@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto");
const users_service_1 = require("@gitroom/nestjs-libraries/database/prisma/users/users.service");
const organization_service_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.service");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const providers_factory_1 = require("@gitroom/backend/services/auth/providers/providers.factory");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const newsletter_service_1 = require("@gitroom/nestjs-libraries/services/newsletter.service");
const notification_service_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notification.service");
const email_service_1 = require("@gitroom/nestjs-libraries/services/email.service");
let AuthService = class AuthService {
    constructor(_userService, _organizationService, _notificationService, _emailService) {
        this._userService = _userService;
        this._organizationService = _organizationService;
        this._notificationService = _notificationService;
        this._emailService = _emailService;
    }
    async canRegister(provider) {
        if (process.env.DISABLE_REGISTRATION !== 'true' || provider === client_1.Provider.GENERIC) {
            return true;
        }
        return (await this._organizationService.getCount()) === 0;
    }
    async routeAuth(provider, body, ip, userAgent, addToOrg) {
        if (provider === client_1.Provider.LOCAL) {
            if (process.env.DISALLOW_PLUS && body.email.includes('+')) {
                throw new Error('Email with plus sign is not allowed');
            }
            const user = await this._userService.getUserByEmail(body.email);
            if (body instanceof create_org_user_dto_1.CreateOrgUserDto) {
                if (user) {
                    throw new Error('Email already exists');
                }
                if (!(await this.canRegister(provider))) {
                    throw new Error('Registration is disabled');
                }
                const create = await this._organizationService.createOrgAndUser(body, ip, userAgent);
                const addedOrg = addToOrg && typeof addToOrg !== 'boolean'
                    ? await this._organizationService.addUserToOrg(create.users[0].user.id, addToOrg.id, addToOrg.orgId, addToOrg.role)
                    : false;
                const obj = { addedOrg, jwt: await this.jwt(create.users[0].user) };
                await this._emailService.sendEmail(body.email, 'Activate your account', `Click <a href="${process.env.FRONTEND_URL}/auth/activate/${obj.jwt}">here</a> to activate your account`);
                return obj;
            }
            if (!user || !auth_service_1.AuthService.comparePassword(body.password, user.password)) {
                throw new Error('Invalid user name or password');
            }
            if (!user.activated) {
                throw new Error('User is not activated');
            }
            return { addedOrg: false, jwt: await this.jwt(user) };
        }
        const user = await this.loginOrRegisterProvider(provider, body, ip, userAgent);
        const addedOrg = addToOrg && typeof addToOrg !== 'boolean'
            ? await this._organizationService.addUserToOrg(user.id, addToOrg.id, addToOrg.orgId, addToOrg.role)
            : false;
        return { addedOrg, jwt: await this.jwt(user) };
    }
    getOrgFromCookie(cookie) {
        if (!cookie) {
            return false;
        }
        try {
            const getOrg = auth_service_1.AuthService.verifyJWT(cookie);
            if ((0, dayjs_1.default)(getOrg.timeLimit).isBefore((0, dayjs_1.default)())) {
                return false;
            }
            return getOrg;
        }
        catch (err) {
            return false;
        }
    }
    async loginOrRegisterProvider(provider, body, ip, userAgent) {
        const providerInstance = providers_factory_1.ProvidersFactory.loadProvider(provider);
        const providerUser = await providerInstance.getUser(body.providerToken);
        if (!providerUser) {
            throw new Error('Invalid provider token');
        }
        const user = await this._userService.getUserByProvider(providerUser.id, provider);
        if (user) {
            return user;
        }
        if (!(await this.canRegister(provider))) {
            throw new Error('Registration is disabled');
        }
        const create = await this._organizationService.createOrgAndUser({
            company: body.company,
            email: providerUser.email,
            password: '',
            provider,
            providerId: providerUser.id,
        }, ip, userAgent);
        await newsletter_service_1.NewsletterService.register(providerUser.email);
        return create.users[0].user;
    }
    async forgot(email) {
        const user = await this._userService.getUserByEmail(email);
        if (!user || user.providerName !== client_1.Provider.LOCAL) {
            return false;
        }
        const resetValues = auth_service_1.AuthService.signJWT({
            id: user.id,
            expires: (0, dayjs_1.default)().add(20, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        });
        await this._notificationService.sendEmail(user.email, 'Reset your password', `You have requested to reset your passsord. <br />Click <a href="${process.env.FRONTEND_URL}/auth/forgot/${resetValues}">here</a> to reset your password<br />The link will expire in 20 minutes`);
    }
    forgotReturn(body) {
        const user = auth_service_1.AuthService.verifyJWT(body.token);
        if ((0, dayjs_1.default)(user.expires).isBefore((0, dayjs_1.default)())) {
            return false;
        }
        return this._userService.updatePassword(user.id, body.password);
    }
    async activate(code) {
        const user = auth_service_1.AuthService.verifyJWT(code);
        if (user.id && !user.activated) {
            const getUserAgain = await this._userService.getUserByEmail(user.email);
            if (getUserAgain.activated) {
                return false;
            }
            await this._userService.activateUser(user.id);
            user.activated = true;
            await newsletter_service_1.NewsletterService.register(user.email);
            return this.jwt(user);
        }
        return false;
    }
    oauthLink(provider, query) {
        const providerInstance = providers_factory_1.ProvidersFactory.loadProvider(provider);
        return providerInstance.generateLink(query);
    }
    async checkExists(provider, code) {
        const providerInstance = providers_factory_1.ProvidersFactory.loadProvider(provider);
        const token = await providerInstance.getToken(code);
        const user = await providerInstance.getUser(token);
        if (!user) {
            throw new Error('Invalid user');
        }
        const checkExists = await this._userService.getUserByProvider(user.id, provider);
        if (checkExists) {
            return { jwt: await this.jwt(checkExists) };
        }
        return { token };
    }
    async jwt(user) {
        return auth_service_1.AuthService.signJWT(user);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [users_service_1.UsersService,
        organization_service_1.OrganizationService,
        notification_service_1.NotificationService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map