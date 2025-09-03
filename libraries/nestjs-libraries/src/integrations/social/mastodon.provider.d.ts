import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
export declare class MastodonProvider extends SocialAbstract implements SocialProvider {
    maxConcurrentJob: number;
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    scopes: string[];
    editor: "normal";
    refreshToken(refreshToken: string): Promise<AuthTokenDetails>;
    protected generateUrlDynamic(customUrl: string, state: string, clientId: string, url: string): string;
    generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }>;
    protected dynamicAuthenticate(clientId: string, clientSecret: string, url: string, code: string): Promise<{
        id: any;
        name: any;
        accessToken: any;
        refreshToken: string;
        expiresIn: number;
        picture: any;
        username: any;
    }>;
    authenticate(params: {
        code: string;
        codeVerifier: string;
        refresh?: string;
    }): Promise<{
        id: any;
        name: any;
        accessToken: any;
        refreshToken: string;
        expiresIn: number;
        picture: any;
        username: any;
    }>;
    uploadFile(instanceUrl: string, fileUrl: string, accessToken: string): Promise<any>;
    dynamicPost(id: string, accessToken: string, url: string, postDetails: PostDetails[]): Promise<PostResponse[]>;
    post(id: string, accessToken: string, postDetails: PostDetails[]): Promise<PostResponse[]>;
}
