import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';
export declare class DiscordProvider extends SocialAbstract implements SocialProvider {
    maxConcurrentJob: number;
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    editor: "markdown";
    scopes: string[];
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
        expiresIn: any;
        picture: string;
        username: any;
    }>;
    channels(accessToken: string, params: any, id: string): Promise<any>;
    post(id: string, accessToken: string, postDetails: PostDetails[]): Promise<PostResponse[]>;
    changeNickname(id: string, accessToken: string, name: string): Promise<{
        name: string;
    }>;
    mention(token: string, data: {
        query: string;
    }, id: string, integration: Integration): Promise<any[]>;
    mentionFormat(idOrHandle: string, name: string): string;
}
