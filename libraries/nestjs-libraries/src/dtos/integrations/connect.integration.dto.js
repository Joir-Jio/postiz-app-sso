"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectIntegrationDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class ConnectIntegrationDto {
}
exports.ConnectIntegrationDto = ConnectIntegrationDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], ConnectIntegrationDto.prototype, "state", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], ConnectIntegrationDto.prototype, "code", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], ConnectIntegrationDto.prototype, "timezone", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], ConnectIntegrationDto.prototype, "refresh", void 0);
//# sourceMappingURL=connect.integration.dto.js.map