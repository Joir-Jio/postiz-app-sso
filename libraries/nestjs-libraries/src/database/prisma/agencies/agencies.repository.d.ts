import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateAgencyDto } from '@gitroom/nestjs-libraries/dtos/agencies/create.agency.dto';
export declare class AgenciesRepository {
    private _socialMediaAgencies;
    private _socialMediaAgenciesNiche;
    constructor(_socialMediaAgencies: PrismaRepository<'socialMediaAgency'>, _socialMediaAgenciesNiche: PrismaRepository<'socialMediaAgencyNiche'>);
    getAllAgencies(): import(".prisma/client").Prisma.PrismaPromise<({
        logo: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            path: string;
            type: string;
            thumbnail: string | null;
            thumbnailTimestamp: number | null;
            alt: string | null;
            fileSize: number;
        };
        niches: {
            agencyId: string;
            niche: string;
        }[];
    } & {
        id: string;
        name: string;
        website: string | null;
        facebook: string | null;
        instagram: string | null;
        twitter: string | null;
        linkedIn: string | null;
        youtube: string | null;
        tiktok: string | null;
        shortDescription: string;
        description: string;
        userId: string;
        logoId: string | null;
        slug: string | null;
        otherSocialMedia: string | null;
        approved: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    getCount(): import(".prisma/client").Prisma.PrismaPromise<number>;
    getAllAgenciesSlug(): import(".prisma/client").Prisma.PrismaPromise<{
        slug: string;
    }[]>;
    approveOrDecline(action: string, id: string): import(".prisma/client").Prisma.Prisma__SocialMediaAgencyClient<{
        id: string;
        name: string;
        website: string | null;
        facebook: string | null;
        instagram: string | null;
        twitter: string | null;
        linkedIn: string | null;
        youtube: string | null;
        tiktok: string | null;
        shortDescription: string;
        description: string;
        userId: string;
        logoId: string | null;
        slug: string | null;
        otherSocialMedia: string | null;
        approved: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getAgencyById(id: string): import(".prisma/client").Prisma.Prisma__SocialMediaAgencyClient<{
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
        logo: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            path: string;
            type: string;
            thumbnail: string | null;
            thumbnailTimestamp: number | null;
            alt: string | null;
            fileSize: number;
        };
        niches: {
            agencyId: string;
            niche: string;
        }[];
    } & {
        id: string;
        name: string;
        website: string | null;
        facebook: string | null;
        instagram: string | null;
        twitter: string | null;
        linkedIn: string | null;
        youtube: string | null;
        tiktok: string | null;
        shortDescription: string;
        description: string;
        userId: string;
        logoId: string | null;
        slug: string | null;
        otherSocialMedia: string | null;
        approved: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getAgencyInformation(agency: string): import(".prisma/client").Prisma.Prisma__SocialMediaAgencyClient<{
        logo: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            path: string;
            type: string;
            thumbnail: string | null;
            thumbnailTimestamp: number | null;
            alt: string | null;
            fileSize: number;
        };
        niches: {
            agencyId: string;
            niche: string;
        }[];
    } & {
        id: string;
        name: string;
        website: string | null;
        facebook: string | null;
        instagram: string | null;
        twitter: string | null;
        linkedIn: string | null;
        youtube: string | null;
        tiktok: string | null;
        shortDescription: string;
        description: string;
        userId: string;
        logoId: string | null;
        slug: string | null;
        otherSocialMedia: string | null;
        approved: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getAgencyByUser(user: User): import(".prisma/client").Prisma.Prisma__SocialMediaAgencyClient<{
        logo: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            organizationId: string;
            path: string;
            type: string;
            thumbnail: string | null;
            thumbnailTimestamp: number | null;
            alt: string | null;
            fileSize: number;
        };
        niches: {
            agencyId: string;
            niche: string;
        }[];
    } & {
        id: string;
        name: string;
        website: string | null;
        facebook: string | null;
        instagram: string | null;
        twitter: string | null;
        linkedIn: string | null;
        youtube: string | null;
        tiktok: string | null;
        shortDescription: string;
        description: string;
        userId: string;
        logoId: string | null;
        slug: string | null;
        otherSocialMedia: string | null;
        approved: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createAgency(user: User, body: CreateAgencyDto): Promise<{
        id: string;
    }>;
}
