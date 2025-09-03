"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("@gitroom/nestjs-libraries/services/stripe.service");
const swagger_1 = require("@nestjs/swagger");
const codes_service_1 = require("@gitroom/nestjs-libraries/services/codes.service");
let StripeController = class StripeController {
    constructor(_stripeService, _codesService) {
        this._stripeService = _stripeService;
        this._codesService = _codesService;
    }
    stripeConnect(req) {
        var _a, _b, _c;
        const event = this._stripeService.validateRequest(req.rawBody, req.headers['stripe-signature'], process.env.STRIPE_SIGNING_KEY_CONNECT);
        if (((_c = (_b = (_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.metadata) === null || _c === void 0 ? void 0 : _c.service) !== 'gitroom') {
            return { ok: true };
        }
        switch (event.type) {
            case 'account.updated':
                return this._stripeService.updateAccount(event);
            default:
                return { ok: true };
        }
    }
    stripe(req) {
        var _a, _b, _c;
        const event = this._stripeService.validateRequest(req.rawBody, req.headers['stripe-signature'], process.env.STRIPE_SIGNING_KEY);
        if (((_c = (_b = (_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.metadata) === null || _c === void 0 ? void 0 : _c.service) !== 'gitroom' &&
            event.type !== 'invoice.payment_succeeded') {
            return { ok: true };
        }
        try {
            switch (event.type) {
                case 'invoice.payment_succeeded':
                    return this._stripeService.paymentSucceeded(event);
                case 'account.updated':
                    return this._stripeService.updateAccount(event);
                case 'customer.subscription.created':
                    return this._stripeService.createSubscription(event);
                case 'customer.subscription.updated':
                    return this._stripeService.updateSubscription(event);
                case 'customer.subscription.deleted':
                    return this._stripeService.deleteSubscription(event);
                default:
                    return { ok: true };
            }
        }
        catch (e) {
            throw new common_1.HttpException(e, 500);
        }
    }
    async getStripeCodes(providerToken) {
        return this._codesService.generateCodes(providerToken);
    }
};
exports.StripeController = StripeController;
tslib_1.__decorate([
    (0, common_1.Post)('/connect'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], StripeController.prototype, "stripeConnect", null);
tslib_1.__decorate([
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], StripeController.prototype, "stripe", null);
tslib_1.__decorate([
    (0, common_1.Get)('/lifetime-deal-codes/:provider'),
    (0, common_1.Header)('Content-disposition', 'attachment; filename=codes.csv'),
    (0, common_1.Header)('Content-type', 'text/csv'),
    tslib_1.__param(0, (0, common_1.Param)('provider')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], StripeController.prototype, "getStripeCodes", null);
exports.StripeController = StripeController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Stripe'),
    (0, common_1.Controller)('/stripe'),
    tslib_1.__metadata("design:paramtypes", [stripe_service_1.StripeService,
        codes_service_1.CodesService])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map