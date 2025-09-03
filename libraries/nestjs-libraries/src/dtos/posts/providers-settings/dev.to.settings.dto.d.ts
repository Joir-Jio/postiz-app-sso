import { MediaDto } from '@gitroom/nestjs-libraries/dtos/media/media.dto';
import { DevToTagsSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/dev.to.tags.settings.dto';
export declare class DevToSettingsDto {
    title: string;
    main_image?: MediaDto;
    canonical?: string;
    organization?: string;
    tags: DevToTagsSettingsDto[];
}
