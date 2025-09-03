import { Organization } from '@prisma/client';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
export declare class CopilotController {
    private _subscriptionService;
    constructor(_subscriptionService: SubscriptionService);
    chat(req: Request, res: Response): Promise<void> & import("graphql-yoga").PromiseOrValue<Response> & void;
    calculateCredits(organization: Organization, type: 'ai_images' | 'ai_videos'): Promise<{
        credits: number;
    }>;
}
