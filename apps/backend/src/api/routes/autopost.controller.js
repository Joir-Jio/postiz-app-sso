"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutopostController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const swagger_1 = require("@nestjs/swagger");
const permissions_ability_1 = require("@gitroom/backend/services/auth/permissions/permissions.ability");
const autopost_service_1 = require("@gitroom/nestjs-libraries/database/prisma/autopost/autopost.service");
const autopost_dto_1 = require("@gitroom/nestjs-libraries/dtos/autopost/autopost.dto");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
let AutopostController = class AutopostController {
    constructor(_autopostsService) {
        this._autopostsService = _autopostsService;
    }
    async getAutoposts(org) {
        return this._autopostsService.getAutoposts(org.id);
    }
    async createAutopost(org, body) {
        return this._autopostsService.createAutopost(org.id, body);
    }
    async updateAutopost(org, body, id) {
        return this._autopostsService.createAutopost(org.id, body, id);
    }
    async deleteAutopost(org, id) {
        return this._autopostsService.deleteAutopost(org.id, id);
    }
    async changeActive(org, id, active) {
        return this._autopostsService.changeActive(org.id, id, active);
    }
    async sendWebhook(url) {
        return this._autopostsService.loadXML(url);
    }
};
exports.AutopostController = AutopostController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AutopostController.prototype, "getAutoposts", null);
tslib_1.__decorate([
    (0, common_1.Post)('/'),
    (0, permissions_ability_1.CheckPolicies)([permission_exception_class_1.AuthorizationActions.Create, permission_exception_class_1.Sections.WEBHOOKS]),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, autopost_dto_1.AutopostDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AutopostController.prototype, "createAutopost", null);
tslib_1.__decorate([
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, autopost_dto_1.AutopostDto, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AutopostController.prototype, "updateAutopost", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AutopostController.prototype, "deleteAutopost", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:id/active'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)('active')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], AutopostController.prototype, "changeActive", null);
tslib_1.__decorate([
    (0, common_1.Post)('/send'),
    tslib_1.__param(0, (0, common_1.Query)('url')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AutopostController.prototype, "sendWebhook", null);
exports.AutopostController = AutopostController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Autopost'),
    (0, common_1.Controller)('/autopost'),
    tslib_1.__metadata("design:paramtypes", [autopost_service_1.AutopostService])
], AutopostController);
//# sourceMappingURL=autopost.controller.js.map