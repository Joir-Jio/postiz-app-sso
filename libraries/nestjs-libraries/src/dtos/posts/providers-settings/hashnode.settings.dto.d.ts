import { MediaDto } from '@gitroom/nestjs-libraries/dtos/media/media.dto';
export declare class HashnodeTagsSettings {
    value: string;
    label: string;
}
export declare class HashnodeSettingsDto {
    title: string;
    subtitle: string;
    main_image?: MediaDto;
    canonical?: string;
    publication?: string;
    tags: HashnodeTagsSettings[];
}
