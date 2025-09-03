import { HttpException } from '@nestjs/common';
export declare enum Sections {
    CHANNEL = "channel",
    POSTS_PER_MONTH = "posts_per_month",
    VIDEOS_PER_MONTH = "videos_per_month",
    TEAM_MEMBERS = "team_members",
    COMMUNITY_FEATURES = "community_features",
    FEATURED_BY_GITROOM = "featured_by_gitroom",
    AI = "ai",
    IMPORT_FROM_CHANNELS = "import_from_channels",
    ADMIN = "admin",
    WEBHOOKS = "webhooks"
}
export declare enum AuthorizationActions {
    Create = "create",
    Read = "read",
    Update = "update",
    Delete = "delete"
}
export declare class SubscriptionException extends HttpException {
    constructor(message: {
        section: Sections;
        action: AuthorizationActions;
    });
}
