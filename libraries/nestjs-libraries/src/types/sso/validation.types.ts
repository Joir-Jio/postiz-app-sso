/**
 * Comprehensive validation and error types for multi-product SSO context
 * Provides strong error typing and business logic validation
 * 
 * @fileoverview Validation types and error handling for multi-product SSO
 * @version 1.0.0
 */

import { z } from 'zod';

/**
 * Error categories for SSO operations
 */
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

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error codes for specific failure scenarios
 */
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
  IP_BLOCKED = 'SSO_SEC_006',
  REQUEST_TOO_LARGE = 'SSO_SEC_007',
  URL_TOO_LONG = 'SSO_SEC_008',
  HEADERS_TOO_LARGE = 'SSO_SEC_009',
}

/**
 * Base SSO error interface
 */
export interface BaseSsoError {
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
}

/**
 * Extended SSO error with context
 */
export interface SsoError extends BaseSsoError {
  readonly stack?: string;
  readonly cause?: Error | SsoError;
  readonly retryable: boolean;
  readonly userMessage?: string;
  readonly actionItems?: string[];
}

/**
 * Validation error details
 */
export interface ValidationError extends SsoError {
  readonly category: SsoErrorCategory.VALIDATION;
  readonly fieldErrors: Array<{
    readonly field: string;
    readonly value: unknown;
    readonly constraint: string;
    readonly message: string;
  }>;
}

/**
 * Authentication error details
 */
export interface AuthenticationError extends SsoError {
  readonly category: SsoErrorCategory.AUTHENTICATION;
  readonly authMethod?: string;
  readonly tokenType?: string;
  readonly expiresAt?: Date;
}

/**
 * Authorization error details
 */
export interface AuthorizationError extends SsoError {
  readonly category: SsoErrorCategory.AUTHORIZATION;
  readonly requiredPermissions: string[];
  readonly actualPermissions: string[];
  readonly resourceType: string;
  readonly resourceId?: string;
}

/**
 * Validation result interface
 */
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

/**
 * Validation context for business rules
 */
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

/**
 * Field validation rule interface
 */
export interface ValidationRule<T = unknown> {
  readonly name: string;
  readonly description: string;
  readonly validate: (value: T, context?: ValidationContext) => ValidationResult<T>;
  readonly async: boolean;
  readonly dependencies?: string[];
}

/**
 * Business rule validation interface
 */
export interface BusinessRule<T = unknown> {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly priority: number;
  readonly enabled: boolean;
  readonly validate: (data: T, context: ValidationContext) => Promise<ValidationResult<T>>;
  readonly errorMessage: string;
  readonly actionItems?: string[];
}

/**
 * Multi-product context validator
 */
export interface MultiProductValidator<T = unknown> {
  validateProduct(productKey: string, context: ValidationContext): Promise<ValidationResult>;
  validateUser(userData: T, context: ValidationContext): Promise<ValidationResult<T>>;
  validatePermissions(requiredPermissions: string[], context: ValidationContext): Promise<ValidationResult>;
  validateConfiguration(config: unknown, productKey: string): ValidationResult;
  validateMediaAccess(mediaId: string, context: ValidationContext): Promise<ValidationResult>;
}

/**
 * Error recovery strategies
 */
export enum ErrorRecoveryStrategy {
  RETRY = 'retry',
  FALLBACK = 'fallback',
  SKIP = 'skip',
  FAIL_FAST = 'fail_fast',
  USER_INPUT = 'user_input',
}

/**
 * Error recovery options
 */
export interface ErrorRecoveryOptions {
  readonly strategy: ErrorRecoveryStrategy;
  readonly maxRetries?: number;
  readonly retryDelay?: number;
  readonly fallbackValue?: unknown;
  readonly userPrompt?: string;
}

/**
 * Error context for detailed debugging
 */
export interface ErrorContext {
  readonly operation: string;
  readonly component: string;
  readonly version: string;
  readonly environment: string;
  readonly buildId?: string;
  readonly correlationId: string;
  readonly parentSpanId?: string;
  readonly traceId?: string;
}

/**
 * Zod schemas for validation
 */
export const SsoErrorCategorySchema = z.nativeEnum(SsoErrorCategory);
export const ErrorSeveritySchema = z.nativeEnum(ErrorSeverity);
export const SsoErrorCodeSchema = z.nativeEnum(SsoErrorCode);

export const BaseSsoErrorSchema = z.object({
  code: SsoErrorCodeSchema,
  category: SsoErrorCategorySchema,
  severity: ErrorSeveritySchema,
  message: z.string().min(1),
  details: z.record(z.unknown()).optional(),
  timestamp: z.date(),
  requestId: z.string().optional(),
  userId: z.string().uuid().optional(),
  productKey: z.string().optional(),
  organizationId: z.string().uuid().optional(),
});

export const ValidationContextSchema = z.object({
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  productKey: z.string().min(1),
  requestIp: z.string().ip(),
  userAgent: z.string().min(1),
  timestamp: z.date(),
  sessionId: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  data: z.unknown().optional(),
  errors: z.array(z.unknown()), // Would be ValidationError array in practice
  warnings: z.array(z.object({
    field: z.string(),
    message: z.string(),
    suggestion: z.string().optional(),
  })),
});

/**
 * Type guards for error types
 */
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

/**
 * Error factory for creating typed errors
 */
export class SsoErrorFactory {
  static createValidationError(
    code: SsoErrorCode,
    message: string,
    fieldErrors: ValidationError['fieldErrors'],
    context?: Partial<ValidationContext>
  ): ValidationError {
    return {
      code,
      category: SsoErrorCategory.VALIDATION,
      severity: ErrorSeverity.MEDIUM,
      message,
      fieldErrors,
      timestamp: new Date(),
      retryable: false,
      userId: context?.userId,
      productKey: context?.productKey,
      organizationId: context?.organizationId,
    };
  }

  static createAuthenticationError(
    code: SsoErrorCode,
    message: string,
    authMethod?: string,
    tokenType?: string
  ): AuthenticationError {
    return {
      code,
      category: SsoErrorCategory.AUTHENTICATION,
      severity: ErrorSeverity.HIGH,
      message,
      authMethod,
      tokenType,
      timestamp: new Date(),
      retryable: code !== SsoErrorCode.TOKEN_EXPIRED,
    };
  }

  static createAuthorizationError(
    code: SsoErrorCode,
    message: string,
    requiredPermissions: string[],
    actualPermissions: string[],
    resourceType: string,
    resourceId?: string
  ): AuthorizationError {
    return {
      code,
      category: SsoErrorCategory.AUTHORIZATION,
      severity: ErrorSeverity.HIGH,
      message,
      requiredPermissions,
      actualPermissions,
      resourceType,
      resourceId,
      timestamp: new Date(),
      retryable: false,
      actionItems: [
        'Contact administrator to request additional permissions',
        'Verify your access level for this resource',
      ],
    };
  }

  static createBusinessLogicError(
    code: SsoErrorCode,
    message: string,
    details?: Record<string, unknown>,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): SsoError {
    return {
      code,
      category: SsoErrorCategory.BUSINESS_LOGIC,
      severity,
      message,
      details,
      timestamp: new Date(),
      retryable: false,
    };
  }

  static createSecurityError(
    code: SsoErrorCode,
    message: string,
    details?: Record<string, unknown>,
    severity: ErrorSeverity = ErrorSeverity.HIGH
  ): SsoError {
    return {
      code,
      category: SsoErrorCategory.AUTHENTICATION,
      severity,
      message,
      details,
      timestamp: new Date(),
      retryable: false,
      userMessage: 'Security validation failed. Please try again.',
    };
  }
}

/**
 * Validation decorator types
 */
export type ValidatorFunction<T = unknown> = (
  value: T,
  context?: ValidationContext
) => ValidationResult<T> | Promise<ValidationResult<T>>;

/**
 * Field validation decorator metadata
 */
export interface ValidationDecoratorMetadata {
  readonly property: string;
  readonly validators: ValidationRule[];
  readonly required: boolean;
  readonly transform?: (value: unknown) => unknown;
  readonly sanitize?: (value: unknown) => unknown;
}

/**
 * Common validation patterns
 */
export const ValidationPatterns = {
  PRODUCT_KEY: /^[a-zA-Z][a-zA-Z0-9-]{1,49}$/,
  EXTERNAL_USER_ID: /^[a-zA-Z0-9][a-zA-Z0-9_\-\.]{0,254}$/,
  SESSION_ID: /^[a-zA-Z0-9]{32,128}$/,
  JWT_TOKEN: /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  GCS_PATH: /^[a-zA-Z0-9][a-zA-Z0-9_\-\.\/]{0,999}$/,
  MEDIA_TYPE: /^[a-zA-Z][a-zA-Z0-9\/\-\+\.]{2,49}$/,
} as const;

/**
 * Validation utility functions
 */
export const ValidationUtils = {
  /**
   * Combine multiple validation results
   */
  combineResults: <T>(...results: ValidationResult<T>[]): ValidationResult<T> => {
    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = results.flatMap(r => r.warnings);
    const valid = results.every(r => r.valid);

    return {
      valid,
      data: valid ? results[0]?.data : undefined,
      errors: allErrors,
      warnings: allWarnings,
    };
  },

  /**
   * Create validation context from request
   */
  createContext: (
    userId: string,
    organizationId: string,
    productKey: string,
    request: { ip?: string; headers?: { 'user-agent'?: string } }
  ): ValidationContext => ({
    userId,
    organizationId,
    productKey,
    requestIp: request.ip || '127.0.0.1',
    userAgent: request.headers?.['user-agent'] || 'Unknown',
    timestamp: new Date(),
  }),

  /**
   * Sanitize sensitive data for error reporting
   */
  sanitizeErrorData: (error: SsoError): Omit<SsoError, 'details'> & { details?: Record<string, unknown> } => {
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'credential'];
    const sanitizedDetails: Record<string, unknown> = {};

    if (error.details) {
      Object.entries(error.details).forEach(([key, value]) => {
        if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
          sanitizedDetails[key] = '[REDACTED]';
        } else {
          sanitizedDetails[key] = value;
        }
      });
    }

    return {
      ...error,
      details: sanitizedDetails,
    };
  },

  /**
   * Check if error is recoverable
   */
  isRecoverable: (error: SsoError): boolean => {
    const recoverableCodes = [
      SsoErrorCode.TIMEOUT_ERROR,
      SsoErrorCode.CONNECTION_ERROR,
      SsoErrorCode.EXTERNAL_SERVICE_ERROR,
      SsoErrorCode.RATE_LIMIT_EXCEEDED,
    ];
    return recoverableCodes.includes(error.code);
  },
};

/**
 * Export validation schemas bundle
 */
export const ValidationSchemas = {
  SsoErrorCategory: SsoErrorCategorySchema,
  ErrorSeverity: ErrorSeveritySchema,
  SsoErrorCode: SsoErrorCodeSchema,
  BaseSsoError: BaseSsoErrorSchema,
  ValidationContext: ValidationContextSchema,
  ValidationResult: ValidationResultSchema,
} as const;