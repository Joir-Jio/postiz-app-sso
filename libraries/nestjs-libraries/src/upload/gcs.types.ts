import { z } from 'zod';

/**
 * Configuration schema for GCS Storage Provider
 * Provides runtime validation and type safety
 */
export const GCSConfigurationSchema = z.object({
  // Required configuration
  projectId: z.string().min(1, 'Project ID is required'),
  bucketName: z.string().min(1, 'Bucket name is required'),
  
  // Optional basic configuration
  region: z.string().optional(),
  publicBaseUrl: z.string().url().optional(),
  
  // Authentication configuration (one of these should be provided)
  keyFilename: z.string().optional(),
  credentials: z.object({
    client_email: z.string().email(),
    private_key: z.string(),
  }).optional(),
  
  // File reference settings
  allowFileReference: z.boolean().default(true),
  allowedPathPatterns: z.array(z.string()).optional(),
  maxFileSize: z.number().int().positive().max(5 * 1024 * 1024 * 1024).default(500 * 1024 * 1024), // Default 500MB, max 5GB
  signedUrlExpiry: z.number().int().positive().max(7 * 24 * 3600).default(3600), // Default 1 hour, max 7 days
  
  // Performance and caching settings
  enableCaching: z.boolean().default(true),
  cacheMaxAge: z.number().int().positive().max(365 * 24 * 3600).optional(), // Max 1 year
  maxRetries: z.number().int().min(0).max(10).default(3),
  requestTimeout: z.number().int().positive().max(300000).default(30000), // Max 5 minutes, default 30 seconds
}).refine(
  (config) => {
    // At least one authentication method should be provided or ADC should be available
    return config.keyFilename || config.credentials || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  },
  {
    message: 'Either keyFilename, credentials object, or GOOGLE_APPLICATION_CREDENTIALS environment variable must be provided',
    path: ['authentication'],
  }
);

export type GCSConfiguration = z.infer<typeof GCSConfigurationSchema>;

/**
 * Schema for file reference options
 */
export const FileReferenceOptionsSchema = z.object({
  filePath: z.string().min(1, 'File path is required'),
  userId: z.string().optional(),
  validatePath: z.boolean().default(true),
  generateThumbnail: z.boolean().default(false),
  skipSizeCheck: z.boolean().default(false),
});

export type FileReferenceOptions = z.infer<typeof FileReferenceOptionsSchema>;

/**
 * Schema for file metadata
 */
export const FileMetadataSchema = z.object({
  name: z.string(),
  size: z.number().int().min(0),
  contentType: z.string(),
  lastModified: z.date(),
  etag: z.string(),
  exists: z.boolean(),
  isPublic: z.boolean().optional(),
  signedUrl: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
});

export type FileMetadata = z.infer<typeof FileMetadataSchema>;

/**
 * Schema for path validation result
 */
export const PathValidationResultSchema = z.object({
  isValid: z.boolean(),
  sanitizedPath: z.string(),
  userFolder: z.string().optional(),
  isDev: z.boolean().optional(),
  errors: z.array(z.string()).optional(),
});

export type PathValidationResult = z.infer<typeof PathValidationResultSchema>;

/**
 * Common path patterns for different use cases
 */
export const COMMON_PATH_PATTERNS = {
  // User buckets with dev/prod separation and file organization
  USER_BUCKET_ORGANIZED: '^[a-zA-Z0-9_-]+-bucket/[a-zA-Z0-9_-]+(-DEV)?/\\d+/[^/]+\\.[a-zA-Z0-9]+$',
  
  // Simple user buckets with ID-based folders
  USER_BUCKET_SIMPLE: '^[a-zA-Z0-9_-]+-bucket/\\d+/[^/]+\\.[a-zA-Z0-9]+$',
  
  // Flat bucket structure
  FLAT_BUCKET: '^[a-zA-Z0-9_-]+-bucket/[^/]+\\.[a-zA-Z0-9]+$',
  
  // Deeply nested organization
  DEEP_ORGANIZATION: '^[a-zA-Z0-9_-]+-bucket/[a-zA-Z0-9_-]+/\\d{4}/\\d{2}/\\d{2}/[^/]+\\.[a-zA-Z0-9]+$',
  
  // Project-based organization
  PROJECT_BASED: '^[a-zA-Z0-9_-]+-bucket/projects/[a-zA-Z0-9_-]+/[^/]+\\.[a-zA-Z0-9]+$',
} as const;

/**
 * Environment variable configuration mapping
 */
export const GCS_ENV_CONFIG = {
  // Required
  GCS_PROJECT_ID: 'projectId',
  GCS_BUCKET_NAME: 'bucketName',
  
  // Optional basic
  GCS_REGION: 'region',
  GCS_PUBLIC_BASE_URL: 'publicBaseUrl',
  
  // Authentication
  GCS_KEY_FILENAME: 'keyFilename',
  GCS_CREDENTIALS: 'credentials', // JSON string
  
  // File reference settings
  GCS_ALLOW_FILE_REFERENCE: 'allowFileReference', // 'true'|'false'
  GCS_ALLOWED_PATH_PATTERNS: 'allowedPathPatterns', // JSON array
  GCS_MAX_FILE_SIZE: 'maxFileSize', // bytes
  GCS_SIGNED_URL_EXPIRY: 'signedUrlExpiry', // seconds
  
  // Performance
  GCS_ENABLE_CACHING: 'enableCaching', // 'true'|'false'
  GCS_CACHE_MAX_AGE: 'cacheMaxAge', // seconds
  GCS_MAX_RETRIES: 'maxRetries',
  GCS_REQUEST_TIMEOUT: 'requestTimeout', // milliseconds
} as const;

/**
 * Validation utility functions
 */
export class GCSConfigValidator {
  /**
   * Validate GCS configuration with detailed error reporting
   */
  static validateConfig(config: unknown): { success: true; data: GCSConfiguration } | { success: false; errors: string[] } {
    try {
      const result = GCSConfigurationSchema.safeParse(config);
      
      if (result.success) {
        return { success: true, data: result.data };
      }
      
      const errors = result.error.errors.map(err => {
        return `${err.path.join('.')}: ${err.message}`;
      });
      
      return { success: false, errors };
    } catch (error) {
      return { success: false, errors: [`Configuration validation error: ${error}`] };
    }
  }

  /**
   * Validate file reference options
   */
  static validateFileReferenceOptions(options: unknown): { success: true; data: FileReferenceOptions } | { success: false; errors: string[] } {
    try {
      const result = FileReferenceOptionsSchema.safeParse(options);
      
      if (result.success) {
        return { success: true, data: result.data };
      }
      
      const errors = result.error.errors.map(err => {
        return `${err.path.join('.')}: ${err.message}`;
      });
      
      return { success: false, errors };
    } catch (error) {
      return { success: false, errors: [`Options validation error: ${error}`] };
    }
  }

  /**
   * Create configuration from environment variables
   */
  static createConfigFromEnv(): GCSConfiguration {
    const rawConfig = {
      projectId: process.env.GCS_PROJECT_ID,
      bucketName: process.env.GCS_BUCKET_NAME,
      region: process.env.GCS_REGION,
      publicBaseUrl: process.env.GCS_PUBLIC_BASE_URL,
      keyFilename: process.env.GCS_KEY_FILENAME,
      credentials: process.env.GCS_CREDENTIALS ? JSON.parse(process.env.GCS_CREDENTIALS) : undefined,
      allowFileReference: process.env.GCS_ALLOW_FILE_REFERENCE === 'true',
      allowedPathPatterns: process.env.GCS_ALLOWED_PATH_PATTERNS ? JSON.parse(process.env.GCS_ALLOWED_PATH_PATTERNS) : undefined,
      maxFileSize: process.env.GCS_MAX_FILE_SIZE ? parseInt(process.env.GCS_MAX_FILE_SIZE) : undefined,
      signedUrlExpiry: process.env.GCS_SIGNED_URL_EXPIRY ? parseInt(process.env.GCS_SIGNED_URL_EXPIRY) : undefined,
      enableCaching: process.env.GCS_ENABLE_CACHING !== 'false',
      cacheMaxAge: process.env.GCS_CACHE_MAX_AGE ? parseInt(process.env.GCS_CACHE_MAX_AGE) : undefined,
      maxRetries: process.env.GCS_MAX_RETRIES ? parseInt(process.env.GCS_MAX_RETRIES) : undefined,
      requestTimeout: process.env.GCS_REQUEST_TIMEOUT ? parseInt(process.env.GCS_REQUEST_TIMEOUT) : undefined,
    };

    const validation = this.validateConfig(rawConfig);
    if (!validation.success) {
      throw new Error(`Invalid GCS configuration from environment: ${validation.errors.join(', ')}`);
    }

    return validation.data;
  }
}

/**
 * Default configurations for common scenarios
 */
export const DEFAULT_CONFIGS = {
  /**
   * Development configuration with relaxed security
   */
  DEVELOPMENT: {
    allowFileReference: true,
    allowedPathPatterns: [
      COMMON_PATH_PATTERNS.USER_BUCKET_ORGANIZED,
      COMMON_PATH_PATTERNS.USER_BUCKET_SIMPLE,
      COMMON_PATH_PATTERNS.FLAT_BUCKET,
    ],
    maxFileSize: 100 * 1024 * 1024, // 100MB
    signedUrlExpiry: 7200, // 2 hours
    enableCaching: true,
    maxRetries: 3,
    requestTimeout: 30000,
  } as Partial<GCSConfiguration>,

  /**
   * Production configuration with enhanced security
   */
  PRODUCTION: {
    allowFileReference: true,
    allowedPathPatterns: [
      COMMON_PATH_PATTERNS.USER_BUCKET_ORGANIZED,
    ],
    maxFileSize: 500 * 1024 * 1024, // 500MB
    signedUrlExpiry: 3600, // 1 hour
    enableCaching: true,
    cacheMaxAge: 86400, // 1 day
    maxRetries: 5,
    requestTimeout: 60000, // 1 minute
  } as Partial<GCSConfiguration>,

  /**
   * High-performance configuration for large files
   */
  HIGH_PERFORMANCE: {
    allowFileReference: true,
    allowedPathPatterns: [
      COMMON_PATH_PATTERNS.USER_BUCKET_ORGANIZED,
      COMMON_PATH_PATTERNS.PROJECT_BASED,
    ],
    maxFileSize: 2 * 1024 * 1024 * 1024, // 2GB
    signedUrlExpiry: 1800, // 30 minutes
    enableCaching: true,
    cacheMaxAge: 43200, // 12 hours
    maxRetries: 3,
    requestTimeout: 120000, // 2 minutes
  } as Partial<GCSConfiguration>,
} as const;