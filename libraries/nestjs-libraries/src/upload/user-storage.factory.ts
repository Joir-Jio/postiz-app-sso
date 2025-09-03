import { CloudflareStorage } from './cloudflare.storage';
import { GCSStorage, GCSConfiguration } from './gcs.storage';
import { IUploadProvider } from './upload.interface';
import { LocalStorage } from './local.storage';
import * as path from 'path';

export class UserStorageFactory {
  /**
   * 为特定用户创建存储实例
   */
  static createUserStorage(userId: string): IUploadProvider {
    const storageProvider = process.env.STORAGE_PROVIDER || 'local';

    switch (storageProvider) {
      case 'local':
        return new LocalStorage(process.env.UPLOAD_DIRECTORY!);
      case 'cloudflare':
        return new CloudflareStorage(
          process.env.CLOUDFLARE_ACCOUNT_ID!,
          process.env.CLOUDFLARE_ACCESS_KEY!,
          process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
          process.env.CLOUDFLARE_REGION!,
          process.env.CLOUDFLARE_BUCKETNAME!,
          process.env.CLOUDFLARE_BUCKET_URL!
        );
      case 'gcs':
        return UserStorageFactory.createUserGCSStorage(userId);
      default:
        throw new Error(`Invalid storage type ${storageProvider}`);
    }
  }

  /**
   * 为特定用户创建GCS存储实例（使用共享密钥）
   */
  private static createUserGCSStorage(userId: string): GCSStorage {
    // 使用用户特定的配置（如果存在）或默认配置
    const userBucket = process.env[`GCS_BUCKET_${userId}`] || process.env.GCS_BUCKET_NAME!;
    const userProjectId = process.env[`GCS_PROJECT_ID_${userId}`] || process.env.GCS_PROJECT_ID!;
    const userPath = process.env[`GCS_PATH_${userId}`];

    const config: GCSConfiguration = {
      projectId: userProjectId,
      bucketName: userBucket,
      region: process.env.GCS_REGION || 'us-central1',
      publicBaseUrl: process.env.GCS_PUBLIC_BASE_URL,
      
      // 使用共享的服务账号密钥
      keyFilename: process.env.GCS_KEY_FILENAME,
      credentials: process.env.GCS_CREDENTIALS ? JSON.parse(process.env.GCS_CREDENTIALS) : undefined,


      // File reference settings
      allowFileReference: process.env.GCS_ALLOW_FILE_REFERENCE === 'true',
      allowedPathPatterns: process.env.GCS_ALLOWED_PATH_PATTERNS 
        ? JSON.parse(process.env.GCS_ALLOWED_PATH_PATTERNS) 
        : undefined,
      maxFileSize: process.env.GCS_MAX_FILE_SIZE ? parseInt(process.env.GCS_MAX_FILE_SIZE) : undefined,
      signedUrlExpiry: process.env.GCS_SIGNED_URL_EXPIRY ? parseInt(process.env.GCS_SIGNED_URL_EXPIRY) : undefined,

      // Performance and caching settings
      enableCaching: process.env.GCS_ENABLE_CACHING !== 'false',
      cacheMaxAge: process.env.GCS_CACHE_MAX_AGE ? parseInt(process.env.GCS_CACHE_MAX_AGE) : undefined,
      maxRetries: process.env.GCS_MAX_RETRIES ? parseInt(process.env.GCS_MAX_RETRIES) : undefined,
      requestTimeout: process.env.GCS_REQUEST_TIMEOUT ? parseInt(process.env.GCS_REQUEST_TIMEOUT) : undefined,
    };

    // 验证必需配置
    if (!config.projectId) {
      throw new Error(`GCS_PROJECT_ID not configured for user ${userId}`);
    }
    if (!config.bucketName) {
      throw new Error(`GCS_BUCKET_NAME not configured for user ${userId}`);
    }

    console.log(`🗂️  Creating GCS storage for user ${userId}:`, {
      project: config.projectId,
      bucket: config.bucketName,
      userPath: userPath,
      sharedKeyFile: config.keyFilename
    });

    return new GCSStorage(config);
  }

  /**
   * 根据媒体存储配置创建存储实例（使用共享密钥）
   */
  static createStorageFromConfig(mediaStorage: any): IUploadProvider {
    switch (mediaStorage.provider) {
      case 'gcs':
        const gcsConfig: GCSConfiguration = {
          projectId: mediaStorage.config?.projectId || process.env.GCS_PROJECT_ID!,
          bucketName: mediaStorage.bucket,
          region: mediaStorage.region || 'us-central1',
          // 使用共享的服务账号密钥文件
          keyFilename: process.env.GCS_KEY_FILENAME,
          credentials: process.env.GCS_CREDENTIALS ? JSON.parse(process.env.GCS_CREDENTIALS) : undefined,
          enableCaching: true,
          allowFileReference: process.env.GCS_ALLOW_FILE_REFERENCE === 'true',
          maxFileSize: process.env.GCS_MAX_FILE_SIZE ? parseInt(process.env.GCS_MAX_FILE_SIZE) : undefined,
          signedUrlExpiry: process.env.GCS_SIGNED_URL_EXPIRY ? parseInt(process.env.GCS_SIGNED_URL_EXPIRY) : undefined,
        };
        return new GCSStorage(gcsConfig);

      case 'aws':
        // TODO: 实现AWS S3配置
        throw new Error('AWS S3 storage not implemented yet');

      case 'local':
        return new LocalStorage(process.env.UPLOAD_DIRECTORY!);

      case 'cloudflare':
        return new CloudflareStorage(
          process.env.CLOUDFLARE_ACCOUNT_ID!,
          process.env.CLOUDFLARE_ACCESS_KEY!,
          process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
          process.env.CLOUDFLARE_REGION!,
          mediaStorage.bucket,
          process.env.CLOUDFLARE_BUCKET_URL!
        );

      default:
        throw new Error(`Unsupported storage provider: ${mediaStorage.provider}`);
    }
  }
}