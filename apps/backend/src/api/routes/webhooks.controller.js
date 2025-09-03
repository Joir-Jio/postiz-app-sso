"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhookController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const swagger_1 = require("@nestjs/swagger");
const webhooks_service_1 = require("@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.service");
const permissions_ability_1 = require("@gitroom/backend/services/auth/permissions/permissions.ability");
const webhooks_dto_1 = require("@gitroom/nestjs-libraries/dtos/webhooks/webhooks.dto");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
let WebhookController = class WebhookController {
    constructor(_webhooksService) {
        this._webhooksService = _webhooksService;
    }
    async getStatistics(org) {
        return this._webhooksService.getWebhooks(org.id);
    }
    async createAWebhook(org, body) {
        return this._webhooksService.createWebhook(org.id, body);
    }
    async updateWebhook(org, body) {
        return this._webhooksService.createWebhook(org.id, body);
    }
    async deleteWebhook(org, id) {
        return this._webhooksService.deleteWebhook(org.id, id);
    }
    async sendWebhook(body, url) {
        try {
            await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            });
        }
        catch (err) {
        }
        return { send: true };
    }
};
exports.WebhookController = WebhookController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WebhookController.prototype, "getStatistics", null);
tslib_1.__decorate([
    (0, common_1.Post)('/'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.WEBHOOKS]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, webhooks_dto_1.WebhooksDto]),
    tslib_1.__metadata("design:returntype", Promise)
], WebhookController.prototype, "createAWebhook", null);
tslib_1.__decorate([
    (0, common_1.Put)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, webhooks_dto_1.UpdateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], WebhookController.prototype, "updateWebhook", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], WebhookController.prototype, "deleteWebhook", null);
tslib_1.__decorate([
    (0, common_1.Post)('/send'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Query)('url')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], WebhookController.prototype, "sendWebhook", null);
exports.WebhookController = WebhookController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('/webhooks'),
    tslib_1.__metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhookController);
//# sourceMappingURL=webhooks.controller.js.map