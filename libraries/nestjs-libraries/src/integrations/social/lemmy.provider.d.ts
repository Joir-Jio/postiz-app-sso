import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';
import { LemmySettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/lemmy.dto';
export declare class LemmyProvider extends SocialAbstract implements SocialProvider {
    maxConcurrentJob: number;
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    scopes: string[];
    editor: "normal";
    customFields(): Promise<({
        key: string;
        label: string;
        defaultValue: string;
        validation: string;
        type: "text";
    } | {
        key: string;
        label: string;
        validation: string;
        type: "text";
        defaultValue?: undefined;
    } | {
        key: string;
        label: string;
        validation: string;
        type: "password";
        defaultValue?: undefined;
    })[]>;
    refreshToken(refreshToken: string): Promise<AuthTokenDetails>;
    generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }>;
    authenticate(params: {
        code: string;
        codeVerifier: string;
        refresh?: string;
    }): Promise<"Invalid credentials" | {
        refreshToken: any;
        expiresIn: number;
        accessToken: any;
        id: string;
        name: any;
        picture: any;
        username: any;
    }>;
    post(id: string, accessToken: string, postDetails: PostDetails<LemmySettingsDto>[], integration: Integration): Promise<PostResponse[]>;
    subreddits(accessToken: string, data: any, id: string, integration: Integration): Promise<any>;
}
