import { ThirdPartyManager } from '@gitroom/nestjs-libraries/3rdparties/thirdparty.manager';
import { Organization } from '@prisma/client';
import { MediaService } from '@gitroom/nestjs-libraries/database/prisma/media/media.service';
export declare class ThirdPartyController {
    private _thirdPartyManager;
    private _mediaService;
    private storage;
    constructor(_thirdPartyManager: ThirdPartyManager, _mediaService: MediaService);
    getThirdPartyList(): Promise<any[]>;
    getSavedThirdParty(organization: Organization): Promise<{
        title: string;
        position: "media" | "webhook";
        fields: {
            name: string;
            description: string;
            type: string;
            placeholder: string;
            validation?: RegExp;
        }[];
        description: string;
        id: string;
        name: string;
        identifier: string;
    }[]>;
    deleteById(organization: Organization, id: string): import(".prisma/client").Prisma.Prisma__ThirdPartyClient<{
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
    generate(organization: Organization, id: string, data: any): Promise<{
        id: string;
        name: string;
        path: string;
        thumbnail: string;
        alt: string;
    }>;
    callFunction(organization: Organization, id: string, functionName: string, data: any): Promise<any>;
    addApiKey(organization: Organization, identifier: string, api: string): Promise<{
        id: string;
    }>;
}
