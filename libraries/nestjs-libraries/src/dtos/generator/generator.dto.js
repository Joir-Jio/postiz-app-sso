"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratorDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class GeneratorDto {
}
exports.GeneratorDto = GeneratorDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    tslib_1.__metadata("design:type", String)
], GeneratorDto.prototype, "research", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], GeneratorDto.prototype, "isPicture", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['one_short', 'one_long', 'thread_short', 'thread_long']),
    tslib_1.__metadata("design:type", String)
], GeneratorDto.prototype, "format", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['personal', 'company']),
    tslib_1.__metadata("design:type", String)
], GeneratorDto.prototype, "tone", void 0);
//# sourceMappingURL=generator.dto.js.map