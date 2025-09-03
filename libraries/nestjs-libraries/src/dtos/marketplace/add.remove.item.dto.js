"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRemoveItemDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const tags_list_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/tags.list");
class AddRemoveItemDto {
}
exports.AddRemoveItemDto = AddRemoveItemDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(tags_list_1.allTagsOptions.map((p) => p.key)),
    tslib_1.__metadata("design:type", String)
], AddRemoveItemDto.prototype, "key", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], AddRemoveItemDto.prototype, "state", void 0);
//# sourceMappingURL=add.remove.item.dto.js.map