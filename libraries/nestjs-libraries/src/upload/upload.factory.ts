import { CloudflareStorage } from './cloudflare.storage';
import { GCSStorage, GCSConfiguration } from './gcs.storage';
import { IUploadProvider } from './upload.interface';
import { LocalStorage } from './local.storage';

export class UploadFactory {
  static createStorage(): IUploadProvider {
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
        return UploadFactory.createGCSStorage();
      default:
        throw new Error(`Invalid storage type ${storageProvider}`);
    }
  }

  private static createGCSStorage(): GCSStorage {
    const config: GCSConfiguration = {
      projectId: process.env.GCS_PROJECT_ID!,
      bucketName: process.env.GCS_BUCKET_NAME!,
      region: process.env.GCS_REGION,
      publicBaseUrl: process.env.GCS_PUBLIC_BASE_URL,
      
      // Authentication - prefer service account key file, fallback to credentials object, then ADC
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
      enableCaching: process.env.GCS_ENABLE_CACHING !== 'false', // Default to true
      cacheMaxAge: process.env.GCS_CACHE_MAX_AGE ? parseInt(process.env.GCS_CACHE_MAX_AGE) : undefined,
      maxRetries: process.env.GCS_MAX_RETRIES ? parseInt(process.env.GCS_MAX_RETRIES) : undefined,
      requestTimeout: process.env.GCS_REQUEST_TIMEOUT ? parseInt(process.env.GCS_REQUEST_TIMEOUT) : undefined,
    };

    // Validate required configuration
    if (!config.projectId) {
      throw new Error('GCS_PROJECT_ID environment variable is required');
    }
    if (!config.bucketName) {
      throw new Error('GCS_BUCKET_NAME environment variable is required');
    }

    // Validate authentication configuration
    if (!config.keyFilename && !config.credentials && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.warn('No GCS authentication configured. Falling back to Application Default Credentials (ADC).');
    }

    return new GCSStorage(config);
  }
}
