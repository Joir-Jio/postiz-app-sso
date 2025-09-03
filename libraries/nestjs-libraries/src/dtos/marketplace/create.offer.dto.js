"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOfferDto = exports.SocialMedia = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SocialMedia {
}
exports.SocialMedia = SocialMedia;
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], SocialMedia.prototype, "total", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SocialMedia.prototype, "value", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], SocialMedia.prototype, "price", void 0);
class CreateOfferDto {
}
exports.CreateOfferDto = CreateOfferDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateOfferDto.prototype, "group", void 0);
tslib_1.__decorate([
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SocialMedia),
    tslib_1.__metadata("design:type", Array)
], CreateOfferDto.prototype, "socialMedia", void 0);
//# sourceMappingURL=create.offer.dto.js.map