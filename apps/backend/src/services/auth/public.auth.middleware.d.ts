import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
export declare class PublicAuthMiddleware implements NestMiddleware {
    private _organizationService;
    constructor(_organizationService: OrganizationService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
