export declare class BillingSubscribeDto {
    period: 'MONTHLY' | 'YEARLY';
    billing: 'STANDARD' | 'PRO' | 'TEAM' | 'ULTIMATE';
    utm: string;
    tolt: string;
}
