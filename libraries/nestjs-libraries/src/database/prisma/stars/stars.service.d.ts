import { StarsRepository } from '@gitroom/nestjs-libraries/database/prisma/stars/stars.repository';
import { NotificationService } from '@gitroom/nestjs-libraries/database/prisma/notifications/notification.service';
import { StarsListDto } from '@gitroom/nestjs-libraries/dtos/analytics/stars.list.dto';
import { BullMqClient } from '@gitroom/nestjs-libraries/bull-mq-transport-new/client';
declare enum Inform {
    Removed = 0,
    New = 1,
    Changed = 2
}
export declare class StarsService {
    private _starsRepository;
    private _notificationsService;
    private _workerServiceProducer;
    constructor(_starsRepository: StarsRepository, _notificationsService: NotificationService, _workerServiceProducer: BullMqClient);
    getGitHubRepositoriesByOrgId(org: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }[]>;
    getAllGitHubRepositories(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }[]>;
    getStarsByLogin(login: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        login: string;
        totalStars: number;
        stars: number;
        date: Date;
        forks: number;
        totalForks: number;
    }[]>;
    getLastStarsByLogin(login: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        login: string;
        totalStars: number;
        stars: number;
        date: Date;
        forks: number;
        totalForks: number;
    }>;
    createStars(login: string, totalNewsStars: number, totalStars: number, totalNewForks: number, totalForks: number, date: Date): import(".prisma/client").Prisma.Prisma__StarClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        login: string;
        totalStars: number;
        stars: number;
        date: Date;
        forks: number;
        totalForks: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    sync(login: string, token?: string): Promise<void>;
    findValidToken(login: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }>;
    fetchWillFallback(url: string, userToken?: string): Promise<Response>;
    syncForksProcess(login: string, userToken?: string, page?: number): Promise<{
        [x: string]: number;
    }>;
    syncProcess(login: string, userToken?: string, page?: number): Promise<{
        [x: string]: number;
    }>;
    updateTrending(language: string, hash: string, arr: Array<{
        name: string;
        position: number;
    }>): Promise<void>;
    inform(type: Inform, removedFromTrending: Array<{
        name: string;
        position: number;
    }>, language: string): Promise<void>;
    replaceOrAddTrending(language: string, hash: string, arr: Array<{
        name: string;
        position: number;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        trendingList: string;
        language: string | null;
        hash: string;
    }>;
    getStars(org: string): Promise<any[]>;
    getStarsFilter(orgId: string, starsFilter: StarsListDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        login: string;
        totalStars: number;
        stars: number;
        date: Date;
        forks: number;
        totalForks: number;
    }[]>;
    addGitHub(orgId: string, code: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }>;
    getOrganizations(orgId: string, id: string): Promise<any>;
    getRepositoriesOfOrganization(orgId: string, id: string, github: string): Promise<any>;
    updateGitHubLogin(orgId: string, id: string, login: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }>;
    deleteRepository(orgId: string, id: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }>;
    predictTrending(max?: number): Promise<string[]>;
    predictTrendingLoop(trendings: Array<{
        date: Date;
    }>, current?: number, max?: number): Promise<Date[]>;
}
export {};
