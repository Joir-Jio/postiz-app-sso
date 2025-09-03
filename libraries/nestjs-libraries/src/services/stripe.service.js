"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const tslib_1 = require("tslib");
const stripe_1 = tslib_1.__importDefault(require("stripe"));
const common_1 = require("@nestjs/common");
const subscription_service_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service");
const organization_service_1 = require("@gitroom/nestjs-libraries/database/prisma/organizations/organization.service");
const make_is_1 = require("@gitroom/nestjs-libraries/services/make.is");
const lodash_1 = require("lodash");
const messages_service_1 = require("@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service");
const pricing_1 = require("@gitroom/nestjs-libraries/database/prisma/subscriptions/pricing");
const auth_service_1 = require("@gitroom/helpers/auth/auth.service");
const track_service_1 = require("@gitroom/nestjs-libraries/track/track.service");
const users_service_1 = require("@gitroom/nestjs-libraries/database/prisma/users/users.service");
const track_enum_1 = require("@gitroom/nestjs-libraries/user/track.enum");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-04-10',
});
let StripeService = class StripeService {
    constructor(_subscriptionService, _organizationService, _userService, _messagesService, _trackService) {
        this._subscriptionService = _subscriptionService;
        this._organizationService = _organizationService;
        this._userService = _userService;
        this._messagesService = _messagesService;
        this._trackService = _trackService;
    }
    validateRequest(rawBody, signature, endpointSecret) {
        return stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
    }
    async updateAccount(event) {
        var _a, _b, _c;
        if (!event.account) {
            return;
        }
        const accountCharges = event.data.object.payouts_enabled &&
            event.data.object.charges_enabled &&
            !((_c = (_b = (_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.requirements) === null || _c === void 0 ? void 0 : _c.disabled_reason);
        await this._subscriptionService.updateConnectedStatus(event.account, accountCharges);
    }
    async checkValidCard(event) {
        if (event.data.object.status === 'incomplete') {
            return false;
        }
        const getOrgFromCustomer = await this._organizationService.getOrgByCustomerId(event.data.object.customer);
        if (!(getOrgFromCustomer === null || getOrgFromCustomer === void 0 ? void 0 : getOrgFromCustomer.allowTrial)) {
            return true;
        }
        console.log('Checking card');
        const paymentMethods = await stripe.paymentMethods.list({
            customer: event.data.object.customer,
        });
        const latestMethod = paymentMethods.data.reduce((prev, current) => {
            if (prev.created < current.created) {
                return current;
            }
            return prev;
        }, { created: -100 });
        if (!latestMethod.id) {
            return false;
        }
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: 100,
                currency: 'usd',
                payment_method: latestMethod.id,
                customer: event.data.object.customer,
                automatic_payment_methods: {
                    allow_redirects: 'never',
                    enabled: true,
                },
                capture_method: 'manual',
                confirm: true,
            });
            if (paymentIntent.status !== 'requires_capture') {
                console.error('Cant charge');
                await stripe.paymentMethods.detach(paymentMethods.data[0].id);
                await stripe.subscriptions.cancel(event.data.object.id);
                return false;
            }
            await stripe.paymentIntents.cancel(paymentIntent.id);
            return true;
        }
        catch (err) {
            try {
                await stripe.paymentMethods.detach(paymentMethods.data[0].id);
                await stripe.subscriptions.cancel(event.data.object.id);
            }
            catch (err) {
            }
            return false;
        }
    }
    async createSubscription(event) {
        const { uniqueId, billing, period, } = event.data.object.metadata;
        try {
            const check = await this.checkValidCard(event);
            if (!check) {
                return { ok: false };
            }
        }
        catch (err) {
            return { ok: false };
        }
        return this._subscriptionService.createOrUpdateSubscription(event.data.object.status !== 'active', uniqueId, event.data.object.customer, pricing_1.pricing[billing].channel, billing, period, event.data.object.cancel_at);
    }
    async updateSubscription(event) {
        const { uniqueId, billing, period, } = event.data.object.metadata;
        const check = await this.checkValidCard(event);
        if (!check) {
            return { ok: false };
        }
        return this._subscriptionService.createOrUpdateSubscription(event.data.object.status !== 'active', uniqueId, event.data.object.customer, pricing_1.pricing[billing].channel, billing, period, event.data.object.cancel_at);
    }
    async deleteSubscription(event) {
        await this._subscriptionService.deleteSubscription(event.data.object.customer);
    }
    async createOrGetCustomer(organization) {
        if (organization.paymentId) {
            return organization.paymentId;
        }
        const customer = await stripe.customers.create({
            name: organization.name,
        });
        await this._subscriptionService.updateCustomerId(organization.id, customer.id);
        return customer.id;
    }
    async getPackages() {
        const products = await stripe.prices.list({
            active: true,
            expand: ['data.tiers', 'data.product'],
            lookup_keys: [
                'standard_monthly',
                'standard_yearly',
                'pro_monthly',
                'pro_yearly',
            ],
        });
        const productsList = (0, lodash_1.groupBy)(products.data.map((p) => {
            var _a, _b, _c, _d;
            return ({
                name: (_a = p.product) === null || _a === void 0 ? void 0 : _a.name,
                recurring: (_b = p === null || p === void 0 ? void 0 : p.recurring) === null || _b === void 0 ? void 0 : _b.interval,
                price: ((_d = (_c = p === null || p === void 0 ? void 0 : p.tiers) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.unit_amount) / 100,
            });
        }), 'recurring');
        return Object.assign({}, productsList);
    }
    async prorate(organizationId, body) {
        var _a, _b, _c, _d, _e, _f, _g;
        const org = await this._organizationService.getOrgById(organizationId);
        const customer = await this.createOrGetCustomer(org);
        const priceData = pricing_1.pricing[body.billing];
        const allProducts = await stripe.products.list({
            active: true,
            expand: ['data.prices'],
        });
        const findProduct = allProducts.data.find((product) => product.name.toUpperCase() === body.billing.toUpperCase()) ||
            (await stripe.products.create({
                active: true,
                name: body.billing,
            }));
        const pricesList = await stripe.prices.list({
            active: true,
            product: findProduct.id,
        });
        const findPrice = pricesList.data.find((p) => {
            var _a, _b;
            return ((_b = (_a = p === null || p === void 0 ? void 0 : p.recurring) === null || _a === void 0 ? void 0 : _a.interval) === null || _b === void 0 ? void 0 : _b.toLowerCase()) ===
                (body.period === 'MONTHLY' ? 'month' : 'year') &&
                (p === null || p === void 0 ? void 0 : p.nickname) === body.billing + ' ' + body.period &&
                (p === null || p === void 0 ? void 0 : p.unit_amount) ===
                    (body.period === 'MONTHLY'
                        ? priceData.month_price
                        : priceData.year_price) *
                        100;
        }) ||
            (await stripe.prices.create({
                active: true,
                product: findProduct.id,
                currency: 'usd',
                nickname: body.billing + ' ' + body.period,
                unit_amount: (body.period === 'MONTHLY'
                    ? priceData.month_price
                    : priceData.year_price) * 100,
                recurring: {
                    interval: body.period === 'MONTHLY' ? 'month' : 'year',
                },
            }));
        const proration_date = Math.floor(Date.now() / 1000);
        const currentUserSubscription = {
            data: (await stripe.subscriptions.list({
                customer,
                status: 'all',
            })).data.filter((f) => f.status === 'active' || f.status === 'trialing'),
        };
        try {
            const price = await stripe.invoices.retrieveUpcoming({
                customer,
                subscription: (_b = (_a = currentUserSubscription === null || currentUserSubscription === void 0 ? void 0 : currentUserSubscription.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.id,
                subscription_proration_behavior: 'create_prorations',
                subscription_billing_cycle_anchor: 'now',
                subscription_items: [
                    {
                        id: (_g = (_f = (_e = (_d = (_c = currentUserSubscription === null || currentUserSubscription === void 0 ? void 0 : currentUserSubscription.data) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.items) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.id,
                        price: findPrice === null || findPrice === void 0 ? void 0 : findPrice.id,
                        quantity: 1,
                    },
                ],
                subscription_proration_date: proration_date,
            });
            return {
                price: (price === null || price === void 0 ? void 0 : price.amount_remaining) ? (price === null || price === void 0 ? void 0 : price.amount_remaining) / 100 : 0,
            };
        }
        catch (err) {
            return { price: 0 };
        }
    }
    async getCustomerSubscriptions(organizationId) {
        const org = (await this._organizationService.getOrgById(organizationId));
        const customer = org.paymentId;
        return stripe.subscriptions.list({
            customer: customer,
            status: 'all',
        });
    }
    async setToCancel(organizationId) {
        const id = (0, make_is_1.makeId)(10);
        const org = await this._organizationService.getOrgById(organizationId);
        const customer = await this.createOrGetCustomer(org);
        const currentUserSubscription = {
            data: (await stripe.subscriptions.list({
                customer,
                status: 'all',
            })).data.filter((f) => f.status !== 'canceled'),
        };
        const { cancel_at } = await stripe.subscriptions.update(currentUserSubscription.data[0].id, {
            cancel_at_period_end: !currentUserSubscription.data[0].cancel_at_period_end,
            metadata: {
                service: 'gitroom',
                id,
            },
        });
        return {
            id,
            cancel_at: cancel_at ? new Date(cancel_at * 1000) : undefined,
        };
    }
    async getCustomerByOrganizationId(organizationId) {
        const org = (await this._organizationService.getOrgById(organizationId));
        return org.paymentId;
    }
    async createBillingPortalLink(customer) {
        return stripe.billingPortal.sessions.create({
            customer,
            return_url: process.env['FRONTEND_URL'] + '/billing',
        });
    }
    async createCheckoutSession(ud, uniqueId, customer, body, price, userId, allowTrial) {
        const isUtm = body.utm ? `&utm_source=${body.utm}` : '';
        const { url } = await stripe.checkout.sessions.create(Object.assign(Object.assign({ customer, cancel_url: process.env['FRONTEND_URL'] + `/billing?cancel=true${isUtm}`, success_url: process.env['FRONTEND_URL'] +
                `/launches?onboarding=true&check=${uniqueId}${isUtm}`, mode: 'subscription', subscription_data: Object.assign(Object.assign({}, (allowTrial ? { trial_period_days: 7 } : {})), { metadata: Object.assign(Object.assign({ service: 'gitroom' }, body), { userId,
                    uniqueId,
                    ud }) }) }, (body.tolt
            ? {
                metadata: {
                    tolt_referral: body.tolt,
                },
            }
            : {})), { allow_promotion_codes: true, line_items: [
                {
                    price,
                    quantity: 1,
                },
            ] }));
        return { url };
    }
    async createAccountProcess(userId, email, country) {
        const account = await this._subscriptionService.getUserAccount(userId);
        if ((account === null || account === void 0 ? void 0 : account.account) && (account === null || account === void 0 ? void 0 : account.connectedAccount)) {
            return { url: await this.addBankAccount(account.account) };
        }
        if ((account === null || account === void 0 ? void 0 : account.account) && !(account === null || account === void 0 ? void 0 : account.connectedAccount)) {
            await stripe.accounts.del(account.account);
        }
        const createAccount = await this.createAccount(userId, email, country);
        return { url: await this.addBankAccount(createAccount) };
    }
    async createAccount(userId, email, country) {
        const account = await stripe.accounts.create({
            type: 'custom',
            capabilities: {
                transfers: {
                    requested: true,
                },
                card_payments: {
                    requested: true,
                },
            },
            tos_acceptance: {
                service_agreement: 'full',
            },
            metadata: {
                service: 'gitroom',
            },
            country,
            email,
        });
        await this._subscriptionService.updateAccount(userId, account.id);
        return account.id;
    }
    async addBankAccount(userId) {
        const accountLink = await stripe.accountLinks.create({
            account: userId,
            refresh_url: process.env['FRONTEND_URL'] + '/marketplace/seller',
            return_url: process.env['FRONTEND_URL'] + '/marketplace/seller',
            type: 'account_onboarding',
            collection_options: {
                fields: 'eventually_due',
            },
        });
        return accountLink.url;
    }
    async finishTrial(paymentId) {
        const list = (await stripe.subscriptions.list({
            customer: paymentId,
        })).data.filter((f) => f.status === 'trialing');
        return stripe.subscriptions.update(list[0].id, {
            trial_end: 'now',
        });
    }
    async checkSubscription(organizationId, subscriptionId) {
        var _a;
        const orgValue = await this._subscriptionService.checkSubscription(organizationId, subscriptionId);
        if (orgValue) {
            return 2;
        }
        const getCustomerSubscriptions = await this.getCustomerSubscriptions(organizationId);
        if (getCustomerSubscriptions.data.length === 0) {
            return 0;
        }
        if ((_a = getCustomerSubscriptions.data.find((p) => p.metadata.uniqueId === subscriptionId)) === null || _a === void 0 ? void 0 : _a.canceled_at) {
            return 1;
        }
        return 0;
    }
    async payAccountStepOne(userId, organization, seller, orderId, ordersItems, groupId) {
        const customer = (await this.createOrGetCustomer(organization));
        const price = ordersItems.reduce((all, current) => {
            return all + current.price * current.quantity;
        }, 0);
        const { url } = await stripe.checkout.sessions.create({
            customer,
            mode: 'payment',
            currency: 'usd',
            success_url: process.env['FRONTEND_URL'] + `/messages/${groupId}`,
            metadata: {
                orderId,
                service: 'gitroom',
                type: 'marketplace',
            },
            line_items: [
                ...ordersItems,
                {
                    integrationType: `Gitroom Fee (${+process.env.FEE_AMOUNT * 100}%)`,
                    quantity: 1,
                    price: price * +process.env.FEE_AMOUNT,
                },
            ].map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: (!item.price ? 'Platform: ' : '') +
                            (0, lodash_1.capitalize)(item.integrationType),
                    },
                    unit_amount: item.price * 100,
                },
                quantity: item.quantity,
            })),
            payment_intent_data: {
                transfer_group: orderId,
            },
        });
        return { url };
    }
    async subscribe(uniqueId, organizationId, userId, body, allowTrial) {
        const id = (0, make_is_1.makeId)(10);
        const priceData = pricing_1.pricing[body.billing];
        const org = await this._organizationService.getOrgById(organizationId);
        const customer = await this.createOrGetCustomer(org);
        const allProducts = await stripe.products.list({
            active: true,
            expand: ['data.prices'],
        });
        const findProduct = allProducts.data.find((product) => product.name.toUpperCase() === body.billing.toUpperCase()) ||
            (await stripe.products.create({
                active: true,
                name: body.billing,
            }));
        const pricesList = await stripe.prices.list({
            active: true,
            product: findProduct.id,
        });
        const findPrice = pricesList.data.find((p) => {
            var _a, _b;
            return ((_b = (_a = p === null || p === void 0 ? void 0 : p.recurring) === null || _a === void 0 ? void 0 : _a.interval) === null || _b === void 0 ? void 0 : _b.toLowerCase()) ===
                (body.period === 'MONTHLY' ? 'month' : 'year') &&
                (p === null || p === void 0 ? void 0 : p.unit_amount) ===
                    (body.period === 'MONTHLY'
                        ? priceData.month_price
                        : priceData.year_price) *
                        100;
        }) ||
            (await stripe.prices.create({
                active: true,
                product: findProduct.id,
                currency: 'usd',
                nickname: body.billing + ' ' + body.period,
                unit_amount: (body.period === 'MONTHLY'
                    ? priceData.month_price
                    : priceData.year_price) * 100,
                recurring: {
                    interval: body.period === 'MONTHLY' ? 'month' : 'year',
                },
            }));
        const getCurrentSubscriptions = await this._subscriptionService.getSubscription(organizationId);
        if (!getCurrentSubscriptions) {
            return this.createCheckoutSession(uniqueId, id, customer, body, findPrice.id, userId, allowTrial);
        }
        const currentUserSubscription = {
            data: (await stripe.subscriptions.list({
                customer,
                status: 'all',
            })).data.filter((f) => f.status === 'active' || f.status === 'trialing'),
        };
        try {
            await stripe.subscriptions.update(currentUserSubscription.data[0].id, {
                cancel_at_period_end: false,
                metadata: Object.assign(Object.assign({ service: 'gitroom' }, body), { userId,
                    id, ud: uniqueId }),
                proration_behavior: 'always_invoice',
                items: [
                    {
                        id: currentUserSubscription.data[0].items.data[0].id,
                        price: findPrice.id,
                        quantity: 1,
                    },
                ],
            });
            return { id };
        }
        catch (err) {
            const { url } = await this.createBillingPortalLink(customer);
            return {
                portal: url,
            };
        }
    }
    async paymentSucceeded(event) {
        const subscription = await stripe.subscriptions.retrieve(event.data.object.subscription);
        const { userId, ud } = subscription.metadata;
        const user = await this._userService.getUserById(userId);
        if (user && user.ip && user.agent) {
            this._trackService.track(ud, user.ip, user.agent, track_enum_1.TrackEnum.Purchase, {
                value: event.data.object.amount_paid / 100,
            });
        }
        return { ok: true };
    }
    async payout(orderId, charge, account, price) {
        return stripe.transfers.create({
            amount: price * 100,
            currency: 'usd',
            destination: account,
            source_transaction: charge,
            transfer_group: orderId,
        });
    }
    async lifetimeDeal(organizationId, code) {
        const getCurrentSubscription = await this._subscriptionService.getSubscriptionByOrganizationId(organizationId);
        if (getCurrentSubscription && !(getCurrentSubscription === null || getCurrentSubscription === void 0 ? void 0 : getCurrentSubscription.isLifetime)) {
            throw new Error('You already have a non lifetime subscription');
        }
        try {
            const testCode = auth_service_1.AuthService.fixedDecryption(code);
            const findCode = await this._subscriptionService.getCode(testCode);
            if (findCode) {
                return {
                    success: false,
                };
            }
            const nextPackage = !getCurrentSubscription ? 'STANDARD' : 'PRO';
            const findPricing = pricing_1.pricing[nextPackage];
            await this._subscriptionService.createOrUpdateSubscription(false, (0, make_is_1.makeId)(10), organizationId, (getCurrentSubscription === null || getCurrentSubscription === void 0 ? void 0 : getCurrentSubscription.subscriptionTier) === 'PRO'
                ? getCurrentSubscription.totalChannels + 5
                : findPricing.channel, nextPackage, 'MONTHLY', null, testCode, organizationId);
            return {
                success: true,
            };
        }
        catch (err) {
            console.log(err);
            return {
                success: false,
            };
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [subscription_service_1.SubscriptionService,
        organization_service_1.OrganizationService,
        users_service_1.UsersService,
        messages_service_1.MessagesService,
        track_service_1.TrackService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map