import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';
export declare class OrganizationRepository {
    private _organization;
    private _userOrg;
    private _user;
    constructor(_organization: PrismaRepository<'organization'>, _userOrg: PrismaRepository<'userOrganization'>, _user: PrismaRepository<'user'>);
    getOrgByApiKey(api: string): import(".prisma/client").Prisma.Prisma__OrganizationClient<{
        subscription: {
            subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
            totalChannels: number;
            isLifetime: boolean;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string | null;
        paymentId: string | null;
        allowTrial: boolean;
        isTrailing: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getCount(): import(".prisma/client").Prisma.PrismaPromise<number>;
    getUserOrg(id: string): import(".prisma/client").Prisma.Prisma__UserOrganizationClient<{
        organization: {
            subscription: {
                subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
                totalChannels: number;
                isLifetime: boolean;
            };
            users: {
                id: string;
                userId: string;
                disabled: boolean;
                role: import(".prisma/client").$Enums.Role;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            apiKey: string | null;
            paymentId: string | null;
            allowTrial: boolean;
            isTrailing: boolean;
        };
        user: {
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
        };
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getImpersonateUser(name: string): import(".prisma/client").Prisma.PrismaPromise<{
        organization: {
            id: string;
        };
        user: {
            id: string;
            name: string;
            email: string;
        };
        id: string;
    }[]>;
    updateApiKey(orgId: string): import(".prisma/client").Prisma.Prisma__OrganizationClient<{
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
    getOrgsByUserId(userId: string): Promise<({
        subscription: {
            createdAt: Date;
            subscriptionTier: import(".prisma/client").$Enums.SubscriptionTier;
            totalChannels: number;
            isLifetime: boolean;
        };
        users: {
            disabled: boolean;
            role: import(".prisma/client").$Enums.Role;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string | null;
        paymentId: string | null;
        allowTrial: boolean;
        isTrailing: boolean;
    })[]>;
    getOrgById(id: string): Promise<{
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
    addUserToOrg(userId: string, id: string, orgId: string, role: 'USER' | 'ADMIN'): Promise<false | {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        disabled: boolean;
        role: import(".prisma/client").$Enums.Role;
    }>;
    createOrgAndUser(body: Omit<CreateOrgUserDto, 'providerToken'> & {
        providerId?: string;
    }, hasEmail: boolean, ip: string, userAgent: string): Promise<{
        id: string;
        users: {
            user: {
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
            };
        }[];
    }>;
    getOrgByCustomerId(customerId: string): import(".prisma/client").Prisma.Prisma__OrganizationClient<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        apiKey: string | null;
        paymentId: string | null;
        allowTrial: boolean;
        isTrailing: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getTeam(orgId: string): Promise<{
        users: {
            user: {
                id: string;
                email: string;
            };
            role: import(".prisma/client").$Enums.Role;
        }[];
    }>;
    getAllUsersOrgs(orgId: string): import(".prisma/client").Prisma.Prisma__OrganizationClient<{
        users: {
            user: {
                id: string;
                email: string;
            };
        }[];
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    deleteTeamMember(orgId: string, userId: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        disabled: boolean;
        role: import(".prisma/client").$Enums.Role;
    }>;
    disableOrEnableNonSuperAdminUsers(orgId: string, disable: boolean): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
}
