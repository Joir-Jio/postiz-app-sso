import { Organization } from '@prisma/client';
import { AutopostService } from '@gitroom/nestjs-libraries/database/prisma/autopost/autopost.service';
import { AutopostDto } from '@gitroom/nestjs-libraries/dtos/autopost/autopost.dto';
export declare class AutopostController {
    private _autopostsService;
    constructor(_autopostsService: AutopostService);
    getAutoposts(org: Organization): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string | null;
        active: boolean;
        title: string;
        integrations: string;
        url: string;
        lastUrl: string;
        onSlot: boolean;
        syncLast: boolean;
        addPicture: boolean;
        generateContent: boolean;
    }[]>;
    createAutopost(org: Organization, body: AutopostDto): Promise<{
        id: string;
        active: boolean;
    }>;
    updateAutopost(org: Organization, body: AutopostDto, id: string): Promise<{
        id: string;
        active: boolean;
    }>;
    deleteAutopost(org: Organization, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string | null;
        active: boolean;
        title: string;
        integrations: string;
        url: string;
        lastUrl: string;
        onSlot: boolean;
        syncLast: boolean;
        addPicture: boolean;
        generateContent: boolean;
    }>;
    changeActive(org: Organization, id: string, active: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        organizationId: string;
        content: string | null;
        active: boolean;
        title: string;
        integrations: string;
        url: string;
        lastUrl: string;
        onSlot: boolean;
        syncLast: boolean;
        addPicture: boolean;
        generateContent: boolean;
    }>;
    sendWebhook(url: string): Promise<{
        success: boolean;
        date: any;
        url: any;
        description: string;
    } | {
        success: boolean;
        date?: undefined;
        url?: undefined;
        description?: undefined;
    }>;
}
