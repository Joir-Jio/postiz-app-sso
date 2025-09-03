"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class XDto {
}
exports.XDto = XDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^(https:\/\/x\.com\/i\/communities\/\d+)?$/, {
        message: 'Invalid X community URL. It should be in the format: https://x.com/i/communities/1493446837214187523',
    }),
    tslib_1.__metadata("design:type", String)
], XDto.prototype, "community", void 0);
//# sourceMappingURL=x.dto.js.map