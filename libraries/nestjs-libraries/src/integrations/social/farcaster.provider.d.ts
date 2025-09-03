import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';
export declare class FarcasterProvider extends SocialAbstract implements SocialProvider {
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    isWeb3: boolean;
    scopes: string[];
    maxConcurrentJob: number;
    editor: "normal";
    refreshToken(refresh_token: string): Promise<AuthTokenDetails>;
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
        id: string;
        name: any;
        accessToken: any;
        refreshToken: string;
        expiresIn: number;
        picture: any;
        username: any;
    }>;
    post(id: string, accessToken: string, postDetails: PostDetails[]): Promise<PostResponse[]>;
    subreddits(accessToken: string, data: any, id: string, integration: Integration): Promise<{
        title: string;
        name: string;
        id: string;
    }[]>;
}
