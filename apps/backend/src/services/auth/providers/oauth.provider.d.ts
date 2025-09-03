import { ProvidersInterface } from '@gitroom/backend/services/auth/providers.interface';
export declare class OauthProvider implements ProvidersInterface {
    private readonly authUrl;
    private readonly baseUrl;
    private readonly clientId;
    private readonly clientSecret;
    private readonly frontendUrl;
    private readonly tokenUrl;
    private readonly userInfoUrl;
    constructor();
    generateLink(): string;
    getToken(code: string): Promise<string>;
    getUser(access_token: string): Promise<{
        email: string;
        id: string;
    }>;
}
