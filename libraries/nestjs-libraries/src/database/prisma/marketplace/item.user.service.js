"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemUserService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const item_user_repository_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/item.user.repository");
let ItemUserService = class ItemUserService {
    constructor(_itemUserRepository) {
        this._itemUserRepository = _itemUserRepository;
    }
    addOrRemoveItem(add, userId, item) {
        return this._itemUserRepository.addOrRemoveItem(add, userId, item);
    }
    getItems(userId) {
        return this._itemUserRepository.getItems(userId);
    }
};
exports.ItemUserService = ItemUserService;
exports.ItemUserService = ItemUserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [item_user_repository_1.ItemUserRepository])
], ItemUserService);
//# sourceMappingURL=item.user.service.js.map