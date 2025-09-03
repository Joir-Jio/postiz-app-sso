import { MediaDto } from '@gitroom/nestjs-libraries/dtos/media/media.dto';
import { type AllProvidersSettings } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/all.providers.settings';
export declare class Integration {
    id: string;
}
export declare class PostContent {
    content: string;
    id: string;
    image: MediaDto[];
}
export declare class Post {
    integration: Integration;
    value: PostContent[];
    group: string;
    settings: AllProvidersSettings;
}
declare class Tags {
    value: string;
    label: string;
}
export declare class CreatePostDto {
    type: 'draft' | 'schedule' | 'now';
    order?: string;
    shortLink: boolean;
    inter?: number;
    date: string;
    tags: Tags[];
    posts: Post[];
}
export {};
