import { Request } from 'express';
import { UnifiedSsoService } from '@gitroom/backend/services/sso/unified-sso.service';
import { PlatformService } from '@gitroom/backend/services/sso/platform.service';
import { UserMappingService } from '@gitroom/backend/services/sso/user-mapping.service';
import { InputValidationService } from '@gitroom/nestjs-libraries/security/input-validation.service';
import { AuditLoggingService } from '@gitroom/nestjs-libraries/security/audit-logging.service';
import { GCSStorage } from '@gitroom/nestjs-libraries/upload/gcs.storage';
interface EnsureUserRequest {
    productKey: string;
    email: string;
    externalUserId: string;
    name?: string;
    avatar?: string;
    organizationName?: string;
    permissions?: string[];
    metadata?: Record<string, unknown>;
}
interface EnsureUserResponse {
    success: boolean;
    user: {
        id: string;
        email: string;
        name?: string;
        avatar?: string;
        isNew: boolean;
    };
    organization: {
        id: string;
        name: string;
        isNew: boolean;
    };
    mapping: {
        id: string;
        externalUserId: string;
        permissions: string[];
    };
    error?: string;
}
interface LinkMediaRequest {
    productKey: string;
    userId: string;
    mediaReferences: Array<{
        externalMediaId: string;
        fileName: string;
        fileUrl: string;
        fileType: string;
        fileSize?: number;
        metadata?: Record<string, unknown>;
    }>;
}
interface ConsolidateUsersRequest {
    primaryUserId: string;
    duplicateUserIds: string[];
    mergeStrategy: 'keep_primary' | 'merge_all' | 'manual';
    conflictResolution: {
        email: 'primary' | 'latest';
        name: 'primary' | 'latest';
        avatar: 'primary' | 'latest';
        organizations: 'merge' | 'primary';
    };
}
export declare class InternalApiController {
    private readonly unifiedSsoService;
    private readonly platformService;
    private readonly userMappingService;
    private readonly inputValidation;
    private readonly auditLogger;
    private readonly gcsStorage;
    private readonly logger;
    constructor(unifiedSsoService: UnifiedSsoService, platformService: PlatformService, userMappingService: UserMappingService, inputValidation: InputValidationService, auditLogger: AuditLoggingService, gcsStorage: GCSStorage);
    ensureUser(request: EnsureUserRequest, authorization: string, req: Request): Promise<EnsureUserResponse>;
    linkMedia(request: LinkMediaRequest, authorization: string, req: Request): Promise<{
        success: boolean;
        linkedCount: number;
        mediaReferences: Array<{
            externalMediaId: string;
            postizMediaId: string;
            url: string;
        }>;
        errors: Array<{
            externalMediaId: string;
            error: string;
        }>;
    }>;
    getUserMappings(userId: string, includeInactive: boolean, authorization: string, req: Request): Promise<{
        success: boolean;
        userId: string;
        mappings: Array<{
            id: string;
            productKey: string;
            externalUserId: string;
            permissions: string[];
            dataAccessLevel: string;
            status: string;
            lastSync: Date;
            createdAt: Date;
        }>;
    }>;
    consolidateUsers(request: ConsolidateUsersRequest, authorization: string, req: Request): Promise<{
        success: boolean;
        consolidatedUserId: string;
        mergedMappings: number;
        error?: string;
    }>;
    getSsoAnalytics(productKey?: string, timeRange?: string, authorization?: string, req?: Request): Promise<{
        success: boolean;
        analytics: {
            userMappings: any;
            productHealth: any[];
            recentActivity: any[];
            errorSummary: any[];
        };
    }>;
    testWebhook(productKey: string, testRequest: {
        webhookType: 'userCreated' | 'userLogin' | 'mediaShared' | 'configUpdated';
        payload?: Record<string, unknown>;
    }, authorization: string, req: Request): Promise<{
        success: boolean;
        webhookUrl?: string;
        responseStatus?: number;
        responseTime?: number;
        error?: string;
    }>;
    private authenticateInternalRequest;
    private validateEnsureUserRequest;
    private convertToTrustDomainScopes;
    private createMediaReference;
    private extractAdminUserId;
    private performWebhookTest;
    private get prisma();
}
export {};
