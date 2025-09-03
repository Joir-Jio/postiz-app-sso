import { ProvidersInterface } from '@gitroom/backend/services/auth/providers.interface';
export declare class GithubProvider implements ProvidersInterface {
    generateLink(): string;
    getToken(code: string): Promise<string>;
    getUser(access_token: string): Promise<{
        email: string;
        id: string;
    }>;
}
