"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotReturnPasswordDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
class ForgotReturnPasswordDto {
}
exports.ForgotReturnPasswordDto = ForgotReturnPasswordDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.MinLength)(3),
    tslib_1.__metadata("design:type", String)
], ForgotReturnPasswordDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsIn)([(0, make_is_1.makeId)(10)], {
        message: 'Passwords do not match',
    }),
    (0, class_validator_1.ValidateIf)((o) => o.password !== o.repeatPassword),
    tslib_1.__metadata("design:type", String)
], ForgotReturnPasswordDto.prototype, "repeatPassword", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.MinLength)(5),
    tslib_1.__metadata("design:type", String)
], ForgotReturnPasswordDto.prototype, "token", void 0);
//# sourceMappingURL=forgot-return.password.dto.js.map