"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StarsListDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class StarsListDto {
}
exports.StarsListDto = StarsListDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", Number)
], StarsListDto.prototype, "page", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['login', 'totalStars', 'stars', 'date', 'forks', 'totalForks']),
    tslib_1.__metadata("design:type", String)
], StarsListDto.prototype, "key", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['desc', 'asc']),
    tslib_1.__metadata("design:type", String)
], StarsListDto.prototype, "state", void 0);
//# sourceMappingURL=stars.list.dto.js.map