"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class ApiKeyDto {
}
exports.ApiKeyDto = ApiKeyDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4, {
        message: 'Must be at least 4 characters',
    }),
    tslib_1.__metadata("design:type", String)
], ApiKeyDto.prototype, "api", void 0);
//# sourceMappingURL=api.key.dto.js.map