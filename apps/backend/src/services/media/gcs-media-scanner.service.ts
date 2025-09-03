/**
 * GCS媒体文件扫描服务
 * 扫描用户的GCS存储路径，发现新文件并同步到数据库
 */

import { Injectable, Logger } from '@nestjs/common';
import { MediaRepository } from '@gitroom/nestjs-libraries/database/prisma/media/media.repository';
import { UserStorageFactory } from '@gitroom/nestjs-libraries/upload/user-storage.factory';
import { GCSStorage, FileMetadata } from '@gitroom/nestjs-libraries/upload/gcs.storage';
import { IExtendedUploadProvider } from '@gitroom/nestjs-libraries/upload/upload.interface';
import * as path from 'path';

export interface GcsScanResult {
  found: number;
  new: number;
  deleted: number;
  errors: number;
  files: {
    name: string;
    path: string;
    size: number;
    isNew: boolean;
    error?: string;
  }[];
}

@Injectable()
export class GcsMediaScannerService {
  private readonly logger = new Logger(GcsMediaScannerService.name);
  
  // 扫描结果缓存 - 5分钟TTL
  private readonly _scanCache = new Map<string, { result: GcsScanResult; timestamp: number }>();
  private readonly SCAN_CACHE_TTL = 5 * 60 * 1000; // 5分钟

  constructor(
    private _mediaRepository: MediaRepository
  ) {}

  /**
   * 扫描用户的GCS存储路径，发现并同步文件到数据库
   */
  async scanAndSyncUserMedia(
    organizationId: string, 
    userStorageConfig?: any,
    maxFiles = 100,
    useCache = true
  ): Promise<GcsScanResult> {
    // 构建缓存key
    const cacheKey = `${organizationId}:${JSON.stringify(userStorageConfig)}:${maxFiles}`;
    
    // 检查缓存
    if (useCache && this._scanCache.has(cacheKey)) {
      const cached = this._scanCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.SCAN_CACHE_TTL) {
        this.logger.log(`📋 Returning cached scan result for organization ${organizationId} (age: ${Math.round((Date.now() - cached.timestamp) / 1000)}s)`);
        return cached.result;
      }
      // 缓存过期，删除
      this._scanCache.delete(cacheKey);
    }

    const result: GcsScanResult = {
      found: 0,
      new: 0,
      deleted: 0,
      errors: 0,
      files: []
    };

    try {
      this.logger.log(`🔍 Scanning GCS media for organization ${organizationId} (fresh scan)`);
      
      // 创建用户特定的存储实例
      const storage = this.createUserStorage(userStorageConfig);
      
      if (!storage || !this.isGCSStorage(storage)) {
        throw new Error('GCS storage not available or user config missing');
      }

      // 确定扫描路径
      const scanPrefix = this.getUserStoragePath(userStorageConfig);
      this.logger.log(`📂 Scanning path: ${scanPrefix}`);

      // 列出GCS中的文件
      const gcsFiles = await storage.listFiles(scanPrefix, undefined, maxFiles);
      result.found = gcsFiles.length;
      
      this.logger.log(`📋 Found ${gcsFiles.length} files in GCS`);

      // 获取数据库中已存在的文件
      const existingMedia = await this._mediaRepository.getMedia(organizationId, 1);
      const existingPaths = new Set(existingMedia.results.map(m => m.path));
      
      // 创建GCS文件路径集合，用于检测已删除的文件
      const gcsFilePaths = new Set(gcsFiles.map(f => this.generatePublicUrl(f.name, userStorageConfig)));

      // 处理每个GCS文件
      for (const gcsFile of gcsFiles) {
        try {
          const fileName = path.basename(gcsFile.name);
          const publicUrl = this.generatePublicUrl(gcsFile.name, userStorageConfig);
          
          const fileInfo = {
            name: fileName,
            path: publicUrl,
            size: gcsFile.size,
            isNew: false,
            gcsPath: gcsFile.name
          };

          // 检查是否已存在于数据库
          if (!existingPaths.has(publicUrl)) {
            // 新文件，添加到数据库
            await this._mediaRepository.saveFile(organizationId, fileName, publicUrl);
            fileInfo.isNew = true;
            result.new++;
            
            this.logger.log(`✅ Added new file: ${fileName}`);
          }

          result.files.push(fileInfo);

        } catch (error) {
          result.errors++;
          const errorMsg = error instanceof Error ? error.message : String(error);
          
          result.files.push({
            name: path.basename(gcsFile.name),
            path: gcsFile.name,
            size: gcsFile.size,
            isNew: false,
            error: errorMsg
          });

          this.logger.error(`❌ Error processing file ${gcsFile.name}: ${errorMsg}`);
        }
      }

      // 检测已删除的文件（在数据库中但不在GCS中）
      for (const existingPath of existingPaths) {
        if (!gcsFilePaths.has(existingPath) && this.isGcsUrl(existingPath, userStorageConfig)) {
          try {
            // 从数据库中删除已不存在的文件
            await this._mediaRepository.deleteFile(organizationId, existingPath);
            result.deleted++;
            this.logger.log(`🗑️ Deleted missing file: ${path.basename(existingPath)}`);
          } catch (error) {
            result.errors++;
            this.logger.error(`❌ Error deleting missing file ${existingPath}: ${error}`);
          }
        }
      }

      this.logger.log(`🎯 Scan complete: ${result.found} found, ${result.new} new, ${result.deleted} deleted, ${result.errors} errors`);
      
      // 保存到缓存
      if (useCache) {
        this._scanCache.set(cacheKey, { result, timestamp: Date.now() });
        this.logger.log(`💾 Cached scan result for organization ${organizationId}`);
      }
      
      return result;

    } catch (error) {
      this.logger.error(`💥 Media scan failed: ${error}`);
      throw error;
    }
  }

  /**
   * 为SSO用户快速同步媒体
   */
  async quickSyncForSsoUser(organizationId: string, user: any): Promise<GcsScanResult> {
    if (!user?.mediaStorage) {
      this.logger.warn(`⚠️ No media storage config for user`);
      return { found: 0, new: 0, deleted: 0, errors: 0, files: [] };
    }

    return this.scanAndSyncUserMedia(organizationId, user.mediaStorage, 50);
  }

  /**
   * 创建用户特定的存储实例
   */
  private createUserStorage(mediaStorageConfig?: any): IExtendedUploadProvider | null {
    if (!mediaStorageConfig) {
      // 回退到默认存储配置
      const storageProvider = process.env.STORAGE_PROVIDER;
      if (storageProvider === 'gcs') {
        return UserStorageFactory.createUserStorage('default');
      }
      return null;
    }

    try {
      return UserStorageFactory.createStorageFromConfig(mediaStorageConfig);
    } catch (error) {
      this.logger.error(`Failed to create user storage: ${error}`);
      return null;
    }
  }

  /**
   * 检查是否为GCS存储
   */
  private isGCSStorage(storage: any): storage is GCSStorage {
    return storage && typeof storage.listFiles === 'function';
  }

  /**
   * 获取用户存储路径
   */
  private getUserStoragePath(mediaStorageConfig?: any): string {
    if (mediaStorageConfig?.path) {
      // 确保路径以斜杠结尾，以便正确列出目录内容
      // 修复: 处理path为数字的情况（来自SSO token）
      const userPath = String(mediaStorageConfig.path);
      return userPath.endsWith('/') ? userPath : `${userPath}/`;
    }
    return '';
  }

  /**
   * 生成文件的公共URL
   */
  private generatePublicUrl(gcsFileName: string, mediaStorageConfig?: any): string {
    if (mediaStorageConfig?.bucket) {
      const bucketName = mediaStorageConfig.bucket;
      return `https://storage.cloud.google.com/${bucketName}/${gcsFileName}`;
    }
    
    // 回退到环境变量配置
    const bucketName = process.env.GCS_BUCKET_NAME || 'default-bucket';
    return `https://storage.cloud.google.com/${bucketName}/${gcsFileName}`;
  }

  /**
   * 检查URL是否为当前用户的GCS文件
   */
  private isGcsUrl(url: string, mediaStorageConfig?: any): boolean {
    if (!url.includes('storage.cloud.google.com') && !url.includes('storage.googleapis.com')) {
      return false;
    }
    
    // 检查是否匹配用户的bucket
    if (mediaStorageConfig?.bucket) {
      return url.includes(`/${mediaStorageConfig.bucket}/`);
    }
    
    // 回退到环境变量配置
    const envBucket = process.env.GCS_BUCKET_NAME;
    return envBucket ? url.includes(`/${envBucket}/`) : true;
  }

  /**
   * 清理扫描缓存
   */
  clearScanCache(): void {
    this._scanCache.clear();
    this.logger.log(`🧹 Scan cache cleared`);
  }

  /**
   * 清理过期的扫描缓存条目
   */
  cleanupExpiredCache(): void {
    const now = Date.now();
    let removedCount = 0;
    
    for (const [key, value] of this._scanCache.entries()) {
      if (now - value.timestamp > this.SCAN_CACHE_TTL) {
        this._scanCache.delete(key);
        removedCount++;
      }
    }
    
    if (removedCount > 0) {
      this.logger.log(`🧹 Cleaned up ${removedCount} expired cache entries`);
    }
  }

  /**
   * 强制刷新特定组织的缓存
   */
  async refreshCache(organizationId: string, userStorageConfig?: any): Promise<GcsScanResult> {
    this.logger.log(`🔄 Force refreshing cache for organization ${organizationId}`);
    return this.scanAndSyncUserMedia(organizationId, userStorageConfig, 100, false);
  }

  /**
   * 获取扫描服务状态
   */
  getStatus() {
    // 清理过期缓存
    this.cleanupExpiredCache();
    
    return {
      service: 'GcsMediaScannerService',
      version: '1.2.0',
      features: ['sync-new-files', 'delete-missing-files', 'cache-scan-results'],
      cache: {
        entries: this._scanCache.size,
        ttlMinutes: this.SCAN_CACHE_TTL / (60 * 1000)
      },
      gcsConfigured: !!process.env.GCS_BUCKET_NAME,
      timestamp: new Date().toISOString()
    };
  }
}