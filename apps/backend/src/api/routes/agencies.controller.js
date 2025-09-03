"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgenciesController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const agencies_service_1 = require("@gitroom/nestjs-libraries/database/prisma/agencies/agencies.service");
const user_from_request_1 = require("@gitroom/nestjs-libraries/user/user.from.request");
const create_agency_dto_1 = require("@gitroom/nestjs-libraries/dtos/agencies/create.agency.dto");
let AgenciesController = class AgenciesController {
    constructor(_agenciesService) {
        this._agenciesService = _agenciesService;
    }
    async getAgencyByUser(user) {
        return (await this._agenciesService.getAgencyByUser(user)) || {};
    }
    async createAgency(user, body) {
        return this._agenciesService.createAgency(user, body);
    }
    async updateAgency(user, action, id) {
        if (!user.isSuperAdmin) {
            return 400;
        }
        return this._agenciesService.approveOrDecline(user.email, action, id);
    }
};
exports.AgenciesController = AgenciesController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AgenciesController.prototype, "getAgencyByUser", null);
tslib_1.__decorate([
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, create_agency_dto_1.CreateAgencyDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AgenciesController.prototype, "createAgency", null);
tslib_1.__decorate([
    (0, common_1.Post)('/action/:action/:id'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('action')),
    tslib_1.__param(2, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AgenciesController.prototype, "updateAgency", null);
exports.AgenciesController = AgenciesController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Agencies'),
    (0, common_1.Controller)('/agencies'),
    tslib_1.__metadata("design:paramtypes", [agencies_service_1.AgenciesService])
], AgenciesController);
//# sourceMappingURL=agencies.controller.js.map