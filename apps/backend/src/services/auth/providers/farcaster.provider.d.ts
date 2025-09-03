import { ProvidersInterface } from '@gitroom/backend/services/auth/providers.interface';
export declare class FarcasterProvider implements ProvidersInterface {
    generateLink(): string;
    getToken(code: string): Promise<any>;
    getUser(providerToken: string): Promise<{
        id: string;
        email: string;
    }>;
}
