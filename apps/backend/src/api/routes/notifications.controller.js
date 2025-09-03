"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_from_request_1 = require("@gitroom/nestjs-libraries/user/user.from.request");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const notification_service_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notification.service");
const swagger_1 = require("@nestjs/swagger");
let NotificationsController = class NotificationsController {
    constructor(_notificationsService) {
        this._notificationsService = _notificationsService;
    }
    async mainPageList(user, organization) {
        return this._notificationsService.getMainPageCount(organization.id, user.id);
    }
    async notifications(user, organization) {
        return this._notificationsService.getNotifications(organization.id, user.id);
    }
};
exports.NotificationsController = NotificationsController;
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationsController.prototype, "mainPageList", null);
tslib_1.__decorate([
    (0, common_1.Get)('/list'),
    tslib_1.__param(0, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(1, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationsController.prototype, "notifications", null);
exports.NotificationsController = NotificationsController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, common_1.Controller)('/notifications'),
    tslib_1.__metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map