import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    constructor();
    onModuleInit(): Promise<void>;
}
export declare class PrismaRepository<T extends keyof PrismaService> {
    private _prismaService;
    model: Pick<PrismaService, T>;
    constructor(_prismaService: PrismaService);
}
export declare class PrismaTransaction {
    private _prismaService;
    model: Pick<PrismaService, '$transaction'>;
    constructor(_prismaService: PrismaService);
}
