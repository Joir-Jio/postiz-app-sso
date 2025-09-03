import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { SetsDto } from '@gitroom/nestjs-libraries/dtos/sets/sets.dto';
export declare class SetsRepository {
    private _sets;
    constructor(_sets: PrismaRepository<'sets'>);
    getTotal(orgId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    getSets(orgId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        content: string;
    }[]>;
    deleteSet(orgId: string, id: string): import(".prisma/client").Prisma.Prisma__SetsClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        content: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createSet(orgId: string, body: SetsDto): Promise<{
        id: string;
    }>;
}
