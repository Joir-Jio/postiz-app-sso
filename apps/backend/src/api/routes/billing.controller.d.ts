import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { Organization, User } from '@prisma/client';
import { BillingSubscribeDto } from '@gitroom/nestjs-libraries/dtos/billing/billing.subscribe.dto';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
import { Request } from 'express';
import { Nowpayments } from '@gitroom/nestjs-libraries/crypto/nowpayments';
export declare class BillingController {
    private _subscriptionService;
    private _stripeService;
    private _notificationService;
    private _nowpayments;
    constructor(_subscriptionService: SubscriptionService, _stripeService: StripeService, _notificationService: NotificationService, _nowpayments: Nowpayments);
    checkId(org: Organization, body: string): Promise<{
        status: number;
    }>;
    finishTrial(org: Organization): Promise<{
        finish: boolean;
    }>;
    isTrialFinished(org: Organization): Promise<{
        finished: boolean;
    }>;
    subscribe(org: Organization, user: User, body: BillingSubscribeDto, req: Request): Promise<{
        url: string;
    } | {
        id: string;
        portal?: undefined;
    } | {
        portal: string;
        id?: undefined;
    }>;
    modifyPayment(org: Organization): Promise<{
        portal: string;
    }>;
    getCurrentBilling(org: Organization): import(".prisma/client").Prisma.Prisma__SubscriptionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
        identifier: string | null;
        cancelAt: Date | null;
        period: import(".prisma/client").$Enums.Period;
        totalChannels: number;
        isLifetime: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    cancel(org: Organization, user: User, body: {
        feedback: string;
    }): Promise<{
        id: string;
        cancel_at: Date;
    }>;
    prorate(org: Organization, body: BillingSubscribeDto): Promise<{
        price: number;
    }>;
    lifetime(org: Organization, body: {
        code: string;
    }): Promise<{
        success: boolean;
    }>;
    addSubscription(body: {
        subscription: string;
    }, user: User, org: Organization): Promise<void>;
    crypto(org: Organization): Promise<{
        id: any;
        invoice_url: any;
    }>;
}
