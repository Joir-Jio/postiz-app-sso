import { AuthTokenDetails, PostDetails, PostResponse, SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
import { SocialAbstract } from '@gitroom/nestjs-libraries/integrations/social.abstract';
export declare class TelegramProvider extends SocialAbstract implements SocialProvider {
    maxConcurrentJob: number;
    identifier: string;
    name: string;
    isBetweenSteps: boolean;
    isWeb3: boolean;
    scopes: string[];
    editor: "html";
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
    }): Promise<"No chat found" | {
        id: string;
        name: string;
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        picture: string;
        username: string;
    }>;
    getBotId(query: {
        id?: number;
        word: string;
    }): Promise<{
        chatId: number;
        lastChatId?: undefined;
    } | {
        lastChatId: number;
        chatId?: undefined;
    } | {
        chatId?: undefined;
        lastChatId?: undefined;
    }>;
    post(id: string, accessToken: string, postDetails: PostDetails[]): Promise<PostResponse[]>;
    private chunkMedia;
    botIsAdmin(chatId: number, botId: number): Promise<boolean>;
}
