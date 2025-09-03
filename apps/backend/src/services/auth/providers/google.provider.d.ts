import { ProvidersInterface } from '@gitroom/backend/services/auth/providers.interface';
export declare class GoogleProvider implements ProvidersInterface {
    generateLink(): string;
    getToken(code: string): Promise<string>;
    getUser(providerToken: string): Promise<{
        id: string;
        email: string;
    }>;
}
