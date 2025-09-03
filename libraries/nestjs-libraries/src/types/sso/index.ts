/**
 * Multi-product SSO TypeScript types and utilities
 * Main export file for all SSO-related types, interfaces, and utilities
 * 
 * @fileoverview Comprehensive type system for multi-product SSO integration
 * @version 1.0.0
 */

// Core types and entities
export * from './core.types';
// @ts-ignore - Ignore duplicate export conflicts
export * from './jwt.types';
// @ts-ignore - Ignore duplicate export conflicts
export * from './configuration.types';
// @ts-ignore - Ignore duplicate export conflicts
export * from './validation.types';
// @ts-ignore - Ignore duplicate export conflicts
export * from './integration.types';

// Re-export commonly used types for convenience
export type {
  // Core entities
  SaasProduct,
  ProductUser,
  UserGcsMapping,
  MediaReference,
  BaseEntity,
  
  // Configuration
  BaseConfiguration,
  
  // JWT and authentication
  SsoFlowContext,
  TokenPair,
  
  // Validation and errors
  SsoError,
  ValidationError,
  ValidationResult,
  ValidationContext,
  
  // Utility types
  DeepReadonly,
  PartialBy,
  RequiredBy,
} from './core.types';

// Additional exports from JWT types
export type {
  JwtPayload,
  JwtValidationResult,
} from './jwt.types';

// Additional exports from integration types
export type {
  CrossProductUserContext,
} from './integration.types';

// Re-export enums for easy access
export {
  // Core enums
  ProductStatus,
  DataAccessLevel,
  TrustDomainScope,
  
  // Configuration enums
  ConfigurationVersion,
  StorageProvider,
  AuthenticationMethod,
  
  // JWT enums
  JwtTokenType,
  JwtAlgorithm,
  
  // Validation enums
  SsoErrorCategory,
  ErrorSeverity,
  SsoErrorCode,
  
  // Integration enums
  IntegrationType,
  IntegrationStatus,
} from './core.types';

// Schema bundles for validation
export {
  SsoSchemas,
  JwtSchemas,
  ConfigurationSchemas,
  ValidationSchemas,
  IntegrationSchemas,
} from './core.types';

// Utility functions
export {
  // Type guards
  isSaasProduct,
  isProductUser,
  isUserGcsMapping,
  isMediaReference,
  
  // JWT utilities
  isSsoTrustPayload,
  isProductSessionPayload,
  isTemporaryAuthPayload,
  isMediaAccessPayload,
  isSsoAccessPayload,
  isSsoRefreshPayload,
  
  // Validation utilities
  isSsoError,
  isValidationError,
  isAuthenticationError,
  isAuthorizationError,
  
  // Integration utilities
  isSsoHandoffPayload,
  isUserCreationHandoff,
  isMediaHandoffPayload,
  isContextSharingPayload,
} from './core.types';

// Configuration utilities
export {
  ConfigurationUtils,
  ConfigurationBuilder,
  isVideoGenerationConfig,
  isShopifyAppConfig,
} from './configuration.types';

// Validation utilities and patterns
export {
  ValidationPatterns,
  ValidationUtils,
  SsoErrorFactory,
} from './validation.types';

// Integration utilities
export {
  IntegrationUtils,
} from './integration.types';

/**
 * Commonly used type combinations for convenience
 */

/**
 * Complete SSO user context including all related data
 */
export interface CompleteUserContext {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
  organization: {
    id: string;
    name: string;
  };
  product: {
    key: string;
    name: string;
    config: any;
  };
  productUser: any;
  permissions: string[];
  session: {
    id: string;
    expiresAt: Date;
    lastActivity: Date;
  };
}

/**
 * SSO operation result with comprehensive status
 */
export interface SsoOperationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: any;
  metadata: {
    operationType: string;
    productKey: string;
    userId?: string;
    organizationId?: string;
    duration: number;
    timestamp: Date;
  };
}

/**
 * Product registration payload for new product setup
 */
export interface ProductRegistrationPayload {
  productKey: string;
  productName: string;
  productDescription?: string;
  baseUrl: string;
  adminEmail: string;
  configuration: any;
  capabilities: {
    supportedIntegrations: import('./integration.types').IntegrationType[];
    mediaFormats: string[];
    authMethods: string[];
  };
  webhookEndpoints?: {
    userCreated?: string;
    userLogin?: string;
    mediaShared?: string;
  };
}

/**
 * Cross-product data sharing request
 */
export interface CrossProductDataRequest {
  sourceProduct: string;
  targetProduct: string;
  userId: string;
  dataTypes: string[];
  permissionLevel: 'read' | 'write' | 'admin';
  expiresIn?: number;
  webhook?: {
    url: string;
    events: string[];
  };
}

/**
 * Media processing pipeline configuration
 */
export interface MediaProcessingPipeline {
  steps: Array<{
    name: string;
    type: 'thumbnail' | 'optimization' | 'metadata' | 'custom';
    config: Record<string, unknown>;
    conditions?: Record<string, unknown>;
  }>;
  webhook?: {
    url: string;
    events: ('started' | 'progress' | 'completed' | 'failed')[];
  };
  timeout: number;
  retryPolicy: {
    maxAttempts: number;
    backoffMultiplier: number;
  };
}

/**
 * SSO analytics and monitoring data
 */
export interface SsoAnalytics {
  loginEvents: {
    total: number;
    successful: number;
    failed: number;
    byProduct: Record<string, { successful: number; failed: number }>;
    byTimeRange: Array<{ date: string; count: number }>;
  };
  tokenUsage: {
    issued: number;
    refreshed: number;
    revoked: number;
    expired: number;
  };
  mediaOperations: {
    uploads: number;
    downloads: number;
    shares: number;
    deletions: number;
    storageUsed: number;
  };
  errors: Array<{
    code: string;
    count: number;
    lastOccurrence: Date;
    affectedProducts: string[];
  }>;
  performance: {
    averageResponseTime: number;
    p95ResponseTime: number;
    uptime: number;
    errorRate: number;
  };
}

/**
 * Comprehensive type for SSO system status
 */
export interface SsoSystemStatus {
  healthy: boolean;
  version: string;
  uptime: number;
  products: Array<{
    key: string;
    name: string;
    status: string;
    lastHeartbeat: Date;
    version: string;
  }>;
  services: {
    database: { healthy: boolean; responseTime: number };
    storage: { healthy: boolean; quota: { used: number; limit: number } };
    jwt: { healthy: boolean; keyRotation: Date };
  };
  metrics: SsoAnalytics;
  alerts: Array<{
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: Date;
    resolved: boolean;
  }>;
}

/**
 * Type helpers for conditional operations
 */
export type IfSsoEnabled<T extends { ssoEnabled: boolean }, TrueType, FalseType> = 
  T['ssoEnabled'] extends true ? TrueType : FalseType;

export type IfMediaEnabled<T extends { allowMediaUpload: boolean }, TrueType, FalseType> = 
  T['allowMediaUpload'] extends true ? TrueType : FalseType;

/**
 * Advanced utility types for type-safe operations
 */
export type SsoApiEndpoint<TProduct extends string, TOperation extends string> = 
  `/api/sso/${TProduct}/${TOperation}`;

export type ProductApiEndpoint<TProduct extends string, TResource extends string> = 
  `/api/products/${TProduct}/${TResource}`;

export type WebhookEndpoint<TProduct extends string, TEvent extends string> = 
  `/webhooks/${TProduct}/${TEvent}`;

/**
 * Factory functions for common operations
 */
export const SsoTypeFactory = {
  /**
   * Create a complete user context
   */
  createUserContext: (
    user: any,
    organization: any,
    productUser: any,
    product: any,
    sessionId: string
  ): CompleteUserContext => ({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.picture?.path,
    },
    organization: {
      id: organization.id,
      name: organization.name,
    },
    product: {
      key: product.productKey,
      name: product.productName,
      config: {
        version: '1.0',
        productKey: product.productKey,
        settings: product.settings,
        lastUpdated: product.updatedAt,
        isValid: product.status === 'ACTIVE',
      },
    },
    productUser,
    permissions: [], // Should be derived from productUser.permissions
    session: {
      id: sessionId,
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      lastActivity: new Date(),
    },
  }),

  /**
   * Create an SSO operation result
   */
  createOperationResult: <T>(
    success: boolean,
    operationType: string,
    productKey: string,
    data?: T,
    error?: any,
    metadata?: Record<string, unknown>
  ): SsoOperationResult<T> => ({
    success,
    data,
    error,
    metadata: {
      operationType,
      productKey,
      duration: 0, // Should be calculated
      timestamp: new Date(),
      ...metadata,
    },
  }),
};