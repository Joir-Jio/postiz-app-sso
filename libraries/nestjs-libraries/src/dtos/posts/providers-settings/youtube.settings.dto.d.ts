import { MediaDto } from '@gitroom/nestjs-libraries/dtos/media/media.dto';
export declare class YoutubeTagsSettings {
    value: string;
    label: string;
}
export declare class YoutubeSettingsDto {
    title: string;
    type: string;
    thumbnail?: MediaDto;
    tags: YoutubeTagsSettings[];
}
