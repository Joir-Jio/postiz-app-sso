"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoFunctionDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
class VideoFunctionDto {
}
exports.VideoFunctionDto = VideoFunctionDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], VideoFunctionDto.prototype, "identifier", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], VideoFunctionDto.prototype, "functionName", void 0);
//# sourceMappingURL=video.function.dto.js.map