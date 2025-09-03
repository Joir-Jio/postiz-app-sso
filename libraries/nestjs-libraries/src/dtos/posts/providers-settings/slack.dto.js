"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class SlackDto {
}
exports.SlackDto = SlackDto;
tslib_1.__decorate([
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SlackDto.prototype, "channel", void 0);
//# sourceMappingURL=slack.dto.js.map