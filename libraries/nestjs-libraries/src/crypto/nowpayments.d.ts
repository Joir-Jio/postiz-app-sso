import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
export interface ProcessPayment {
    payment_id: number;
    payment_status: string;
    pay_address: string;
    price_amount: number;
    price_currency: string;
    pay_amount: number;
    actually_paid: number;
    pay_currency: string;
    order_id: string;
    order_description: string;
    purchase_id: string;
    created_at: string;
    updated_at: string;
    outcome_amount: number;
    outcome_currency: string;
}
export declare class Nowpayments {
    private _subscriptionService;
    constructor(_subscriptionService: SubscriptionService);
    processPayment(path: string, body: ProcessPayment): Promise<ProcessPayment>;
    createPaymentPage(orgId: string): Promise<{
        id: any;
        invoice_url: any;
    }>;
}
