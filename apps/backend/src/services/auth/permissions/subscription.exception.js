"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionExceptionFilter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const permission_exception_class_1 = require("@gitroom/backend/services/auth/permissions/permission.exception.class");
let SubscriptionExceptionFilter = class SubscriptionExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const error = exception.getResponse();
        const message = getErrorMessage(error);
        response.status(status).json({
            statusCode: status,
            message,
            url: process.env.FRONTEND_URL + '/billing',
        });
    }
};
exports.SubscriptionExceptionFilter = SubscriptionExceptionFilter;
exports.SubscriptionExceptionFilter = SubscriptionExceptionFilter = tslib_1.__decorate([
    (0, common_1.Catch)(permission_exception_class_1.SubscriptionException)
], SubscriptionExceptionFilter);
const getErrorMessage = (error) => {
    switch (error.section) {
        case permission_exception_class_1.Sections.POSTS_PER_MONTH:
            switch (error.action) {
                default:
                    return 'You have reached the maximum number of posts for your subscription. Please upgrade your subscription to add more posts.';
            }
        case permission_exception_class_1.Sections.CHANNEL:
            switch (error.action) {
                default:
                    return 'You have reached the maximum number of channels for your subscription. Please upgrade your subscription to add more channels.';
            }
        case permission_exception_class_1.Sections.WEBHOOKS:
            switch (error.action) {
                default:
                    return 'You have reached the maximum number of webhooks for your subscription. Please upgrade your subscription to add more webhooks.';
            }
        case permission_exception_class_1.Sections.VIDEOS_PER_MONTH:
            switch (error.action) {
                default:
                    return 'You have reached the maximum number of generated videos for your subscription. Please upgrade your subscription to generate more videos.';
            }
    }
};
//# sourceMappingURL=subscription.exception.js.map