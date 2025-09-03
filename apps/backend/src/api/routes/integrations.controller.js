"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const redis_service_1 = require("@gitroom/nestjs-libraries/redis/redis.service");
const connect_integration_dto_1 = require("@gitroom/nestjs-libraries/dtos/integrations/connect.integration.dto");
const integration_manager_1 = require("@gitroom/nestjs-libraries/integrations/integration.manager");
const integration_service_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.service");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const integration_function_dto_1 = require("@gitroom/nestjs-libraries/dtos/integrations/integration.function.dto");
const permissions_ability_1 = require("@gitroom/backend/services/auth/permissions/permissions.ability");
const pricing_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing");
const swagger_1 = require("@nestjs/swagger");
const user_from_request_1 = require("@gitroom/nestjs-libraries/user/user.from.request");
const integration_missing_scopes_1 = require("@gitroom/nestjs-libraries/integrations/integration.missing.scopes");
const posts_service_1 = require("@gitroom/nestjs-libraries/database/prisma/posts/posts.service");
const integration_time_dto_1 = require("@gitroom/nestjs-libraries/dtos/integrations/integration.time.dto");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const plug_dto_1 = require("@gitroom/nestjs-libraries/dtos/plugs/plug.dto");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const timer_1 = require("@gitroom/helpers/utils/timer");
const telegram_provider_1 = require("@gitroom/nestjs-libraries/integrations/social/telegram.provider");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
const lodash_1 = require("lodash");
let IntegrationsController = class IntegrationsController {
    constructor(_integrationManager, _integrationService, _postService) {
        this._integrationManager = _integrationManager;
        this._integrationService = _integrationService;
        this._postService = _postService;
    }
    getIntegration() {
        return this._integrationManager.getAllIntegrations();
    }
    getInternalPlugs(identifier) {
        return this._integrationManager.getInternalPlugs(identifier);
    }
    getCustomers(org) {
        return this._integrationService.customers(org.id);
    }
    async updateIntegrationGroup(org, id, body) {
        return this._integrationService.updateIntegrationGroup(org.id, id, body.group);
    }
    async updateOnCustomerName(org, id, body) {
        return this._integrationService.updateOnCustomerName(org.id, id, body.name);
    }
    async getIntegrationList(org) {
        return {
            integrations: await Promise.all((await this._integrationService.getIntegrationsList(org.id)).map(async (p) => {
                const findIntegration = this._integrationManager.getSocialIntegration(p.providerIdentifier);
                return Object.assign(Object.assign({ name: p.name, id: p.id, internalId: p.internalId, disabled: p.disabled, editor: findIntegration.editor, picture: p.picture || '/no-picture.jpg', identifier: p.providerIdentifier, inBetweenSteps: p.inBetweenSteps, refreshNeeded: p.refreshNeeded, isCustomFields: !!findIntegration.customFields }, (findIntegration.customFields
                    ? { customFields: await findIntegration.customFields() }
                    : {})), { display: p.profile, type: p.type, time: JSON.parse(p.postingTimes), changeProfilePicture: !!(findIntegration === null || findIntegration === void 0 ? void 0 : findIntegration.changeProfilePicture), changeNickName: !!(findIntegration === null || findIntegration === void 0 ? void 0 : findIntegration.changeNickname), customer: p.customer, additionalSettings: p.additionalSettings || '[]' });
            })),
        };
    }
    async updateProviderSettings(org, id, body) {
        if (typeof body !== 'string') {
            throw new Error('Invalid body');
        }
        await this._integrationService.updateProviderSettings(org.id, id, body);
    }
    async setNickname(org, id, body) {
        const integration = await this._integrationService.getIntegrationById(org.id, id);
        if (!integration) {
            throw new Error('Invalid integration');
        }
        const manager = this._integrationManager.getSocialIntegration(integration.providerIdentifier);
        if (!manager.changeProfilePicture && !manager.changeNickname) {
            throw new Error('Invalid integration');
        }
        const { url } = manager.changeProfilePicture
            ? await manager.changeProfilePicture(integration.internalId, integration.token, body.picture)
            : { url: '' };
        const { name } = manager.changeNickname
            ? await manager.changeNickname(integration.internalId, integration.token, body.name)
            : { name: '' };
        return this._integrationService.updateNameAndUrl(id, name, url);
    }
    getSingleIntegration(id, order, user, org) {
        return this._integrationService.getIntegrationForOrder(id, order, user.id, org.id);
    }
    async getIntegrationUrl(integration, refresh, externalUrl) {
        if (!this._integrationManager
            .getAllowedSocialsIntegrations()
            .includes(integration)) {
            throw new Error('Integration not allowed');
        }
        const integrationProvider = this._integrationManager.getSocialIntegration(integration);
        if (integrationProvider.externalUrl && !externalUrl) {
            throw new Error('Missing external url');
        }
        try {
            const getExternalUrl = integrationProvider.externalUrl
                ? Object.assign(Object.assign({}, (await integrationProvider.externalUrl(externalUrl))), { instanceUrl: externalUrl }) : undefined;
            const { codeVerifier, state, url } = await integrationProvider.generateAuthUrl(getExternalUrl);
            if (refresh) {
                await redis_service_1.ioRedis.set(`refresh:${state}`, refresh, 'EX', 300);
            }
            await redis_service_1.ioRedis.set(`login:${state}`, codeVerifier, 'EX', 300);
            await redis_service_1.ioRedis.set(`external:${state}`, JSON.stringify(getExternalUrl), 'EX', 300);
            return { url };
        }
        catch (err) {
            return { err: true };
        }
    }
    async setTime(org, id, body) {
        return this._integrationService.setTimes(org.id, id, body);
    }
    async mentions(org, body) {
        var _a;
        const getIntegration = await this._integrationService.getIntegrationById(org.id, body.id);
        if (!getIntegration) {
            throw new Error('Invalid integration');
        }
        let newList = [];
        try {
            newList = (await this.functionIntegration(org, body)) || [];
        }
        catch (err) {
            console.log(err);
        }
        if (!Array.isArray(newList) && (newList === null || newList === void 0 ? void 0 : newList.none)) {
            return newList;
        }
        const list = await this._integrationService.getMentions(getIntegration.providerIdentifier, (_a = body === null || body === void 0 ? void 0 : body.data) === null || _a === void 0 ? void 0 : _a.query);
        if (Array.isArray(newList) && newList.length) {
            await this._integrationService.insertMentions(getIntegration.providerIdentifier, newList
                .map((p) => ({
                name: p.label || '',
                username: p.id || '',
                image: p.image || '',
                doNotCache: p.doNotCache || false,
            }))
                .filter((f) => f.name && !f.doNotCache));
        }
        return (0, lodash_1.uniqBy)([
            ...list.map((p) => ({
                id: p.username,
                image: p.image,
                label: p.name,
            })),
            ...newList,
        ], (p) => p.id).filter((f) => f.label && f.id);
    }
    async functionIntegration(org, body) {
        const getIntegration = await this._integrationService.getIntegrationById(org.id, body.id);
        if (!getIntegration) {
            throw new Error('Invalid integration');
        }
        const integrationProvider = this._integrationManager.getSocialIntegration(getIntegration.providerIdentifier);
        if (!integrationProvider) {
            throw new Error('Invalid provider');
        }
        if (integrationProvider[body.name]) {
            try {
                const load = await integrationProvider[body.name](getIntegration.token, body.data, getIntegration.internalId, getIntegration);
                return load;
            }
            catch (err) {
                if (err instanceof social_abstract_1.RefreshToken) {
                    const { accessToken, refreshToken, expiresIn, additionalSettings } = await integrationProvider.refreshToken(getIntegration.refreshToken);
                    if (accessToken) {
                        await this._integrationService.createOrUpdateIntegration(additionalSettings, !!integrationProvider.oneTimeToken, getIntegration.organizationId, getIntegration.name, getIntegration.picture, 'social', getIntegration.internalId, getIntegration.providerIdentifier, accessToken, refreshToken, expiresIn);
                        getIntegration.token = accessToken;
                        if (integrationProvider.refreshWait) {
                            await (0, timer_1.timer)(10000);
                        }
                        return this.functionIntegration(org, body);
                    }
                    else {
                        await this._integrationService.disconnectChannel(org.id, getIntegration);
                        return false;
                    }
                }
                return false;
            }
        }
        throw new Error('Function not found');
    }
    async connectSocialMedia(org, integration, body) {
        var _a;
        if (!this._integrationManager
            .getAllowedSocialsIntegrations()
            .includes(integration)) {
            throw new Error('Integration not allowed');
        }
        const integrationProvider = this._integrationManager.getSocialIntegration(integration);
        const getCodeVerifier = integrationProvider.customFields
            ? 'none'
            : await redis_service_1.ioRedis.get(`login:${body.state}`);
        if (!getCodeVerifier) {
            throw new Error('Invalid state');
        }
        if (!integrationProvider.customFields) {
            await redis_service_1.ioRedis.del(`login:${body.state}`);
        }
        const details = integrationProvider.externalUrl
            ? await redis_service_1.ioRedis.get(`external:${body.state}`)
            : undefined;
        if (details) {
            await redis_service_1.ioRedis.del(`external:${body.state}`);
        }
        const refresh = await redis_service_1.ioRedis.get(`refresh:${body.state}`);
        if (refresh) {
            await redis_service_1.ioRedis.del(`refresh:${body.state}`);
        }
        const { error, accessToken, expiresIn, refreshToken, id, name, picture, username, additionalSettings, } = await new Promise(async (res) => {
            const auth = await integrationProvider.authenticate({
                code: body.code,
                codeVerifier: getCodeVerifier,
                refresh: body.refresh,
            }, details ? JSON.parse(details) : undefined);
            if (typeof auth === 'string') {
                return res({
                    error: auth,
                    accessToken: '',
                    id: '',
                    name: '',
                    picture: '',
                    username: '',
                    additionalSettings: [],
                });
            }
            if (refresh && integrationProvider.reConnect) {
                const newAuth = await integrationProvider.reConnect(auth.id, refresh, auth.accessToken);
                return res(newAuth);
            }
            return res(auth);
        });
        if (error) {
            throw new social_abstract_1.NotEnoughScopes(error);
        }
        if (!id) {
            throw new social_abstract_1.NotEnoughScopes('Invalid API key');
        }
        if (refresh && String(id) !== String(refresh)) {
            throw new social_abstract_1.NotEnoughScopes('Please refresh the channel that needs to be refreshed');
        }
        let validName = name;
        if (!validName) {
            if (username) {
                validName = (_a = username.split('.')[0]) !== null && _a !== void 0 ? _a : username;
            }
            else {
                validName = `Channel_${String(id).slice(0, 8)}`;
            }
        }
        if (process.env.STRIPE_PUBLISHABLE_KEY &&
            org.isTrailing &&
            (await this._integrationService.checkPreviousConnections(org.id, String(id)))) {
            throw new common_1.HttpException('', 412);
        }
        return this._integrationService.createOrUpdateIntegration(additionalSettings, !!integrationProvider.oneTimeToken, org.id, validName.trim(), picture, 'social', String(id), integration, accessToken, refreshToken, expiresIn, username, refresh ? false : integrationProvider.isBetweenSteps, body.refresh, +body.timezone, details
            ? auth_service_1.AuthService.fixedEncryption(details)
            : integrationProvider.customFields
                ? auth_service_1.AuthService.fixedEncryption(Buffer.from(body.code, 'base64').toString())
                : undefined);
    }
    disableChannel(org, id) {
        return this._integrationService.disableChannel(org.id, id);
    }
    async saveInstagram(id, body, org) {
        return this._integrationService.saveInstagram(org.id, id, body);
    }
    async saveFacebook(id, body, org) {
        return this._integrationService.saveFacebook(org.id, id, body.page);
    }
    async saveLinkedin(id, body, org) {
        return this._integrationService.saveLinkedin(org.id, id, body.page);
    }
    enableChannel(org, id) {
        var _a;
        return this._integrationService.enableChannel(org.id, ((_a = org === null || org === void 0 ? void 0 : org.subscription) === null || _a === void 0 ? void 0 : _a.totalChannels) || pricing_1.pricing.FREE.channel, id);
    }
    async deleteChannel(org, id) {
        const isTherePosts = await this._integrationService.getPostsForChannel(org.id, id);
        if (isTherePosts.length) {
            for (const post of isTherePosts) {
                await this._postService.deletePost(org.id, post.group);
            }
        }
        return this._integrationService.deleteChannel(org.id, id);
    }
    async getPlugList() {
        return { plugs: this._integrationManager.getAllPlugs() };
    }
    async getPlugsByIntegrationId(id, org) {
        return this._integrationService.getPlugsByIntegrationId(org.id, id);
    }
    async postPlugsByIntegrationId(id, org, body) {
        return this._integrationService.createOrUpdatePlug(org.id, id, body);
    }
    async changePlugActivation(id, org, status) {
        return this._integrationService.changePlugActivation(org.id, id, status);
    }
    async getUpdates(query) {
        return new telegram_provider_1.TelegramProvider().getBotId(query);
    }
};
exports.IntegrationsController = IntegrationsController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], IntegrationsController.prototype, "getIntegration", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:identifier/internal-plugs'),
    tslib_1.__param(0, (0, common_1.Param)('identifier')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], IntegrationsController.prototype, "getInternalPlugs", null);
tslib_1.__decorate([
    (0, common_1.Get)('/customers'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IntegrationsController.prototype, "getCustomers", null);
tslib_1.__decorate([
    (0, common_1.Put)('/:id/group'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "updateIntegrationGroup", null);
tslib_1.__decorate([
    (0, common_1.Put)('/:id/customer-name'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "updateOnCustomerName", null);
tslib_1.__decorate([
    (0, common_1.Get)('/list'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getIntegrationList", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:id/settings'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)('additionalSettings')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "updateProviderSettings", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:id/nickname'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "setNickname", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)('order')),
    tslib_1.__param(2, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(3, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IntegrationsController.prototype, "getSingleIntegration", null);
tslib_1.__decorate([
    (0, common_1.Get)('/social/:integration'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.CHANNEL]),
    tslib_1.__param(0, (0, common_1.Param)('integration')),
    tslib_1.__param(1, (0, common_1.Query)('refresh')),
    tslib_1.__param(2, (0, common_1.Query)('externalUrl')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getIntegrationUrl", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:id/time'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, integration_time_dto_1.IntegrationTimeDto]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "setTime", null);
tslib_1.__decorate([
    (0, common_1.Post)('/mentions'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, integration_function_dto_1.IntegrationFunctionDto]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "mentions", null);
tslib_1.__decorate([
    (0, common_1.Post)('/function'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, integration_function_dto_1.IntegrationFunctionDto]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "functionIntegration", null);
tslib_1.__decorate([
    (0, common_1.Post)('/social/:integration/connect'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.CHANNEL]),
    (0, common_1.UseFilters)(new integration_missing_scopes_1.NotEnoughScopesFilter()),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('integration')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, connect_integration_dto_1.ConnectIntegrationDto]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "connectSocialMedia", null);
tslib_1.__decorate([
    (0, common_1.Post)('/disable'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], IntegrationsController.prototype, "disableChannel", null);
tslib_1.__decorate([
    (0, common_1.Post)('/instagram/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "saveInstagram", null);
tslib_1.__decorate([
    (0, common_1.Post)('/facebook/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "saveFacebook", null);
tslib_1.__decorate([
    (0, common_1.Post)('/linkedin-page/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "saveLinkedin", null);
tslib_1.__decorate([
    (0, common_1.Post)('/enable'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], IntegrationsController.prototype, "enableChannel", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "deleteChannel", null);
tslib_1.__decorate([
    (0, common_1.Get)('/plug/list'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getPlugList", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:id/plugs'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getPlugsByIntegrationId", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:id/plugs'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, plug_dto_1.PlugDto]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "postPlugsByIntegrationId", null);
tslib_1.__decorate([
    (0, common_1.Put)('/plugs/:id/activate'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Body)('status')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "changePlugActivation", null);
tslib_1.__decorate([
    (0, common_1.Get)('/telegram/updates'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationsController.prototype, "getUpdates", null);
exports.IntegrationsController = IntegrationsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Integrations'),
    (0, common_1.Controller)('/integrations'),
    tslib_1.__metadata("design:paramtypes", [integration_manager_1.IntegrationManager,
        integration_service_1.IntegrationService,
        posts_service_1.PostsService])
], IntegrationsController);
//# sourceMappingURL=integrations.controller.js.map