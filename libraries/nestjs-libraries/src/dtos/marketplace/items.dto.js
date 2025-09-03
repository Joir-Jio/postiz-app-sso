"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const tags_list_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/tags.list");
class ItemsDto {
}
exports.ItemsDto = ItemsDto;
tslib_1.__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsIn)(tags_list_1.allTagsOptions.map((p) => p.key), { each: true }),
    tslib_1.__metadata("design:type", Array)
], ItemsDto.prototype, "items", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], ItemsDto.prototype, "page", void 0);
//# sourceMappingURL=items.dto.js.map