import { AnalyticsData, AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { InstagramDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/instagram.dto';
import { Integration } from '@prisma/client';
export declare class InstagramProvider extends SocialAbstract implements SocialProvider {
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    toolTip: string;
    scopes: string[];
    maxConcurrentJob: number;
    editor: "normal";
    refreshToken(refresh_token: string): Promise<AuthTokenDetails>;
    handleErrors(body: string): {
        type: 'refresh-token' | 'bad-body' | 'retry';
        value: string;
    } | undefined;
    reConnect(id: string, requiredId: string, accessToken: string): Promise<AuthTokenDetails>;
    generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }>;
    authenticate(params: {
        code: string;
        codeVerifier: string;
        refresh: string;
    }): Promise<{
        id: any;
        name: any;
        accessToken: any;
        refreshToken: any;
        expiresIn: number;
        picture: any;
        username: string;
    }>;
    pages(accessToken: string): Promise<{
        pageId: any;
        id: any;
        name: any;
        picture: {
            data: {
                url: any;
            };
        };
    }[]>;
    fetchPageInformation(accessToken: string, data: {
        pageId: string;
        id: string;
    }): Promise<{
        id: any;
        name: any;
        picture: any;
        access_token: any;
        username: any;
    }>;
    post(id: string, accessToken: string, postDetails: PostDetails<InstagramDto>[], integration: Integration, type?: string): Promise<PostResponse[]>;
    private setTitle;
    analytics(id: string, accessToken: string, date: number, type?: string): Promise<AnalyticsData[]>;
    music(accessToken: string, data: {
        q: string;
    }): Promise<Response>;
}
