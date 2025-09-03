import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { TikTokDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/tiktok.dto';
import { Integration } from '@prisma/client';
export declare class TiktokProvider extends SocialAbstract implements SocialProvider {
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    convertToJPEG: boolean;
    scopes: string[];
    maxConcurrentJob: number;
    editor: "normal";
    handleErrors(body: string): {
        type: 'refresh-token' | 'bad-body';
        value: string;
    } | undefined;
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
    }): Promise<{
        id: any;
        name: any;
        accessToken: any;
        refreshToken: any;
        expiresIn: number;
        picture: any;
        username: any;
    }>;
    maxVideoLength(accessToken: string): Promise<{
        maxDurationSeconds: any;
    }>;
    private uploadedVideoSuccess;
    private postingMethod;
    post(id: string, accessToken: string, postDetails: PostDetails<TikTokDto>[], integration: Integration): Promise<PostResponse[]>;
}
