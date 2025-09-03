import 'reflect-metadata';
import { SocialProvider } from '@gitroom/nestjs-libraries/integrations/social/social.integrations.interface';
export declare const socialIntegrationList: SocialProvider[];
export declare class IntegrationManager {
    getAllIntegrations(): Promise<{
        social: {
            customFields?: {
                key: string;
                label: string;
                defaultValue?: string;
                validation: string;
                type: "text" | "password";
            }[];
            name: string;
            identifier: string;
            toolTip: string;
            editor: "html" | "normal" | "markdown";
            isExternal: boolean;
            isWeb3: boolean;
        }[];
        article: any[];
    }>;
    getAllPlugs(): {
        name: string;
        identifier: string;
        plugs: any;
    }[];
    getInternalPlugs(providerName: string): {
        internalPlugs: any;
    };
    getAllowedSocialsIntegrations(): string[];
    getSocialIntegration(integration: string): SocialProvider;
}
