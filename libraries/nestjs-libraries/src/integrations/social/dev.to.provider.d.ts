import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';
export declare class DevToProvider extends SocialAbstract implements SocialProvider {
    maxConcurrentJob: number;
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    editor: "markdown";
    scopes: string[];
    generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }>;
    handleErrors(body: string): {
        type: "bad-body";
        value: string;
    };
    refreshToken(refreshToken: string): Promise<AuthTokenDetails>;
    customFields(): Promise<{
        key: string;
        label: string;
        validation: string;
        type: "password";
    }[]>;
    authenticate(params: {
        code: string;
        codeVerifier: string;
        refresh?: string;
    }): Promise<"Invalid credentials" | {
        refreshToken: string;
        expiresIn: number;
        accessToken: any;
        id: any;
        name: any;
        picture: any;
        username: any;
    }>;
    tags(token: string): Promise<any>;
    organizations(token: string): Promise<{
        id: any;
        name: any;
        username: any;
    }[]>;
    post(id: string, accessToken: string, postDetails: PostDetails[], integration: Integration): Promise<PostResponse[]>;
}
