import { Ability } from '@casl/ability';
import { SubscriptionService } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.service';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { WebhooksService } from '@gitroom/nestjs-libraries/database/prisma/webhooks/webhooks.service';
import { AuthorizationActions, Sections } from './permission.exception.class';
export type AppAbility = Ability<[AuthorizationActions, Sections]>;
export declare class PermissionsService {
    private _subscriptionService;
    private _postsService;
    private _integrationService;
    private _webhooksService;
    constructor(_subscriptionService: SubscriptionService, _postsService: PostsService, _integrationService: IntegrationService, _webhooksService: WebhooksService);
    getPackageOptions(orgId: string): Promise<{
        subscription: {
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
        };
        options: {
            channel: number;
            current: string;
            month_price: number;
            year_price: number;
            posts_per_month: number;
            team_members: boolean;
            community_features: boolean;
            featured_by_gitroom: boolean;
            ai: boolean;
            import_from_channels: boolean;
            image_generator?: boolean;
            image_generation_count: number;
            generate_videos: number;
            public_api: boolean;
            webhooks: number;
            autoPost: boolean;
        };
    }>;
    check(orgId: string, created_at: Date, permission: 'USER' | 'ADMIN' | 'SUPERADMIN', requestedPermission: Array<[AuthorizationActions, Sections]>): Promise<Ability<[AuthorizationActions, Sections], import("@casl/ability").MongoQuery>>;
}
