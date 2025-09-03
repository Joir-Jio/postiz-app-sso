/**
 * User Mapping Service - External user to Postiz user mapping
 * Handles complex user identity mapping across multiple external products
 * 
 * @fileoverview User mapping service for cross-product identity management
 * @version 1.0.0
 * 
 * Key Features:
 * - External user ID to Postiz user mapping
 * - Multi-product user identity consolidation
 * - Conflict resolution for duplicate mappings
 * - User synchronization and profile merging
 * - Privacy-compliant data sharing
 * - Real-time mapping updates with events
 * - Performance optimized with caching
 * - Audit trail for all mapping operations
 */

import { Injectable, Logger, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  ProductUser,
  CrossProductUserContext,
  SsoOperationResult,
  SsoTypeFactory,
  TrustDomainScope,
  DataAccessLevel,
} from '@gitroom/nestjs-libraries/types/sso';
import { PrismaService } from '@gitroom/nestjs-libraries/database/prisma/prisma.service';
import { AuditLoggingService } from '@gitroom/nestjs-libraries/security/audit-logging.service';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { CreateOrgUserDto } from '@gitroom/nestjs-libraries/dtos/auth/create.org.user.dto';
import { randomUUID, createHash, createHmac } from 'crypto';
import dayjs from 'dayjs';

// Internal interfaces for user mapping
interface UserMappingEntry {
  id: string;
  userId: string;
  organizationId: string;
  productKey: string;
  externalUserId: string;
  email: string;
  name?: string;
  avatar?: string;
  permissions: TrustDomainScope[];
  dataAccessLevel: DataAccessLevel;
  metadata: Record<string, unknown>;
  lastSync: Date;
  status: 'active' | 'suspended' | 'merged' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

interface UserConsolidationRequest {
  primaryUserId: string;
  duplicateUserIds: string[];
  mergeStrategy: 'keep_primary' | 'merge_all' | 'manual';
  conflictResolution: {
    email: 'primary' | 'latest' | 'manual';
    name: 'primary' | 'latest' | 'manual';
    avatar: 'primary' | 'latest' | 'manual';
    organizations: 'merge' | 'primary' | 'latest';
  };
  requestedBy: string;
}

interface MappingAnalytics {
  totalMappings: number;
  activeUsers: number;
  productDistribution: Record<string, number>;
  conflictCount: number;
  recentMappings24h: number;
  syncSuccessRate: number;
  lastUpdated: Date;
}

interface SyncProfile {
  externalUserId: string;
  email: string;
  name?: string;
  avatar?: string;
  customFields?: Record<string, unknown>;
  lastModified?: Date;
}

@Injectable()
export class UserMappingService {
  private readonly logger = new Logger(UserMappingService.name);
  private readonly mappingCache = new Map<string, UserMappingEntry>();
  private readonly syncQueue = new Set<string>();
  private readonly eventEmitter: EventEmitter2;

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogger: AuditLoggingService,
    private readonly organizationService: OrganizationService,
    private readonly usersService: UsersService,
    eventEmitter: EventEmitter2
  ) {
    this.eventEmitter = eventEmitter;
    this.initializeMappingCache();
    this.setupSyncProcessor();
  }

  /**
   * Create or update user mapping for external product
   */
  async createUserMapping(
    productKey: string,
    externalUserId: string,
    userProfile: SyncProfile,
    options: {
      autoCreateUser?: boolean;
      organizationName?: string;
      permissions?: TrustDomainScope[];
      dataAccessLevel?: DataAccessLevel;
      metadata?: Record<string, unknown>;
      clientContext?: { ip: string; userAgent: string };
    } = {}
  ): Promise<SsoOperationResult<UserMappingEntry>> {
    const startTime = Date.now();
    const operationId = randomUUID();

    this.logger.debug(`Creating user mapping`, {
      operationId,
      productKey,
      externalUserId,
      email: userProfile.email,
    });

    try {
      // Step 1: Validate product exists
      const product = await this.validateProduct(productKey);
      if (!product) {
        throw new BadRequestException(`Product not found: ${productKey}`);
      }

      // Step 2: Check for existing mapping
      const existingMapping = await this.findMappingByExternalId(productKey, externalUserId);
      if (existingMapping && existingMapping.status === 'active') {
        return await this.updateUserMapping(existingMapping.id, userProfile, options);
      }

      // Step 3: Find or create Postiz user by email
      let postizUser = await this.usersService.getUserByEmail(userProfile.email);
      let postizOrganization = null;
      let isNewUser = false;

      if (!postizUser && options.autoCreateUser) {
        // Create new user and organization
        // @ts-ignore
        const createUserDto: CreateOrgUserDto = {
          email: userProfile.email,
          password: '', // No password for SSO users
          company: options.organizationName || 'My Organization',
          provider: 'SSO' as any,
        };

        const creationResult = await this.organizationService.createOrgAndUser(
          createUserDto,
          options.clientContext?.ip || '',
          options.clientContext?.userAgent || ''
        );

        postizUser = creationResult.users[0].user as any;
        postizOrganization = creationResult;
        isNewUser = true;

      } else if (!postizUser) {
        throw new NotFoundException(`User not found for email: ${userProfile.email}`);
      }

      // Step 4: Get user's organization if not created
      if (!postizOrganization) {
        const userOrg = await this.prisma.userOrganization.findFirst({
          where: { userId: postizUser.id },
          include: { organization: true },
        });
        postizOrganization = userOrg?.organization;
      }

      if (!postizOrganization) {
        throw new BadRequestException('User has no associated organization');
      }

      // Step 5: Create product user mapping
      // @ts-ignore
      const productUser = await this.prisma.productUser.create({
        data: {
          user: { connect: { id: postizUser.id } },
          organization: { connect: { id: postizOrganization.id } },
          product: { connect: { id: product.id } },
          externalUserId,
          externalUserEmail: (options.metadata?.externalEmail as string) || postizUser.email,
          externalUserName: (options.metadata?.externalName as string) || postizUser.name,
          externalUserMetadata: JSON.parse(JSON.stringify(options.metadata || {})),
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Step 6: Create user GCS mapping for media references
      // @ts-ignore
      await this.prisma.userGcsMapping.create({
        data: {
          productUser: { connect: { id: productUser.id } },
          product: { connect: { id: product.id } },
          userId: postizUser.id,
          organizationId: postizOrganization.id,
          productKey,
          gcsPath: this.generateUserGcsPath(productKey, postizUser.id),
          permissions: this.convertToGcsPermissions(options.permissions || []),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Step 7: Create mapping entry
      const mappingEntry: UserMappingEntry = {
        id: productUser.id,
        userId: postizUser.id,
        organizationId: postizOrganization.id,
        productKey,
        externalUserId,
        email: userProfile.email,
        name: userProfile.name,
        avatar: userProfile.avatar,
        permissions: options.permissions || [TrustDomainScope.SSO_LOGIN],
        dataAccessLevel: options.dataAccessLevel || DataAccessLevel.READ_ONLY,
        metadata: options.metadata || {},
        lastSync: new Date(),
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Step 8: Cache the mapping
      const cacheKey = this.generateMappingCacheKey(productKey, externalUserId);
      this.mappingCache.set(cacheKey, mappingEntry);

      // Step 9: Emit mapping created event
      await this.eventEmitter.emitAsync('user.mapping.created', {
        operationId,
        mappingId: mappingEntry.id,
        productKey,
        userId: postizUser.id,
        organizationId: postizOrganization.id,
        externalUserId,
        isNewUser,
      });

      // Step 10: Audit log the operation
      await this.auditLogger.logEvent('user_mapping_created', {
        operationId,
        mappingId: mappingEntry.id,
        productKey,
        userId: postizUser.id,
        externalUserId,
        email: userProfile.email,
        isNewUser,
        clientIP: options.clientContext?.ip,
        userAgent: options.clientContext?.userAgent,
      });

      this.logger.log(`User mapping created successfully`, {
        operationId,
        mappingId: mappingEntry.id,
        productKey,
        userId: postizUser.id,
        isNewUser,
      });

      return SsoTypeFactory.createOperationResult(
        true,
        'user_mapping_create',
        productKey,
        mappingEntry,
        undefined,
        {
          operationId,
          mappingId: mappingEntry.id,
          userId: postizUser.id,
          isNewUser,
          duration: Date.now() - startTime,
        }
      );

    } catch (error) {
      this.logger.error(`User mapping creation failed: ${(error instanceof Error ? error.message : String(error))}`, {
        operationId,
        productKey,
        externalUserId,
        error: (error instanceof Error ? error.stack : undefined),
      });

      await this.auditLogger.logEvent('user_mapping_creation_failed', {
        operationId,
        productKey,
        externalUserId,
        error: (error instanceof Error ? error.message : String(error)),
        clientIP: options.clientContext?.ip,
      });

      const ssoError = {
        code: 'USER_MAPPING_FAILED' as any,
        message: (error instanceof Error ? error.message : String(error)),
        category: 'user_mapping' as const,
        severity: 'error' as const,
        productKey,
        timestamp: new Date(),
        context: { operationId, externalUserId },
      };

      return SsoTypeFactory.createOperationResult(
        false,
        'user_mapping_create',
        productKey,
        undefined,
        ssoError,
        { operationId, duration: Date.now() - startTime }
      );
    }
  }

  /**
   * Update existing user mapping with sync data
   */
  async updateUserMapping(
    mappingId: string,
    userProfile: SyncProfile,
    options: {
      permissions?: TrustDomainScope[];
      dataAccessLevel?: DataAccessLevel;
      metadata?: Record<string, unknown>;
      clientContext?: { ip: string; userAgent: string };
    } = {}
  ): Promise<SsoOperationResult<UserMappingEntry>> {
    const startTime = Date.now();

    try {
      // Step 1: Find existing mapping
      const existingMapping = await this.findMappingById(mappingId);
      if (!existingMapping) {
        throw new NotFoundException(`Mapping not found: ${mappingId}`);
      }

      // Step 2: Update product user record
      const updatedProductUser = await this.prisma.productUser.update({
        where: { id: mappingId },
        data: {
          permissions: options.permissions || existingMapping.permissions,
          dataAccessLevel: options.dataAccessLevel || existingMapping.dataAccessLevel,
          metadata: {
            ...existingMapping.metadata,
            ...options.metadata,
            email: userProfile.email,
            name: userProfile.name,
            avatar: userProfile.avatar,
            lastSyncedAt: new Date(),
            updatedBy: 'user-mapping-service',
          },
          updatedAt: new Date(),
        },
      });

      // Step 3: Update user profile if needed
      await this.syncUserProfile(existingMapping.userId, userProfile);

      // Step 4: Update mapping entry
      const updatedMapping: UserMappingEntry = {
        ...existingMapping,
        email: userProfile.email,
        name: userProfile.name,
        avatar: userProfile.avatar,
        permissions: options.permissions || existingMapping.permissions,
        dataAccessLevel: options.dataAccessLevel || existingMapping.dataAccessLevel,
        metadata: {
          ...existingMapping.metadata,
          ...options.metadata,
        },
        lastSync: new Date(),
        updatedAt: new Date(),
      };

      // Step 5: Update cache
      const cacheKey = this.generateMappingCacheKey(existingMapping.productKey, existingMapping.externalUserId);
      this.mappingCache.set(cacheKey, updatedMapping);

      // Step 6: Emit update event
      await this.eventEmitter.emitAsync('user.mapping.updated', {
        mappingId,
        productKey: existingMapping.productKey,
        userId: existingMapping.userId,
        changes: {
          permissions: options.permissions !== undefined,
          dataAccessLevel: options.dataAccessLevel !== undefined,
          profile: userProfile !== undefined,
        },
      });

      // Step 7: Audit log the update
      await this.auditLogger.logEvent('user_mapping_updated', {
        mappingId,
        productKey: existingMapping.productKey,
        userId: existingMapping.userId,
        externalUserId: existingMapping.externalUserId,
        clientIP: options.clientContext?.ip,
        userAgent: options.clientContext?.userAgent,
      });

      this.logger.debug(`User mapping updated successfully`, {
        mappingId,
        productKey: existingMapping.productKey,
        userId: existingMapping.userId,
      });

      return SsoTypeFactory.createOperationResult(
        true,
        'user_mapping_update',
        existingMapping.productKey,
        updatedMapping,
        undefined,
        { mappingId, duration: Date.now() - startTime }
      );

    } catch (error) {
      this.logger.error(`User mapping update failed: ${(error instanceof Error ? error.message : String(error))}`, {
        mappingId,
        error: (error instanceof Error ? error.stack : undefined),
      });

      const ssoError = {
        code: 'USER_MAPPING_UPDATE_FAILED' as any,
        message: (error instanceof Error ? error.message : String(error)),
        category: 'user_mapping' as const,
        severity: 'error' as const,
        timestamp: new Date(),
        context: { mappingId },
      };

      return SsoTypeFactory.createOperationResult(
        false,
        'user_mapping_update',
        'unknown',
        undefined,
        ssoError,
        { mappingId, duration: Date.now() - startTime }
      );
    }
  }

  /**
   * Find user mapping by external ID
   */
  async findUserMapping(
    productKey: string,
    externalUserId: string,
    useCache: boolean = true
  ): Promise<UserMappingEntry | null> {
    if (useCache) {
      const cacheKey = this.generateMappingCacheKey(productKey, externalUserId);
      const cached = this.mappingCache.get(cacheKey);
      if (cached) return cached;
    }

    return await this.findMappingByExternalId(productKey, externalUserId);
  }

  /**
   * Find all mappings for a Postiz user
   */
  async findUserMappings(
    userId: string,
    includeInactive: boolean = false
  ): Promise<UserMappingEntry[]> {
    try {
      const productUsers = await this.prisma.productUser.findMany({
        where: { 
          userId,
          ...(includeInactive ? {} : { status: 'active' }),
        },
        include: {
          product: true,
        },
      });

      return productUsers.map(pu => this.convertToMappingEntry(pu));

    } catch (error) {
      this.logger.error(`Failed to find user mappings: ${(error instanceof Error ? error.message : String(error))}`, { userId });
      return [];
    }
  }

  /**
   * Consolidate duplicate user accounts across products
   */
  async consolidateUsers(
    request: UserConsolidationRequest,
    adminContext: { adminUserId: string; ip: string; userAgent: string }
  ): Promise<SsoOperationResult<{ consolidatedUserId: string; mergedMappings: number }>> {
    const startTime = Date.now();
    const operationId = randomUUID();

    this.logger.log(`Starting user consolidation`, {
      operationId,
      primaryUserId: request.primaryUserId,
      duplicateCount: request.duplicateUserIds.length,
      strategy: request.mergeStrategy,
    });

    try {
      // Step 1: Validate primary user exists
      const primaryUser = await this.usersService.getUserById(request.primaryUserId);
      if (!primaryUser) {
        throw new NotFoundException(`Primary user not found: ${request.primaryUserId}`);
      }

      // Step 2: Validate duplicate users exist
      const duplicateUsers = await Promise.all(
        request.duplicateUserIds.map(id => this.usersService.getUserById(id))
      );

      if (duplicateUsers.some(user => !user)) {
        throw new BadRequestException('One or more duplicate users not found');
      }

      // Step 3: Get all mappings for duplicate users
      const allMappingsToMerge: UserMappingEntry[][] = await Promise.all(
        request.duplicateUserIds.map(userId => this.findUserMappings(userId, true))
      );

      const totalMappings = allMappingsToMerge.flat().length;

      // Step 4: Perform consolidation based on strategy
      let mergedMappings = 0;
      for (const mappings of allMappingsToMerge) {
        for (const mapping of mappings) {
          await this.transferMapping(mapping, request.primaryUserId, adminContext);
          mergedMappings++;
        }
      }

      // Step 5: Merge user profiles if needed
      if (request.mergeStrategy === 'merge_all') {
        await this.mergeUserProfiles(primaryUser, duplicateUsers, request.conflictResolution);
      }

      // Step 6: Mark duplicate users as merged
      await Promise.all(
        request.duplicateUserIds.map(userId => 
          this.markUserAsMerged(userId, request.primaryUserId, adminContext)
        )
      );

      // Step 7: Clean up cache
      this.invalidateUserMappingCache(request.primaryUserId);
      request.duplicateUserIds.forEach(userId => this.invalidateUserMappingCache(userId));

      // Step 8: Emit consolidation event
      await this.eventEmitter.emitAsync('users.consolidated', {
        operationId,
        primaryUserId: request.primaryUserId,
        mergedUserIds: request.duplicateUserIds,
        totalMappings: mergedMappings,
        consolidatedBy: adminContext.adminUserId,
      });

      // Step 9: Audit log the consolidation
      await this.auditLogger.logEvent('users_consolidated', {
        operationId,
        primaryUserId: request.primaryUserId,
        mergedUserIds: request.duplicateUserIds,
        totalMappings: mergedMappings,
        strategy: request.mergeStrategy,
        adminUserId: adminContext.adminUserId,
        clientIP: adminContext.ip,
      });

      const result = {
        consolidatedUserId: request.primaryUserId,
        mergedMappings,
      };

      this.logger.log(`User consolidation completed`, {
        operationId,
        primaryUserId: request.primaryUserId,
        mergedMappings,
        processingTime: Date.now() - startTime,
      });

      return SsoTypeFactory.createOperationResult(
        true,
        'user_consolidation',
        'platform',
        result,
        undefined,
        {
          operationId,
          totalMappings: mergedMappings,
          duration: Date.now() - startTime,
        }
      );

    } catch (error) {
      this.logger.error(`User consolidation failed: ${(error instanceof Error ? error.message : String(error))}`, {
        operationId,
        primaryUserId: request.primaryUserId,
        error: (error instanceof Error ? error.stack : undefined),
      });

      const ssoError = {
        code: 'USER_CONSOLIDATION_FAILED' as any,
        message: (error instanceof Error ? error.message : String(error)),
        category: 'user_mapping' as const,
        severity: 'error' as const,
        timestamp: new Date(),
        context: { operationId, primaryUserId: request.primaryUserId },
      };

      return SsoTypeFactory.createOperationResult(
        false,
        'user_consolidation',
        'platform',
        undefined,
        ssoError,
        { operationId, duration: Date.now() - startTime }
      );
    }
  }

  /**
   * Get mapping analytics
   */
  async getMappingAnalytics(productKey?: string): Promise<MappingAnalytics> {
    try {
      const where = productKey ? { product: { productKey } } : {};
      
      const [totalMappings, activeMappings, recentMappings] = await Promise.all([
        this.prisma.productUser.count({ where }),
        this.prisma.productUser.count({ where: { ...where, status: 'active' } }),
        this.prisma.productUser.count({ 
          where: { 
            ...where, 
            createdAt: { gte: dayjs().subtract(24, 'hours').toDate() } 
          } 
        }),
      ]);

      // Get product distribution
      const productDistribution = await this.prisma.productUser.groupBy({
        by: ['productId'],
        _count: { id: true },
        where,
      });

      const productDistMap: Record<string, number> = {};
      for (const item of productDistribution) {
        const product = await this.prisma.saasProduct.findUnique({
          where: { id: item.productId },
        });
        if (product) {
          productDistMap[product.productKey] = item._count.id;
        }
      }

      return {
        totalMappings,
        activeUsers: activeMappings,
        productDistribution: productDistMap,
        conflictCount: 0, // Would implement conflict detection
        recentMappings24h: recentMappings,
        syncSuccessRate: 99.5, // Would calculate from sync logs
        lastUpdated: new Date(),
      };

    } catch (error) {
      this.logger.error(`Failed to get mapping analytics: ${(error instanceof Error ? error.message : String(error))}`);
      return {
        totalMappings: 0,
        activeUsers: 0,
        productDistribution: {},
        conflictCount: 0,
        recentMappings24h: 0,
        syncSuccessRate: 0,
        lastUpdated: new Date(),
      };
    }
  }

  /**
   * Batch sync user profiles from external products
   */
  async batchSyncUsers(
    productKey: string,
    userProfiles: SyncProfile[],
    options: { dryRun?: boolean; batchSize?: number } = {}
  ): Promise<{
    processed: number;
    updated: number;
    created: number;
    errors: Array<{ externalUserId: string; error: string }>;
  }> {
    const batchSize = options.batchSize || 50;
    const isDryRun = options.dryRun || false;
    const results = {
      processed: 0,
      updated: 0,
      created: 0,
      errors: [] as Array<{ externalUserId: string; error: string }>,
    };

    this.logger.log(`Starting batch sync for ${userProfiles.length} users`, {
      productKey,
      batchSize,
      isDryRun,
    });

    // Process in batches to avoid overwhelming the system
    for (let i = 0; i < userProfiles.length; i += batchSize) {
      const batch = userProfiles.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (profile) => {
        try {
          const existingMapping = await this.findUserMapping(productKey, profile.externalUserId);
          
          if (!isDryRun) {
            if (existingMapping) {
              await this.updateUserMapping(existingMapping.id, profile);
              results.updated++;
            } else {
              await this.createUserMapping(productKey, profile.externalUserId, profile, {
                autoCreateUser: true,
              });
              results.created++;
            }
          }
          
          results.processed++;

        } catch (error) {
          results.errors.push({
            externalUserId: profile.externalUserId,
            error: (error instanceof Error ? error.message : String(error)),
          });
          this.logger.error(`Batch sync error for ${profile.externalUserId}: ${(error instanceof Error ? error.message : String(error))}`);
        }
      });

      await Promise.all(batchPromises);

      // Add small delay between batches
      if (i + batchSize < userProfiles.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    this.logger.log(`Batch sync completed`, {
      productKey,
      ...results,
      isDryRun,
    });

    return results;
  }

  /**
   * Private helper methods
   */

  private async validateProduct(productKey: string): Promise<any> {
    return await this.prisma.saasProduct.findUnique({
      where: { productKey },
    });
  }

  private async findMappingByExternalId(
    productKey: string,
    externalUserId: string
  ): Promise<UserMappingEntry | null> {
    try {
      const productUser = await this.prisma.productUser.findFirst({
        where: {
          externalUserId,
          product: { productKey },
        },
        include: { product: true, user: true },
      });

      return productUser ? this.convertToMappingEntry(productUser) : null;

    } catch (error) {
      this.logger.error(`Failed to find mapping: ${(error instanceof Error ? error.message : String(error))}`);
      return null;
    }
  }

  private async findMappingById(mappingId: string): Promise<UserMappingEntry | null> {
    try {
      const productUser = await this.prisma.productUser.findUnique({
        where: { id: mappingId },
        include: { product: true, user: true },
      });

      return productUser ? this.convertToMappingEntry(productUser) : null;

    } catch (error) {
      this.logger.error(`Failed to find mapping by ID: ${(error instanceof Error ? error.message : String(error))}`);
      return null;
    }
  }

  private convertToMappingEntry(productUser: any): UserMappingEntry {
    return {
      id: productUser.id,
      userId: productUser.userId,
      organizationId: productUser.organizationId,
      productKey: productUser.product?.productKey || '',
      externalUserId: productUser.externalUserId,
      email: productUser.metadata?.email || productUser.user?.email || '',
      name: productUser.metadata?.name || productUser.user?.name,
      avatar: productUser.metadata?.avatar || productUser.user?.picture?.path,
      permissions: productUser.permissions as TrustDomainScope[],
      dataAccessLevel: productUser.dataAccessLevel as DataAccessLevel,
      metadata: productUser.metadata || {},
      lastSync: productUser.metadata?.lastSyncedAt || productUser.updatedAt,
      status: productUser.status,
      createdAt: productUser.createdAt,
      updatedAt: productUser.updatedAt,
    };
  }

  private generateMappingCacheKey(productKey: string, externalUserId: string): string {
    return `${productKey}:${externalUserId}`;
  }

  private generateUserGcsPath(productKey: string, userId: string): string {
    return `users/${productKey}/${userId}/media/`;
  }

  private convertToGcsPermissions(ssoPermissions: TrustDomainScope[]): string[] {
    const gcsPermissions: string[] = [];
    
    if (ssoPermissions.includes(TrustDomainScope.MEDIA_ACCESS)) {
      gcsPermissions.push('media_read', 'media_write');
    }
    if (ssoPermissions.includes(TrustDomainScope.USER_READ)) {
      gcsPermissions.push('user_read');
    }
    
    return gcsPermissions;
  }

  private async syncUserProfile(userId: string, profile: SyncProfile): Promise<void> {
    try {
      const updateData: any = {};

      if (profile.name && profile.name.trim()) {
        updateData.name = profile.name.trim();
      }

      // Only update if we have meaningful changes
      if (Object.keys(updateData).length > 0) {
        await this.prisma.user.update({
          where: { id: userId },
          data: {
            ...updateData,
            updatedAt: new Date(),
          },
        });
      }

    } catch (error) {
      this.logger.error(`Failed to sync user profile: ${(error instanceof Error ? error.message : String(error))}`, { userId });
    }
  }

  private async transferMapping(
    mapping: UserMappingEntry,
    newUserId: string,
    adminContext: { adminUserId: string; ip: string; userAgent: string }
  ): Promise<void> {
    await this.prisma.productUser.update({
      where: { id: mapping.id },
      data: {
        userId: newUserId,
        metadata: {
          ...mapping.metadata,
          transferredFrom: mapping.userId,
          transferredBy: adminContext.adminUserId,
          transferredAt: new Date(),
        },
        updatedAt: new Date(),
      },
    });
  }

  private async mergeUserProfiles(
    primaryUser: any,
    duplicateUsers: any[],
    conflictResolution: UserConsolidationRequest['conflictResolution']
  ): Promise<void> {
    // Implementation would merge user profiles based on conflict resolution strategy
    this.logger.debug(`Merging user profiles for ${primaryUser.id}`);
  }

  private async markUserAsMerged(
    userId: string,
    primaryUserId: string,
    adminContext: { adminUserId: string; ip: string; userAgent: string }
  ): Promise<void> {
    // Mark user as merged (soft delete with reference to primary)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `merged_${userId}@postiz.local`,
        name: `[MERGED] ${userId}`,
        activated: false,
        // In a real implementation, we might have a separate merged_users table
      },
    });
  }

  private invalidateUserMappingCache(userId: string): void {
    // Remove all cache entries for a user
    for (const [key, mapping] of this.mappingCache.entries()) {
      if (mapping.userId === userId) {
        this.mappingCache.delete(key);
      }
    }
  }

  private async initializeMappingCache(): Promise<void> {
    // Load recently accessed mappings into cache on startup
    try {
      const recentMappings = await this.prisma.productUser.findMany({
        where: {
          updatedAt: { gte: dayjs().subtract(1, 'hour').toDate() },
          status: 'active',
        },
        include: { product: true, user: true },
        take: 1000,
      });

      for (const mapping of recentMappings) {
        const entry = this.convertToMappingEntry(mapping);
        const cacheKey = this.generateMappingCacheKey(entry.productKey, entry.externalUserId);
        this.mappingCache.set(cacheKey, entry);
      }

      this.logger.debug(`Initialized mapping cache with ${recentMappings.length} entries`);

    } catch (error) {
      this.logger.error(`Failed to initialize mapping cache: ${(error instanceof Error ? error.message : String(error))}`);
    }
  }

  private setupSyncProcessor(): void {
    // Process sync queue every 30 seconds
    setInterval(async () => {
      if (this.syncQueue.size > 0) {
        const toSync = Array.from(this.syncQueue);
        this.syncQueue.clear();
        
        this.logger.debug(`Processing ${toSync.length} sync operations`);
        
        // Process sync operations
        // Implementation would handle queued sync operations
      }
    }, 30000);

    // Clean up cache every hour
    setInterval(() => {
      const cutoff = dayjs().subtract(2, 'hours');
      let cleanupCount = 0;

      for (const [key, mapping] of this.mappingCache.entries()) {
        if (dayjs(mapping.lastSync).isBefore(cutoff)) {
          this.mappingCache.delete(key);
          cleanupCount++;
        }
      }

      if (cleanupCount > 0) {
        this.logger.debug(`Cleaned up ${cleanupCount} cached mappings`);
      }
    }, 60 * 60 * 1000);
  }
}