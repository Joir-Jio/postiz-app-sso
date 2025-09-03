"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class LoginUserDto {
}
exports.LoginUserDto = LoginUserDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateIf)((o) => !o.providerToken),
    (0, class_validator_1.MinLength)(3),
    tslib_1.__metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], LoginUserDto.prototype, "provider", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateIf)((o) => !o.password),
    tslib_1.__metadata("design:type", String)
], LoginUserDto.prototype, "providerToken", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
//# sourceMappingURL=login.user.dto.js.map