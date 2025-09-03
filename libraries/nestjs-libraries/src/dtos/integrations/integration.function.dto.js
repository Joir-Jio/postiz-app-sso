"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationFunctionDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class IntegrationFunctionDto {
}
exports.IntegrationFunctionDto = IntegrationFunctionDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], IntegrationFunctionDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], IntegrationFunctionDto.prototype, "id", void 0);
//# sourceMappingURL=integration.function.dto.js.map