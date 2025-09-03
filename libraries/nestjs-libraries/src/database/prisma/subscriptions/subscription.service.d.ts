import { SubscriptionRepository } from '@gitroom/nestjs-libraries/database/prisma/subscriptions/subscription.repository';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { Organization } from '@prisma/client';
export declare class SubscriptionService {
    private readonly _subscriptionRepository;
    private readonly _integrationService;
    private readonly _organizationService;
    constructor(_subscriptionRepository: SubscriptionRepository, _integrationService: IntegrationService, _organizationService: OrganizationService);
    getSubscriptionByOrganizationId(organizationId: string): import(".prisma/client").Prisma.Prisma__SubscriptionClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
        identifier: string | null;
        cancelAt: Date | null;
        period: import(".prisma/client").$Enums.Period;
        totalChannels: number;
        isLifetime: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    useCredit<T>(organization: Organization, type: string, func: () => Promise<T>): Promise<T>;
    getCode(code: string): import(".prisma/client").Prisma.Prisma__UsedCodesClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orgId: string;
        code: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateAccount(userId: string, account: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        password: string | null;
        providerName: import(".prisma/client").$Enums.Provider;
        lastName: string | null;
        isSuperAdmin: boolean;
        bio: string | null;
        audience: number;
        pictureId: string | null;
        providerId: string | null;
        timezone: number;
        lastReadNotifications: Date;
        inviteId: string | null;
        activated: boolean;
        marketplace: boolean;
        account: string | null;
        connectedAccount: boolean;
        lastOnline: Date;
        ip: string | null;
        agent: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getUserAccount(userId: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        account: string;
        connectedAccount: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    deleteSubscription(customerId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateCustomerId(organizationId: string, customerId: string): import(".prisma/client").Prisma.Prisma__OrganizationClient<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string | null;
        paymentId: string | null;
        allowTrial: boolean;
        isTrailing: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    checkSubscription(organizationId: string, subscriptionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
        identifier: string | null;
        cancelAt: Date | null;
        period: import(".prisma/client").$Enums.Period;
        totalChannels: number;
        isLifetime: boolean;
    }>;
    updateConnectedStatus(account: string, accountCharges: boolean): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    modifySubscription(customerId: string, totalChannels: number, billing: 'FREE' | 'STANDARD' | 'PRO'): Promise<boolean>;
    createOrUpdateSubscription(isTrailing: boolean, identifier: string, customerId: string, totalChannels: number, billing: 'STANDARD' | 'PRO', period: 'MONTHLY' | 'YEARLY', cancelAt: number | null, code?: string, org?: string): Promise<void | {}>;
    getSubscription(organizationId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
        identifier: string | null;
        cancelAt: Date | null;
        period: import(".prisma/client").$Enums.Period;
        totalChannels: number;
        isLifetime: boolean;
    }>;
    checkCredits(organization: Organization, checkType?: string): Promise<{
        credits: number;
    }>;
    lifeTime(orgId: string, identifier: string, subscription: any): Promise<void | {}>;
    addSubscription(orgId: string, userId: string, subscription: any): Promise<void | {}>;
}
