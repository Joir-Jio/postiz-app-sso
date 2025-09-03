import { SetsRepository } from '@gitroom/nestjs-libraries/database/prisma/sets/sets.repository';
import { SetsDto } from '@gitroom/nestjs-libraries/dtos/sets/sets.dto';
export declare class SetsService {
    private _setsRepository;
    constructor(_setsRepository: SetsRepository);
    getTotal(orgId: string): import(".prisma/client").Prisma.PrismaPromise<number>;
    getSets(orgId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        content: string;
    }[]>;
    createSet(orgId: string, body: SetsDto): Promise<{
        id: string;
    }>;
    deleteSet(orgId: string, id: string): import(".prisma/client").Prisma.Prisma__SetsClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        content: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
