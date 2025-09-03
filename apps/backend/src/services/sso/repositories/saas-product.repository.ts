/**
 * SaaS Product Repository for SSO multi-product integration
 * Handles database operations for product management
 * 
 * @fileoverview Repository service for SaaS product CRUD operations
 * @version 1.0.0
 */

import { Injectable, HttpException, Logger } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { SaasProduct, ProductStatus } from '@gitroom/nestjs-libraries/types/sso/core.types';
import * as crypto from 'crypto';

export interface CreateSaasProductData {
  productKey: string;
  productName: string;
  productDescription?: string;
  baseUrl: string;
  apiKey?: string;
  webhookSecret?: string;
  ssoEnabled?: boolean;
  ssoRedirectUrl?: string;
  allowedDomains?: string[];
  gcsBucketName?: string;
  gcsBasePath?: string;
  gcsCredentials?: any;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  autoCreateUsers?: boolean;
  allowMediaUpload?: boolean;
  dataIsolationEnabled?: boolean;
}

export interface UpdateSaasProductData {
  productName?: string;
  productDescription?: string;
  baseUrl?: string;
  apiKey?: string;
  webhookSecret?: string;
  ssoEnabled?: boolean;
  ssoRedirectUrl?: string;
  allowedDomains?: string[];
  gcsBucketName?: string;
  gcsBasePath?: string;
  gcsCredentials?: any;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  autoCreateUsers?: boolean;
  allowMediaUpload?: boolean;
  dataIsolationEnabled?: boolean;
  status?: ProductStatus;
}

export interface ProductQueryOptions {
  includeInactive?: boolean;
  productKeys?: string[];
  status?: ProductStatus[];
  ssoEnabled?: boolean;
  mediaEnabled?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'productName' | 'productKey';
  orderDirection?: 'asc' | 'desc';
}

@Injectable()
export class SaasProductRepository {
  private readonly logger = new Logger(SaasProductRepository.name);

  constructor(
    private readonly prisma: PrismaService
  ) {}

  /**
   * Create a new SaaS product
   */
  async create(data: CreateSaasProductData): Promise<SaasProduct> {
    try {
      // Validate product key uniqueness
      const existing = await this.findByProductKey(data.productKey);
      if (existing) {
        throw new HttpException(`Product with key '${data.productKey}' already exists`, 409);
      }

      // Encrypt sensitive data
      const apiKeyHash = data.apiKey ? this.hashApiKey(data.apiKey) : undefined;
      const webhookSecret = data.webhookSecret ? this.encryptWebhookSecret(data.webhookSecret) : undefined;
      const gcsCredentialsHash = data.gcsCredentials ? this.encryptGcsCredentials(data.gcsCredentials) : undefined;

      const product = await (this.prisma as any).saasProduct.create({
        data: {
          productKey: data.productKey,
          productName: data.productName,
          productDescription: data.productDescription,
          baseUrl: data.baseUrl,
          apiKeyHash,
          webhookSecret,
          ssoEnabled: data.ssoEnabled ?? false,
          ssoRedirectUrl: data.ssoRedirectUrl,
          allowedDomains: data.allowedDomains ?? [],
          gcsBucketName: data.gcsBucketName,
          gcsBasePath: data.gcsBasePath,
          gcsCredentialsHash,
          settings: data.settings ?? {},
          metadata: data.metadata ?? {},
          autoCreateUsers: data.autoCreateUsers ?? true,
          allowMediaUpload: data.allowMediaUpload ?? false,
          dataIsolationEnabled: data.dataIsolationEnabled ?? true,
          status: ProductStatus.ACTIVE,
        },
      });

      this.logger.log(`Created SaaS product: ${product.productKey} (${product.id})`);
      return product;
    } catch (error) {
      this.logger.error(`Failed to create SaaS product: ${error}`);
      throw error;
    }
  }

  /**
   * Find product by ID
   */
  async findById(id: string): Promise<SaasProduct | null> {
    try {
      return await (this.prisma as any).saasProduct.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to find product by ID ${id}: ${error}`);
      return null;
    }
  }

  /**
   * Find product by product key
   */
  async findByProductKey(productKey: string): Promise<SaasProduct | null> {
    try {
      return await (this.prisma as any).saasProduct.findUnique({
        where: { productKey },
      });
    } catch (error) {
      this.logger.error(`Failed to find product by key ${productKey}: ${error}`);
      return null;
    }
  }

  /**
   * Find products with query options
   */
  async findMany(options: ProductQueryOptions = {}): Promise<{
    products: SaasProduct[];
    total: number;
  }> {
    try {
      const {
        includeInactive = false,
        productKeys,
        status,
        ssoEnabled,
        mediaEnabled,
        limit = 50,
        offset = 0,
        orderBy = 'createdAt',
        orderDirection = 'desc',
      } = options;

      // Build where clause
      const where: any = {};

      if (!includeInactive) {
        where.deletedAt = null;
        where.status = { not: ProductStatus.SUSPENDED };
      }

      if (productKeys?.length) {
        where.productKey = { in: productKeys };
      }

      if (status?.length) {
        where.status = { in: status };
      }

      if (ssoEnabled !== undefined) {
        where.ssoEnabled = ssoEnabled;
      }

      if (mediaEnabled !== undefined) {
        where.allowMediaUpload = mediaEnabled;
      }

      // Execute queries in parallel
      const [products, total] = await Promise.all([
        (this.prisma as any).saasProduct.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { [orderBy]: orderDirection },
        }),
        (this.prisma as any).saasProduct.count({ where }),
      ]);

      return { products, total };
    } catch (error) {
      this.logger.error(`Failed to find products: ${error}`);
      throw new HttpException('Failed to retrieve products', 500);
    }
  }

  /**
   * Update product by ID
   */
  async update(id: string, data: UpdateSaasProductData): Promise<SaasProduct> {
    try {
      const product = await this.findById(id);
      if (!product) {
        throw new HttpException('Product not found', 404);
      }

      // Prepare update data with encryption
      const updateData: any = { ...data };

      if (data.apiKey !== undefined) {
        updateData.apiKeyHash = data.apiKey ? this.hashApiKey(data.apiKey) : null;
        delete updateData.apiKey;
      }

      if (data.webhookSecret !== undefined) {
        updateData.webhookSecret = data.webhookSecret ? this.encryptWebhookSecret(data.webhookSecret) : null;
      }

      if (data.gcsCredentials !== undefined) {
        updateData.gcsCredentialsHash = data.gcsCredentials ? this.encryptGcsCredentials(data.gcsCredentials) : null;
        delete updateData.gcsCredentials;
      }

      const updatedProduct = await (this.prisma as any).saasProduct.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Updated SaaS product: ${updatedProduct.productKey} (${id})`);
      return updatedProduct;
    } catch (error) {
      this.logger.error(`Failed to update product ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Soft delete product
   */
  async delete(id: string): Promise<boolean> {
    try {
      const product = await this.findById(id);
      if (!product) {
        throw new HttpException('Product not found', 404);
      }

      await (this.prisma as any).saasProduct.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          status: ProductStatus.SUSPENDED,
        },
      });

      this.logger.log(`Deleted SaaS product: ${product.productKey} (${id})`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Check if product has media capabilities
   */
  async hasMediaCapabilities(productKey: string): Promise<boolean> {
    try {
      const product = await this.findByProductKey(productKey);
      return product?.allowMediaUpload && 
             product?.gcsBucketName !== null && 
             product?.gcsCredentialsHash !== null;
    } catch (error) {
      this.logger.error(`Failed to check media capabilities for ${productKey}: ${error}`);
      return false;
    }
  }

  /**
   * Get products with SSO enabled
   */
  async findSsoEnabledProducts(): Promise<SaasProduct[]> {
    try {
      const { products } = await this.findMany({
        ssoEnabled: true,
        includeInactive: false,
        limit: 100,
      });
      return products;
    } catch (error) {
      this.logger.error(`Failed to get SSO enabled products: ${error}`);
      return [];
    }
  }

  /**
   * Get products with media capabilities
   */
  async findMediaEnabledProducts(): Promise<SaasProduct[]> {
    try {
      const { products } = await this.findMany({
        mediaEnabled: true,
        includeInactive: false,
        limit: 100,
      });
      return products.filter(p => p.gcsBucketName && p.gcsCredentialsHash);
    } catch (error) {
      this.logger.error(`Failed to get media enabled products: ${error}`);
      return [];
    }
  }

  /**
   * Validate API key for product
   */
  async validateApiKey(productKey: string, apiKey: string): Promise<boolean> {
    try {
      const product = await this.findByProductKey(productKey);
      if (!product || !product.apiKeyHash) {
        return false;
      }

      const hashedInput = this.hashApiKey(apiKey);
      return hashedInput === product.apiKeyHash;
    } catch (error) {
      this.logger.error(`Failed to validate API key for ${productKey}: ${error}`);
      return false;
    }
  }

  /**
   * Update product activity timestamp
   */
  async updateLastActivity(productKey: string): Promise<void> {
    try {
      await (this.prisma as any).saasProduct.update({
        where: { productKey },
        data: {
          metadata: {
            lastActivity: new Date().toISOString(),
          },
        },
      });
    } catch (error) {
      this.logger.warn(`Failed to update last activity for ${productKey}: ${error}`);
    }
  }

  /**
   * Get product statistics
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    ssoEnabled: number;
    mediaEnabled: number;
    suspended: number;
  }> {
    try {
      const [total, active, ssoEnabled, mediaEnabled, suspended] = await Promise.all([
        (this.prisma as any).saasProduct.count(),
        (this.prisma as any).saasProduct.count({
          where: { status: ProductStatus.ACTIVE, deletedAt: null }
        }),
        (this.prisma as any).saasProduct.count({
          where: { ssoEnabled: true, deletedAt: null }
        }),
        (this.prisma as any).saasProduct.count({
          where: { allowMediaUpload: true, deletedAt: null }
        }),
        (this.prisma as any).saasProduct.count({
          where: { status: ProductStatus.SUSPENDED }
        }),
      ]);

      return { total, active, ssoEnabled, mediaEnabled, suspended };
    } catch (error) {
      this.logger.error(`Failed to get product statistics: ${error}`);
      return { total: 0, active: 0, ssoEnabled: 0, mediaEnabled: 0, suspended: 0 };
    }
  }

  // ===============================
  // Private Helper Methods
  // ===============================

  /**
   * Hash API key for secure storage
   */
  private hashApiKey(apiKey: string): string {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Encrypt webhook secret
   */
  private encryptWebhookSecret(secret: string): string {
    try {
      const encryptionKey = process.env.WEBHOOK_ENCRYPTION_KEY || 'default-key';
      const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
      let encrypted = cipher.update(secret, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      this.logger.error(`Failed to encrypt webhook secret: ${error}`);
      return secret; // Fallback to plain text in case of error
    }
  }

  /**
   * Decrypt webhook secret
   */
  decryptWebhookSecret(encryptedSecret: string): string {
    try {
      const encryptionKey = process.env.WEBHOOK_ENCRYPTION_KEY || 'default-key';
      const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
      let decrypted = decipher.update(encryptedSecret, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      this.logger.error(`Failed to decrypt webhook secret: ${error}`);
      return encryptedSecret; // Return as-is if decryption fails
    }
  }

  /**
   * Encrypt GCS credentials
   */
  private encryptGcsCredentials(credentials: any): string {
    try {
      const encryptionKey = process.env.GCS_ENCRYPTION_KEY || 'default-key';
      const cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
      let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      this.logger.error(`Failed to encrypt GCS credentials: ${error}`);
      return JSON.stringify(credentials);
    }
  }

  /**
   * Decrypt GCS credentials
   */
  decryptGcsCredentials(encryptedCredentials: string): any {
    try {
      const encryptionKey = process.env.GCS_ENCRYPTION_KEY || 'default-key';
      const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
      let decrypted = decipher.update(encryptedCredentials, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return JSON.parse(decrypted);
    } catch (error) {
      this.logger.error(`Failed to decrypt GCS credentials: ${error}`);
      return {};
    }
  }
}