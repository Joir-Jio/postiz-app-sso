import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { StarsListDto } from '@gitroom/nestjs-libraries/dtos/analytics/stars.list.dto';
export declare class StarsRepository {
    private _github;
    private _stars;
    private _trending;
    constructor(_github: PrismaRepository<'gitHub'>, _stars: PrismaRepository<'star'>, _trending: PrismaRepository<'trending'>);
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
    replaceOrAddTrending(language: string, hashedNames: string, arr: {
        name: string;
        position: number;
    }[]): import(".prisma/client").Prisma.Prisma__TrendingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        trendingList: string;
        language: string | null;
        hash: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
    getGitHubsByNames(names: string[]): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }[]>;
    findValidToken(login: string): import(".prisma/client").Prisma.Prisma__GitHubClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
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
    getTrendingByLanguage(language: string): import(".prisma/client").Prisma.Prisma__TrendingClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        trendingList: string;
        language: string | null;
        hash: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getStarsFilter(githubs: string[], starsFilter: StarsListDto): import(".prisma/client").Prisma.PrismaPromise<{
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
    addGitHub(orgId: string, accessToken: string): import(".prisma/client").Prisma.Prisma__GitHubClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getGitHubById(orgId: string, id: string): import(".prisma/client").Prisma.Prisma__GitHubClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    updateGitHubLogin(orgId: string, id: string, login: string): import(".prisma/client").Prisma.Prisma__GitHubClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    deleteRepository(orgId: string, id: string): import(".prisma/client").Prisma.Prisma__GitHubClient<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        login: string | null;
        token: string;
        jobId: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getOrganizationsByGitHubLogin(login: string): import(".prisma/client").Prisma.PrismaPromise<{
        organizationId: string;
    }[]>;
}
