import { PrismaRepository } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { SignatureDto } from '@gitroom/nestjs-libraries/dtos/signature/signature.dto';
export declare class SignatureRepository {
    private _signatures;
    constructor(_signatures: PrismaRepository<'signatures'>);
    getSignaturesByOrgId(orgId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        autoAdd: boolean;
    }[]>;
    getDefaultSignature(orgId: string): import(".prisma/client").Prisma.Prisma__SignaturesClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        autoAdd: boolean;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    createOrUpdateSignature(orgId: string, signature: SignatureDto, id?: string): Promise<{
        id: string;
    }>;
    deleteSignature(orgId: string, id: string): import(".prisma/client").Prisma.Prisma__SignaturesClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        autoAdd: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
