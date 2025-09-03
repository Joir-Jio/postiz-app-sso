"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const client_1 = require("@prisma/client");
const common_1 = require("@nestjs/common");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
let OrganizationRepository = class OrganizationRepository {
    constructor(_organization, _userOrg, _user) {
        this._organization = _organization;
        this._userOrg = _userOrg;
        this._user = _user;
    }
    getOrgByApiKey(api) {
        return this._organization.model.organization.findFirst({
            where: {
                apiKey: api,
            },
            include: {
                subscription: {
                    select: {
                        subscriptionTier: true,
                        totalChannels: true,
                        isLifetime: true,
                    },
                },
            },
        });
    }
    getCount() {
        return this._organization.model.organization.count();
    }
    getUserOrg(id) {
        return this._userOrg.model.userOrganization.findFirst({
            where: {
                id,
            },
            select: {
                user: true,
                organization: {
                    include: {
                        users: {
                            select: {
                                id: true,
                                disabled: true,
                                role: true,
                                userId: true,
                            },
                        },
                        subscription: {
                            select: {
                                subscriptionTier: true,
                                totalChannels: true,
                                isLifetime: true,
                            },
                        },
                    },
                },
            },
        });
    }
    getImpersonateUser(name) {
        return this._userOrg.model.userOrganization.findMany({
            where: {
                user: {
                    OR: [
                        {
                            name: {
                                contains: name,
                            },
                        },
                        {
                            email: {
                                contains: name,
                            },
                        },
                        {
                            id: {
                                contains: name,
                            },
                        },
                    ],
                },
            },
            select: {
                id: true,
                organization: {
                    select: {
                        id: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    updateApiKey(orgId) {
        return this._organization.model.organization.update({
            where: {
                id: orgId,
            },
            data: {
                apiKey: auth_service_1.AuthService.fixedEncryption((0, make_is_1.makeId)(20)),
            },
        });
    }
    async getOrgsByUserId(userId) {
        return this._organization.model.organization.findMany({
            where: {
                users: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                users: {
                    where: {
                        userId,
                    },
                    select: {
                        disabled: true,
                        role: true,
                    },
                },
                subscription: {
                    select: {
                        subscriptionTier: true,
                        totalChannels: true,
                        isLifetime: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
    async getOrgById(id) {
        return this._organization.model.organization.findUnique({
            where: {
                id,
            },
        });
    }
    async addUserToOrg(userId, id, orgId, role) {
        var _a;
        const checkIfInviteExists = await this._user.model.user.findFirst({
            where: {
                inviteId: id,
            },
        });
        if (checkIfInviteExists) {
            return false;
        }
        const checkForSubscription = await this._organization.model.organization.findFirst({
            where: {
                id: orgId,
            },
            select: {
                subscription: true,
            },
        });
        if (process.env.STRIPE_PUBLISHABLE_KEY &&
            ((_a = checkForSubscription === null || checkForSubscription === void 0 ? void 0 : checkForSubscription.subscription) === null || _a === void 0 ? void 0 : _a.subscriptionTier) ===
                client_1.SubscriptionTier.STANDARD) {
            return false;
        }
        const create = await this._userOrg.model.userOrganization.create({
            data: {
                role,
                userId,
                organizationId: orgId,
            },
        });
        await this._user.model.user.update({
            where: {
                id: userId,
            },
            data: {
                inviteId: id,
            },
        });
        return create;
    }
    async createOrgAndUser(body, hasEmail, ip, userAgent) {
        return this._organization.model.organization.create({
            data: {
                name: body.company,
                apiKey: auth_service_1.AuthService.fixedEncryption((0, make_is_1.makeId)(20)),
                allowTrial: true,
                isTrailing: true,
                users: {
                    create: {
                        role: client_1.Role.SUPERADMIN,
                        user: {
                            create: {
                                activated: body.provider !== 'LOCAL' || !hasEmail,
                                email: body.email,
                                password: body.password
                                    ? auth_service_1.AuthService.hashPassword(body.password)
                                    : '',
                                providerName: body.provider,
                                providerId: body.providerId || '',
                                timezone: 0,
                                ip,
                                agent: userAgent,
                            },
                        },
                    },
                },
            },
            select: {
                id: true,
                users: {
                    select: {
                        user: true,
                    },
                },
            },
        });
    }
    getOrgByCustomerId(customerId) {
        return this._organization.model.organization.findFirst({
            where: {
                paymentId: customerId,
            },
        });
    }
    async getTeam(orgId) {
        return this._organization.model.organization.findUnique({
            where: {
                id: orgId,
            },
            select: {
                users: {
                    select: {
                        role: true,
                        user: {
                            select: {
                                email: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });
    }
    getAllUsersOrgs(orgId) {
        return this._organization.model.organization.findUnique({
            where: {
                id: orgId,
            },
            select: {
                users: {
                    select: {
                        user: {
                            select: {
                                email: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async deleteTeamMember(orgId, userId) {
        return this._userOrg.model.userOrganization.delete({
            where: {
                userId_organizationId: {
                    userId,
                    organizationId: orgId,
                },
            },
        });
    }
    disableOrEnableNonSuperAdminUsers(orgId, disable) {
        return this._userOrg.model.userOrganization.updateMany({
            where: {
                organizationId: orgId,
                role: {
                    not: client_1.Role.SUPERADMIN,
                },
            },
            data: {
                disabled: disable,
            },
        });
    }
};
exports.OrganizationRepository = OrganizationRepository;
exports.OrganizationRepository = OrganizationRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository,
        prisma_service_1.PrismaRepository])
], OrganizationRepository);
//# sourceMappingURL=organization.repository.js.map