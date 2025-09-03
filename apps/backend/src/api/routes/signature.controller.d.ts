import { Organization } from '@prisma/client';
import { SignatureService } from '@gitroom/nestjs-libraries/database/prisma/signatures/signature.service';
import { SignatureDto } from '@gitroom/nestjs-libraries/dtos/signature/signature.dto';
export declare class SignatureController {
    private _signatureService;
    constructor(_signatureService: SignatureService);
    getSignatures(org: Organization): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        autoAdd: boolean;
    }[]>;
    getDefaultSignature(org: Organization): Promise<{}>;
    createSignature(org: Organization, body: SignatureDto): Promise<{
        id: string;
    }>;
    deleteSignature(org: Organization, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string;
        autoAdd: boolean;
    }>;
    updateSignature(id: string, org: Organization, body: SignatureDto): Promise<{
        id: string;
    }>;
}
