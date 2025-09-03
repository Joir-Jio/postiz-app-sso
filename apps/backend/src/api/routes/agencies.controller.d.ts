import { User } from '@prisma/client';
import { AgenciesService } from '@gitroom/nestjs-libraries/database/prisma/agencies/agencies.service';
import { CreateAgencyDto } from '@gitroom/nestjs-libraries/dtos/agencies/create.agency.dto';
export declare class AgenciesController {
    private _agenciesService;
    constructor(_agenciesService: AgenciesService);
    getAgencyByUser(user: User): Promise<{}>;
    createAgency(user: User, body: CreateAgencyDto): Promise<{
        id: string;
    }>;
    updateAgency(user: User, action: string, id: string): Promise<void | 400>;
}
