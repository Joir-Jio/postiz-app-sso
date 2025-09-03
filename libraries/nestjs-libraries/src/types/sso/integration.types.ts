/**
 * Integration-friendly types for seamless handoff between external products and Postiz
 * Provides comprehensive interfaces for cross-product communication
 * 
 * @fileoverview Integration types for multi-product SSO system
 * @version 1.0.0
 */

import { z } from 'zod';
import { User, Organization } from '@prisma/client';
import { 
  SaasProduct, 
  ProductUser, 
  MediaReference, 
  UserGcsMapping, 
  TrustDomainScope 
} from './core.types';
import { JwtPayload, SsoFlowContext } from './jwt.types';
import { BaseConfiguration } from './configuration.types';

/**
 * Integration flow types for different handoff scenarios
 */
export enum IntegrationType {
  SSO_LOGIN = 'sso_login',
  MEDIA_HANDOFF = 'media_handoff',
  USER_CREATION = 'user_creation',
  CONTEXT_SHARING = 'context_sharing',
  WEBHOOK_NOTIFICATION = 'webhook_notification',
  API_PROXY = 'api_proxy',
}

/**
 * Integration status tracking
 */
export enum IntegrationStatus {
  INITIATED = 'initiated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

/**
 * Cross-product user context for seamless experience
 */
export interface CrossProductUserContext {
  readonly userId: string;
  readonly organizationId: string;
  readonly externalUserId: string;
  readonly email: string;
  readonly name?: string;
  readonly avatar?: string;
  readonly preferences: Record<string, unknown>;
  readonly permissions: TrustDomainScope[];
  readonly sessionId: string;
  readonly lastActivity: Date;
  readonly originProduct: string;
  readonly targetProduct: string;
  readonly metadata: Record<string, unknown>;
}

/**
 * Media handoff context for file sharing
 */
export interface MediaHandoffContext {
  readonly mediaReferences: MediaReference[];
  readonly gcsMappings: UserGcsMapping[];
  readonly temporaryUrls: Array<{
    readonly mediaId: string;
    readonly url: string;
    readonly expiresAt: Date;
    readonly accessLevel: 'read' | 'write';
  }>;
  readonly bucketAccess: {
    readonly bucketName: string;
    readonly basePath: string;
    readonly permissions: string[];
  };
  readonly processingStatus: Record<string, {
    readonly status: 'pending' | 'processing' | 'completed' | 'failed';
    readonly progress?: number;
    readonly error?: string;
  }>;
}

/**
 * SSO handoff payload for authentication flow
 */
export interface SsoHandoffPayload {
  readonly type: IntegrationType.SSO_LOGIN;
  readonly userContext: CrossProductUserContext;
  readonly authToken: string;
  readonly redirectUrl: string;
  readonly state: string;
  readonly expiresAt: Date;
  readonly challenge?: string;
  readonly nonce?: string;
}

/**
 * User creation handoff for automatic provisioning
 */
export interface UserCreationHandoff {
  readonly type: IntegrationType.USER_CREATION;
  readonly externalUserData: {
    readonly id: string;
    readonly email: string;
    readonly name?: string;
    readonly avatar?: string;
    readonly metadata: Record<string, unknown>;
  };
  readonly organizationData?: {
    readonly id?: string;
    readonly name: string;
    readonly domain?: string;
    readonly settings?: Record<string, unknown>;
  };
  readonly productConfiguration: BaseConfiguration;
  readonly autoActivate: boolean;
  readonly notifyUser: boolean;
  readonly welcomeEmail?: boolean;
}

/**
 * Media handoff payload for file operations
 */
export interface MediaHandoffPayload {
  readonly type: IntegrationType.MEDIA_HANDOFF;
  readonly userContext: CrossProductUserContext;
  readonly mediaContext: MediaHandoffContext;
  readonly operation: 'upload' | 'download' | 'share' | 'process';
  readonly requestId: string;
  readonly callback?: {
    readonly url: string;
    readonly method: 'POST' | 'PUT' | 'PATCH';
    readonly headers?: Record<string, string>;
    readonly authentication?: 'bearer' | 'apikey' | 'signature';
  };
}

/**
 * Context sharing payload for seamless user experience
 */
export interface ContextSharingPayload {
  readonly type: IntegrationType.CONTEXT_SHARING;
  readonly userContext: CrossProductUserContext;
  readonly sharedData: {
    readonly posts?: Array<{
      readonly id: string;
      readonly content: string;
      readonly media?: string[];
      readonly publishDate?: Date;
      readonly platforms?: string[];
    }>;
    readonly integrations?: Array<{
      readonly platform: string;
      readonly connected: boolean;
      readonly username?: string;
      readonly permissions?: string[];
    }>;
    readonly analytics?: Record<string, unknown>;
    readonly settings?: Record<string, unknown>;
  };
  readonly permissionLevel: 'read' | 'write' | 'admin';
  readonly dataScope: string[];
  readonly expiresAt?: Date;
}

/**
 * Webhook notification payload for event-driven integration
 */
export interface WebhookNotificationPayload {
  readonly type: IntegrationType.WEBHOOK_NOTIFICATION;
  readonly event: string;
  readonly timestamp: Date;
  readonly productKey: string;
  readonly userId?: string;
  readonly organizationId?: string;
  readonly data: Record<string, unknown>;
  readonly signature: string;
  readonly version: string;
  readonly retryCount: number;
}

/**
 * API proxy payload for transparent service calls
 */
export interface ApiProxyPayload {
  readonly type: IntegrationType.API_PROXY;
  readonly userContext: CrossProductUserContext;
  readonly targetEndpoint: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly headers: Record<string, string>;
  readonly body?: unknown;
  readonly timeout: number;
  readonly retryPolicy?: {
    readonly maxAttempts: number;
    readonly backoffMs: number;
  };
}

/**
 * Union type for all integration payloads
 */
export type IntegrationPayload = 
  | SsoHandoffPayload
  | UserCreationHandoff
  | MediaHandoffPayload
  | ContextSharingPayload
  | WebhookNotificationPayload
  | ApiProxyPayload;

/**
 * Integration request wrapper
 */
export interface IntegrationRequest<T extends IntegrationPayload = IntegrationPayload> {
  readonly id: string;
  readonly type: IntegrationType;
  readonly originProduct: string;
  readonly targetProduct: string;
  readonly initiatedBy: string;
  readonly payload: T;
  readonly status: IntegrationStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly completedAt?: Date;
  readonly errorDetails?: {
    readonly code: string;
    readonly message: string;
    readonly retryable: boolean;
  };
  readonly metadata: Record<string, unknown>;
}

/**
 * Integration response wrapper
 */
export interface IntegrationResponse<T = unknown> {
  readonly requestId: string;
  readonly success: boolean;
  readonly data?: T;
  readonly error?: {
    readonly code: string;
    readonly message: string;
    readonly details?: Record<string, unknown>;
  };
  readonly metadata?: Record<string, unknown>;
  readonly processedAt: Date;
}

/**
 * SSO callback result for authentication completion
 */
export interface SsoCallbackResult {
  readonly success: boolean;
  readonly user: User;
  readonly organization: Organization;
  readonly productUser: ProductUser;
  readonly authTokens: {
    readonly accessToken: string;
    readonly refreshToken?: string;
    readonly expiresIn: number;
  };
  readonly redirectUrl: string;
  readonly sessionEstablished: boolean;
  readonly firstLogin: boolean;
}

/**
 * User provisioning result
 */
export interface UserProvisioningResult {
  readonly success: boolean;
  readonly user: User;
  readonly organization: Organization;
  readonly productUser: ProductUser;
  readonly created: {
    readonly user: boolean;
    readonly organization: boolean;
    readonly productUser: boolean;
  };
  readonly activationRequired: boolean;
  readonly notifications: {
    readonly welcome: boolean;
    readonly activation: boolean;
  };
}

/**
 * Media operation result
 */
export interface MediaOperationResult {
  readonly success: boolean;
  readonly operation: 'upload' | 'download' | 'share' | 'process';
  readonly mediaReferences: MediaReference[];
  readonly urls?: Array<{
    readonly mediaId: string;
    readonly url: string;
    readonly expiresAt: Date;
  }>;
  readonly processingJobs?: Array<{
    readonly jobId: string;
    readonly status: string;
    readonly estimatedCompletion?: Date;
  }>;
  readonly quota?: {
    readonly used: number;
    readonly limit: number;
    readonly percentage: number;
  };
}

/**
 * Integration handler interface for implementing different flows
 */
export interface IntegrationHandler<T extends IntegrationPayload = IntegrationPayload> {
  readonly type: IntegrationType;
  canHandle(request: IntegrationRequest): boolean;
  process(request: IntegrationRequest<T>): Promise<IntegrationResponse>;
  validate(payload: T): Promise<boolean>;
  rollback?(request: IntegrationRequest<T>): Promise<void>;
}

/**
 * Integration registry for managing handlers
 */
export interface IntegrationRegistry {
  register<T extends IntegrationPayload>(handler: IntegrationHandler<T>): void;
  getHandler(type: IntegrationType): IntegrationHandler | undefined;
  getHandlers(): IntegrationHandler[];
  unregister(type: IntegrationType): boolean;
}

/**
 * Product capability definition for integration compatibility
 */
export interface ProductCapabilities {
  readonly productKey: string;
  readonly supportedIntegrations: IntegrationType[];
  readonly mediaFormats: {
    readonly supported: string[];
    readonly maxFileSize: number;
    readonly processingCapabilities: string[];
  };
  readonly authMethods: string[];
  readonly apiVersion: string;
  readonly webhookSupport: boolean;
  readonly rateLimits: {
    readonly requestsPerMinute: number;
    readonly burstLimit: number;
    readonly concurrentSessions: number;
  };
  readonly dataRetention: {
    readonly sessionDays: number;
    readonly mediaDays: number;
    readonly logsDays: number;
  };
}

/**
 * Cross-product compatibility matrix
 */
export interface CompatibilityMatrix {
  readonly products: ProductCapabilities[];
  readonly compatibility: Record<string, Record<string, {
    readonly compatible: boolean;
    readonly supportedFlows: IntegrationType[];
    readonly limitations?: string[];
    readonly requiresUpgrade?: boolean;
  }>>;
  readonly lastUpdated: Date;
}

/**
 * Zod schemas for runtime validation
 */
export const IntegrationTypeSchema = z.nativeEnum(IntegrationType);
export const IntegrationStatusSchema = z.nativeEnum(IntegrationStatus);

export const CrossProductUserContextSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  externalUserId: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
  preferences: z.record(z.unknown()),
  permissions: z.array(z.string()),
  sessionId: z.string().min(1),
  lastActivity: z.date(),
  originProduct: z.string().min(1),
  targetProduct: z.string().min(1),
  metadata: z.record(z.unknown()),
});

export const SsoHandoffPayloadSchema = z.object({
  type: z.literal(IntegrationType.SSO_LOGIN),
  userContext: CrossProductUserContextSchema,
  authToken: z.string().min(1),
  redirectUrl: z.string().url(),
  state: z.string().min(1),
  expiresAt: z.date(),
  challenge: z.string().optional(),
  nonce: z.string().optional(),
});

export const UserCreationHandoffSchema = z.object({
  type: z.literal(IntegrationType.USER_CREATION),
  externalUserData: z.object({
    id: z.string().min(1),
    email: z.string().email(),
    name: z.string().optional(),
    avatar: z.string().url().optional(),
    metadata: z.record(z.unknown()),
  }),
  organizationData: z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1),
    domain: z.string().optional(),
    settings: z.record(z.unknown()).optional(),
  }).optional(),
  productConfiguration: z.record(z.unknown()), // BaseConfiguration schema
  autoActivate: z.boolean(),
  notifyUser: z.boolean(),
  welcomeEmail: z.boolean().optional(),
});

export const IntegrationRequestSchema = z.object({
  id: z.string().uuid(),
  type: IntegrationTypeSchema,
  originProduct: z.string().min(1),
  targetProduct: z.string().min(1),
  initiatedBy: z.string().uuid(),
  payload: z.record(z.unknown()), // Union of payload schemas
  status: IntegrationStatusSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
  errorDetails: z.object({
    code: z.string(),
    message: z.string(),
    retryable: z.boolean(),
  }).optional(),
  metadata: z.record(z.unknown()),
});

export const IntegrationResponseSchema = z.object({
  requestId: z.string().uuid(),
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }).optional(),
  metadata: z.record(z.unknown()).optional(),
  processedAt: z.date(),
});

/**
 * Type guards for integration payloads
 */
export const isSsoHandoffPayload = (payload: IntegrationPayload): payload is SsoHandoffPayload => {
  return payload.type === IntegrationType.SSO_LOGIN;
};

export const isUserCreationHandoff = (payload: IntegrationPayload): payload is UserCreationHandoff => {
  return payload.type === IntegrationType.USER_CREATION;
};

export const isMediaHandoffPayload = (payload: IntegrationPayload): payload is MediaHandoffPayload => {
  return payload.type === IntegrationType.MEDIA_HANDOFF;
};

export const isContextSharingPayload = (payload: IntegrationPayload): payload is ContextSharingPayload => {
  return payload.type === IntegrationType.CONTEXT_SHARING;
};

/**
 * Integration utilities for common operations
 */
export const IntegrationUtils = {
  /**
   * Create user context from Postiz user data
   */
  createUserContext: (
    user: User,
    organization: Organization,
    productUser: ProductUser,
    sessionId: string,
    originProduct: string,
    targetProduct: string
  ): CrossProductUserContext => ({
    userId: user.id,
    organizationId: organization.id,
    externalUserId: productUser.externalUserId,
    email: user.email,
    name: user.name || undefined,
    preferences: productUser.preferences,
    permissions: [], // Derive from product user permissions
    sessionId,
    lastActivity: new Date(),
    originProduct,
    targetProduct,
    metadata: {
      userAgent: '', // Should be passed from request
      lastLogin: productUser.lastSsoLogin,
      dataAccessLevel: productUser.dataAccessLevel,
    },
  }),

  /**
   * Generate integration request ID
   */
  generateRequestId: (): string => {
    return `int_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  },

  /**
   * Create integration request
   */
  createRequest: <T extends IntegrationPayload>(
    type: IntegrationType,
    originProduct: string,
    targetProduct: string,
    initiatedBy: string,
    payload: T,
    metadata: Record<string, unknown> = {}
  ): IntegrationRequest<T> => ({
    id: IntegrationUtils.generateRequestId(),
    type,
    originProduct,
    targetProduct,
    initiatedBy,
    payload,
    status: IntegrationStatus.INITIATED,
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata,
  }),

  /**
   * Create success response
   */
  createSuccessResponse: <T>(requestId: string, data: T, metadata?: Record<string, unknown>): IntegrationResponse<T> => ({
    requestId,
    success: true,
    data,
    metadata,
    processedAt: new Date(),
  }),

  /**
   * Create error response
   */
  createErrorResponse: (
    requestId: string, 
    code: string, 
    message: string, 
    details?: Record<string, unknown>
  ): IntegrationResponse => ({
    requestId,
    success: false,
    error: {
      code,
      message,
      details,
    },
    processedAt: new Date(),
  }),

  /**
   * Validate payload structure
   */
  validatePayload: <T extends IntegrationPayload>(
    payload: unknown,
    type: IntegrationType
  ): payload is T => {
    try {
      switch (type) {
        case IntegrationType.SSO_LOGIN:
          return SsoHandoffPayloadSchema.parse(payload) !== null;
        case IntegrationType.USER_CREATION:
          return UserCreationHandoffSchema.parse(payload) !== null;
        default:
          return false;
      }
    } catch {
      return false;
    }
  },
};

/**
 * Export integration schemas bundle
 */
export const IntegrationSchemas = {
  IntegrationType: IntegrationTypeSchema,
  IntegrationStatus: IntegrationStatusSchema,
  CrossProductUserContext: CrossProductUserContextSchema,
  SsoHandoffPayload: SsoHandoffPayloadSchema,
  UserCreationHandoff: UserCreationHandoffSchema,
  IntegrationRequest: IntegrationRequestSchema,
  IntegrationResponse: IntegrationResponseSchema,
} as const;