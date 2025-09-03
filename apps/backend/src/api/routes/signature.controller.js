"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const swagger_1 = require("@nestjs/swagger");
const signature_service_1 = require("@gitroom/nestjs-libraries/database/prisma/signatures/signature.service");
const signature_dto_1 = require("@gitroom/nestjs-libraries/dtos/signature/signature.dto");
let SignatureController = class SignatureController {
    constructor(_signatureService) {
        this._signatureService = _signatureService;
    }
    async getSignatures(org) {
        return this._signatureService.getSignaturesByOrgId(org.id);
    }
    async getDefaultSignature(org) {
        return (await this._signatureService.getDefaultSignature(org.id)) || {};
    }
    async createSignature(org, body) {
        return this._signatureService.createOrUpdateSignature(org.id, body);
    }
    async deleteSignature(org, id) {
        return this._signatureService.deleteSignature(org.id, id);
    }
    async updateSignature(id, org, body) {
        return this._signatureService.createOrUpdateSignature(org.id, body, id);
    }
};
exports.SignatureController = SignatureController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SignatureController.prototype, "getSignatures", null);
tslib_1.__decorate([
    (0, common_1.Get)('/default'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SignatureController.prototype, "getDefaultSignature", null);
tslib_1.__decorate([
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, signature_dto_1.SignatureDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SignatureController.prototype, "createSignature", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SignatureController.prototype, "deleteSignature", null);
tslib_1.__decorate([
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, signature_dto_1.SignatureDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SignatureController.prototype, "updateSignature", null);
exports.SignatureController = SignatureController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Signatures'),
    (0, common_1.Controller)('/signatures'),
    tslib_1.__metadata("design:paramtypes", [signature_service_1.SignatureService])
], SignatureController);
//# sourceMappingURL=signature.controller.js.map