import Stripe from 'stripe';
import { Organization, User } from '@prisma/client';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { BillingSubscribeDto } from '@gitroom/nestjs-libraries/dtos/billing/billing.subscribe.dto';
import { MessagesService } from '@gitroom/nestjs-libraries/database/prisma/marketplace/messages.service';
import { TrackService } from '@gitroom/nestjs-libraries/track/track.service';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
export declare class StripeService {
    private _subscriptionService;
    private _organizationService;
    private _userService;
    private _messagesService;
    private _trackService;
    constructor(_subscriptionService: SubscriptionService, _organizationService: OrganizationService, _userService: UsersService, _messagesService: MessagesService, _trackService: TrackService);
    validateRequest(rawBody: Buffer, signature: string, endpointSecret: string): Stripe.Event;
    updateAccount(event: Stripe.AccountUpdatedEvent): Promise<void>;
    checkValidCard(event: Stripe.CustomerSubscriptionCreatedEvent | Stripe.CustomerSubscriptionUpdatedEvent): Promise<boolean>;
    createSubscription(event: Stripe.CustomerSubscriptionCreatedEvent): Promise<void | {}>;
    updateSubscription(event: Stripe.CustomerSubscriptionUpdatedEvent): Promise<void | {}>;
    deleteSubscription(event: Stripe.CustomerSubscriptionDeletedEvent): Promise<void>;
    createOrGetCustomer(organization: Organization): Promise<string>;
    getPackages(): Promise<{
        [x: string]: {
            name: any;
            recurring: Stripe.Price.Recurring.Interval;
            price: number;
        }[];
    }>;
    prorate(organizationId: string, body: BillingSubscribeDto): Promise<{
        price: number;
    }>;
    getCustomerSubscriptions(organizationId: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.Subscription>>>;
    setToCancel(organizationId: string): Promise<{
        id: string;
        cancel_at: Date;
    }>;
    getCustomerByOrganizationId(organizationId: string): Promise<string>;
    createBillingPortalLink(customer: string): Promise<Stripe.Response<Stripe.BillingPortal.Session>>;
    private createCheckoutSession;
    createAccountProcess(userId: string, email: string, country: string): Promise<{
        url: string;
    }>;
    createAccount(userId: string, email: string, country: string): Promise<string>;
    addBankAccount(userId: string): Promise<string>;
    finishTrial(paymentId: string): Promise<Stripe.Response<Stripe.Subscription>>;
    checkSubscription(organizationId: string, subscriptionId: string): Promise<1 | 2 | 0>;
    payAccountStepOne(userId: string, organization: Organization, seller: User, orderId: string, ordersItems: Array<{
        integrationType: string;
        quantity: number;
        price: number;
    }>, groupId: string): Promise<{
        url: string;
    }>;
    subscribe(uniqueId: string, organizationId: string, userId: string, body: BillingSubscribeDto, allowTrial: boolean): Promise<{
        url: string;
    } | {
        id: string;
        portal?: undefined;
    } | {
        portal: string;
        id?: undefined;
    }>;
    paymentSucceeded(event: Stripe.InvoicePaymentSucceededEvent): Promise<{
        ok: boolean;
    }>;
    payout(orderId: string, charge: string, account: string, price: number): Promise<Stripe.Response<Stripe.Transfer>>;
    lifetimeDeal(organizationId: string, code: string): Promise<{
        success: boolean;
    }>;
}
