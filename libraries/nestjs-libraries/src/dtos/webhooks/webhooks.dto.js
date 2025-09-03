"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDto = exports.WebhooksDto = exports.WebhooksIntegrationDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class WebhooksIntegrationDto {
}
exports.WebhooksIntegrationDto = WebhooksIntegrationDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], WebhooksIntegrationDto.prototype, "id", void 0);
class WebhooksDto {
}
exports.WebhooksDto = WebhooksDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], WebhooksDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], WebhooksDto.prototype, "url", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => WebhooksIntegrationDto),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", Array)
], WebhooksDto.prototype, "integrations", void 0);
class UpdateDto {
}
exports.UpdateDto = UpdateDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], UpdateDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], UpdateDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", String)
], UpdateDto.prototype, "url", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => WebhooksIntegrationDto),
    (0, class_validator_1.IsDefined)(),
    tslib_1.__metadata("design:type", Array)
], UpdateDto.prototype, "integrations", void 0);
//# sourceMappingURL=webhooks.dto.js.map