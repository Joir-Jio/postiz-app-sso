"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Nowpayments = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
let Nowpayments = class Nowpayments {
    constructor(_subscriptionService) {
        this._subscriptionService = _subscriptionService;
    }
    async processPayment(path, body) {
        const decrypt = auth_service_1.AuthService.verifyJWT(path);
        if (!decrypt || !decrypt.order_id) {
            return;
        }
        if (body.payment_status !== 'confirmed' &&
            body.payment_status !== 'finished') {
            return;
        }
        const [org, make] = body.order_id.split('_');
        await this._subscriptionService.lifeTime(org, make, 'PRO');
        return body;
    }
    async createPaymentPage(orgId) {
        const onlyId = (0, make_is_1.makeId)(5);
        const make = orgId + '_' + onlyId;
        const signRequest = auth_service_1.AuthService.signJWT({ order_id: make });
        const { id, invoice_url } = await (await fetch('https://api.nowpayments.io/v1/invoice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NOWPAYMENTS_API_KEY,
            },
            body: JSON.stringify({
                price_amount: process.env.NOWPAYMENTS_AMOUNT,
                price_currency: 'USD',
                order_id: make,
                pay_currency: 'SOL',
                order_description: 'Lifetime deal account for Postiz',
                ipn_callback_url: process.env.NEXT_PUBLIC_BACKEND_URL +
                    `/public/crypto/${signRequest}`,
                success_url: process.env.FRONTEND_URL + `/launches?check=${onlyId}`,
                cancel_url: process.env.FRONTEND_URL,
            }),
        })).json();
        return {
            id,
            invoice_url,
        };
    }
};
exports.Nowpayments = Nowpayments;
exports.Nowpayments = Nowpayments = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], Nowpayments);
//# sourceMappingURL=nowpayments.js.map