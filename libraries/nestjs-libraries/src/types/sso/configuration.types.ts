/**
 * Generic type system for multi-product configuration handling
 * Provides flexible, extensible types for product-specific settings
 * 
 * @fileoverview Advanced TypeScript configuration types for multi-product SSO
 * @version 1.0.0
 */

import { z } from 'zod';
import { SaasProduct, ProductStatus } from './core.types';

/**
 * Configuration schema version for backward compatibility
 */
export enum ConfigurationVersion {
  V1_0 = '1.0',
  V1_1 = '1.1',
  V2_0 = '2.0',
}

/**
 * Storage provider types for media handling
 */
export enum StorageProvider {
  GCS = 'gcs',
  AWS_S3 = 'aws-s3',
  AZURE_BLOB = 'azure-blob',
  LOCAL = 'local',
}

/**
 * Authentication method types
 */
export enum AuthenticationMethod {
  JWT = 'jwt',
  OAUTH2 = 'oauth2',
  API_KEY = 'api-key',
  WEBHOOK = 'webhook',
}

/**
 * Generic configuration base interface
 */
export interface BaseConfiguration<TSettings = Record<string, unknown>> {
  readonly version: ConfigurationVersion;
  readonly productKey: string;
  readonly settings: TSettings;
  readonly lastUpdated: Date;
  readonly isValid: boolean;
}

/**
 * Storage configuration interface
 */
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

/**
 * Authentication configuration interface  
 */
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

/**
 * Feature flags configuration
 */
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

/**
 * Integration configuration interface
 */
export interface IntegrationConfiguration {
  readonly enabled: boolean;
  readonly endpoints: {
    readonly baseUrl: string;
    readonly authUrl: string;
    readonly webhookUrl?: string;
    readonly healthUrl?: string;
  };
  readonly credentials: {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly apiKey?: string;
  };
  readonly timeouts: {
    readonly connect: number;
    readonly request: number;
    readonly retry: number;
  };
  readonly retryPolicy: {
    readonly maxAttempts: number;
    readonly backoffMultiplier: number;
    readonly maxDelay: number;
  };
}

/**
 * Specific product configuration types
 */

/**
 * Video generation product configuration
 */
export interface VideoGenerationConfig extends BaseConfiguration {
  readonly settings: {
    readonly maxVideoLength: number;
    readonly supportedFormats: string[];
    readonly qualitySettings: {
      readonly resolution: string[];
      readonly frameRate: number[];
      readonly bitrate: Record<string, number>;
    };
    readonly processing: {
      readonly timeout: number;
      readonly concurrency: number;
      readonly priority: 'low' | 'normal' | 'high';
    };
    readonly storage: StorageConfiguration;
    readonly webhooks?: {
      readonly onComplete: string;
      readonly onError: string;
      readonly onProgress?: string;
    };
  };
}

/**
 * Shopify app configuration
 */
export interface ShopifyAppConfig extends BaseConfiguration {
  readonly settings: {
    readonly scopes: string[];
    readonly webhookTopics: string[];
    readonly appBridge: {
      readonly version: string;
      readonly features: string[];
    };
    readonly billing: {
      readonly chargeType: 'recurring' | 'usage' | 'onetime';
      readonly amount: number;
      readonly trialDays?: number;
    };
    readonly installation: {
      readonly autoInstall: boolean;
      readonly requiredPermissions: string[];
      readonly optionalPermissions: string[];
    };
  };
}

/**
 * Analytics product configuration
 */
export interface AnalyticsConfig extends BaseConfiguration {
  readonly settings: {
    readonly dataRetention: {
      readonly rawDataDays: number;
      readonly aggregatedDataDays: number;
    };
    readonly sampling: {
      readonly rate: number;
      readonly strategy: 'uniform' | 'stratified' | 'reservoir';
    };
    readonly metrics: {
      readonly enabled: string[];
      readonly customDimensions: Record<string, string>;
    };
    readonly export: {
      readonly formats: string[];
      readonly maxRows: number;
      readonly scheduled: boolean;
    };
  };
}

/**
 * Generic product configuration factory
 */
export type ProductConfigurationFactory<T extends string> = 
  T extends 'video-generation' ? VideoGenerationConfig :
  T extends 'shopify-app' ? ShopifyAppConfig :
  T extends 'analytics' ? AnalyticsConfig :
  BaseConfiguration;

/**
 * Dynamic configuration registry
 */
export interface ConfigurationRegistry<T extends Record<string, string> = Record<string, string>> {
  readonly configurations: {
    readonly [K in keyof T]: ProductConfigurationFactory<T[K]>;
  };
  readonly metadata: {
    readonly totalProducts: number;
    readonly activeProducts: number;
    readonly lastSync: Date;
  };
}

/**
 * Configuration validation result
 */
export interface ConfigurationValidationResult<T = unknown> {
  readonly valid: boolean;
  readonly configuration?: T;
  readonly errors: Array<{
    readonly field: string;
    readonly message: string;
    readonly code: string;
  }>;
  readonly warnings: Array<{
    readonly field: string;
    readonly message: string;
    readonly suggestion?: string;
  }>;
}

/**
 * Configuration manager interface
 */
export interface ConfigurationManager<T extends BaseConfiguration> {
  get(productKey: string): Promise<T | null>;
  set(productKey: string, configuration: T): Promise<boolean>;
  validate(configuration: Partial<T>): ConfigurationValidationResult<T>;
  merge(existing: T, updates: Partial<T>): T;
  migrate(from: ConfigurationVersion, to: ConfigurationVersion, config: T): T;
}

/**
 * Environment-specific configurations
 */
export interface EnvironmentConfiguration {
  readonly environment: 'development' | 'staging' | 'production';
  readonly debug: boolean;
  readonly logLevel: 'error' | 'warn' | 'info' | 'debug';
  readonly monitoring: {
    readonly enabled: boolean;
    readonly metricsEndpoint?: string;
    readonly alerting?: {
      readonly email: string[];
      readonly webhook?: string;
    };
  };
  readonly security: {
    readonly cors: {
      readonly origins: string[];
      readonly credentials: boolean;
    };
    readonly headers: Record<string, string>;
    readonly rateLimiting: {
      readonly global: number;
      readonly perProduct: number;
    };
  };
}

/**
 * Zod schemas for runtime validation
 */
export const ConfigurationVersionSchema = z.nativeEnum(ConfigurationVersion);
export const StorageProviderSchema = z.nativeEnum(StorageProvider);
export const AuthenticationMethodSchema = z.nativeEnum(AuthenticationMethod);

export const BaseConfigurationSchema = z.object({
  version: ConfigurationVersionSchema,
  productKey: z.string().min(1).max(50),
  settings: z.record(z.unknown()),
  lastUpdated: z.date(),
  isValid: z.boolean(),
});

export const StorageConfigurationSchema = z.object({
  provider: StorageProviderSchema,
  bucket: z.string().min(1),
  region: z.string().optional(),
  basePath: z.string().min(1),
  credentials: z.record(z.unknown()),
  publicAccess: z.boolean(),
  encryption: z.boolean(),
  retention: z.object({
    days: z.number().int().min(1),
    policy: z.enum(['auto-delete', 'archive']),
  }).optional(),
});

export const AuthConfigurationSchema = z.object({
  method: AuthenticationMethodSchema,
  issuer: z.string().url(),
  audience: z.array(z.string()),
  tokenExpiry: z.number().int().min(300), // minimum 5 minutes
  refreshExpiry: z.number().int().min(3600).optional(), // minimum 1 hour
  keyRotation: z.object({
    enabled: z.boolean(),
    intervalDays: z.number().int().min(1),
  }).optional(),
  rateLimit: z.object({
    requestsPerMinute: z.number().int().min(1),
    burstLimit: z.number().int().min(1),
  }).optional(),
});

export const FeatureFlagsSchema = z.object({
  autoUserCreation: z.boolean(),
  mediaUpload: z.boolean(),
  crossProductAccess: z.boolean(),
  dataIsolation: z.boolean(),
  auditLogging: z.boolean(),
  realTimeSync: z.boolean(),
  webhookNotifications: z.boolean(),
  customFields: z.boolean(),
});

export const IntegrationConfigurationSchema = z.object({
  enabled: z.boolean(),
  endpoints: z.object({
    baseUrl: z.string().url(),
    authUrl: z.string().url(),
    webhookUrl: z.string().url().optional(),
    healthUrl: z.string().url().optional(),
  }),
  credentials: z.object({
    clientId: z.string().min(1),
    clientSecret: z.string().min(1),
    apiKey: z.string().optional(),
  }),
  timeouts: z.object({
    connect: z.number().int().min(1000),
    request: z.number().int().min(1000),
    retry: z.number().int().min(1000),
  }),
  retryPolicy: z.object({
    maxAttempts: z.number().int().min(1).max(10),
    backoffMultiplier: z.number().min(1),
    maxDelay: z.number().int().min(1000),
  }),
});

export const VideoGenerationConfigSchema = BaseConfigurationSchema.extend({
  settings: z.object({
    maxVideoLength: z.number().int().min(1),
    supportedFormats: z.array(z.string()),
    qualitySettings: z.object({
      resolution: z.array(z.string()),
      frameRate: z.array(z.number().int().positive()),
      bitrate: z.record(z.number().int().positive()),
    }),
    processing: z.object({
      timeout: z.number().int().min(1000),
      concurrency: z.number().int().min(1),
      priority: z.enum(['low', 'normal', 'high']),
    }),
    storage: StorageConfigurationSchema,
    webhooks: z.object({
      onComplete: z.string().url(),
      onError: z.string().url(),
      onProgress: z.string().url().optional(),
    }).optional(),
  }),
});

export const ShopifyAppConfigSchema = BaseConfigurationSchema.extend({
  settings: z.object({
    scopes: z.array(z.string()),
    webhookTopics: z.array(z.string()),
    appBridge: z.object({
      version: z.string(),
      features: z.array(z.string()),
    }),
    billing: z.object({
      chargeType: z.enum(['recurring', 'usage', 'onetime']),
      amount: z.number().min(0),
      trialDays: z.number().int().min(0).optional(),
    }),
    installation: z.object({
      autoInstall: z.boolean(),
      requiredPermissions: z.array(z.string()),
      optionalPermissions: z.array(z.string()),
    }),
  }),
});

/**
 * Utility types for configuration operations
 */
export type ConfigurationKeys<T extends BaseConfiguration> = keyof T['settings'];
export type ConfigurationValueType<T extends BaseConfiguration, K extends ConfigurationKeys<T>> = T['settings'][K];

/**
 * Deep partial for configuration updates
 */
export type DeepPartialConfiguration<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartialConfiguration<T[P]> : T[P];
};

/**
 * Configuration change tracking
 */
export interface ConfigurationChange<T extends BaseConfiguration> {
  readonly field: ConfigurationKeys<T>;
  readonly previousValue: unknown;
  readonly newValue: unknown;
  readonly timestamp: Date;
  readonly userId: string;
  readonly reason?: string;
}

/**
 * Configuration history tracking
 */
export interface ConfigurationHistory<T extends BaseConfiguration> {
  readonly productKey: string;
  readonly version: ConfigurationVersion;
  readonly changes: ConfigurationChange<T>[];
  readonly createdAt: Date;
  readonly createdBy: string;
}

/**
 * Type guards for configuration types
 */
export const isVideoGenerationConfig = (config: BaseConfiguration): config is VideoGenerationConfig => {
  return VideoGenerationConfigSchema.safeParse(config).success;
};

export const isShopifyAppConfig = (config: BaseConfiguration): config is ShopifyAppConfig => {
  return ShopifyAppConfigSchema.safeParse(config).success;
};

/**
 * Configuration builder pattern
 */
export class ConfigurationBuilder<T extends BaseConfiguration> {
  private config: Partial<{ -readonly [K in keyof T]: T[K] }> = {};

  constructor(private readonly productKey: string) {
    this.config.productKey = productKey;
    this.config.version = ConfigurationVersion.V1_0;
  }

  withVersion(version: ConfigurationVersion): this {
    this.config.version = version;
    return this;
  }

  withSettings(settings: T['settings']): this {
    this.config.settings = settings;
    return this;
  }

  withStorageConfiguration(storage: StorageConfiguration): this {
    if (!this.config.settings) {
      this.config.settings = {} as T['settings'];
    }
    (this.config.settings as any).storage = storage;
    return this;
  }

  withFeatureFlags(flags: FeatureFlags): this {
    if (!this.config.settings) {
      this.config.settings = {} as T['settings'];
    }
    (this.config.settings as any).featureFlags = flags;
    return this;
  }

  build(): T {
    this.config.lastUpdated = new Date();
    this.config.isValid = true;
    return this.config as T;
  }
}

/**
 * Configuration utility functions
 */
export const ConfigurationUtils = {
  /**
   * Merge configurations with type safety
   */
  mergeConfigurations: <T extends BaseConfiguration>(
    base: T,
    override: DeepPartialConfiguration<T>
  ): T => {
    return {
      ...base,
      ...override,
      settings: {
        ...base.settings,
        ...(override.settings || {}),
      },
      lastUpdated: new Date(),
    } as T;
  },

  /**
   * Validate configuration completeness
   */
  validateRequiredFields: <T extends BaseConfiguration>(
    config: Partial<T>,
    requiredFields: (keyof T)[]
  ): string[] => {
    const missing: string[] = [];
    requiredFields.forEach(field => {
      if (config[field] === undefined) {
        missing.push(field as string);
      }
    });
    return missing;
  },

  /**
   * Create default configuration for product type
   */
  createDefault: (productKey: string): BaseConfiguration => {
    return new ConfigurationBuilder(productKey)
      .withSettings({})
      .build();
  },
};

/**
 * Export configuration schemas bundle
 */
export const ConfigurationSchemas = {
  ConfigurationVersion: ConfigurationVersionSchema,
  StorageProvider: StorageProviderSchema,
  AuthenticationMethod: AuthenticationMethodSchema,
  BaseConfiguration: BaseConfigurationSchema,
  StorageConfiguration: StorageConfigurationSchema,
  AuthConfiguration: AuthConfigurationSchema,
  FeatureFlags: FeatureFlagsSchema,
  IntegrationConfiguration: IntegrationConfigurationSchema,
  VideoGenerationConfig: VideoGenerationConfigSchema,
  ShopifyAppConfig: ShopifyAppConfigSchema,
} as const;