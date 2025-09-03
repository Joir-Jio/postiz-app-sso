"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const upload_factory_1 = require("@gitroom/nestjs-libraries/upload/upload.factory");
let IntegrationRepository = class IntegrationRepository {
    constructor(_integration, _posts, _plugs, _exisingPlugData, _customers, _mentions) {
        this._integration = _integration;
        this._posts = _posts;
        this._plugs = _plugs;
        this._exisingPlugData = _exisingPlugData;
        this._customers = _customers;
        this._mentions = _mentions;
        this.storage = upload_factory_1.UploadFactory.createStorage();
    }
    getMentions(platform, q) {
        return this._mentions.model.mentions.findMany({
            where: {
                platform,
                OR: [
                    {
                        name: {
                            contains: q,
                            mode: 'insensitive',
                        },
                    },
                    {
                        username: {
                            contains: q,
                            mode: 'insensitive',
                        },
                    },
                ],
            },
            orderBy: {
                name: 'asc',
            },
            take: 100,
            select: {
                name: true,
                username: true,
                image: true,
            },
        });
    }
    insertMentions(platform, mentions) {
        if (mentions.length === 0) {
            return [];
        }
        return this._mentions.model.mentions.createMany({
            data: mentions.map((mention) => ({
                platform,
                name: mention.name,
                username: mention.username,
                image: mention.image,
            })),
            skipDuplicates: true,
        });
    }
    async checkPreviousConnections(org, id) {
        const findIt = await this._integration.model.integration.findMany({
            where: {
                rootInternalId: id.split('_').pop(),
            },
            select: {
                organizationId: true,
                id: true,
            },
        });
        if (findIt.some((f) => f.organizationId === org)) {
            return false;
        }
        return findIt.length > 0;
    }
    updateProviderSettings(org, id, settings) {
        return this._integration.model.integration.update({
            where: {
                id,
                organizationId: org,
            },
            data: {
                additionalSettings: settings,
            },
        });
    }
    async setTimes(org, id, times) {
        return this._integration.model.integration.update({
            select: {
                id: true,
            },
            where: {
                id,
                organizationId: org,
            },
            data: {
                postingTimes: JSON.stringify(times.time),
            },
        });
    }
    getPlug(plugId) {
        return this._plugs.model.plugs.findFirst({
            where: {
                id: plugId,
            },
            include: {
                integration: true,
            },
        });
    }
    async getPlugs(orgId, integrationId) {
        return this._plugs.model.plugs.findMany({
            where: {
                integrationId,
                organizationId: orgId,
                activated: true,
            },
            include: {
                integration: {
                    select: {
                        id: true,
                        providerIdentifier: true,
                    },
                },
            },
        });
    }
    async updateIntegration(id, params) {
        if (params.picture &&
            (params.picture.indexOf(process.env.CLOUDFLARE_BUCKET_URL) === -1 ||
                params.picture.indexOf(process.env.FRONTEND_URL) === -1)) {
            params.picture = await this.storage.uploadSimple(params.picture);
        }
        return this._integration.model.integration.update({
            where: {
                id,
            },
            data: Object.assign({}, params),
        });
    }
    disconnectChannel(org, id) {
        return this._integration.model.integration.update({
            where: {
                id,
                organizationId: org,
            },
            data: {
                refreshNeeded: true,
            },
        });
    }
    async createOrUpdateIntegration(additionalSettings, oneTimeToken, org, name, picture, type, internalId, provider, token, refreshToken = '', expiresIn = 999999999, username, isBetweenSteps = false, refresh, timezone, customInstanceDetails) {
        var _a;
        const postTimes = timezone
            ? {
                postingTimes: JSON.stringify([
                    { time: 560 - timezone },
                    { time: 850 - timezone },
                    { time: 1140 - timezone },
                ]),
            }
            : {};
        const upsert = await this._integration.model.integration.upsert({
            where: {
                organizationId_internalId: {
                    internalId,
                    organizationId: org,
                },
            },
            create: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ type: type, name, providerIdentifier: provider, token, profile: username }, (picture ? { picture } : {})), { inBetweenSteps: isBetweenSteps, refreshToken }), (expiresIn
                ? { tokenExpiration: new Date(Date.now() + expiresIn * 1000) }
                : {})), { internalId }), postTimes), { organizationId: org, refreshNeeded: false, rootInternalId: internalId.split('_').pop() }), (customInstanceDetails ? { customInstanceDetails } : {})), { additionalSettings: additionalSettings
                    ? JSON.stringify(additionalSettings)
                    : '[]' }),
            update: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (additionalSettings
                ? { additionalSettings: JSON.stringify(additionalSettings) }
                : {})), (customInstanceDetails ? { customInstanceDetails } : {})), { type: type }), (!refresh
                ? {
                    inBetweenSteps: isBetweenSteps,
                }
                : {})), (picture ? { picture } : {})), { profile: username, providerIdentifier: provider, token,
                refreshToken }), (expiresIn
                ? { tokenExpiration: new Date(Date.now() + expiresIn * 1000) }
                : {})), { internalId, organizationId: org, deletedAt: null, refreshNeeded: false }),
        });
        if (oneTimeToken) {
            const rootId = ((_a = (await this._integration.model.integration.findFirst({
                where: {
                    organizationId: org,
                    internalId: internalId,
                },
            }))) === null || _a === void 0 ? void 0 : _a.rootInternalId) || internalId.split('_').pop();
            await this._integration.model.integration.updateMany({
                where: {
                    id: {
                        not: upsert.id,
                    },
                    organizationId: org,
                    rootInternalId: rootId,
                },
                data: Object.assign({ token,
                    refreshToken, refreshNeeded: false }, (expiresIn
                    ? { tokenExpiration: new Date(Date.now() + expiresIn * 1000) }
                    : {})),
            });
        }
        return upsert;
    }
    needsToBeRefreshed() {
        return this._integration.model.integration.findMany({
            where: {
                tokenExpiration: {
                    lte: (0, dayjs_1.default)().add(1, 'day').toDate(),
                },
                inBetweenSteps: false,
                deletedAt: null,
                refreshNeeded: false,
            },
        });
    }
    refreshNeeded(org, id) {
        return this._integration.model.integration.update({
            where: {
                id,
                organizationId: org,
            },
            data: {
                refreshNeeded: true,
            },
        });
    }
    updateNameAndUrl(id, name, url) {
        return this._integration.model.integration.update({
            where: {
                id,
            },
            data: Object.assign(Object.assign({}, (name ? { name } : {})), (url ? { picture: url } : {})),
        });
    }
    getIntegrationById(org, id) {
        return this._integration.model.integration.findFirst({
            where: {
                organizationId: org,
                id,
            },
        });
    }
    async getIntegrationForOrder(id, order, user, org) {
        const integration = await this._posts.model.post.findFirst({
            where: {
                integrationId: id,
                submittedForOrder: {
                    id: order,
                    messageGroup: {
                        OR: [
                            { sellerId: user },
                            { buyerId: user },
                            { buyerOrganizationId: org },
                        ],
                    },
                },
            },
            select: {
                integration: {
                    select: {
                        id: true,
                        name: true,
                        picture: true,
                        inBetweenSteps: true,
                        providerIdentifier: true,
                    },
                },
            },
        });
        return integration === null || integration === void 0 ? void 0 : integration.integration;
    }
    async updateOnCustomerName(org, id, name) {
        const customer = !name
            ? undefined
            : (await this._customers.model.customer.findFirst({
                where: {
                    orgId: org,
                    name,
                },
            })) ||
                (await this._customers.model.customer.create({
                    data: {
                        name,
                        orgId: org,
                    },
                }));
        return this._integration.model.integration.update({
            where: {
                id,
                organizationId: org,
            },
            data: {
                customer: !customer
                    ? { disconnect: true }
                    : {
                        connect: {
                            id: customer.id,
                        },
                    },
            },
        });
    }
    updateIntegrationGroup(org, id, group) {
        return this._integration.model.integration.update({
            where: {
                id,
                organizationId: org,
            },
            data: !group
                ? {
                    customer: {
                        disconnect: true,
                    },
                }
                : {
                    customer: {
                        connect: {
                            id: group,
                        },
                    },
                },
        });
    }
    customers(orgId) {
        return this._customers.model.customer.findMany({
            where: {
                orgId,
                deletedAt: null,
            },
        });
    }
    getIntegrationsList(org) {
        return this._integration.model.integration.findMany({
            where: {
                organizationId: org,
                deletedAt: null,
            },
            include: {
                customer: true,
            },
        });
    }
    async disableChannel(org, id) {
        await this._integration.model.integration.update({
            where: {
                id,
                organizationId: org,
            },
            data: {
                disabled: true,
            },
        });
    }
    async enableChannel(org, id) {
        await this._integration.model.integration.update({
            where: {
                id,
                organizationId: org,
            },
            data: {
                disabled: false,
            },
        });
    }
    getPostsForChannel(org, id) {
        return this._posts.model.post.groupBy({
            by: ['group'],
            where: {
                organizationId: org,
                integrationId: id,
                deletedAt: null,
            },
        });
    }
    deleteChannel(org, id) {
        return this._integration.model.integration.update({
            where: {
                id,
                organizationId: org,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
    async checkForDeletedOnceAndUpdate(org, page) {
        return this._integration.model.integration.updateMany({
            where: {
                organizationId: org,
                internalId: page,
                deletedAt: {
                    not: null,
                },
            },
            data: {
                internalId: (0, make_is_1.makeId)(10),
            },
        });
    }
    async disableIntegrations(org, totalChannels) {
        const getChannels = await this._integration.model.integration.findMany({
            where: {
                organizationId: org,
                disabled: false,
                deletedAt: null,
            },
            take: totalChannels,
            select: {
                id: true,
            },
        });
        for (const channel of getChannels) {
            await this._integration.model.integration.update({
                where: {
                    id: channel.id,
                },
                data: {
                    disabled: true,
                },
            });
        }
    }
    getPlugsByIntegrationId(org, id) {
        return this._plugs.model.plugs.findMany({
            where: {
                organizationId: org,
                integrationId: id,
            },
        });
    }
    createOrUpdatePlug(org, integrationId, body) {
        return this._plugs.model.plugs.upsert({
            where: {
                organizationId: org,
                plugFunction_integrationId: {
                    integrationId,
                    plugFunction: body.func,
                },
            },
            create: {
                integrationId,
                organizationId: org,
                plugFunction: body.func,
                data: JSON.stringify(body.fields),
                activated: true,
            },
            update: {
                data: JSON.stringify(body.fields),
            },
            select: {
                activated: true,
            },
        });
    }
    changePlugActivation(orgId, plugId, status) {
        return this._plugs.model.plugs.update({
            where: {
                organizationId: orgId,
                id: plugId,
            },
            data: {
                activated: !!status,
            },
        });
    }
    async loadExisingData(methodName, integrationId, id) {
        return this._exisingPlugData.model.exisingPlugData.findMany({
            where: {
                integrationId,
                methodName,
                value: {
                    in: id,
                },
            },
        });
    }
    async saveExisingData(methodName, integrationId, value) {
        return this._exisingPlugData.model.exisingPlugData.createMany({
            data: value.map((p) => ({
                integrationId,
                methodName,
                value: p,
            })),
        });
    }
    async getPostingTimes(orgId, integrationsId) {
        return this._integration.model.integration.findMany({
            where: Object.assign(Object.assign({}, (integrationsId ? { id: integrationsId } : {})), { organizationId: orgId, disabled: false, deletedAt: null }),
            select: {
                postingTimes: true,
            },
        });
    }
};
exports.IntegrationRepository = IntegrationRepository;
exports.IntegrationRepository = IntegrationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository])
], IntegrationRepository);
//# sourceMappingURL=integration.repository.js.map