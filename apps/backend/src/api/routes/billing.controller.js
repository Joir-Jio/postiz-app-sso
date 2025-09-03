"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
const stripe_service_1 = require("@gitroom/nestjs-libraries/services/stripe.service");
const org_from_request_1 = require("@gitroom/nestjs-libraries/user/org.from.request");
const billing_subscribe_dto_1 = require("@gitroom/nestjs-libraries/dtos/billing/billing.subscribe.dto");
const swagger_1 = require("@nestjs/swagger");
const user_from_request_1 = require("@gitroom/nestjs-libraries/user/user.from.request");
const notification_service_1 = require("@gitroom/nestjs-libraries/database/prisma/notifications/notification.service");
const nowpayments_1 = require("@gitroom/nestjs-libraries/crypto/nowpayments");
let BillingController = class BillingController {
    constructor(_subscriptionService, _stripeService, _notificationService, _nowpayments) {
        this._subscriptionService = _subscriptionService;
        this._stripeService = _stripeService;
        this._notificationService = _notificationService;
        this._nowpayments = _nowpayments;
    }
    async checkId(org, body) {
        return {
            status: await this._stripeService.checkSubscription(org.id, body),
        };
    }
    async finishTrial(org) {
        try {
            await this._stripeService.finishTrial(org.paymentId);
        }
        catch (err) { }
        return {
            finish: true,
        };
    }
    async isTrialFinished(org) {
        return {
            finished: !org.isTrailing,
        };
    }
    subscribe(org, user, body, req) {
        var _a;
        const uniqueId = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.track;
        return this._stripeService.subscribe(uniqueId, org.id, user.id, body, org.allowTrial);
    }
    async modifyPayment(org) {
        const customer = await this._stripeService.getCustomerByOrganizationId(org.id);
        const { url } = await this._stripeService.createBillingPortalLink(customer);
        return {
            portal: url,
        };
    }
    getCurrentBilling(org) {
        return this._subscriptionService.getSubscriptionByOrganizationId(org.id);
    }
    async cancel(org, user, body) {
        await this._notificationService.sendEmail(process.env.EMAIL_FROM_ADDRESS, 'Subscription Cancelled', `Organization ${org.name} has cancelled their subscription because: ${body.feedback}`, user.email);
        return this._stripeService.setToCancel(org.id);
    }
    prorate(org, body) {
        return this._stripeService.prorate(org.id, body);
    }
    async lifetime(org, body) {
        return this._stripeService.lifetimeDeal(org.id, body.code);
    }
    async addSubscription(body, user, org) {
        if (!user.isSuperAdmin) {
            throw new Error('Unauthorized');
        }
        await this._subscriptionService.addSubscription(org.id, user.id, body.subscription);
    }
    async crypto(org) {
        return this._nowpayments.createPaymentPage(org.id);
    }
};
exports.BillingController = BillingController;
tslib_1.__decorate([
    (0, common_1.Get)('/check/:id'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "checkId", null);
tslib_1.__decorate([
    (0, common_1.Post)('/finish-trial'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "finishTrial", null);
tslib_1.__decorate([
    (0, common_1.Get)('/is-trial-finished'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "isTrialFinished", null);
tslib_1.__decorate([
    (0, common_1.Post)('/subscribe'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__param(3, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, billing_subscribe_dto_1.BillingSubscribeDto, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BillingController.prototype, "subscribe", null);
tslib_1.__decorate([
    (0, common_1.Get)('/portal'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "modifyPayment", null);
tslib_1.__decorate([
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], BillingController.prototype, "getCurrentBilling", null);
tslib_1.__decorate([
    (0, common_1.Post)('/cancel'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "cancel", null);
tslib_1.__decorate([
    (0, common_1.Post)('/prorate'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, billing_subscribe_dto_1.BillingSubscribeDto]),
    tslib_1.__metadata("design:returntype", void 0)
], BillingController.prototype, "prorate", null);
tslib_1.__decorate([
    (0, common_1.Post)('/lifetime'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "lifetime", null);
tslib_1.__decorate([
    (0, common_1.Post)('/add-subscription'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, user_from_request_1.GetUserFromRequest)()),
    tslib_1.__param(2, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "addSubscription", null);
tslib_1.__decorate([
    (0, common_1.Get)('/crypto'),
    tslib_1.__param(0, (0, org_from_request_1.GetOrgFromRequest)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "crypto", null);
exports.BillingController = BillingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Billing'),
    (0, common_1.Controller)('/billing'),
    tslib_1.__metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        stripe_service_1.StripeService,
        notification_service_1.NotificationService,
        nowpayments_1.Nowpayments])
], BillingController);
//# sourceMappingURL=billing.controller.js.map