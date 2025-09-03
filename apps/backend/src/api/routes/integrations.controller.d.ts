import { ConnectIntegrationDto } from '@gitroom/nestjs-libraries/dtos/integrations/connect.integration.dto';
import { IntegrationManager } from '@gitroom/nestjs-libraries/integrations/integration.manager';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { Organization, User } from '@prisma/client';
import { IntegrationFunctionDto } from '@gitroom/nestjs-libraries/dtos/integrations/integration.function.dto';
import { PostsService } from '@gitroom/nestjs-libraries/database/prisma/posts/posts.service';
import { IntegrationTimeDto } from '@gitroom/nestjs-libraries/dtos/integrations/integration.time.dto';
import { PlugDto } from '@gitroom/nestjs-libraries/dtos/plugs/plug.dto';
export declare class IntegrationsController {
    private _integrationManager;
    private _integrationService;
    private _postService;
    constructor(_integrationManager: IntegrationManager, _integrationService: IntegrationService, _postService: PostsService);
    getIntegration(): Promise<{
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
    getInternalPlugs(identifier: string): {
        internalPlugs: any;
    };
    getCustomers(org: Organization): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        orgId: string;
    }[]>;
    updateIntegrationGroup(org: Organization, id: string, body: {
        group: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        picture: string | null;
        organizationId: string;
        type: string;
        internalId: string;
        providerIdentifier: string;
        token: string;
        disabled: boolean;
        tokenExpiration: Date | null;
        refreshToken: string | null;
        profile: string | null;
        inBetweenSteps: boolean;
        refreshNeeded: boolean;
        postingTimes: string;
        customInstanceDetails: string | null;
        customerId: string | null;
        rootInternalId: string | null;
        additionalSettings: string | null;
    }>;
    updateOnCustomerName(org: Organization, id: string, body: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        picture: string | null;
        organizationId: string;
        type: string;
        internalId: string;
        providerIdentifier: string;
        token: string;
        disabled: boolean;
        tokenExpiration: Date | null;
        refreshToken: string | null;
        profile: string | null;
        inBetweenSteps: boolean;
        refreshNeeded: boolean;
        postingTimes: string;
        customInstanceDetails: string | null;
        customerId: string | null;
        rootInternalId: string | null;
        additionalSettings: string | null;
    }>;
    getIntegrationList(org: Organization): Promise<{
        integrations: {
            display: string;
            type: string;
            time: any;
            changeProfilePicture: boolean;
            changeNickName: boolean;
            customer: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                orgId: string;
            };
            additionalSettings: string;
            customFields?: {
                key: string;
                label: string;
                defaultValue?: string;
                validation: string;
                type: "text" | "password";
            }[];
            name: string;
            id: string;
            internalId: string;
            disabled: boolean;
            editor: "html" | "normal" | "markdown";
            picture: string;
            identifier: string;
            inBetweenSteps: boolean;
            refreshNeeded: boolean;
            isCustomFields: boolean;
        }[];
    }>;
    updateProviderSettings(org: Organization, id: string, body: string): Promise<void>;
    setNickname(org: Organization, id: string, body: {
        name: string;
        picture: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        picture: string | null;
        organizationId: string;
        type: string;
        internalId: string;
        providerIdentifier: string;
        token: string;
        disabled: boolean;
        tokenExpiration: Date | null;
        refreshToken: string | null;
        profile: string | null;
        inBetweenSteps: boolean;
        refreshNeeded: boolean;
        postingTimes: string;
        customInstanceDetails: string | null;
        customerId: string | null;
        rootInternalId: string | null;
        additionalSettings: string | null;
    }>;
    getSingleIntegration(id: string, order: string, user: User, org: Organization): Promise<{
        id: string;
        name: string;
        picture: string;
        providerIdentifier: string;
        inBetweenSteps: boolean;
    }>;
    getIntegrationUrl(integration: string, refresh: string, externalUrl: string): Promise<{
        url: string;
        err?: undefined;
    } | {
        err: boolean;
        url?: undefined;
    }>;
    setTime(org: Organization, id: string, body: IntegrationTimeDto): Promise<{
        id: string;
    }>;
    mentions(org: Organization, body: IntegrationFunctionDto): Promise<any[] | {
        none: true;
    }>;
    functionIntegration(org: Organization, body: IntegrationFunctionDto): Promise<any>;
    connectSocialMedia(org: Organization, integration: string, body: ConnectIntegrationDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        picture: string | null;
        organizationId: string;
        type: string;
        internalId: string;
        providerIdentifier: string;
        token: string;
        disabled: boolean;
        tokenExpiration: Date | null;
        refreshToken: string | null;
        profile: string | null;
        inBetweenSteps: boolean;
        refreshNeeded: boolean;
        postingTimes: string;
        customInstanceDetails: string | null;
        customerId: string | null;
        rootInternalId: string | null;
        additionalSettings: string | null;
    }>;
    disableChannel(org: Organization, id: string): Promise<void>;
    saveInstagram(id: string, body: {
        pageId: string;
        id: string;
    }, org: Organization): Promise<{
        success: boolean;
    }>;
    saveFacebook(id: string, body: {
        page: string;
    }, org: Organization): Promise<{
        success: boolean;
    }>;
    saveLinkedin(id: string, body: {
        page: string;
    }, org: Organization): Promise<{
        success: boolean;
    }>;
    enableChannel(org: Organization, id: string): Promise<void>;
    deleteChannel(org: Organization, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        picture: string | null;
        organizationId: string;
        type: string;
        internalId: string;
        providerIdentifier: string;
        token: string;
        disabled: boolean;
        tokenExpiration: Date | null;
        refreshToken: string | null;
        profile: string | null;
        inBetweenSteps: boolean;
        refreshNeeded: boolean;
        postingTimes: string;
        customInstanceDetails: string | null;
        customerId: string | null;
        rootInternalId: string | null;
        additionalSettings: string | null;
    }>;
    getPlugList(): Promise<{
        plugs: {
            name: string;
            identifier: string;
            plugs: any;
        }[];
    }>;
    getPlugsByIntegrationId(id: string, org: Organization): Promise<{
        id: string;
        data: string;
        activated: boolean;
        organizationId: string;
        plugFunction: string;
        integrationId: string;
    }[]>;
    postPlugsByIntegrationId(id: string, org: Organization, body: PlugDto): Promise<{
        activated: boolean;
    }>;
    changePlugActivation(id: string, org: Organization, status: boolean): Promise<{
        id: string;
    }>;
    getUpdates(query: {
        word: string;
        id?: number;
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
}
