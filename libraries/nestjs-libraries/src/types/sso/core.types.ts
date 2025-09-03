/**
 * Core TypeScript type definitions for multi-product SSO system
 * Provides strong typing for database entities and business logic
 * 
 * @fileoverview Comprehensive type system for multi-product SSO integration
 * @version 1.0.0
 */

import { z } from 'zod';

/**
 * Product status enumeration following database constraints
 */
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

/**
 * Data access levels for product users
 */
export enum DataAccessLevel {
  FULL = 'FULL',
  LIMITED = 'LIMITED',
  READ_ONLY = 'READ_ONLY',
  MEDIA_ONLY = 'MEDIA_ONLY',
}

/**
 * Trust domain scopes for JWT tokens
 */
export enum TrustDomainScope {
  SSO_LOGIN = 'sso:login',
  USER_CREATE = 'user:create',
  USER_READ = 'user:read',
  MEDIA_ACCESS = 'media:access',
  MEDIA_UPLOAD = 'media:upload',
  ORG_READ = 'org:read',
}

/**
 * Generic configuration interface for extensible product settings
 */
export interface ProductConfiguration<T = Record<string, unknown>> {
  readonly id: string;
  readonly version: string;
  readonly lastUpdated: Date;
  readonly settings: T;
}

/**
 * Base entity interface following Postiz conventions
 */
export interface BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date;
}

/**
 * SaaS Product entity type matching database schema
 */
export interface SaasProduct extends BaseEntity {
  readonly productKey: string;
  readonly productName: string;
  readonly productDescription?: string;
  readonly baseUrl: string;
  readonly apiKey?: string; // API key for authentication
  readonly apiKeyHash?: string; // Hashed API key for security
  readonly webhookSecret?: string; // Encrypted webhook secret
  
  // SSO configuration
  readonly ssoEnabled: boolean;
  readonly ssoRedirectUrl?: string;
  readonly allowedDomains?: string[];
  
  // GCS configuration
  readonly gcsBucketName?: string;
  readonly gcsBasePath?: string;
  readonly gcsCredentialsHash?: string; // Encrypted GCS credentials
  readonly gcsCredentialsJson?: Record<string, unknown>; // Decrypted GCS credentials (for runtime use)
  
  // Flexible settings and metadata
  readonly settings: Record<string, unknown> | any;
  readonly metadata: Record<string, unknown> | any;
  
  // Feature flags
  readonly autoCreateUsers: boolean;
  readonly allowMediaUpload: boolean;
  readonly dataIsolationEnabled: boolean;
  
  // Rate limiting & Security
  readonly rateLimitRpm?: number;
  readonly maxFileSize?: bigint;
  readonly allowedMimeTypes?: string[];
  
  readonly status: ProductStatus;
}

/**
 * Product User mapping entity type
 */
export interface ProductUser extends BaseEntity {
  readonly productId: string;
  readonly userId: string;
  readonly organizationId: string;
  
  // External product user identification
  readonly externalUserId: string;
  readonly externalUserEmail: string;
  readonly externalUserName?: string;
  readonly externalUserMetadata: Record<string, unknown> | any;
  
  // SSO session management
  readonly ssoSessionId?: string;
  readonly ssoSessionHash?: string;
  readonly lastSsoLogin?: Date;
  readonly ssoTokenHash?: string;
  
  // User preferences and permissions
  readonly preferences: Record<string, unknown> | any;
  readonly permissions: Record<string, unknown> | any;
  readonly dataAccessLevel: DataAccessLevel;
  
  // Security & Audit
  readonly isActive: boolean;
  readonly lastActivity: Date;
  readonly loginCount: number;
  readonly failedLoginAttempts: number;
  readonly lockedUntil?: Date;
  
  // IP and Device Tracking for Security
  readonly lastLoginIp?: string;
  readonly lastLoginUserAgent?: string;
  readonly knownDevices: Record<string, unknown>[] | any;
}

/**
 * User GCS mapping for media file access
 */
export interface UserGcsMapping extends BaseEntity {
  readonly productUserId: string;
  readonly gcsPath: string;
  readonly localPath: string;
  readonly bucketName: string;
  readonly fileHash: string;
  readonly fileSize: number;
  readonly mimeType: string;
  readonly isPublic: boolean;
  readonly expiresAt?: Date;
  readonly accessMetadata: Record<string, unknown>;
}

/**
 * Media reference entity for external file linking
 */
export interface MediaReference extends BaseEntity {
  readonly productUserId: string;
  readonly productId: string;
  readonly organizationId: string;
  readonly externalMediaId: string;
  readonly mediaType: string;
  readonly originalUrl: string;
  readonly gcsPath?: string;
  readonly thumbnailPath?: string;
  readonly fileSize?: bigint;
  readonly mimeType?: string;
  readonly width?: number;
  readonly height?: number;
  readonly duration?: number;
  readonly isProcessed: boolean;
  readonly processingStatus: string;
  readonly processingError?: string;
  readonly processedAt?: Date;
  readonly contentModerationScore?: number;
  readonly moderationFlags: string[];
  readonly isApproved: boolean;
  readonly approvedBy?: string;
  readonly approvedAt?: Date;
  readonly encryptedMetadata?: string;
  readonly metadata?: Record<string, unknown> | any;
}

/**
 * Extended MediaReference with decrypted metadata for convenience
 */
export interface MediaReferenceWithMetadata extends MediaReference {
  readonly metadata?: Record<string, unknown>;
}

/**
 * Zod schemas for runtime validation
 */
export const ProductStatusSchema = z.nativeEnum(ProductStatus);
export const DataAccessLevelSchema = z.nativeEnum(DataAccessLevel);
export const TrustDomainScopeSchema = z.nativeEnum(TrustDomainScope);

export const BaseEntitySchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().optional(),
});

export const SaasProductSchema = BaseEntitySchema.extend({
  productKey: z.string().min(1).max(50),
  productName: z.string().min(1).max(255),
  productDescription: z.string().optional(),
  baseUrl: z.string().url().max(500),
  apiKey: z.string().max(255).optional(),
  webhookSecret: z.string().max(255).optional(),
  ssoEnabled: z.boolean(),
  ssoRedirectUrl: z.string().url().max(500).optional(),
  allowedDomains: z.array(z.string()).optional(),
  gcsBucketName: z.string().max(255).optional(),
  gcsBasePath: z.string().max(500).optional(),
  gcsCredentialsJson: z.record(z.unknown()).optional(),
  settings: z.record(z.unknown()),
  metadata: z.record(z.unknown()),
  autoCreateUsers: z.boolean(),
  allowMediaUpload: z.boolean(),
  dataIsolationEnabled: z.boolean(),
  status: ProductStatusSchema,
});

export const ProductUserSchema = BaseEntitySchema.extend({
  productId: z.string().uuid(),
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  externalUserId: z.string().min(1).max(255),
  externalUserEmail: z.string().email().max(320),
  externalUserName: z.string().max(255).optional(),
  externalUserMetadata: z.record(z.unknown()),
  ssoSessionId: z.string().max(255).optional(),
  lastSsoLogin: z.date().optional(),
  ssoTokenHash: z.string().max(255).optional(),
  preferences: z.record(z.unknown()),
  permissions: z.record(z.unknown()),
  isActive: z.boolean(),
  dataAccessLevel: DataAccessLevelSchema,
});

export const UserGcsMappingSchema = BaseEntitySchema.extend({
  productUserId: z.string().uuid(),
  gcsPath: z.string().min(1).max(1000),
  localPath: z.string().min(1).max(1000),
  bucketName: z.string().min(1).max(255),
  fileHash: z.string().min(1).max(255),
  fileSize: z.number().int().min(0),
  mimeType: z.string().min(1).max(255),
  isPublic: z.boolean(),
  expiresAt: z.date().optional(),
  accessMetadata: z.record(z.unknown()),
});

export const MediaReferenceSchema = BaseEntitySchema.extend({
  productUserId: z.string().uuid(),
  organizationId: z.string().uuid(),
  externalMediaId: z.string().min(1).max(255),
  mediaType: z.string().min(1).max(50),
  originalUrl: z.string().url(),
  gcsPath: z.string().max(1000).optional(),
  thumbnailPath: z.string().max(1000).optional(),
  metadata: z.record(z.unknown()),
  fileSize: z.number().int().min(0).optional(),
  mimeType: z.string().max(255).optional(),
  width: z.number().int().min(0).optional(),
  height: z.number().int().min(0).optional(),
  duration: z.number().min(0).optional(),
  isProcessed: z.boolean(),
  processingStatus: z.string().max(50).optional(),
});

/**
 * Type guards for runtime type checking
 */
export const isSaasProduct = (obj: unknown): obj is SaasProduct => {
  return SaasProductSchema.safeParse(obj).success;
};

export const isProductUser = (obj: unknown): obj is ProductUser => {
  return ProductUserSchema.safeParse(obj).success;
};

export const isUserGcsMapping = (obj: unknown): obj is UserGcsMapping => {
  return UserGcsMappingSchema.safeParse(obj).success;
};

export const isMediaReference = (obj: unknown): obj is MediaReference => {
  return MediaReferenceSchema.safeParse(obj).success;
};

/**
 * Utility types for advanced TypeScript operations
 */
export type SaasProductKeys = keyof SaasProduct;
export type ProductUserKeys = keyof ProductUser;
export type RequiredSaasProductFields = Required<Pick<SaasProduct, 'productKey' | 'productName' | 'baseUrl' | 'status'>>;
export type OptionalSaasProductFields = Partial<Pick<SaasProduct, 'apiKey' | 'webhookSecret' | 'ssoRedirectUrl'>>;

/**
 * Conditional types for feature flag based typing
 */
export type MediaEnabledProduct<T extends SaasProduct> = T['allowMediaUpload'] extends true
  ? T & { gcsConfiguration: Required<Pick<T, 'gcsBucketName' | 'gcsBasePath'>> }
  : T;

export type SsoEnabledProduct<T extends SaasProduct> = T['ssoEnabled'] extends true
  ? T & { ssoConfiguration: Required<Pick<T, 'ssoRedirectUrl'>> }
  : T;

/**
 * Mapped types for dynamic product configurations
 */
export type ProductConfigurationMap<T extends Record<string, SaasProduct>> = {
  [K in keyof T]: ProductConfiguration<T[K]['settings']>;
};

/**
 * Template literal types for dynamic API paths
 */
export type SsoEndpoint<T extends string> = `/api/sso/${T}`;
export type ProductEndpoint<T extends string, U extends string> = `/api/products/${T}/${U}`;

export type SsoApiPath = SsoEndpoint<'login' | 'callback' | 'logout' | 'validate'>;
export type ProductApiPath<T extends string> = ProductEndpoint<T, 'users' | 'media' | 'config'>;

/**
 * Generic helper types for extensible configurations
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/**
 * Configuration type for product-specific settings
 */
export interface ProductSpecificConfig {
  readonly allowedFeatures: string[];
  readonly rateLimits: Record<string, number>;
  readonly customFields: Record<string, unknown>;
  readonly integrations: Record<string, boolean>;
}

/**
 * Missing types that are referenced in index.ts exports
 */

// JWT Types imported from jwt.types.ts
export enum JwtTokenType {
  SSO_ACCESS = 'sso:access',
  SSO_REFRESH = 'sso:refresh',
  TRUST_DOMAIN = 'trust:domain',
  PRODUCT_SESSION = 'product:session',
  MEDIA_ACCESS = 'media:access',
  TEMPORARY_AUTH = 'temp:auth',
}

export enum JwtAlgorithm {
  HS256 = 'HS256',
  HS384 = 'HS384',
  HS512 = 'HS512',
  RS256 = 'RS256',
  RS384 = 'RS384',
  RS512 = 'RS512',
}

// Validation types imported from validation.types.ts
export enum SsoErrorCategory {
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  VALIDATION = 'validation',
  CONFIGURATION = 'configuration',
  INTEGRATION = 'integration',
  MEDIA_ACCESS = 'media_access',
  RATE_LIMITING = 'rate_limiting',
  BUSINESS_LOGIC = 'business_logic',
  SYSTEM_ERROR = 'system_error',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum SsoErrorCode {
  // Authentication errors
  INVALID_TOKEN = 'SSO_AUTH_001',
  TOKEN_EXPIRED = 'SSO_AUTH_002',
  TOKEN_NOT_ACTIVE = 'SSO_AUTH_003',
  INVALID_SIGNATURE = 'SSO_AUTH_004',
  MISSING_TOKEN = 'SSO_AUTH_005',
  TOKEN_REVOKED = 'SSO_AUTH_006',
  
  // Authorization errors
  INSUFFICIENT_PERMISSIONS = 'SSO_AUTHZ_001',
  PRODUCT_ACCESS_DENIED = 'SSO_AUTHZ_002',
  ORGANIZATION_ACCESS_DENIED = 'SSO_AUTHZ_003',
  MEDIA_ACCESS_DENIED = 'SSO_AUTHZ_004',
  FEATURE_DISABLED = 'SSO_AUTHZ_005',
  
  // Validation errors
  INVALID_PRODUCT_KEY = 'SSO_VAL_001',
  INVALID_USER_DATA = 'SSO_VAL_002',
  INVALID_CONFIGURATION = 'SSO_VAL_003',
  MISSING_REQUIRED_FIELD = 'SSO_VAL_004',
  FIELD_FORMAT_INVALID = 'SSO_VAL_005',
  DATA_CONSTRAINT_VIOLATION = 'SSO_VAL_006',
  
  // Configuration errors
  PRODUCT_NOT_FOUND = 'SSO_CFG_001',
  PRODUCT_DISABLED = 'SSO_CFG_002',
  INVALID_SSO_CONFIG = 'SSO_CFG_003',
  MISSING_STORAGE_CONFIG = 'SSO_CFG_004',
  INVALID_CREDENTIALS = 'SSO_CFG_005',
  
  // Integration errors
  EXTERNAL_SERVICE_ERROR = 'SSO_INT_001',
  API_CALL_FAILED = 'SSO_INT_002',
  WEBHOOK_DELIVERY_FAILED = 'SSO_INT_003',
  TIMEOUT_ERROR = 'SSO_INT_004',
  CONNECTION_ERROR = 'SSO_INT_005',
  
  // Media access errors
  MEDIA_NOT_FOUND = 'SSO_MED_001',
  GCS_ACCESS_ERROR = 'SSO_MED_002',
  STORAGE_QUOTA_EXCEEDED = 'SSO_MED_003',
  UNSUPPORTED_MEDIA_TYPE = 'SSO_MED_004',
  MEDIA_PROCESSING_ERROR = 'SSO_MED_005',
  
  // Rate limiting errors
  RATE_LIMIT_EXCEEDED = 'SSO_RATE_001',
  QUOTA_EXCEEDED = 'SSO_RATE_002',
  CONCURRENT_LIMIT_EXCEEDED = 'SSO_RATE_003',
  
  // Business logic errors
  DUPLICATE_USER_MAPPING = 'SSO_BIZ_001',
  ORGANIZATION_LIMIT_EXCEEDED = 'SSO_BIZ_002',
  SUBSCRIPTION_EXPIRED = 'SSO_BIZ_003',
  FEATURE_NOT_AVAILABLE = 'SSO_BIZ_004',
  
  // System errors
  DATABASE_ERROR = 'SSO_SYS_001',
  CACHE_ERROR = 'SSO_SYS_002',
  ENCRYPTION_ERROR = 'SSO_SYS_003',
  INTERNAL_SERVER_ERROR = 'SSO_SYS_004',
  
  // Additional missing codes referenced in services
  PRODUCT_INACTIVE = 'SSO_CFG_006',
  DATA_ISOLATION_VIOLATION = 'SSO_AUTHZ_006',
  CSRF_TOKEN_MISSING = 'SSO_SEC_001',
  CSRF_TOKEN_INVALID = 'SSO_SEC_002',
  SUSPICIOUS_ACTIVITY = 'SSO_SEC_003',
  
  // Additional codes used in security middleware
  INVALID_EMAIL = 'SSO_VAL_007',
  INVALID_TOKEN_FORMAT = 'SSO_AUTH_007',
  TOKEN_INVALID = 'SSO_AUTH_008',
  XSS_DETECTED = 'SSO_SEC_004',
  SQL_INJECTION_DETECTED = 'SSO_SEC_005',
}

// Integration types imported from integration.types.ts
export enum IntegrationType {
  SSO_LOGIN = 'sso_login',
  MEDIA_HANDOFF = 'media_handoff',
  USER_CREATION = 'user_creation',
  CONTEXT_SHARING = 'context_sharing',
  WEBHOOK_NOTIFICATION = 'webhook_notification',
  API_PROXY = 'api_proxy',
}

export enum IntegrationStatus {
  INITIATED = 'initiated',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

// Configuration types imported from configuration.types.ts
export enum ConfigurationVersion {
  V1_0 = '1.0',
  V1_1 = '1.1',
  V2_0 = '2.0',
}

export enum StorageProvider {
  GCS = 'gcs',
  AWS_S3 = 'aws-s3',
  AZURE_BLOB = 'azure-blob',
  LOCAL = 'local',
}

export enum AuthenticationMethod {
  JWT = 'jwt',
  OAUTH2 = 'oauth2',
  API_KEY = 'api-key',
  WEBHOOK = 'webhook',
}

// Basic configuration interface
export interface BaseConfiguration<TSettings = Record<string, unknown>> {
  readonly version: ConfigurationVersion;
  readonly productKey: string;
  readonly settings: TSettings;
  readonly lastUpdated: Date;
  readonly isValid: boolean;
}

// Define basic error interfaces
export interface SsoError {
  readonly code: SsoErrorCode;
  readonly category: SsoErrorCategory;
  readonly severity: ErrorSeverity;
  readonly message: string;
  readonly details?: Record<string, unknown>;
  readonly timestamp: Date;
  readonly requestId?: string;
  readonly userId?: string;
  readonly productKey?: string;
  readonly organizationId?: string;
  readonly stack?: string;
  readonly cause?: Error | SsoError;
  readonly retryable: boolean;
  readonly userMessage?: string;
  readonly actionItems?: string[];
}

export interface ValidationError extends SsoError {
  readonly category: SsoErrorCategory.VALIDATION;
  readonly fieldErrors: Array<{
    readonly field: string;
    readonly value: unknown;
    readonly constraint: string;
    readonly message: string;
  }>;
}

export interface AuthenticationError extends SsoError {
  readonly category: SsoErrorCategory.AUTHENTICATION;
  readonly authMethod?: string;
  readonly tokenType?: string;
  readonly expiresAt?: Date;
}

export interface AuthorizationError extends SsoError {
  readonly category: SsoErrorCategory.AUTHORIZATION;
  readonly requiredPermissions: string[];
  readonly actualPermissions: string[];
  readonly resourceType: string;
  readonly resourceId?: string;
}

export interface ValidationResult<T = unknown> {
  readonly valid: boolean;
  readonly data?: T;
  readonly errors: ValidationError[];
  readonly warnings: Array<{
    readonly field: string;
    readonly message: string;
    readonly suggestion?: string;
  }>;
}

export interface ValidationContext {
  readonly userId: string;
  readonly organizationId: string;
  readonly productKey: string;
  readonly requestIp: string;
  readonly userAgent: string;
  readonly timestamp: Date;
  readonly sessionId?: string;
  readonly metadata?: Record<string, unknown>;
}

// JWT payload types
export interface BaseJwtPayload {
  readonly iss: string;
  readonly sub: string;
  readonly aud: string | string[];
  readonly exp: number;
  readonly iat: number;
  readonly nbf?: number;
  readonly jti: string;
}

export interface SsoTrustPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.TRUST_DOMAIN;
  readonly scopes: TrustDomainScope[];
  readonly productKey: string;
  readonly organizationId: string;
  readonly externalUserId: string;
  readonly sessionId: string;
  readonly permissions: Record<string, boolean>;
  readonly metadata: Record<string, unknown>;
}

export interface ProductSessionPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.PRODUCT_SESSION;
  readonly productKey: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly externalUserId: string;
  readonly sessionId: string;
  readonly dataAccessLevel: string;
  readonly lastActivity: number;
  readonly refreshToken?: string;
}

export interface TemporaryAuthPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.TEMPORARY_AUTH;
  readonly productKey: string;
  readonly challenge: string;
  readonly redirectUrl: string;
  readonly state: string;
  readonly nonce: string;
}

export interface MediaAccessPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.MEDIA_ACCESS;
  readonly productKey: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly mediaReferences: string[];
  readonly gcsPaths: string[];
  readonly accessLevel: 'read' | 'write' | 'delete';
  readonly bucketName: string;
}

export interface SsoAccessPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.SSO_ACCESS;
  readonly productKey: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly externalUserId: string;
  readonly email: string;
  readonly name?: string;
  readonly scopes: TrustDomainScope[];
  readonly sessionId: string;
  readonly refreshTokenId?: string;
}

export interface SsoRefreshPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.SSO_REFRESH;
  readonly productKey: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly sessionId: string;
  readonly accessTokenId: string;
  readonly rotationCount: number;
}

export type JwtPayload = 
  | SsoTrustPayload
  | ProductSessionPayload
  | TemporaryAuthPayload
  | MediaAccessPayload
  | SsoAccessPayload
  | SsoRefreshPayload;

export interface JwtValidationResult<T extends JwtPayload = JwtPayload> {
  readonly valid: boolean;
  readonly payload?: T;
  readonly error?: string;
  readonly decoded?: any;
  readonly expired: boolean;
  readonly notBefore: boolean;
}

export interface SsoFlowContext {
  readonly productKey: string;
  readonly userId: string;
  readonly organizationId: string;
  readonly externalUserId: string;
  readonly email: string;
  readonly name?: string;
  readonly sessionId: string;
  readonly scopes: TrustDomainScope[];
  readonly metadata: Record<string, unknown>;
  readonly clientIP: string;
  readonly userAgent: string;
  readonly redirectUrl?: string;
}

export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly tokenType: 'Bearer';
  readonly scope: string;
}

// Configuration interfaces
export interface ProductConfigurationFactory<T extends string> {
  // This would be a mapped type in real implementation
}

export interface ConfigurationRegistry<T extends Record<string, string> = Record<string, string>> {
  readonly configurations: Record<keyof T, BaseConfiguration>;
  readonly metadata: {
    readonly totalProducts: number;
    readonly activeProducts: number;
    readonly lastSync: Date;
  };
}

export interface StorageConfiguration {
  readonly provider: StorageProvider;
  readonly bucket: string;
  readonly region?: string;
  readonly basePath: string;
  readonly credentials: Record<string, unknown>;
  readonly publicAccess: boolean;
  readonly encryption: boolean;
  readonly retention?: {
    readonly days: number;
    readonly policy: 'auto-delete' | 'archive';
  };
}

export interface AuthConfiguration {
  readonly method: AuthenticationMethod;
  readonly issuer: string;
  readonly audience: string[];
  readonly tokenExpiry: number;
  readonly refreshExpiry?: number;
  readonly keyRotation?: {
    readonly enabled: boolean;
    readonly intervalDays: number;
  };
  readonly rateLimit?: {
    readonly requestsPerMinute: number;
    readonly burstLimit: number;
  };
}

export interface FeatureFlags {
  readonly autoUserCreation: boolean;
  readonly mediaUpload: boolean;
  readonly crossProductAccess: boolean;
  readonly dataIsolation: boolean;
  readonly auditLogging: boolean;
  readonly realTimeSync: boolean;
  readonly webhookNotifications: boolean;
  readonly customFields: boolean;
}

// Integration interfaces
export interface IntegrationPayload {
  readonly type: IntegrationType;
}

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

// Type guard functions
export const isSsoTrustPayload = (payload: JwtPayload): payload is SsoTrustPayload => {
  return payload.type === JwtTokenType.TRUST_DOMAIN;
};

export const isProductSessionPayload = (payload: JwtPayload): payload is ProductSessionPayload => {
  return payload.type === JwtTokenType.PRODUCT_SESSION;
};

export const isTemporaryAuthPayload = (payload: JwtPayload): payload is TemporaryAuthPayload => {
  return payload.type === JwtTokenType.TEMPORARY_AUTH;
};

export const isMediaAccessPayload = (payload: JwtPayload): payload is MediaAccessPayload => {
  return payload.type === JwtTokenType.MEDIA_ACCESS;
};

export const isSsoAccessPayload = (payload: JwtPayload): payload is SsoAccessPayload => {
  return payload.type === JwtTokenType.SSO_ACCESS;
};

export const isSsoRefreshPayload = (payload: JwtPayload): payload is SsoRefreshPayload => {
  return payload.type === JwtTokenType.SSO_REFRESH;
};

export const isSsoError = (error: unknown): error is SsoError => {
  return typeof error === 'object' && error !== null && 'code' in error && 'category' in error;
};

export const isValidationError = (error: SsoError): error is ValidationError => {
  return error.category === SsoErrorCategory.VALIDATION && 'fieldErrors' in error;
};

export const isAuthenticationError = (error: SsoError): error is AuthenticationError => {
  return error.category === SsoErrorCategory.AUTHENTICATION;
};

export const isAuthorizationError = (error: SsoError): error is AuthorizationError => {
  return error.category === SsoErrorCategory.AUTHORIZATION;
};

// Integration type guards
export const isSsoHandoffPayload = (payload: IntegrationPayload): payload is any => {
  return payload.type === IntegrationType.SSO_LOGIN;
};

export const isUserCreationHandoff = (payload: IntegrationPayload): payload is any => {
  return payload.type === IntegrationType.USER_CREATION;
};

export const isMediaHandoffPayload = (payload: IntegrationPayload): payload is any => {
  return payload.type === IntegrationType.MEDIA_HANDOFF;
};

export const isContextSharingPayload = (payload: IntegrationPayload): payload is any => {
  return payload.type === IntegrationType.CONTEXT_SHARING;
};

// Schema bundles
export const JwtSchemas = {
  JwtTokenType: z.nativeEnum(JwtTokenType),
  JwtAlgorithm: z.nativeEnum(JwtAlgorithm),
  BaseJwtPayload: z.object({
    iss: z.string().min(1),
    sub: z.string(),
    aud: z.union([z.string(), z.array(z.string())]),
    exp: z.number().int().positive(),
    iat: z.number().int().positive(),
    nbf: z.number().int().positive().optional(),
    jti: z.string(),
  }),
} as const;

export const ConfigurationSchemas = {
  ConfigurationVersion: z.nativeEnum(ConfigurationVersion),
  StorageProvider: z.nativeEnum(StorageProvider),
  AuthenticationMethod: z.nativeEnum(AuthenticationMethod),
} as const;

export const ValidationSchemas = {
  SsoErrorCategory: z.nativeEnum(SsoErrorCategory),
  ErrorSeverity: z.nativeEnum(ErrorSeverity),
  SsoErrorCode: z.nativeEnum(SsoErrorCode),
} as const;

export const IntegrationSchemas = {
  IntegrationType: z.nativeEnum(IntegrationType),
  IntegrationStatus: z.nativeEnum(IntegrationStatus),
} as const;

/**
 * Export all schemas as a convenient bundle
 */
export const SsoSchemas = {
  ProductStatus: ProductStatusSchema,
  DataAccessLevel: DataAccessLevelSchema,
  TrustDomainScope: TrustDomainScopeSchema,
  BaseEntity: BaseEntitySchema,
  SaasProduct: SaasProductSchema,
  ProductUser: ProductUserSchema,
  UserGcsMapping: UserGcsMappingSchema,
  MediaReference: MediaReferenceSchema,
} as const;