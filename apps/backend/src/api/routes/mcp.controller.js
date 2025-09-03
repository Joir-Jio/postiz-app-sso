"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.McpController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mcp_service_1 = require("@gitroom/nestjs-libraries/mcp/mcp.service");
const organization_service_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.service");
let McpController = class McpController {
    constructor(_mcpService, _organizationService) {
        this._mcpService = _mcpService;
        this._organizationService = _organizationService;
    }
    async sse(api) {
        const apiModel = await this._organizationService.getOrgByApiKey(api);
        if (!apiModel) {
            throw new common_1.HttpException('Invalid url', 400);
        }
        return await this._mcpService.runServer(api, apiModel.id);
    }
    async post(api, body) {
        const apiModel = await this._organizationService.getOrgByApiKey(api);
        if (!apiModel) {
            throw new common_1.HttpException('Invalid url', 400);
        }
        return this._mcpService.processPostBody(apiModel.id, body);
    }
};
exports.McpController = McpController;
tslib_1.__decorate([
    (0, common_1.Sse)('/:api/sse'),
    tslib_1.__param(0, (0, common_1.Param)('api')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], McpController.prototype, "sse", null);
tslib_1.__decorate([
    (0, common_1.Post)('/:api/messages'),
    tslib_1.__param(0, (0, common_1.Param)('api')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], McpController.prototype, "post", null);
exports.McpController = McpController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Mcp'),
    (0, common_1.Controller)('/mcp'),
    tslib_1.__metadata("design:paramtypes", [mcp_service_1.McpService,
        organization_service_1.OrganizationService])
], McpController);
//# sourceMappingURL=mcp.controller.js.map