export interface PricingInnerInterface {
    current: string;
    month_price: number;
    year_price: number;
    channel?: number;
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
}
export interface PricingInterface {
    [key: string]: PricingInnerInterface;
}
export declare const pricing: PricingInterface;
