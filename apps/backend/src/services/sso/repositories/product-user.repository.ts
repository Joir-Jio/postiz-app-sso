/**
 * Product User Repository for SSO multi-product integration
 * Handles database operations for product user mappings
 * 
 * @fileoverview Repository service for ProductUser CRUD operations
 * @version 1.0.0
 */

import { Injectable, HttpException, Logger } from '@nestjs/common';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { ProductUser, DataAccessLevel } from '@gitroom/nestjs-libraries/types/sso/core.types';
import * as crypto from 'crypto';

export interface CreateProductUserData {
  productId: string;
  userId: string;
  organizationId: string;
  externalUserId: string;
  externalUserEmail: string;
  externalUserName?: string;
  externalUserMetadata?: Record<string, unknown>;
  ssoSessionId?: string;
  preferences?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  isActive?: boolean;
  dataAccessLevel?: DataAccessLevel;
}

export interface UpdateProductUserData {
  externalUserEmail?: string;
  externalUserName?: string;
  externalUserMetadata?: Record<string, unknown>;
  ssoSessionId?: string;
  ssoTokenHash?: string;
  preferences?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  isActive?: boolean;
  dataAccessLevel?: DataAccessLevel;
  lastActivity?: Date;
}

export interface ProductUserQueryOptions {
  includeInactive?: boolean;
  productIds?: string[];
  organizationIds?: string[];
  userIds?: string[];
  externalUserIds?: string[];
  dataAccessLevels?: DataAccessLevel[];
  isActive?: boolean;
  hasRecentActivity?: boolean;
  recentActivityHours?: number;
  limit?: number;
  offset?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'lastActivity' | 'externalUserName';
  orderDirection?: 'asc' | 'desc';
  includeRelations?: boolean;
}

export interface UserSessionInfo {
  productUser: ProductUser;
  sessionValid: boolean;
  lastActivity: Date;
  permissions: Record<string, boolean>;
  dataAccessLevel: DataAccessLevel;
}

@Injectable()
export class ProductUserRepository {
  private readonly logger = new Logger(ProductUserRepository.name);

  constructor(
    private readonly prisma: PrismaService
  ) {}

  /**
   * Create a new product user mapping
   */
  async create(data: CreateProductUserData): Promise<ProductUser> {
    try {
      // Check for existing mapping
      const existing = await this.findByExternalUserId(data.productId, data.externalUserId);
      if (existing) {
        throw new HttpException(
          `Product user mapping already exists for external user ${data.externalUserId}`,
          409
        );
      }

      const productUser = await (this.prisma as any).productUser.create({
        data: {
          productId: data.productId,
          userId: data.userId,
          organizationId: data.organizationId,
          externalUserId: data.externalUserId,
          externalUserEmail: data.externalUserEmail,
          externalUserName: data.externalUserName,
          externalUserMetadata: data.externalUserMetadata ?? {},
          ssoSessionId: data.ssoSessionId,
          ssoSessionHash: data.ssoSessionId ? this.hashSessionId(data.ssoSessionId) : null,
          preferences: data.preferences ?? {},
          permissions: data.permissions ?? {},
          isActive: data.isActive ?? true,
          dataAccessLevel: data.dataAccessLevel ?? DataAccessLevel.FULL,
          lastActivity: new Date(),
        },
      });

      this.logger.log(`Created product user mapping: ${productUser.id} (${data.externalUserId})`);
      return productUser;
    } catch (error) {
      this.logger.error(`Failed to create product user: ${error}`);
      throw error;
    }
  }

  /**
   * Find product user by ID
   */
  async findById(id: string, includeRelations = false): Promise<ProductUser | null> {
    try {
      const include = includeRelations ? {
        product: true,
        user: true,
        organization: true,
      } : undefined;

      return await (this.prisma as any).productUser.findUnique({
        where: { id },
        include,
      });
    } catch (error) {
      this.logger.error(`Failed to find product user by ID ${id}: ${error}`);
      return null;
    }
  }

  /**
   * Find product user by external user ID
   */
  async findByExternalUserId(
    productId: string, 
    externalUserId: string,
    includeRelations = false
  ): Promise<ProductUser | null> {
    try {
      const include = includeRelations ? {
        product: true,
        user: true,
        organization: true,
      } : undefined;

      return await (this.prisma as any).productUser.findUnique({
        where: {
          productId_externalUserId: {
            productId,
            externalUserId,
          },
        },
        include,
      });
    } catch (error) {
      this.logger.error(`Failed to find product user by external ID ${externalUserId}: ${error}`);
      return null;
    }
  }

  /**
   * Find product users for organization
   */
  async findByOrganization(
    organizationId: string,
    options: ProductUserQueryOptions = {}
  ): Promise<{ productUsers: ProductUser[]; total: number }> {
    try {
      const {
        includeInactive = false,
        productIds,
        isActive,
        limit = 50,
        offset = 0,
        orderBy = 'createdAt',
        orderDirection = 'desc',
        includeRelations = false,
      } = options;

      // Build where clause
      const where: any = { organizationId };

      if (!includeInactive) {
        where.deletedAt = null;
      }

      if (productIds?.length) {
        where.productId = { in: productIds };
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      const include = includeRelations ? {
        product: true,
        user: true,
        organization: true,
      } : undefined;

      // Execute queries in parallel
      const [productUsers, total] = await Promise.all([
        (this.prisma as any).productUser.findMany({
          where,
          include,
          skip: offset,
          take: limit,
          orderBy: { [orderBy]: orderDirection },
        }),
        (this.prisma as any).productUser.count({ where }),
      ]);

      return { productUsers, total };
    } catch (error) {
      this.logger.error(`Failed to find product users for organization ${organizationId}: ${error}`);
      throw new HttpException('Failed to retrieve product users', 500);
    }
  }

  /**
   * Find product users with advanced filtering
   */
  async findMany(options: ProductUserQueryOptions = {}): Promise<{
    productUsers: ProductUser[];
    total: number;
  }> {
    try {
      const {
        includeInactive = false,
        productIds,
        organizationIds,
        userIds,
        externalUserIds,
        dataAccessLevels,
        isActive,
        hasRecentActivity = false,
        recentActivityHours = 24,
        limit = 50,
        offset = 0,
        orderBy = 'createdAt',
        orderDirection = 'desc',
        includeRelations = false,
      } = options;

      // Build where clause
      const where: any = {};

      if (!includeInactive) {
        where.deletedAt = null;
      }

      if (productIds?.length) {
        where.productId = { in: productIds };
      }

      if (organizationIds?.length) {
        where.organizationId = { in: organizationIds };
      }

      if (userIds?.length) {
        where.userId = { in: userIds };
      }

      if (externalUserIds?.length) {
        where.externalUserId = { in: externalUserIds };
      }

      if (dataAccessLevels?.length) {
        where.dataAccessLevel = { in: dataAccessLevels };
      }

      if (isActive !== undefined) {
        where.isActive = isActive;
      }

      if (hasRecentActivity) {
        const cutoffTime = new Date(Date.now() - recentActivityHours * 60 * 60 * 1000);
        where.lastActivity = { gte: cutoffTime };
      }

      const include = includeRelations ? {
        product: true,
        user: true,
        organization: true,
      } : undefined;

      // Execute queries in parallel
      const [productUsers, total] = await Promise.all([
        (this.prisma as any).productUser.findMany({
          where,
          include,
          skip: offset,
          take: limit,
          orderBy: { [orderBy]: orderDirection },
        }),
        (this.prisma as any).productUser.count({ where }),
      ]);

      return { productUsers, total };
    } catch (error) {
      this.logger.error(`Failed to find product users: ${error}`);
      throw new HttpException('Failed to retrieve product users', 500);
    }
  }

  /**
   * Update product user
   */
  async update(id: string, data: UpdateProductUserData): Promise<ProductUser> {
    try {
      const productUser = await this.findById(id);
      if (!productUser) {
        throw new HttpException('Product user not found', 404);
      }

      // Prepare update data
      const updateData: any = { ...data };

      // Hash session ID if provided
      if (data.ssoSessionId !== undefined) {
        updateData.ssoSessionHash = data.ssoSessionId ? this.hashSessionId(data.ssoSessionId) : null;
      }

      // Update last activity if not explicitly provided
      if (!data.lastActivity) {
        updateData.lastActivity = new Date();
      }

      const updatedProductUser = await (this.prisma as any).productUser.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Updated product user: ${updatedProductUser.id}`);
      return updatedProductUser;
    } catch (error) {
      this.logger.error(`Failed to update product user ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Update last activity timestamp
   */
  async updateLastActivity(id: string): Promise<void> {
    try {
      await (this.prisma as any).productUser.update({
        where: { id },
        data: { lastActivity: new Date() },
      });
    } catch (error) {
      this.logger.warn(`Failed to update last activity for product user ${id}: ${error}`);
    }
  }

  /**
   * Update SSO session information
   */
  async updateSsoSession(
    id: string, 
    ssoSessionId: string,
    tokenHash?: string
  ): Promise<ProductUser> {
    try {
      const updateData: any = {
        ssoSessionId,
        ssoSessionHash: this.hashSessionId(ssoSessionId),
        lastSsoLogin: new Date(),
        lastActivity: new Date(),
      };

      if (tokenHash) {
        updateData.ssoTokenHash = tokenHash;
      }

      const updatedProductUser = await (this.prisma as any).productUser.update({
        where: { id },
        data: updateData,
      });

      this.logger.log(`Updated SSO session for product user: ${id}`);
      return updatedProductUser;
    } catch (error) {
      this.logger.error(`Failed to update SSO session for product user ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Deactivate product user
   */
  async deactivate(id: string): Promise<ProductUser> {
    try {
      const updatedProductUser = await (this.prisma as any).productUser.update({
        where: { id },
        data: {
          isActive: false,
          ssoSessionId: null,
          ssoSessionHash: null,
          ssoTokenHash: null,
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Deactivated product user: ${id}`);
      return updatedProductUser;
    } catch (error) {
      this.logger.error(`Failed to deactivate product user ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Soft delete product user
   */
  async delete(id: string): Promise<boolean> {
    try {
      const productUser = await this.findById(id);
      if (!productUser) {
        throw new HttpException('Product user not found', 404);
      }

      await (this.prisma as any).productUser.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          isActive: false,
          ssoSessionId: null,
          ssoSessionHash: null,
          ssoTokenHash: null,
        },
      });

      this.logger.log(`Deleted product user: ${id}`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete product user ${id}: ${error}`);
      throw error;
    }
  }

  /**
   * Validate SSO session
   */
  async validateSsoSession(
    productId: string,
    externalUserId: string,
    sessionId: string
  ): Promise<UserSessionInfo | null> {
    try {
      const productUser = await this.findByExternalUserId(productId, externalUserId, true);
      
      if (!productUser || !productUser.isActive || productUser.deletedAt) {
        return null;
      }

      const sessionValid = productUser.ssoSessionHash === this.hashSessionId(sessionId);

      return {
        productUser,
        sessionValid,
        lastActivity: productUser.lastActivity,
        permissions: productUser.permissions as Record<string, boolean>,
        dataAccessLevel: productUser.dataAccessLevel,
      };
    } catch (error) {
      this.logger.error(`Failed to validate SSO session: ${error}`);
      return null;
    }
  }

  /**
   * Get user permissions for specific actions
   */
  async getUserPermissions(id: string): Promise<Record<string, boolean>> {
    try {
      const productUser = await this.findById(id);
      if (!productUser) {
        return {};
      }

      const permissions = productUser.permissions as Record<string, boolean>;
      
      // Add default permissions based on data access level
      const defaultPermissions: Record<string, boolean> = {
        'user:read': true,
        'media:read': productUser.dataAccessLevel !== DataAccessLevel.READ_ONLY,
        'media:write': productUser.dataAccessLevel === DataAccessLevel.FULL,
        'media:delete': productUser.dataAccessLevel === DataAccessLevel.FULL,
        'org:read': productUser.dataAccessLevel !== DataAccessLevel.READ_ONLY,
      };

      return { ...defaultPermissions, ...permissions };
    } catch (error) {
      this.logger.error(`Failed to get user permissions for ${id}: ${error}`);
      return {};
    }
  }

  /**
   * Get inactive users for cleanup
   */
  async findInactiveUsers(inactiveDays = 90): Promise<ProductUser[]> {
    try {
      const cutoffDate = new Date(Date.now() - inactiveDays * 24 * 60 * 60 * 1000);

      return await (this.prisma as any).productUser.findMany({
        where: {
          deletedAt: null,
          OR: [
            { lastActivity: { lt: cutoffDate } },
            { lastActivity: null, createdAt: { lt: cutoffDate } },
          ],
        },
        include: {
          product: {
            select: { productKey: true, productName: true },
          },
        },
        orderBy: { lastActivity: 'asc' },
      });
    } catch (error) {
      this.logger.error(`Failed to find inactive users: ${error}`);
      return [];
    }
  }

  /**
   * Get product user statistics
   */
  async getStatistics(productId?: string): Promise<{
    total: number;
    active: number;
    inactive: number;
    recentActivity: number;
    byDataAccessLevel: Record<DataAccessLevel, number>;
  }> {
    try {
      const where = productId ? { productId } : {};
      const recentCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days

      const [
        total,
        active,
        inactive,
        recentActivity,
        fullAccess,
        limitedAccess,
        readOnly,
      ] = await Promise.all([
        (this.prisma as any).productUser.count({ where: { ...where, deletedAt: null } }),
        (this.prisma as any).productUser.count({ where: { ...where, isActive: true, deletedAt: null } }),
        (this.prisma as any).productUser.count({ where: { ...where, isActive: false, deletedAt: null } }),
        (this.prisma as any).productUser.count({
          where: { ...where, lastActivity: { gte: recentCutoff }, deletedAt: null }
        }),
        (this.prisma as any).productUser.count({
          where: { ...where, dataAccessLevel: DataAccessLevel.FULL, deletedAt: null }
        }),
        (this.prisma as any).productUser.count({
          where: { ...where, dataAccessLevel: DataAccessLevel.LIMITED, deletedAt: null }
        }),
        (this.prisma as any).productUser.count({
          where: { ...where, dataAccessLevel: DataAccessLevel.READ_ONLY, deletedAt: null }
        }),
      ]);

      return {
        total,
        active,
        inactive,
        recentActivity,
        byDataAccessLevel: {
          [DataAccessLevel.FULL]: fullAccess,
          [DataAccessLevel.LIMITED]: limitedAccess,
          [DataAccessLevel.READ_ONLY]: readOnly,
          [DataAccessLevel.MEDIA_ONLY]: 0, // TODO: Add proper query for media-only users
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get product user statistics: ${error}`);
      return {
        total: 0,
        active: 0,
        inactive: 0,
        recentActivity: 0,
        byDataAccessLevel: {
          [DataAccessLevel.FULL]: 0,
          [DataAccessLevel.LIMITED]: 0,
          [DataAccessLevel.READ_ONLY]: 0,
          [DataAccessLevel.MEDIA_ONLY]: 0,
        },
      };
    }
  }

  // ===============================
  // Private Helper Methods
  // ===============================

  /**
   * Hash session ID for secure storage
   */
  private hashSessionId(sessionId: string): string {
    return crypto.createHash('sha256').update(sessionId).digest('hex');
  }
}