import { ThirdPartyRepository } from '@gitroom/nestjs-libraries/database/prisma/third-party/third-party.repository';
export declare class ThirdPartyService {
    private _thirdPartyRepository;
    constructor(_thirdPartyRepository: ThirdPartyRepository);
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
