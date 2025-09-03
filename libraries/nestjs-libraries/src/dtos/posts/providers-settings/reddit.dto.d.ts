export declare class RedditFlairDto {
    id: string;
    name: string;
}
export declare class RedditSettingsDtoInner {
    subreddit: string;
    title: string;
    type: string;
    url: string;
    is_flair_required: boolean;
    flair: RedditFlairDto;
}
export declare class RedditSettingsValueDto {
    value: RedditSettingsDtoInner;
}
export declare class RedditSettingsDto {
    subreddit: RedditSettingsValueDto[];
}
