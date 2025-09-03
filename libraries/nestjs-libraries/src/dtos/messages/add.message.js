"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMessageDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class AddMessageDto {
}
exports.AddMessageDto = AddMessageDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    tslib_1.__metadata("design:type", String)
], AddMessageDto.prototype, "message", void 0);
//# sourceMappingURL=add.message.js.map