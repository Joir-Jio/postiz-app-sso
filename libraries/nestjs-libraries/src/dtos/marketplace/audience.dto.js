"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudienceDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class AudienceDto {
}
exports.AudienceDto = AudienceDto;
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(99999999),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], AudienceDto.prototype, "audience", void 0);
//# sourceMappingURL=audience.dto.js.map