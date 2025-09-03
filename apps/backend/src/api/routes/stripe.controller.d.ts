import { RawBodyRequest } from '@nestjs/common';
import { StripeService } from '@gitroom/nestjs-libraries/services/stripe.service';
import { CodesService } from '@gitroom/nestjs-libraries/services/codes.service';
export declare class StripeController {
    private readonly _stripeService;
    private readonly _codesService;
    constructor(_stripeService: StripeService, _codesService: CodesService);
    stripeConnect(req: RawBodyRequest<Request>): Promise<void> | {
        ok: boolean;
    };
    stripe(req: RawBodyRequest<Request>): Promise<void | {}> | {
        ok: boolean;
    };
    getStripeCodes(providerToken: string): Promise<string>;
}
