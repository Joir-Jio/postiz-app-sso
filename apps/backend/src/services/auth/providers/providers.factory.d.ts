import { Provider } from '@prisma/client';
import { ProvidersInterface } from '@gitroom/backend/services/auth/providers.interface';
export declare class ProvidersFactory {
    static loadProvider(provider: Provider): ProvidersInterface;
}
