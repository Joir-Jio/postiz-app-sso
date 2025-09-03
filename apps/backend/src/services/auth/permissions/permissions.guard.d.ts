import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '@gitroom/backend/services/auth/permissions/permissions.service';
export declare class PoliciesGuard implements CanActivate {
    private _reflector;
    private _authorizationService;
    constructor(_reflector: Reflector, _authorizationService: PermissionsService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private execPolicyHandler;
}
