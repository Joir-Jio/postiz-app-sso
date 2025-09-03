"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemUserRepository = void 0;
const tslib_1 = require("tslib");
const prisma_service_1 = require("@gitroom/nestjs-libraries/database/prisma/prisma.service");
const common_1 = require("@nestjs/common");
let ItemUserRepository = class ItemUserRepository {
    constructor(_itemUser) {
        this._itemUser = _itemUser;
    }
    addOrRemoveItem(add, userId, item) {
        if (!add) {
            return this._itemUser.model.itemUser.deleteMany({
                where: {
                    user: {
                        id: userId,
                    },
                    key: item,
                },
            });
        }
        return this._itemUser.model.itemUser.create({
            data: {
                key: item,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }
    getItems(userId) {
        return this._itemUser.model.itemUser.findMany({
            where: {
                user: {
                    id: userId,
                },
            },
        });
    }
};
exports.ItemUserRepository = ItemUserRepository;
exports.ItemUserRepository = ItemUserRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaRepository])
], ItemUserRepository);
//# sourceMappingURL=item.user.repository.js.map