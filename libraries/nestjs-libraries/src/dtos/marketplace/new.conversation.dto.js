"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewConversationDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class NewConversationDto {
}
exports.NewConversationDto = NewConversationDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], NewConversationDto.prototype, "to", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(50),
    tslib_1.__metadata("design:type", String)
], NewConversationDto.prototype, "message", void 0);
//# sourceMappingURL=new.conversation.dto.js.map