"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const swagger_1 = require("@nestjs/swagger");
const sets_service_1 = require("@gitroom/nestjs-libraries/database/prisma/sets/sets.service");
const sets_dto_1 = require("@gitroom/nestjs-libraries/dtos/sets/sets.dto");
let SetsController = class SetsController {
    constructor(_setsService) {
        this._setsService = _setsService;
    }
    async getSets(org) {
        return this._setsService.getSets(org.id);
    }
    async createASet(org, body) {
        return this._setsService.createSet(org.id, body);
    }
    async updateSet(org, body) {
        return this._setsService.createSet(org.id, body);
    }
    async deleteSet(org, id) {
        return this._setsService.deleteSet(org.id, id);
    }
};
exports.SetsController = SetsController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SetsController.prototype, "getSets", null);
tslib_1.__decorate([
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, sets_dto_1.SetsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SetsController.prototype, "createASet", null);
tslib_1.__decorate([
    (0, common_1.Put)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, sets_dto_1.UpdateSetsDto]),
    tslib_1.__metadata("design:returntype", Promise)
], SetsController.prototype, "updateSet", null);
tslib_1.__decorate([
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SetsController.prototype, "deleteSet", null);
exports.SetsController = SetsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Sets'),
    (0, common_1.Controller)('/sets'),
    tslib_1.__metadata("design:paramtypes", [sets_service_1.SetsService])
], SetsController);
//# sourceMappingURL=sets.controller.js.map