import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
import { Integration } from '@prisma/client';
import { LinkedinDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/linkedin.dto';
export declare class LinkedinProvider extends SocialAbstract implements SocialProvider {
    identifier: string;
    name: string;
    oneTimeToken: boolean;
    isBetweenSteps: boolean;
    scopes: string[];
    maxConcurrentJob: number;
    refreshWait: boolean;
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
        id: any;
        accessToken: any;
        refreshToken: any;
        expiresIn: any;
        name: any;
        picture: any;
        username: any;
    }>;
    company(token: string, data: {
        url: string;
    }): Promise<{
        options: any;
    }>;
    protected uploadPicture(fileName: string, accessToken: string, personId: string, picture: any, type?: "company" | "personal"): Promise<any>;
    protected fixText(text: string): string;
    private convertImagesToPdfCarousel;
    private streamToBuffer;
    private processMediaForPosts;
    private prepareMediaBuffer;
    private buildPostContent;
    private createLinkedInPostPayload;
    private createMainPost;
    private createCommentPost;
    private createPostResponse;
    post(id: string, accessToken: string, postDetails: PostDetails<LinkedinDto>[], integration: Integration, type?: "company" | "personal"): Promise<PostResponse[]>;
    repostPostUsers(integration: Integration, originalIntegration: Integration, postId: string, information: any, isPersonal?: boolean): Promise<void>;
    mention(token: string, data: {
        query: string;
    }): Promise<any>;
    mentionFormat(idOrHandle: string, name: string): string;
}
