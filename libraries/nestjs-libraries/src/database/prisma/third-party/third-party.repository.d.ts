import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
export declare class ThirdPartyRepository {
    private _thirdParty;
    constructor(_thirdParty: PrismaRepository<'thirdParty'>);
    getAllThirdPartiesByOrganization(org: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        identifier: string;
    }[]>;
    deleteIntegration(org: string, id: string): import(".prisma/client").Prisma.Prisma__ThirdPartyClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        internalId: string;
        apiKey: string;
        identifier: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    getIntegrationById(org: string, id: string): import(".prisma/client").Prisma.Prisma__ThirdPartyClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        internalId: string;
        apiKey: string;
        identifier: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    saveIntegration(org: string, identifier: string, apiKey: string, data: {
        name: string;
        username: string;
        id: string;
    }): import(".prisma/client").Prisma.Prisma__ThirdPartyClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        internalId: string;
        apiKey: string;
        identifier: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
