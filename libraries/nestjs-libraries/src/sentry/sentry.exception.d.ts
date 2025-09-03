import { SentryGlobalFilter } from "@sentry/nestjs/setup";
export declare const FILTER: {
    provide: string;
    useClass: typeof SentryGlobalFilter;
};
