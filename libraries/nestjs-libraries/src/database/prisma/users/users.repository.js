"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const tags_list_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/tags.list");
let UsersRepository = class UsersRepository {
    constructor(_user) {
        this._user = _user;
    }
    getImpersonateUser(name) {
        return this._user.model.user.findMany({
            where: {
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
            select: {
                id: true,
                name: true,
                email: true,
            },
            take: 10,
        });
    }
    getUserById(id) {
        return this._user.model.user.findFirst({
            where: {
                id,
            },
        });
    }
    getUserByEmail(email) {
        return this._user.model.user.findFirst({
            where: {
                email,
                providerName: client_1.Provider.LOCAL,
            },
            include: {
                picture: {
                    select: {
                        id: true,
                        path: true,
                    },
                },
            },
        });
    }
    activateUser(id) {
        return this._user.model.user.update({
            where: {
                id,
            },
            data: {
                activated: true,
            },
        });
    }
    getUserByProvider(providerId, provider) {
        return this._user.model.user.findFirst({
            where: {
                providerId,
                providerName: provider,
            },
        });
    }
    updatePassword(id, password) {
        return this._user.model.user.update({
            where: {
                id,
                providerName: client_1.Provider.LOCAL,
            },
            data: {
                password: auth_service_1.AuthService.hashPassword(password),
            },
        });
    }
    changeAudienceSize(userId, audience) {
        return this._user.model.user.update({
            where: {
                id: userId,
            },
            data: {
                audience,
            },
        });
    }
    changeMarketplaceActive(userId, active) {
        return this._user.model.user.update({
            where: {
                id: userId,
            },
            data: {
                marketplace: active,
            },
        });
    }
    async getPersonal(userId) {
        const user = await this._user.model.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                bio: true,
                picture: {
                    select: {
                        id: true,
                        path: true,
                    },
                },
            },
        });
        return user;
    }
    async changePersonal(userId, body) {
        await this._user.model.user.update({
            where: {
                id: userId,
            },
            data: {
                name: body.fullname,
                bio: body.bio,
                picture: body.picture
                    ? {
                        connect: {
                            id: body.picture.id,
                        },
                    }
                    : {
                        disconnect: true,
                    },
            },
        });
    }
    async getMarketplacePeople(orgId, userId, items) {
        const info = {
            id: {
                not: userId,
            },
            account: {
                not: null,
            },
            connectedAccount: true,
            marketplace: true,
            items: Object.assign({}, (items.items.length
                ? {
                    some: {
                        OR: items.items.map((key) => ({ key })),
                    },
                }
                : {
                    some: {
                        OR: tags_list_1.allTagsOptions.map((p) => ({ key: p.key })),
                    },
                })),
        };
        const list = await this._user.model.user.findMany({
            where: Object.assign({}, info),
            select: {
                id: true,
                name: true,
                bio: true,
                audience: true,
                picture: {
                    select: {
                        id: true,
                        path: true,
                    },
                },
                organizations: {
                    select: {
                        organization: {
                            select: {
                                Integration: {
                                    where: {
                                        disabled: false,
                                        deletedAt: null,
                                    },
                                    select: {
                                        providerIdentifier: true,
                                    },
                                },
                            },
                        },
                    },
                },
                items: {
                    select: {
                        key: true,
                    },
                },
            },
            skip: (items.page - 1) * 8,
            take: 8,
        });
        const count = await this._user.model.user.count({
            where: Object.assign({}, info),
        });
        return {
            list,
            count,
        };
    }
};
exports.UsersRepository = UsersRepository;
exports.UsersRepository = UsersRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository])
], UsersRepository);
//# sourceMappingURL=users.repository.js.map