import { ThirdPartyAbstract, ThirdPartyParams } from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';
import { ModuleRef } from '@nestjs/core';
import { ThirdPartyService } from '@gitroom/nestjs-libraries/database/prisma/third-party/third-party.service';
export declare class ThirdPartyManager {
    private _moduleRef;
    private _thirdPartyService;
    constructor(_moduleRef: ModuleRef, _thirdPartyService: ThirdPartyService);
    getAllThirdParties(): any[];
    getThirdPartyByName(identifier: string): (ThirdPartyParams & {
        instance: ThirdPartyAbstract;
    }) | undefined;
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
    getAllThirdPartiesByOrganization(org: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        identifier: string;
    }[]>;
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
