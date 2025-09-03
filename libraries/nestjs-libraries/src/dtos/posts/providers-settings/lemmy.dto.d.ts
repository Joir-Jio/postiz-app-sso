export declare class LemmySettingsDtoInner {
    subreddit: string;
    id: string;
    title: string;
    url: string;
}
export declare class LemmySettingsValueDto {
    value: LemmySettingsDtoInner;
}
export declare class LemmySettingsDto {
    subreddit: LemmySettingsValueDto[];
}
