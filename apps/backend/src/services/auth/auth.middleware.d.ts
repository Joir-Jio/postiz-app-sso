import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
export declare const removeAuth: (res: Response) => void;
export declare class AuthMiddleware implements NestMiddleware {
    private _organizationService;
    private _userService;
    constructor(_organizationService: OrganizationService, _userService: UsersService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
