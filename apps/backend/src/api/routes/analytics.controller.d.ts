import { Organization } from '@prisma/client';
import { StarsService } from '@gitroom/nestjs-libraries/database/prisma/stars/stars.service';
import { StarsListDto } from '@gitroom/nestjs-libraries/dtos/analytics/stars.list.dto';
import { IntegrationService } from '@gitroom/nestjs-libraries/database/prisma/integrations/integration.service';
export declare class AnalyticsController {
    private _starsService;
    private _integrationService;
    constructor(_starsService: StarsService, _integrationService: IntegrationService);
    getStars(org: Organization): Promise<any[]>;
    getTrending(): Promise<{
        last: string;
        predictions: string;
    }>;
    getStarsFilter(org: Organization, starsFilter: StarsListDto): Promise<{
        stars: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            login: string;
            totalStars: number;
            stars: number;
            date: Date;
            forks: number;
            totalForks: number;
        }[];
    }>;
    getIntegration(org: Organization, integration: string, date: string): Promise<import("@gitroom/nestjs-libraries/integrations/social/social.integrations.interface").AnalyticsData[]>;
}
