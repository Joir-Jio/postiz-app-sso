"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const integration_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.repository");
const integration_manager_1 = require("@gitroom/nestjs-libraries/integrations/integration.manager");
const notification_service_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notification.service");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const timer_1 = require("@gitroom/helpers/utils/timer");
const redis_service_1 = require("@gitroom/nestjs-libraries/redis/redis.service");
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const upload_factory_1 = require("@gitroom/nestjs-libraries/upload/upload.factory");
const client_1 = require("@gitroom/nestjs-libraries/bull-mq-transport-new/client");
const lodash_1 = require("lodash");
const utc_1 = tslib_1.__importDefault(require("dayjs/plugin/utc"));
const autopost_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/autopost/autopost.repository");
dayjs_1.default.extend(utc_1.default);
let IntegrationService = class IntegrationService {
    constructor(_integrationRepository, _autopostsRepository, _integrationManager, _notificationService, _workerServiceProducer) {
        this._integrationRepository = _integrationRepository;
        this._autopostsRepository = _autopostsRepository;
        this._integrationManager = _integrationManager;
        this._notificationService = _notificationService;
        this._workerServiceProducer = _workerServiceProducer;
        this.storage = upload_factory_1.UploadFactory.createStorage();
    }
    async changeActiveCron(orgId) {
        const data = await this._autopostsRepository.getAutoposts(orgId);
        for (const item of data.filter((f) => f.active)) {
            await this._workerServiceProducer.deleteScheduler('cron', item.id);
        }
        return true;
    }
    getMentions(platform, q) {
        return this._integrationRepository.getMentions(platform, q);
    }
    insertMentions(platform, mentions) {
        return this._integrationRepository.insertMentions(platform, mentions);
    }
    async setTimes(orgId, integrationId, times) {
        return this._integrationRepository.setTimes(orgId, integrationId, times);
    }
    updateProviderSettings(org, id, additionalSettings) {
        return this._integrationRepository.updateProviderSettings(org, id, additionalSettings);
    }
    checkPreviousConnections(org, id) {
        return this._integrationRepository.checkPreviousConnections(org, id);
    }
    async createOrUpdateIntegration(additionalSettings, oneTimeToken, org, name, picture, type, internalId, provider, token, refreshToken = '', expiresIn, username, isBetweenSteps = false, refresh, timezone, customInstanceDetails) {
        const uploadedPicture = picture
            ? (picture === null || picture === void 0 ? void 0 : picture.indexOf('imagedelivery.net')) > -1
                ? picture
                : await this.storage.uploadSimple(picture)
            : undefined;
        return this._integrationRepository.createOrUpdateIntegration(additionalSettings, oneTimeToken, org, name, uploadedPicture, type, internalId, provider, token, refreshToken, expiresIn, username, isBetweenSteps, refresh, timezone, customInstanceDetails);
    }
    updateIntegrationGroup(org, id, group) {
        return this._integrationRepository.updateIntegrationGroup(org, id, group);
    }
    updateOnCustomerName(org, id, name) {
        return this._integrationRepository.updateOnCustomerName(org, id, name);
    }
    getIntegrationsList(org) {
        return this._integrationRepository.getIntegrationsList(org);
    }
    getIntegrationForOrder(id, order, user, org) {
        return this._integrationRepository.getIntegrationForOrder(id, order, user, org);
    }
    updateNameAndUrl(id, name, url) {
        return this._integrationRepository.updateNameAndUrl(id, name, url);
    }
    getIntegrationById(org, id) {
        return this._integrationRepository.getIntegrationById(org, id);
    }
    async refreshToken(provider, refresh) {
        try {
            const { refreshToken, accessToken, expiresIn } = await provider.refreshToken(refresh);
            if (!refreshToken || !accessToken || !expiresIn) {
                return false;
            }
            return { refreshToken, accessToken, expiresIn };
        }
        catch (e) {
            return false;
        }
    }
    async disconnectChannel(orgId, integration) {
        await this._integrationRepository.disconnectChannel(orgId, integration.id);
        await this.informAboutRefreshError(orgId, integration);
    }
    async informAboutRefreshError(orgId, integration, err = '') {
        await this._notificationService.inAppNotification(orgId, `Could not refresh your ${integration.providerIdentifier} channel ${err}`, `Could not refresh your ${integration.providerIdentifier} channel ${err}. Please go back to the system and connect it again ${process.env.FRONTEND_URL}/launches`, true);
    }
    async refreshNeeded(org, id) {
        return this._integrationRepository.refreshNeeded(org, id);
    }
    async refreshTokens() {
        const integrations = await this._integrationRepository.needsToBeRefreshed();
        for (const integration of integrations) {
            const provider = this._integrationManager.getSocialIntegration(integration.providerIdentifier);
            const data = await this.refreshToken(provider, integration.refreshToken);
            if (!data) {
                await this.informAboutRefreshError(integration.organizationId, integration);
                await this._integrationRepository.refreshNeeded(integration.organizationId, integration.id);
                return;
            }
            const { refreshToken, accessToken, expiresIn } = data;
            await this.createOrUpdateIntegration(undefined, !!provider.oneTimeToken, integration.organizationId, integration.name, undefined, 'social', integration.internalId, integration.providerIdentifier, accessToken, refreshToken, expiresIn);
        }
    }
    async disableChannel(org, id) {
        return this._integrationRepository.disableChannel(org, id);
    }
    async enableChannel(org, totalChannels, id) {
        const integrations = (await this._integrationRepository.getIntegrationsList(org)).filter((f) => !f.disabled);
        if (!!process.env.STRIPE_PUBLISHABLE_KEY &&
            integrations.length >= totalChannels) {
            throw new Error('You have reached the maximum number of channels');
        }
        return this._integrationRepository.enableChannel(org, id);
    }
    async getPostsForChannel(org, id) {
        return this._integrationRepository.getPostsForChannel(org, id);
    }
    async deleteChannel(org, id) {
        return this._integrationRepository.deleteChannel(org, id);
    }
    async disableIntegrations(org, totalChannels) {
        return this._integrationRepository.disableIntegrations(org, totalChannels);
    }
    async checkForDeletedOnceAndUpdate(org, page) {
        return this._integrationRepository.checkForDeletedOnceAndUpdate(org, page);
    }
    async saveInstagram(org, id, data) {
        const getIntegration = await this._integrationRepository.getIntegrationById(org, id);
        if (getIntegration && !getIntegration.inBetweenSteps) {
            throw new common_1.HttpException('Invalid request', common_1.HttpStatus.BAD_REQUEST);
        }
        const instagram = this._integrationManager.getSocialIntegration('instagram');
        const getIntegrationInformation = await instagram.fetchPageInformation(getIntegration === null || getIntegration === void 0 ? void 0 : getIntegration.token, data);
        await this.checkForDeletedOnceAndUpdate(org, getIntegrationInformation.id);
        await this._integrationRepository.updateIntegration(id, {
            picture: getIntegrationInformation.picture,
            internalId: getIntegrationInformation.id,
            name: getIntegrationInformation.name,
            inBetweenSteps: false,
            token: getIntegrationInformation.access_token,
            profile: getIntegrationInformation.username,
        });
        return { success: true };
    }
    async saveLinkedin(org, id, page) {
        const getIntegration = await this._integrationRepository.getIntegrationById(org, id);
        if (getIntegration && !getIntegration.inBetweenSteps) {
            throw new common_1.HttpException('Invalid request', common_1.HttpStatus.BAD_REQUEST);
        }
        const linkedin = this._integrationManager.getSocialIntegration('linkedin-page');
        const getIntegrationInformation = await linkedin.fetchPageInformation(getIntegration === null || getIntegration === void 0 ? void 0 : getIntegration.token, page);
        await this.checkForDeletedOnceAndUpdate(org, String(getIntegrationInformation.id));
        await this._integrationRepository.updateIntegration(String(id), {
            picture: getIntegrationInformation.picture,
            internalId: String(getIntegrationInformation.id),
            name: getIntegrationInformation.name,
            inBetweenSteps: false,
            token: getIntegrationInformation.access_token,
            profile: getIntegrationInformation.username,
        });
        return { success: true };
    }
    async saveFacebook(org, id, page) {
        const getIntegration = await this._integrationRepository.getIntegrationById(org, id);
        if (getIntegration && !getIntegration.inBetweenSteps) {
            throw new common_1.HttpException('Invalid request', common_1.HttpStatus.BAD_REQUEST);
        }
        const facebook = this._integrationManager.getSocialIntegration('facebook');
        const getIntegrationInformation = await facebook.fetchPageInformation(getIntegration === null || getIntegration === void 0 ? void 0 : getIntegration.token, page);
        await this.checkForDeletedOnceAndUpdate(org, getIntegrationInformation.id);
        await this._integrationRepository.updateIntegration(id, {
            picture: getIntegrationInformation.picture,
            internalId: getIntegrationInformation.id,
            name: getIntegrationInformation.name,
            inBetweenSteps: false,
            token: getIntegrationInformation.access_token,
            profile: getIntegrationInformation.username,
        });
        return { success: true };
    }
    async checkAnalytics(org, integration, date, forceRefresh = false) {
        const getIntegration = await this.getIntegrationById(org.id, integration);
        if (!getIntegration) {
            throw new Error('Invalid integration');
        }
        if (getIntegration.type !== 'social') {
            return [];
        }
        const integrationProvider = this._integrationManager.getSocialIntegration(getIntegration.providerIdentifier);
        if ((0, dayjs_1.default)(getIntegration === null || getIntegration === void 0 ? void 0 : getIntegration.tokenExpiration).isBefore((0, dayjs_1.default)()) ||
            forceRefresh) {
            const { accessToken, expiresIn, refreshToken, additionalSettings } = await new Promise((res) => {
                return integrationProvider
                    .refreshToken(getIntegration.refreshToken)
                    .then((r) => res(r))
                    .catch(() => {
                    res({
                        error: '',
                        accessToken: '',
                        id: '',
                        name: '',
                        picture: '',
                        username: '',
                        additionalSettings: undefined,
                    });
                });
            });
            if (accessToken) {
                await this.createOrUpdateIntegration(additionalSettings, !!integrationProvider.oneTimeToken, getIntegration.organizationId, getIntegration.name, getIntegration.picture, 'social', getIntegration.internalId, getIntegration.providerIdentifier, accessToken, refreshToken, expiresIn);
                getIntegration.token = accessToken;
                if (integrationProvider.refreshWait) {
                    await (0, timer_1.timer)(10000);
                }
            }
            else {
                await this.disconnectChannel(org.id, getIntegration);
                return [];
            }
        }
        const getIntegrationData = await redis_service_1.ioRedis.get(`integration:${org.id}:${integration}:${date}`);
        if (getIntegrationData) {
            return JSON.parse(getIntegrationData);
        }
        if (integrationProvider.analytics) {
            try {
                const loadAnalytics = await integrationProvider.analytics(getIntegration.internalId, getIntegration.token, +date);
                await redis_service_1.ioRedis.set(`integration:${org.id}:${integration}:${date}`, JSON.stringify(loadAnalytics), 'EX', !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
                    ? 1
                    : 3600);
                return loadAnalytics;
            }
            catch (e) {
                if (e instanceof social_abstract_1.RefreshToken) {
                    return this.checkAnalytics(org, integration, date, true);
                }
            }
        }
        return [];
    }
    customers(orgId) {
        return this._integrationRepository.customers(orgId);
    }
    getPlugsByIntegrationId(org, integrationId) {
        return this._integrationRepository.getPlugsByIntegrationId(org, integrationId);
    }
    async processInternalPlug(data, forceRefresh = false) {
        var _a;
        const originalIntegration = await this._integrationRepository.getIntegrationById(data.orgId, data.originalIntegration);
        const getIntegration = await this._integrationRepository.getIntegrationById(data.orgId, data.integration);
        if (!getIntegration || !originalIntegration) {
            return;
        }
        const getAllInternalPlugs = this._integrationManager
            .getInternalPlugs(getIntegration.providerIdentifier)
            .internalPlugs.find((p) => p.identifier === data.plugName);
        if (!getAllInternalPlugs) {
            return;
        }
        const getSocialIntegration = this._integrationManager.getSocialIntegration(getIntegration.providerIdentifier);
        if ((0, dayjs_1.default)(getIntegration === null || getIntegration === void 0 ? void 0 : getIntegration.tokenExpiration).isBefore((0, dayjs_1.default)()) ||
            forceRefresh) {
            const { accessToken, expiresIn, refreshToken, additionalSettings } = await new Promise((res) => {
                getSocialIntegration
                    .refreshToken(getIntegration.refreshToken)
                    .then((r) => res(r))
                    .catch(() => res({
                    accessToken: '',
                    expiresIn: 0,
                    refreshToken: '',
                    id: '',
                    name: '',
                    username: '',
                    picture: '',
                    additionalSettings: undefined,
                }));
            });
            if (!accessToken) {
                await this.refreshNeeded(getIntegration.organizationId, getIntegration.id);
                await this.informAboutRefreshError(getIntegration.organizationId, getIntegration);
                return {};
            }
            await this.createOrUpdateIntegration(additionalSettings, !!getSocialIntegration.oneTimeToken, getIntegration.organizationId, getIntegration.name, getIntegration.picture, 'social', getIntegration.internalId, getIntegration.providerIdentifier, accessToken, refreshToken, expiresIn);
            getIntegration.token = accessToken;
            if (getSocialIntegration.refreshWait) {
                await (0, timer_1.timer)(10000);
            }
        }
        try {
            await ((_a = getSocialIntegration === null || getSocialIntegration === void 0 ? void 0 : getSocialIntegration[getAllInternalPlugs.methodName]) === null || _a === void 0 ? void 0 : _a.call(getSocialIntegration, getIntegration, originalIntegration, data.post, data.information));
        }
        catch (err) {
            if (err instanceof social_abstract_1.RefreshToken) {
                return this.processInternalPlug(data, true);
            }
            return;
        }
    }
    async processPlugs(data) {
        const getPlugById = await this._integrationRepository.getPlug(data.plugId);
        if (!getPlugById) {
            return;
        }
        const integration = this._integrationManager.getSocialIntegration(getPlugById.integration.providerIdentifier);
        const findPlug = this._integrationManager
            .getAllPlugs()
            .find((p) => p.identifier === getPlugById.integration.providerIdentifier);
        const process = await integration[getPlugById.plugFunction](getPlugById.integration, data.postId, JSON.parse(getPlugById.data).reduce((all, current) => {
            all[current.name] = current.value;
            return all;
        }, {}));
        if (process) {
            return;
        }
        if (data.totalRuns === data.currentRun) {
            return;
        }
        this._workerServiceProducer.emit('plugs', {
            id: 'plug_' + data.postId + '_' + findPlug.identifier,
            options: {
                delay: data.delay,
            },
            payload: {
                plugId: data.plugId,
                postId: data.postId,
                delay: data.delay,
                totalRuns: data.totalRuns,
                currentRun: data.currentRun + 1,
            },
        });
    }
    async createOrUpdatePlug(orgId, integrationId, body) {
        const { activated } = await this._integrationRepository.createOrUpdatePlug(orgId, integrationId, body);
        return {
            activated,
        };
    }
    async changePlugActivation(orgId, plugId, status) {
        const { id, integrationId, plugFunction } = await this._integrationRepository.changePlugActivation(orgId, plugId, status);
        return { id };
    }
    async getPlugs(orgId, integrationId) {
        return this._integrationRepository.getPlugs(orgId, integrationId);
    }
    async loadExisingData(methodName, integrationId, id) {
        const exisingData = await this._integrationRepository.loadExisingData(methodName, integrationId, id);
        const loadOnlyIds = exisingData.map((p) => p.value);
        return (0, lodash_1.difference)(id, loadOnlyIds);
    }
    async findFreeDateTime(orgId, integrationsId) {
        const findTimes = await this._integrationRepository.getPostingTimes(orgId, integrationsId);
        return (0, lodash_1.uniq)(findTimes.reduce((all, current) => {
            return [
                ...all,
                ...JSON.parse(current.postingTimes).map((p) => p.time),
            ];
        }, []));
    }
};
exports.IntegrationService = IntegrationService;
exports.IntegrationService = IntegrationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [integration_repository_1.IntegrationRepository,
        autopost_repository_1.AutopostRepository,
        integration_manager_1.IntegrationManager,
        notification_service_1.NotificationService,
        client_1.BullMqClient])
], IntegrationService);
//# sourceMappingURL=integration.service.js.map