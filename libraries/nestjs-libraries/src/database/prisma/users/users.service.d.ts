import { UsersRepository } from '@gitroom/nestjs-libraries/database/prisma/users/users.repository';
import { Provider } from '@prisma/client';
import { ItemsDto } from '@gitroom/nestjs-libraries/dtos/marketplace/items.dto';
import { UserDetailDto } from '@gitroom/nestjs-libraries/dtos/users/user.details.dto';
import { OrganizationRepository } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.repository';
export declare class UsersService {
    private _usersRepository;
    private _organizationRepository;
    constructor(_usersRepository: UsersRepository, _organizationRepository: OrganizationRepository);
    getUserByEmail(email: string): import(".prisma/client").Prisma.Prisma__UserClient<{
        picture: {
            id: string;
            path: string;
        };
    } & {
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getUserById(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    getUserByProvider(providerId: string, provider: Provider): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    activateUser(id: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    updatePassword(id: string, password: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    changeAudienceSize(userId: string, audience: number): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    changeMarketplaceActive(userId: string, active: boolean): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    getMarketplacePeople(orgId: string, userId: string, body: ItemsDto): Promise<{
        list: {
            id: string;
            name: string;
            bio: string;
            audience: number;
            picture: {
                id: string;
                path: string;
            };
            organizations: {
                organization: {
                    Integration: {
                        providerIdentifier: string;
                    }[];
                };
            }[];
            items: {
                key: string;
            }[];
        }[];
        count: number;
    }>;
    getPersonal(userId: string): Promise<{
        id: string;
        name: string;
        bio: string;
        picture: {
            id: string;
            path: string;
        };
    }>;
    changePersonal(userId: string, body: UserDetailDto): Promise<void>;
}
