import { Response, Request } from 'express';
import { TokenValidationDto, TokenValidationResponseDto, TokenRefreshDto, TokenRefreshResponseDto, SsoLogoutDto, SsoLogoutResponseDto } from '@gitroom/nestjs-libraries/dtos/sso/sso-auth.dto';
import { UnifiedSsoService } from '@gitroom/backend/services/sso/unified-sso.service';
import { SeamlessAuthService } from '@gitroom/backend/services/sso/seamless-auth.service';
import { InputValidationService } from '@gitroom/nestjs-libraries/security/input-validation.service';
import { AuditLoggingService } from '@gitroom/nestjs-libraries/security/audit-logging.service';
interface SeamlessLoginRequest {
    token: string;
    challenge?: string;
    state?: string;
    redirect_url?: string;
}
export declare class SeamlessAuthController {
    private readonly unifiedSsoService;
    private readonly seamlessAuthService;
    private readonly inputValidation;
    private readonly auditLogger;
    private readonly logger;
    constructor(unifiedSsoService: UnifiedSsoService, seamlessAuthService: SeamlessAuthService, inputValidation: InputValidationService, auditLogger: AuditLoggingService);
    handleSeamlessLogin(query: SeamlessLoginRequest, request: Request, response: Response, fingerprint?: string): Promise<void>;
    validateToken(validationRequest: TokenValidationDto, request: Request): Promise<TokenValidationResponseDto>;
    refreshToken(refreshRequest: TokenRefreshDto, request: Request): Promise<TokenRefreshResponseDto>;
    logout(logoutRequest: SsoLogoutDto, request: Request, response: Response): Promise<SsoLogoutResponseDto>;
    getSession(request: Request, authorization?: string): Promise<{
        valid: boolean;
        user?: {
            id: string;
            email: string;
            name?: string;
        };
        organization?: {
            id: string;
            name: string;
        };
        session?: {
            id: string;
            expiresAt: Date;
            scopes: string[];
        };
        productKey?: string;
    }>;
    preloadContext(contextRequest: {
        productKey: string;
        contentHints?: {
            mediaIds?: string[];
            platforms?: string[];
            contentType?: 'text' | 'image' | 'video' | 'carousel';
        };
    }, request: Request, authorization?: string): Promise<{
        success: boolean;
        preloadedContent?: any;
        error?: string;
    }>;
    private extractClientContext;
    private validateSeamlessLoginInput;
    private buildErrorRedirectUrl;
}
export {};
