"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const stars_service_1 = require("@gitroom/nestjs-libraries/database/prisma/stars/stars.service");
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const stars_list_dto_1 = require("@gitroom/nestjs-libraries/dtos/analytics/stars.list.dto");
const swagger_1 = require("@nestjs/swagger");
const integration_service_1 = require("@gitroom/nestjs-libraries/database/prisma/integrations/integration.service");
let AnalyticsController = class AnalyticsController {
    constructor(_starsService, _integrationService) {
        this._starsService = _starsService;
        this._integrationService = _integrationService;
    }
    async getStars(org) {
        return this._starsService.getStars(org.id);
    }
    async getTrending() {
        const todayTrending = (0, dayjs_1.default)((0, dayjs_1.default)().format('YYYY-MM-DDT12:00:00'));
        const last = todayTrending.isAfter((0, dayjs_1.default)())
            ? todayTrending.subtract(1, 'day')
            : todayTrending;
        const nextTrending = last.add(1, 'day');
        return {
            last: last.format('YYYY-MM-DD HH:mm:ss'),
            predictions: nextTrending.format('YYYY-MM-DD HH:mm:ss'),
        };
    }
    async getStarsFilter(org, starsFilter) {
        return {
            stars: await this._starsService.getStarsFilter(org.id, starsFilter),
        };
    }
    async getIntegration(org, integration, date) {
        return this._integrationService.checkAnalytics(org, integration, date);
    }
};
exports.AnalyticsController = AnalyticsController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStars", null);
tslib_1.__decorate([
    (0, common_1.Get)('/trending'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTrending", null);
tslib_1.__decorate([
    (0, common_1.Post)('/stars'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, stars_list_dto_1.StarsListDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStarsFilter", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:integration'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('integration')),
    tslib_1.__param(2, (0, common_1.Query)('date')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getIntegration", null);
exports.AnalyticsController = AnalyticsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Analytics'),
    (0, common_1.Controller)('/analytics'),
    tslib_1.__metadata("design:paramtypes", [stars_service_1.StarsService,
        integration_service_1.IntegrationService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map