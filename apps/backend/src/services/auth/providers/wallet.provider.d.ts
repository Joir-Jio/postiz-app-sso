import { ProvidersInterface } from '@gitroom/backend/services/auth/providers.interface';
export declare class WalletProvider implements ProvidersInterface {
    generateLink(params: {
        publicKey: string;
    }): Promise<string>;
    getToken(code: string): Promise<string>;
    getUser(providerToken: string): Promise<{
        id: string;
        email: string;
    }>;
}
