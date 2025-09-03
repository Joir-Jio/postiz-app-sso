import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';
import { WordpressDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/wordpress.dto';
export declare class WordpressProvider extends SocialAbstract implements SocialProvider {
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    editor: "html";
    scopes: string[];
    maxConcurrentJob: number;
    generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }>;
    refreshToken(refreshToken: string): Promise<AuthTokenDetails>;
    customFields(): Promise<({
        key: string;
        label: string;
        validation: string;
        type: "text";
    } | {
        key: string;
        label: string;
        validation: string;
        type: "password";
    })[]>;
    authenticate(params: {
        code: string;
        codeVerifier: string;
        refresh?: string;
    }): Promise<"Invalid credentials" | {
        refreshToken: string;
        expiresIn: number;
        accessToken: string;
        id: string;
        name: any;
        picture: any;
        username: string;
    }>;
    postTypes(token: string): Promise<any[]>;
    post(id: string, accessToken: string, postDetails: PostDetails<WordpressDto>[], integration: Integration): Promise<PostResponse[]>;
}
