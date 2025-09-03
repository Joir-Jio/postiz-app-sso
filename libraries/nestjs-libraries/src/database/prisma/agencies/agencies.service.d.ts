import { AgenciesRepository } from '@gitroom/nestjs-libraries/database/prisma/agencies/agencies.repository';
import { User } from '@prisma/client';
import { CreateAgencyDto } from '@gitroom/nestjs-libraries/dtos/agencies/create.agency.dto';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
export declare class AgenciesService {
    private _agenciesRepository;
    private _notificationService;
    constructor(_agenciesRepository: AgenciesRepository, _notificationService: NotificationService);
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
    getCount(): import(".prisma/client").Prisma.PrismaPromise<number>;
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
    getAllAgenciesSlug(): import(".prisma/client").Prisma.PrismaPromise<{
        slug: string;
    }[]>;
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
    approveOrDecline(email: string, action: string, id: string): Promise<void>;
    createAgency(user: User, body: CreateAgencyDto): Promise<{
        id: string;
    }>;
}
