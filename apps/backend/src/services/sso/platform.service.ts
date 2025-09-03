/**
 * Platform Service - Product registration and management
 * Handles multi-product registration, configuration, and lifecycle management
 * 
 * @fileoverview Platform service for managing external product registrations
 * @version 1.0.0
 * 
 * Key Features:
 * - Product registration and validation
 * - Configuration management with versioning
 * - Health monitoring and status management
 * - Product capabilities and integration management
 * - Cross-product permission management
 * - Analytics and usage tracking
 * - Event-driven notifications
 */

import { Injectable, Logger, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
// import { EventEmitter2 } from '@nestjs/event-emitter'; // Not available
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  ProductRegistrationPayload,
  SaasProduct,
  ProductStatus as CustomProductStatus,
  ConfigurationVersion,
  BaseConfiguration,
  IntegrationType,
  TrustDomainScope,
  SsoOperationResult,
  SsoTypeFactory,
} from '@gitroom/nestjs-libraries/types/sso';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { ProductStatus as PrismaProductStatus } from '@prisma/client';
import { AuditLoggingService } from '@gitroom/nestjs-libraries/security/audit-logging.service';
import { SecureConfigurationService } from '@gitroom/nestjs-libraries/security/secure-config.service';
import { randomUUID, createHash, createHmac } from 'crypto';
import dayjs from 'dayjs';

// Type conversion helpers for Prisma enum conflicts
function convertToCustomProductStatus(prismaStatus: PrismaProductStatus): CustomProductStatus {
  return prismaStatus as unknown as CustomProductStatus;
}

function convertToPrismaProductStatus(customStatus: CustomProductStatus): PrismaProductStatus {
  return customStatus as unknown as PrismaProductStatus;
}

// Internal interfaces
interface ProductHealthStatus {
  productKey: string;
  healthy: boolean;
  lastHeartbeat: Date;
  responseTime: number;
  uptime: number;
  version: string;
  error?: string; // Add error field
  endpoints: {
    status: 'healthy' | 'degraded' | 'down';
    url: string;
    lastCheck: Date;
    responseTime: number;
  }[];
  metrics: {
    requests24h: number;
    errors24h: number;
    errorRate: number;
  };
}

interface ProductCapabilities {
  supportedIntegrations: IntegrationType[];
  mediaFormats: string[];
  authMethods: string[];
  webhookEndpoints: {
    userCreated?: string;
    userLogin?: string;
    mediaShared?: string;
    configUpdated?: string;
  };
  features: {
    autoUserCreation: boolean;
    crossProductSharing: boolean;
    advancedAnalytics: boolean;
    customBranding: boolean;
  };
}

interface ProductAnalytics {
  productKey: string;
  totalUsers: number;
  activeUsers24h: number;
  totalLogins: number;
  logins24h: number;
  mediaUploads: number;
  mediaShares: number;
  errorCount: number;
  lastUpdated: Date;
}

@Injectable()
export class PlatformService {
  private readonly logger = new Logger(PlatformService.name);
  private readonly healthStatusCache = new Map<string, ProductHealthStatus>();
  private readonly analyticsCache = new Map<string, ProductAnalytics>();
  // private readonly eventEmitter: EventEmitter2; // Not available

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogger: AuditLoggingService,
    private readonly secureConfig: SecureConfigurationService,
    // eventEmitter: EventEmitter2 // Not available
  ) {
    // // this.eventEmitter = eventEmitter; // Not available
    this.initializeHealthMonitoring();
  }

  /**
   * Register a new external product with the SSO platform
   */
  async registerProduct(
    registrationPayload: ProductRegistrationPayload,
    adminContext: { adminUserId: string; ip: string; userAgent: string }
  ): Promise<SsoOperationResult<SaasProduct>> {
    const startTime = Date.now();

    try {
      // Step 1: Validate product key uniqueness
      const existingProduct = await this.prisma.saasProduct.findUnique({
        where: { productKey: registrationPayload.productKey },
      });

      if (existingProduct) {
        throw new ConflictException(`Product key '${registrationPayload.productKey}' already exists`);
      }

      // Step 2: Validate configuration and capabilities
      await this.validateProductConfiguration(registrationPayload.configuration);
      await this.validateProductCapabilities(registrationPayload.capabilities);

      // Step 3: Generate secure API keys and secrets
      const apiKey = this.generateApiKey(registrationPayload.productKey);
      const apiSecret = this.generateApiSecret(registrationPayload.productKey);
      const webhookSecret = this.generateWebhookSecret(registrationPayload.productKey);

      // Step 4: Create product record with full configuration
      const product = await this.prisma.saasProduct.create({
        data: {
          productKey: registrationPayload.productKey,
          productName: registrationPayload.productName,
          productDescription: registrationPayload.productDescription,
          baseUrl: registrationPayload.baseUrl,
          // adminEmail: registrationPayload.adminEmail, // Field doesn't exist in schema
          status: PrismaProductStatus.PENDING_REVIEW, // Start as pending, require approval
          settings: {
            ...registrationPayload.configuration,
            apiKey,
            apiSecret: this.hashSecret(apiSecret),
            webhookSecret: this.hashSecret(webhookSecret),
            capabilities: registrationPayload.capabilities,
            webhookEndpoints: registrationPayload.webhookEndpoints || {},
            createdBy: adminContext.adminUserId,
            registrationDate: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Step 5: Initialize product analytics
      await this.initializeProductAnalytics(product.productKey);

      // Step 6: Create initial health status
      await this.initializeProductHealth(product.productKey, registrationPayload.baseUrl);

      // Step 7: Emit product registration event
      // await this.eventEmitter.emitAsync('product.registered', {
      //   productKey: product.productKey,
      //   productName: product.productName,
      //   adminEmail: registrationPayload.adminEmail,
      //   registeredBy: adminContext.adminUserId,
      // });

      // Step 8: Audit log the registration
      await this.auditLogger.logEvent('product_registered', {
        productKey: product.productKey,
        productName: product.productName,
        adminUserId: adminContext.adminUserId,
        clientIP: adminContext.ip,
        userAgent: adminContext.userAgent,
      });

      // Step 9: Send welcome notification with credentials
      await this.sendProductWelcomeNotification(product, {
        apiKey,
        apiSecret, // Only send raw secret once
        webhookSecret,
      });

      this.logger.log(`Product registered successfully: ${product.productKey}`, {
        productId: product.id,
        productName: product.productName,
        adminEmail: registrationPayload.adminEmail,
      });

      // Convert Prisma result to SaasProduct type
      const saasProduct: SaasProduct = {
        ...product,
        status: convertToCustomProductStatus(product.status),
      };

      return SsoTypeFactory.createOperationResult(
        true,
        'product_registration',
        product.productKey,
        saasProduct,
        undefined,
        {
          productId: product.id,
          duration: Date.now() - startTime,
        }
      );

    } catch (error) {
      this.logger.error(`Product registration failed: ${(error instanceof Error ? error.message : String(error))}`, {
        productKey: registrationPayload.productKey,
        error: (error instanceof Error ? error.stack : undefined),
      });

      await this.auditLogger.logEvent('product_registration_failed', {
        productKey: registrationPayload.productKey,
        error: (error instanceof Error ? error.message : String(error)),
        adminUserId: adminContext.adminUserId,
        clientIP: adminContext.ip,
      });

      const ssoError = {
        code: 'PRODUCT_REGISTRATION_FAILED' as any,
        message: (error instanceof Error ? error.message : String(error)),
        category: 'platform' as const,
        severity: 'error' as const,
        productKey: registrationPayload.productKey,
        timestamp: new Date(),
        context: { adminUserId: adminContext.adminUserId },
      };

      return SsoTypeFactory.createOperationResult(
        false,
        'product_registration',
        registrationPayload.productKey,
        undefined,
        ssoError,
        { duration: Date.now() - startTime }
      );
    }
  }

  /**
   * Update product configuration with version tracking
   */
  async updateProductConfiguration(
    productKey: string,
    newConfiguration: Partial<BaseConfiguration>,
    adminContext: { adminUserId: string; ip: string; userAgent: string }
  ): Promise<SsoOperationResult<SaasProduct>> {
    const startTime = Date.now();

    try {
      const product = await this.findActiveProduct(productKey);
      if (!product) {
        throw new NotFoundException(`Product not found: ${productKey}`);
      }

      // Step 1: Validate new configuration
      await this.validateProductConfiguration({
        ...product.settings as BaseConfiguration,
        ...newConfiguration,
      });

      // Step 2: Create configuration history entry
      await this.createConfigurationHistory(productKey, product.settings as BaseConfiguration);

      // Step 3: Update product with new configuration
      const updatedProduct = await this.prisma.saasProduct.update({
        where: { id: product.id },
        data: {
          settings: {
            ...product.settings,
            ...newConfiguration,
            lastUpdated: new Date(),
            updatedBy: adminContext.adminUserId,
            version: this.incrementConfigVersion(
              (product.settings as any)?.version || ConfigurationVersion.V1_0
            ),
          },
          updatedAt: new Date(),
        },
      });

      // Step 4: Emit configuration update event
      // await this.eventEmitter.emitAsync('product.configuration.updated', {
      //   productKey,
      //   oldConfiguration: product.settings,
      //   newConfiguration: updatedProduct.settings,
      //   updatedBy: adminContext.adminUserId,
      // });

      // Step 5: Notify product via webhook if configured
      await this.notifyProductConfigUpdate(productKey, updatedProduct.settings as any as BaseConfiguration);

      // Step 6: Audit log the update
      await this.auditLogger.logEvent('product_configuration_updated', {
        productKey,
        changes: newConfiguration,
        adminUserId: adminContext.adminUserId,
        clientIP: adminContext.ip,
      });

      this.logger.log(`Product configuration updated: ${productKey}`, {
        changes: Object.keys(newConfiguration),
        version: (updatedProduct.settings as any).version,
      });

      // Convert Prisma result to SaasProduct type
      const saasProduct: SaasProduct = {
        ...updatedProduct,
        status: convertToCustomProductStatus(updatedProduct.status),
      };

      return SsoTypeFactory.createOperationResult(
        true,
        'product_configuration_update',
        productKey,
        saasProduct,
        undefined,
        { duration: Date.now() - startTime }
      );

    } catch (error) {
      this.logger.error(`Product configuration update failed: ${(error instanceof Error ? error.message : String(error))}`, {
        productKey,
        error: (error instanceof Error ? error.stack : undefined),
      });

      const ssoError = {
        code: 'CONFIGURATION_UPDATE_FAILED' as any,
        message: (error instanceof Error ? error.message : String(error)),
        category: 'platform' as const,
        severity: 'error' as const,
        productKey,
        timestamp: new Date(),
        context: { adminUserId: adminContext.adminUserId },
      };

      return SsoTypeFactory.createOperationResult(
        false,
        'product_configuration_update',
        productKey,
        undefined,
        ssoError,
        { duration: Date.now() - startTime }
      );
    }
  }

  /**
   * Activate a registered product after approval
   */
  async activateProduct(
    productKey: string,
    adminContext: { adminUserId: string; ip: string; userAgent: string }
  ): Promise<SsoOperationResult<SaasProduct>> {
    const startTime = Date.now();

    try {
      const product = await this.findProductByKey(productKey);
      if (!product) {
        throw new NotFoundException(`Product not found: ${productKey}`);
      }

      if (product.status === PrismaProductStatus.ACTIVE) {
        throw new BadRequestException(`Product is already active: ${productKey}`);
      }

      // Step 1: Perform activation health check
      const healthCheck = await this.performProductHealthCheck(productKey);
      if (!healthCheck.healthy) {
        throw new BadRequestException(`Product failed health check: ${healthCheck.error}`);
      }

      // Step 2: Update product status
      const activatedProduct = await this.prisma.saasProduct.update({
        where: { id: product.id },
        data: {
          status: PrismaProductStatus.ACTIVE,
          settings: {
            ...product.settings,
            activatedAt: new Date(),
            activatedBy: adminContext.adminUserId,
          },
          updatedAt: new Date(),
        },
      });

      // Step 3: Initialize monitoring and analytics
      await this.startProductMonitoring(productKey);
      await this.resetProductAnalytics(productKey);

      // Step 4: Emit activation event
      // await this.eventEmitter.emitAsync('product.activated', {
      //   productKey,
      //   productName: product.productName,
      //   activatedBy: adminContext.adminUserId,
      // });

      // Step 5: Send activation notification
      await this.sendProductActivationNotification(activatedProduct);

      // Step 6: Audit log activation
      await this.auditLogger.logEvent('product_activated', {
        productKey,
        adminUserId: adminContext.adminUserId,
        clientIP: adminContext.ip,
      });

      this.logger.log(`Product activated successfully: ${productKey}`, {
        productId: product.id,
        adminUserId: adminContext.adminUserId,
      });

      // Convert Prisma result to SaasProduct type
      const saasProduct: SaasProduct = {
        ...activatedProduct,
        status: convertToCustomProductStatus(activatedProduct.status),
      };

      return SsoTypeFactory.createOperationResult(
        true,
        'product_activation',
        productKey,
        saasProduct,
        undefined,
        { duration: Date.now() - startTime }
      );

    } catch (error) {
      this.logger.error(`Product activation failed: ${(error instanceof Error ? error.message : String(error))}`, {
        productKey,
        error: (error instanceof Error ? error.stack : undefined),
      });

      const ssoError = {
        code: 'PRODUCT_ACTIVATION_FAILED' as any,
        message: (error instanceof Error ? error.message : String(error)),
        category: 'platform' as const,
        severity: 'error' as const,
        productKey,
        timestamp: new Date(),
        context: { adminUserId: adminContext.adminUserId },
      };

      return SsoTypeFactory.createOperationResult(
        false,
        'product_activation',
        productKey,
        undefined,
        ssoError,
        { duration: Date.now() - startTime }
      );
    }
  }

  /**
   * Deactivate a product (soft delete)
   */
  async deactivateProduct(
    productKey: string,
    reason: string,
    adminContext: { adminUserId: string; ip: string; userAgent: string }
  ): Promise<SsoOperationResult<boolean>> {
    const startTime = Date.now();

    try {
      const product = await this.findActiveProduct(productKey);
      if (!product) {
        throw new NotFoundException(`Active product not found: ${productKey}`);
      }

      // Step 1: Update product status
      await this.prisma.saasProduct.update({
        where: { id: product.id },
        data: {
          status: PrismaProductStatus.INACTIVE,
          settings: {
            ...product.settings,
            deactivatedAt: new Date(),
            deactivatedBy: adminContext.adminUserId,
            deactivationReason: reason,
          },
          updatedAt: new Date(),
        },
      });

      // Step 2: Stop monitoring
      await this.stopProductMonitoring(productKey);

      // Step 3: Emit deactivation event (this will trigger session invalidations)
      // await this.eventEmitter.emitAsync('product.deactivated', {
      //   productKey,
      //   productName: product.productName,
      //   reason,
      //   deactivatedBy: adminContext.adminUserId,
      // });

      // Step 4: Send deactivation notification
      await this.sendProductDeactivationNotification(product, reason);

      // Step 5: Audit log deactivation
      await this.auditLogger.logEvent('product_deactivated', {
        productKey,
        reason,
        adminUserId: adminContext.adminUserId,
        clientIP: adminContext.ip,
      });

      this.logger.log(`Product deactivated: ${productKey}`, {
        reason,
        adminUserId: adminContext.adminUserId,
      });

      return SsoTypeFactory.createOperationResult(
        true,
        'product_deactivation',
        productKey,
        true,
        undefined,
        { duration: Date.now() - startTime }
      );

    } catch (error) {
      this.logger.error(`Product deactivation failed: ${(error instanceof Error ? error.message : String(error))}`, {
        productKey,
        error: (error instanceof Error ? error.stack : undefined),
      });

      const ssoError = {
        code: 'PRODUCT_DEACTIVATION_FAILED' as any,
        message: (error instanceof Error ? error.message : String(error)),
        category: 'platform' as const,
        severity: 'error' as const,
        productKey,
        timestamp: new Date(),
        context: { adminUserId: adminContext.adminUserId },
      };

      return SsoTypeFactory.createOperationResult(
        false,
        'product_deactivation',
        productKey,
        undefined,
        ssoError,
        { duration: Date.now() - startTime }
      );
    }
  }

  /**
   * Get product health status
   */
  async getProductHealth(productKey: string): Promise<ProductHealthStatus | null> {
    return this.healthStatusCache.get(productKey) || null;
  }

  /**
   * Get product analytics
   */
  async getProductAnalytics(productKey: string): Promise<ProductAnalytics | null> {
    const cached = this.analyticsCache.get(productKey);
    if (cached && dayjs().subtract(1, 'hour').isBefore(cached.lastUpdated)) {
      return cached;
    }

    // Refresh analytics from database
    const analytics = await this.calculateProductAnalytics(productKey);
    if (analytics) {
      this.analyticsCache.set(productKey, analytics);
    }

    return analytics;
  }

  /**
   * List all products with status and health
   */
  async listProducts(
    status?: PrismaProductStatus,
    includeHealth: boolean = false,
    includeAnalytics: boolean = false
  ): Promise<Array<SaasProduct & { health?: ProductHealthStatus; analytics?: ProductAnalytics }>> {
    const where = status ? { status } : {};
    
    const products = await this.prisma.saasProduct.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      products.map(async (product) => {
        const enriched: any = { ...product };
        
        if (includeHealth) {
          enriched.health = await this.getProductHealth(product.productKey);
        }
        
        if (includeAnalytics) {
          enriched.analytics = await this.getProductAnalytics(product.productKey);
        }
        
        return enriched;
      })
    );
  }

  /**
   * Regenerate API credentials for a product
   */
  async regenerateApiCredentials(
    productKey: string,
    adminContext: { adminUserId: string; ip: string; userAgent: string }
  ): Promise<SsoOperationResult<{ apiKey: string; apiSecret: string; webhookSecret: string }>> {
    const startTime = Date.now();

    try {
      const product = await this.findActiveProduct(productKey);
      if (!product) {
        throw new NotFoundException(`Product not found: ${productKey}`);
      }

      // Generate new credentials
      const newApiKey = this.generateApiKey(productKey);
      const newApiSecret = this.generateApiSecret(productKey);
      const newWebhookSecret = this.generateWebhookSecret(productKey);

      // Update product with new credentials
      await this.prisma.saasProduct.update({
        where: { id: product.id },
        data: {
          settings: {
            ...product.settings,
            apiKey: newApiKey,
            apiSecret: this.hashSecret(newApiSecret),
            webhookSecret: this.hashSecret(newWebhookSecret),
            lastCredentialRotation: new Date(),
            credentialRotatedBy: adminContext.adminUserId,
          },
          updatedAt: new Date(),
        },
      });

      // Emit credential rotation event
      // await this.eventEmitter.emitAsync('product.credentials.rotated', {
      //   productKey,
      //   rotatedBy: adminContext.adminUserId,
      // });

      // Audit log credential rotation
      await this.auditLogger.logEvent('product_credentials_rotated', {
        productKey,
        adminUserId: adminContext.adminUserId,
        clientIP: adminContext.ip,
      });

      // Send new credentials notification
      await this.sendCredentialRotationNotification(product, {
        apiKey: newApiKey,
        apiSecret: newApiSecret,
        webhookSecret: newWebhookSecret,
      });

      const credentials = {
        apiKey: newApiKey,
        apiSecret: newApiSecret,
        webhookSecret: newWebhookSecret,
      };

      return SsoTypeFactory.createOperationResult(
        true,
        'credential_regeneration',
        productKey,
        credentials,
        undefined,
        { duration: Date.now() - startTime }
      );

    } catch (error) {
      this.logger.error(`Credential regeneration failed: ${(error instanceof Error ? error.message : String(error))}`, {
        productKey,
        error: (error instanceof Error ? error.stack : undefined),
      });

      const ssoError = {
        code: 'CREDENTIAL_REGENERATION_FAILED' as any,
        message: (error instanceof Error ? error.message : String(error)),
        category: 'platform' as const,
        severity: 'error' as const,
        productKey,
        timestamp: new Date(),
        context: { adminUserId: adminContext.adminUserId },
      };

      return SsoTypeFactory.createOperationResult(
        false,
        'credential_regeneration',
        productKey,
        undefined,
        ssoError,
        { duration: Date.now() - startTime }
      );
    }
  }

  /**
   * Health monitoring cron job (runs every 5 minutes)
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async performHealthChecks(): Promise<void> {
    this.logger.debug('Starting scheduled health checks');

    const activeProducts = await this.prisma.saasProduct.findMany({
      where: { status: PrismaProductStatus.ACTIVE },
    });

    const healthPromises = activeProducts.map(async (product) => {
      try {
        const health = await this.performProductHealthCheck(product.productKey);
        this.healthStatusCache.set(product.productKey, health);

        if (!health.healthy) {
          // await this.eventEmitter.emitAsync('product.health.degraded', {
          //   productKey: product.productKey,
          //   health,
          // });
        }
      } catch (error) {
        this.logger.error(`Health check failed for ${product.productKey}: ${(error instanceof Error ? error.message : String(error))}`);
      }
    });

    await Promise.all(healthPromises);
    this.logger.debug(`Health checks completed for ${activeProducts.length} products`);
  }

  /**
   * Analytics update cron job (runs every hour)
   */
  @Cron(CronExpression.EVERY_HOUR)
  async updateAnalytics(): Promise<void> {
    this.logger.debug('Starting analytics update');

    const activeProducts = await this.prisma.saasProduct.findMany({
      where: { status: PrismaProductStatus.ACTIVE },
    });

    const analyticsPromises = activeProducts.map(async (product) => {
      try {
        const analytics = await this.calculateProductAnalytics(product.productKey);
        if (analytics) {
          this.analyticsCache.set(product.productKey, analytics);
        }
      } catch (error) {
        this.logger.error(`Analytics update failed for ${product.productKey}: ${(error instanceof Error ? error.message : String(error))}`);
      }
    });

    await Promise.all(analyticsPromises);
    this.logger.debug(`Analytics updated for ${activeProducts.length} products`);
  }

  /**
   * Private helper methods
   */

  private async findActiveProduct(productKey: string): Promise<any> {
    return await this.prisma.saasProduct.findFirst({
      where: { 
        productKey, 
        status: PrismaProductStatus.ACTIVE,
      },
    });
  }

  private async findProductByKey(productKey: string): Promise<any> {
    return await this.prisma.saasProduct.findUnique({
      where: { productKey },
    });
  }

  private async validateProductConfiguration(config: BaseConfiguration): Promise<void> {
    // Implement configuration validation logic
    if (!config.productKey || !config.settings) {
      throw new BadRequestException('Invalid product configuration');
    }

    // Add more specific validation rules as needed
  }

  private async validateProductCapabilities(capabilities: Partial<ProductCapabilities>): Promise<void> {
    if (!capabilities.supportedIntegrations || capabilities.supportedIntegrations.length === 0) {
      throw new BadRequestException('Product must support at least one integration type');
    }

    if (!capabilities.authMethods || capabilities.authMethods.length === 0) {
      throw new BadRequestException('Product must support at least one authentication method');
    }
  }

  private generateApiKey(productKey: string): string {
    const timestamp = Date.now().toString();
    const random = randomUUID().replace(/-/g, '');
    return `pk_${productKey}_${timestamp}_${random}`.substring(0, 64);
  }

  private generateApiSecret(productKey: string): string {
    const data = `${productKey}:${Date.now()}:${randomUUID()}`;
    // TODO: Replace with proper secret management using this.secureConfig.getSecret()
    return createHmac('sha256', process.env.JWT_SECRET || 'development-secret-key')
      .update(data)
      .digest('hex');
  }

  private generateWebhookSecret(productKey: string): string {
    const data = `webhook:${productKey}:${Date.now()}:${randomUUID()}`;
    // TODO: Replace with proper secret management using this.secureConfig.getSecret()
    return createHmac('sha256', process.env.JWT_SECRET || 'development-secret-key')
      .update(data)
      .digest('hex');
  }

  private hashSecret(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }

  private incrementConfigVersion(currentVersion: ConfigurationVersion): ConfigurationVersion {
    const versions = Object.values(ConfigurationVersion);
    const currentIndex = versions.indexOf(currentVersion);
    return currentIndex < versions.length - 1 
      ? versions[currentIndex + 1] 
      : currentVersion;
  }

  private async createConfigurationHistory(
    productKey: string, 
    configuration: BaseConfiguration
  ): Promise<void> {
    // Store configuration history for rollback capabilities
    // This would typically be stored in a separate table
    this.logger.debug(`Creating configuration history for ${productKey}`);
  }

  private async performProductHealthCheck(productKey: string): Promise<ProductHealthStatus> {
    // Implement actual health check logic
    // For now, return a placeholder healthy status
    return {
      productKey,
      healthy: true,
      lastHeartbeat: new Date(),
      responseTime: 100,
      uptime: 99.9,
      version: '1.0.0',
      endpoints: [],
      metrics: {
        requests24h: 0,
        errors24h: 0,
        errorRate: 0,
      },
    };
  }

  private async calculateProductAnalytics(productKey: string): Promise<ProductAnalytics | null> {
    try {
      // Calculate analytics from database
      const product = await this.findProductByKey(productKey);
      if (!product) return null;

      // This would involve complex queries across multiple tables
      // For now, return placeholder analytics
      return {
        productKey,
        totalUsers: 0,
        activeUsers24h: 0,
        totalLogins: 0,
        logins24h: 0,
        mediaUploads: 0,
        mediaShares: 0,
        errorCount: 0,
        lastUpdated: new Date(),
      };

    } catch (error) {
      this.logger.error(`Failed to calculate analytics for ${productKey}: ${(error instanceof Error ? error.message : String(error))}`);
      return null;
    }
  }

  private async initializeProductAnalytics(productKey: string): Promise<void> {
    const analytics: ProductAnalytics = {
      productKey,
      totalUsers: 0,
      activeUsers24h: 0,
      totalLogins: 0,
      logins24h: 0,
      mediaUploads: 0,
      mediaShares: 0,
      errorCount: 0,
      lastUpdated: new Date(),
    };

    this.analyticsCache.set(productKey, analytics);
  }

  private async initializeProductHealth(productKey: string, baseUrl: string): Promise<void> {
    const health: ProductHealthStatus = {
      productKey,
      healthy: true,
      lastHeartbeat: new Date(),
      responseTime: 0,
      uptime: 100,
      version: '1.0.0',
      endpoints: [],
      metrics: {
        requests24h: 0,
        errors24h: 0,
        errorRate: 0,
      },
    };

    this.healthStatusCache.set(productKey, health);
  }

  private async resetProductAnalytics(productKey: string): Promise<void> {
    await this.initializeProductAnalytics(productKey);
  }

  private async startProductMonitoring(productKey: string): Promise<void> {
    this.logger.debug(`Starting monitoring for product: ${productKey}`);
    // Implementation would setup monitoring infrastructure
  }

  private async stopProductMonitoring(productKey: string): Promise<void> {
    this.logger.debug(`Stopping monitoring for product: ${productKey}`);
    this.healthStatusCache.delete(productKey);
    this.analyticsCache.delete(productKey);
  }

  private initializeHealthMonitoring(): void {
    // Setup initial health monitoring infrastructure
    this.logger.debug('Initializing health monitoring system');
  }

  private async notifyProductConfigUpdate(
    productKey: string, 
    configuration: BaseConfiguration
  ): Promise<void> {
    // Send webhook notification to product about config update
    this.logger.debug(`Notifying product ${productKey} of configuration update`);
  }

  private async sendProductWelcomeNotification(
    product: any, 
    credentials: { apiKey: string; apiSecret: string; webhookSecret: string }
  ): Promise<void> {
    // Send welcome email with credentials
    this.logger.debug(`Sending welcome notification to ${product.adminEmail}`);
  }

  private async sendProductActivationNotification(product: any): Promise<void> {
    // Send activation notification
    this.logger.debug(`Sending activation notification to ${product.adminEmail}`);
  }

  private async sendProductDeactivationNotification(
    product: any, 
    reason: string
  ): Promise<void> {
    // Send deactivation notification
    this.logger.debug(`Sending deactivation notification to ${product.adminEmail}: ${reason}`);
  }

  private async sendCredentialRotationNotification(
    product: any,
    credentials: { apiKey: string; apiSecret: string; webhookSecret: string }
  ): Promise<void> {
    // Send new credentials notification
    this.logger.debug(`Sending credential rotation notification to ${product.adminEmail}`);
  }
}