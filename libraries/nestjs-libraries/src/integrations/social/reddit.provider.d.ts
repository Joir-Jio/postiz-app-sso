import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { RedditSettingsDto } from '@gitroom/nestjs-libraries/dtos/posts/providers-settings/reddit.dto';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
export declare class RedditProvider extends SocialAbstract implements SocialProvider {
    maxConcurrentJob: number;
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    scopes: string[];
    editor: "normal";
    refreshToken(refreshToken: string): Promise<AuthTokenDetails>;
    generateAuthUrl(): Promise<{
        url: string;
        codeVerifier: string;
        state: string;
    }>;
    authenticate(params: {
        code: string;
        codeVerifier: string;
    }): Promise<{
        id: any;
        name: any;
        accessToken: any;
        refreshToken: any;
        expiresIn: any;
        picture: any;
        username: any;
    }>;
    private uploadFileToReddit;
    post(id: string, accessToken: string, postDetails: PostDetails<RedditSettingsDto>[]): Promise<PostResponse[]>;
    subreddits(accessToken: string, data: any): Promise<any>;
    private getPermissions;
    restrictions(accessToken: string, data: {
        subreddit: string;
    }): Promise<{
        subreddit: string;
        allow: any[];
        is_flair_required: boolean;
        flairs: {
            id: any;
            name: any;
        }[];
    }>;
}
