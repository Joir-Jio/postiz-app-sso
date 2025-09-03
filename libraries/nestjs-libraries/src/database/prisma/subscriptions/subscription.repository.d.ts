import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import dayjs from 'dayjs';
import { Organization } from '@prisma/client';
export declare class SubscriptionRepository {
    private readonly _subscription;
    private readonly _organization;
    private readonly _user;
    private readonly _credits;
    private _usedCodes;
    constructor(_subscription: PrismaRepository<'subscription'>, _organization: PrismaRepository<'organization'>, _user: PrismaRepository<'user'>, _credits: PrismaRepository<'credits'>, _usedCodes: PrismaRepository<'usedCodes'>);
    getUserAccount(userId: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        account: string;
        connectedAccount: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
    updateConnectedStatus(account: string, accountCharges: boolean): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
    getCustomerIdByOrgId(organizationId: string): import(".prisma/client").Prisma.Prisma__OrganizationClient<{
        paymentId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    checkSubscription(organizationId: string, subscriptionId: string): import(".prisma/client").Prisma.Prisma__SubscriptionClient<{
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
    deleteSubscriptionByCustomerId(customerId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
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
    getSubscriptionByCustomerId(customerId: string): Promise<{
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
    getOrganizationByCustomerId(customerId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string | null;
        paymentId: string | null;
        allowTrial: boolean;
        isTrailing: boolean;
    }>;
    createOrUpdateSubscription(isTrailing: boolean, identifier: string, customerId: string, totalChannels: number, billing: 'STANDARD' | 'PRO', period: 'MONTHLY' | 'YEARLY', cancelAt: number | null, code?: string, org?: {
        id: string;
    }): Promise<void>;
    getSubscription(organizationId: string): import(".prisma/client").Prisma.Prisma__SubscriptionClient<{
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
    getCreditsFrom(organizationId: string, from: dayjs.Dayjs, type?: string): Promise<number>;
    useCredit<T>(org: Organization, type: string, func: () => Promise<T>): Promise<T>;
    setCustomerId(orgId: string, customerId: string): import(".prisma/client").Prisma.Prisma__OrganizationClient<{
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
}
