import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';
export declare class BlueskyProvider extends SocialAbstract implements SocialProvider {
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
        refreshToken: string;
        expiresIn: number;
        accessToken: string;
        id: string;
        name: string;
        picture: string;
        username: string;
    }>;
    post(id: string, accessToken: string, postDetails: PostDetails[], integration: Integration): Promise<PostResponse[]>;
    autoRepostPost(integration: Integration, id: string, fields: {
        likesAmount: string;
    }): Promise<boolean>;
    autoPlugPost(integration: Integration, id: string, fields: {
        likesAmount: string;
        post: string;
    }): Promise<boolean>;
    mention(token: string, d: {
        query: string;
    }, id: string, integration: Integration): Promise<{
        label: string;
        id: string;
        image: string;
    }[]>;
    mentionFormat(idOrHandle: string, name: string): string;
}
