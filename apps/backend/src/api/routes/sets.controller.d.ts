import { Organization } from '@prisma/client';
import { SetsService } from '@gitroom/nestjs-libraries/database/prisma/sets/sets.service';
import { UpdateSetsDto, SetsDto } from '@gitroom/nestjs-libraries/dtos/sets/sets.dto';
export declare class SetsController {
    private _setsService;
    constructor(_setsService: SetsService);
    getSets(org: Organization): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        content: string;
    }[]>;
    createASet(org: Organization, body: SetsDto): Promise<{
        id: string;
    }>;
    updateSet(org: Organization, body: UpdateSetsDto): Promise<{
        id: string;
    }>;
    deleteSet(org: Organization, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        content: string;
    }>;
}
