import { Request } from 'express';
import { SsoLoginInitiateDto, SsoLoginResponseDto, SsoCallbackDto, SsoCallbackResponseDto, UserContextResponseDto } from '@gitroom/nestjs-libraries/dtos/sso/sso-auth.dto';
import { ProductRegistrationPayload } from '@gitroom/nestjs-libraries/types/sso';
import { UnifiedSsoService } from '@gitroom/backend/services/sso/unified-sso.service';
import { PlatformService } from '@gitroom/backend/services/sso/platform.service';
import { UserMappingService } from '@gitroom/backend/services/sso/user-mapping.service';
import { InputValidationService } from '@gitroom/nestjs-libraries/security/input-validation.service';
import { AuditLoggingService } from '@gitroom/nestjs-libraries/security/audit-logging.service';
interface ProductHealthResponse {
    healthy: boolean;
    version: string;
    uptime: number;
    lastHeartbeat: Date;
    endpoints: {
        status: 'healthy' | 'degraded' | 'down';
        responseTime: number;
    }[];
    analytics: {
        requests24h: number;
        errors24h: number;
        activeUsers: number;
    };
}
export declare class ProductSsoController {
    private readonly unifiedSsoService;
    private readonly platformService;
    private readonly userMappingService;
    private readonly inputValidation;
    private readonly auditLogger;
    private readonly logger;
    constructor(unifiedSsoService: UnifiedSsoService, platformService: PlatformService, userMappingService: UserMappingService, inputValidation: InputValidationService, auditLogger: AuditLoggingService);
    generateSsoToken(productKey: string, loginRequest: SsoLoginInitiateDto, apiKey: string, apiSecret: string, request: Request): Promise<SsoLoginResponseDto>;
    handleSsoCallback(productKey: string, callbackRequest: SsoCallbackDto, apiKey: string, apiSecret: string, request: Request): Promise<SsoCallbackResponseDto>;
    getUserContext(productKey: string, userId: string, apiKey: string, request: Request, externalUserId?: string, email?: string, includes?: string): Promise<UserContextResponseDto>;
    syncUserData(productKey: string, syncRequest: {
        users: Array<{
            externalUserId: string;
            email: string;
            name?: string;
            avatar?: string;
            customFields?: Record<string, unknown>;
        }>;
        options?: {
            dryRun?: boolean;
            batchSize?: number;
        };
    }, apiKey: string, apiSecret: string, request: Request): Promise<{
        success: boolean;
        processed: number;
        updated: number;
        created: number;
        errors: Array<{
            externalUserId: string;
            error: string;
        }>;
    }>;
    getProductHealth(productKey: string, apiKey: string, request: Request): Promise<ProductHealthResponse>;
    registerProduct(registrationPayload: ProductRegistrationPayload, authorization: string, request: Request): Promise<{
        success: boolean;
        productKey: string;
        productId?: string;
        apiCredentials?: {
            apiKey: string;
            apiSecret: string;
            webhookSecret: string;
        };
        error?: string;
    }>;
    private authenticateProductRequest;
    private hashApiSecret;
    private performSecurityChecks;
}
export {};
