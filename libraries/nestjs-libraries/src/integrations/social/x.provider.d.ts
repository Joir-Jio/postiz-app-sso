import { AnalyticsData, AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';
export declare class XProvider extends SocialAbstract implements SocialProvider {
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    scopes: string[];
    maxConcurrentJob: number;
    toolTip: string;
    editor: "normal";
    handleErrors(body: string): {
        type: 'refresh-token' | 'bad-body';
        value: string;
    } | undefined;
    autoRepostPost(integration: Integration, id: string, fields: {
        likesAmount: string;
    }): Promise<boolean>;
    repostPostUsers(integration: Integration, originalIntegration: Integration, postId: string, information: any): Promise<void>;
    autoPlugPost(integration: Integration, id: string, fields: {
        likesAmount: string;
        post: string;
    }): Promise<boolean>;
    refreshToken(): Promise<AuthTokenDetails>;
    generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }>;
    authenticate(params: {
        code: string;
        codeVerifier: string;
    }): Promise<{
        id: string;
        accessToken: string;
        name: string;
        refreshToken: string;
        expiresIn: number;
        picture: string;
        username: string;
        additionalSettings: {
            title: string;
            description: string;
            type: "checkbox";
            value: boolean;
        }[];
    }>;
    post(id: string, accessToken: string, postDetails: PostDetails<{
        active_thread_finisher: boolean;
        thread_finisher: string;
        community?: string;
        who_can_reply_post: 'everyone' | 'following' | 'mentionedUsers' | 'subscribers' | 'verified';
    }>[]): Promise<PostResponse[]>;
    private loadAllTweets;
    analytics(id: string, accessToken: string, date: number): Promise<AnalyticsData[]>;
    mention(token: string, d: {
        query: string;
    }): Promise<{
        id: string;
        image: string;
        label: string;
    }[]>;
    mentionFormat(idOrHandle: string, name: string): string;
}
