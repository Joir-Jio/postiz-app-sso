import { RedditSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/reddit.dto';
import { PinterestSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/pinterest.dto';
import { YoutubeSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/youtube.settings.dto';
import { TikTokDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/tiktok.dto';
import { XDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/x.dto';
import { LemmySettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/lemmy.dto';
import { DribbbleDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/dribbble.dto';
import { DiscordDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/discord.dto';
import { SlackDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/slack.dto';
import { InstagramDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/instagram.dto';
import { LinkedinDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/linkedin.dto';
import { MediumSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/medium.settings.dto';
import { DevToSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/dev.to.settings.dto';
import { HashnodeSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/hashnode.settings.dto';
import { WordpressDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/wordpress.dto';
export type ProviderExtension<T extends string, M> = {
    __type: T;
} & M;
export type AllProvidersSettings = ProviderExtension<'reddit', RedditSettingsDto> | ProviderExtension<'lemmy', LemmySettingsDto> | ProviderExtension<'youtube', YoutubeSettingsDto> | ProviderExtension<'pinterest', PinterestSettingsDto> | ProviderExtension<'dribbble', DribbbleDto> | ProviderExtension<'tiktok', TikTokDto> | ProviderExtension<'discord', DiscordDto> | ProviderExtension<'slack', SlackDto> | ProviderExtension<'x', XDto> | ProviderExtension<'linkedin', LinkedinDto> | ProviderExtension<'linkedin-page', LinkedinDto> | ProviderExtension<'instagram', InstagramDto> | ProviderExtension<'instagram-standalone', InstagramDto> | ProviderExtension<'medium', MediumSettingsDto> | ProviderExtension<'devto', DevToSettingsDto> | ProviderExtension<'hashnode', HashnodeSettingsDto> | ProviderExtension<'wordpress', WordpressDto> | ProviderExtension<'facebook', None> | ProviderExtension<'threads', None> | ProviderExtension<'mastodon', None> | ProviderExtension<'bluesky', None> | ProviderExtension<'wrapcast', None> | ProviderExtension<'telegram', None> | ProviderExtension<'nostr', None> | ProviderExtension<'vk', None>;
type None = NonNullable<unknown>;
export declare const allProviders: (setEmpty?: any) => {
    value: any;
    name: string;
}[];
export declare class EmptySettings {
    __type: string;
}
export {};
