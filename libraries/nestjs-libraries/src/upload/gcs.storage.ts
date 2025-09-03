import { Storage, Bucket, File } from '@google-cloud/storage';
import 'multer';
import { makeId } from '@gitroom/nestjs-libraries/services/make.is';
import mime from 'mime-types';
// @ts-ignore
import { getExtension } from 'mime';
import { IUploadProvider, IExtendedUploadProvider } from './upload.interface';
import axios from 'axios';
import * as path from 'path';

export interface GCSConfiguration {
  projectId: string;
  keyFilename?: string;
  credentials?: {
    client_email: string;
    private_key: string;
  };
  bucketName: string;
  publicBaseUrl?: string;
  region?: string;
  // File reference specific settings
  allowFileReference?: boolean;
  allowedPathPatterns?: string[];
  maxFileSize?: number;
  signedUrlExpiry?: number; // in seconds
  // Caching settings
  enableCaching?: boolean;
  cacheMaxAge?: number;
  // Performance settings
  maxRetries?: number;
  requestTimeout?: number;
}

export interface FileReferenceOptions {
  filePath: string;
  userId?: string;
  validatePath?: boolean;
  generateThumbnail?: boolean;
  skipSizeCheck?: boolean;
}

export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  lastModified: Date;
  etag: string;
  exists: boolean;
  isPublic?: boolean;
  signedUrl?: string;
  thumbnailUrl?: string;
}

export interface PathValidationResult {
  isValid: boolean;
  sanitizedPath: string;
  userFolder?: string;
  isDev?: boolean;
  errors?: string[];
}

class GCSStorage implements IExtendedUploadProvider {
  private _storage: Storage;
  private _bucket: Bucket;
  private _config: GCSConfiguration;
  private _pathCache: Map<string, { result: PathValidationResult; timestamp: number }> = new Map();
  private _metadataCache: Map<string, { metadata: FileMetadata; timestamp: number }> = new Map();
  
  // Cache TTL in milliseconds (default: 5 minutes for paths, 2 minutes for metadata)
  private readonly PATH_CACHE_TTL = 5 * 60 * 1000;
  private readonly METADATA_CACHE_TTL = 2 * 60 * 1000;

  constructor(config: GCSConfiguration) {
    this._config = {
      maxRetries: 3,
      requestTimeout: 30000,
      signedUrlExpiry: 3600, // 1 hour
      enableCaching: true,
      allowFileReference: true,
      maxFileSize: 500 * 1024 * 1024, // 500MB
      ...config,
    };

    // Initialize Google Cloud Storage
    const storageOptions: any = {
      projectId: this._config.projectId,
      maxRetries: this._config.maxRetries,
      timeout: this._config.requestTimeout,
    };

    if (this._config.keyFilename) {
      storageOptions.keyFilename = this._config.keyFilename;
    } else if (this._config.credentials) {
      storageOptions.credentials = this._config.credentials;
    }
    // If neither keyFilename nor credentials, use Application Default Credentials

    this._storage = new Storage(storageOptions);
    this._bucket = this._storage.bucket(this._config.bucketName);

    // Set default allowed path patterns if not provided
    if (!this._config.allowedPathPatterns) {
      this._config.allowedPathPatterns = [
        '^[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+(-DEV)?/\\d+/[^/]+$',  // user-bucket/userId-DEV/id/file.ext
        '^[a-zA-Z0-9_-]+/\\d+/[^/]+$',                          // user-bucket/id/file.ext
        '^[a-zA-Z0-9_-]+/[^/]+$',                               // user-bucket/file.ext
      ];
    }
  }

  /**
   * Validates and sanitizes file paths to prevent path traversal attacks
   */
  private validateFilePath(filePath: string, userId?: string): PathValidationResult {
    const cacheKey = `${filePath}:${userId || 'anonymous'}`;
    
    if (this._config.enableCaching && this._pathCache.has(cacheKey)) {
      const cached = this._pathCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.PATH_CACHE_TTL) {
        return cached.result;
      }
      this._pathCache.delete(cacheKey);
    }

    const result: PathValidationResult = {
      isValid: false,
      sanitizedPath: '',
      errors: []
    };

    try {
      // Basic sanitization
      let sanitizedPath = filePath.trim().replace(/^\/+|\/+$/g, '');
      
      // Check for path traversal attempts
      if (sanitizedPath.includes('..') || sanitizedPath.includes('//')) {
        result.errors!.push('Path traversal detected');
        return this.cachePathResult(cacheKey, result);
      }

      // Normalize path separators
      sanitizedPath = sanitizedPath.replace(/\\/g, '/');

      // Check against allowed patterns
      const isPatternMatch = this._config.allowedPathPatterns!.some(pattern => {
        return new RegExp(pattern).test(sanitizedPath);
      });

      if (!isPatternMatch) {
        result.errors!.push('Path does not match allowed patterns');
        return this.cachePathResult(cacheKey, result);
      }

      // Extract user information from path
      const pathParts = sanitizedPath.split('/');
      if (pathParts.length >= 2) {
        const userFolder = pathParts[1];
        result.userFolder = userFolder.replace('-DEV', '');
        result.isDev = userFolder.endsWith('-DEV');
        
        // If userId provided, validate it matches the path
        if (userId && !userFolder.startsWith(userId)) {
          result.errors!.push('User ID does not match path');
          return this.cachePathResult(cacheKey, result);
        }
      }

      result.isValid = true;
      result.sanitizedPath = sanitizedPath;
      
    } catch (error) {
      result.errors!.push(`Path validation error: ${error}`);
    }

    return this.cachePathResult(cacheKey, result);
  }

  private cachePathResult(cacheKey: string, result: PathValidationResult): PathValidationResult {
    if (this._config.enableCaching) {
      this._pathCache.set(cacheKey, { result, timestamp: Date.now() });
    }
    return result;
  }

  /**
   * Gets file metadata from GCS
   */
  private async getFileMetadata(filePath: string, useCache = true): Promise<FileMetadata> {
    const cacheKey = filePath;
    
    if (useCache && this._config.enableCaching && this._metadataCache.has(cacheKey)) {
      const cached = this._metadataCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.METADATA_CACHE_TTL) {
        return cached.metadata;
      }
      this._metadataCache.delete(cacheKey);
    }

    const file = this._bucket.file(filePath);
    
    try {
      const [metadata] = await file.getMetadata();
      const [exists] = await file.exists();
      
      const fileMetadata: FileMetadata = {
        name: metadata.name || path.basename(filePath),
        size: parseInt(String(metadata.size || '0')),
        contentType: metadata.contentType || 'application/octet-stream',
        lastModified: new Date(metadata.updated || metadata.timeCreated),
        etag: metadata.etag || '',
        exists,
        isPublic: false, // We'll check this separately if needed
      };

      if (this._config.enableCaching) {
        this._metadataCache.set(cacheKey, { metadata: fileMetadata, timestamp: Date.now() });
      }

      return fileMetadata;
    } catch (error) {
      // File doesn't exist or other error
      const fileMetadata: FileMetadata = {
        name: path.basename(filePath),
        size: 0,
        contentType: 'application/octet-stream',
        lastModified: new Date(),
        etag: '',
        exists: false,
      };
      
      return fileMetadata;
    }
  }

  /**
   * Generates a signed URL for secure file access
   */
  private async generateSignedUrl(filePath: string, action: 'read' | 'write' = 'read'): Promise<string> {
    try {
      const file = this._bucket.file(filePath);
      const [signedUrl] = await file.getSignedUrl({
        action,
        expires: Date.now() + (this._config.signedUrlExpiry! * 1000),
        version: 'v4',
      });
      
      return signedUrl;
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error}`);
    }
  }

  /**
   * Reference an existing file in GCS without uploading
   */
  async referenceFile(options: FileReferenceOptions): Promise<any> {
    if (!this._config.allowFileReference) {
      throw new Error('File referencing is not enabled');
    }

    // Validate path
    const pathValidation = this.validateFilePath(options.filePath, options.userId);
    if (!pathValidation.isValid) {
      throw new Error(`Invalid file path: ${pathValidation.errors?.join(', ')}`);
    }

    // Get file metadata
    const metadata = await this.getFileMetadata(pathValidation.sanitizedPath);
    if (!metadata.exists) {
      throw new Error(`File does not exist: ${pathValidation.sanitizedPath}`);
    }

    // Check file size limit
    if (!options.skipSizeCheck && metadata.size > this._config.maxFileSize!) {
      throw new Error(`File too large: ${metadata.size} bytes (max: ${this._config.maxFileSize} bytes)`);
    }

    // Generate signed URL for secure access
    const signedUrl = await this.generateSignedUrl(pathValidation.sanitizedPath);

    // Create file-like object similar to multer file
    const referencedFile = {
      filename: metadata.name,
      mimetype: metadata.contentType,
      size: metadata.size,
      originalname: metadata.name,
      fieldname: 'file',
      path: signedUrl,
      destination: signedUrl,
      encoding: '7bit',
      // GCS specific properties
      gcsPath: pathValidation.sanitizedPath,
      bucketName: this._config.bucketName,
      isReference: true,
      lastModified: metadata.lastModified,
      etag: metadata.etag,
      // Stream-like buffer for compatibility
      buffer: Buffer.alloc(0), // Empty buffer for referenced files
      stream: null as any,
    };

    return referencedFile;
  }

  /**
   * Standard upload from URL (implements IUploadProvider)
   */
  async uploadSimple(path: string): Promise<string> {
    try {
      console.log(`🔍 GCS uploadSimple started for: ${path}`);
      
      const loadImage = await fetch(path);
      if (!loadImage.ok) {
        console.error(`❌ Failed to fetch image from ${path}: ${loadImage.status} ${loadImage.statusText}`);
        throw new Error(`Failed to fetch image: ${loadImage.statusText}`);
      }

      const contentType = loadImage.headers.get('content-type') || 'application/octet-stream';
      const extension = getExtension(contentType) || 'bin';
      const id = makeId(10);
      const fileName = `${id}.${extension}`;

      console.log(`📦 GCS upload details: bucket=${this._config.bucketName}, fileName=${fileName}, contentType=${contentType}`);

      const file = this._bucket.file(fileName);
      const buffer = Buffer.from(await loadImage.arrayBuffer());

      console.log(`📤 Starting GCS upload, buffer size: ${buffer.length} bytes`);

      // Upload to GCS
      const stream = file.createWriteStream({
        metadata: {
          contentType,
          cacheControl: this._config.cacheMaxAge ? `public, max-age=${this._config.cacheMaxAge}` : undefined,
        },
        // Removed 'public: true' - incompatible with uniform bucket-level access
        validation: 'crc32c',
      });

      await new Promise((resolve, reject) => {
        stream.on('error', (err) => {
          console.error(`❌ GCS stream error:`, err);
          reject(err);
        });
        stream.on('finish', () => {
          console.log(`✅ GCS upload completed successfully for ${fileName}`);
          resolve(undefined);
        });
        stream.end(buffer);
      });

      // Generate signed URL for private bucket access with longer expiry for YouTube  
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours for YouTube processing
        version: 'v4',
      });
      
      console.log(`🔐 Generated YouTube-compatible signed URL (24h expiry)`);
      console.log(`📋 Signed URL details:`, {
        fileName,
        bucketName: this._config.bucketName,
        contentType,
        fileSize: buffer.length,
        expiresIn: '24 hours',
        urlPreview: signedUrl.substring(0, 150) + '...'
      });
      
      // Test if the signed URL is accessible with actual GET request  
      try {
        console.log(`🔍 Testing signed URL with GET request (first 1KB)...`);
        const testResponse = await fetch(signedUrl, { 
          method: 'GET',
          headers: { 'Range': 'bytes=0-1023' } // Just test first 1KB
        });
        console.log(`✅ Signed URL GET test: ${testResponse.status} ${testResponse.statusText}`);
        console.log(`📊 Response headers:`, {
          contentType: testResponse.headers.get('content-type'),
          contentLength: testResponse.headers.get('content-length'),
          cacheControl: testResponse.headers.get('cache-control'),
          contentRange: testResponse.headers.get('content-range')
        });
        
        // Check if we got video content or HTML error page
        if (testResponse.headers.get('content-type')?.includes('text/html')) {
          console.error(`❌ WARNING: Signed URL returns HTML instead of video content!`);
          const textContent = await testResponse.text();
          console.error(`❌ HTML response preview:`, textContent.substring(0, 500));
        } else {
          console.log(`✅ Signed URL returns expected video content type`);
        }
      } catch (testError) {
        console.error(`❌ Signed URL GET test failed:`, (testError as any)?.message);
      }
      
      return signedUrl;
    } catch (error) {
      console.error(`💥 GCS uploadSimple failed for ${path}:`, error);
      throw new Error(`Failed to upload simple file: ${(error as any)?.message || error}`);
    }
  }

  /**
   * Upload for permanent storage (like avatars) with private access
   * Uses a private bucket and generates signed URLs for access
   */
  async uploadPersistent(path: string, bucketName?: string): Promise<string> {
    try {
      console.log(`🔍 GCS uploadPersistent started for: ${path}`);
      
      const loadImage = await fetch(path);
      if (!loadImage.ok) {
        console.error(`❌ Failed to fetch image from ${path}: ${loadImage.status} ${loadImage.statusText}`);
        throw new Error(`Failed to fetch image: ${loadImage.statusText}`);
      }

      const contentType = loadImage.headers.get('content-type') || 'application/octet-stream';
      const extension = getExtension(contentType) || 'bin';
      const id = makeId(10);
      const fileName = `${id}.${extension}`;

      // Use private bucket for persistent storage
      const persistentBucketName = bucketName || 'hypehusk01-postiz-avater';
      console.log(`📦 GCS persistent upload details: bucket=${persistentBucketName}, fileName=${fileName}, contentType=${contentType}`);

      const persistentBucket = this._storage.bucket(persistentBucketName);
      const file = persistentBucket.file(fileName);
      const buffer = Buffer.from(await loadImage.arrayBuffer());

      console.log(`📤 Starting GCS persistent upload, buffer size: ${buffer.length} bytes`);

      // Upload to persistent private bucket
      const stream = file.createWriteStream({
        metadata: {
          contentType,
          cacheControl: this._config.cacheMaxAge ? `public, max-age=${this._config.cacheMaxAge}` : undefined,
        },
        validation: 'crc32c',
      });

      await new Promise((resolve, reject) => {
        stream.on('error', (err) => {
          console.error(`❌ GCS persistent stream error:`, err);
          reject(err);
        });
        stream.on('finish', () => {
          console.log(`✅ GCS persistent upload completed successfully for ${fileName}`);
          resolve(undefined);
        });
        stream.end(buffer);
      });

      // Generate signed URL for private access (valid for 7 days)
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      });
      
      console.log(`🔐 Generated persistent private signed URL (7-day expiry)`);
      return signedUrl;
    } catch (error) {
      console.error(`💥 GCS uploadPersistent failed for ${path}:`, error);
      throw new Error(`Failed to upload persistent file: ${(error as any)?.message || error}`);
    }
  }

  /**
   * Standard file upload (implements IUploadProvider)
   */
  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      const id = makeId(10);
      const extension = mime.extension(file.mimetype) || 'bin';
      const fileName = `${id}.${extension}`;

      const gcsFile = this._bucket.file(fileName);

      // Upload to GCS
      const stream = gcsFile.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          originalName: file.originalname,
          cacheControl: this._config.cacheMaxAge ? `public, max-age=${this._config.cacheMaxAge}` : undefined,
        },
        // Removed 'public: true' - incompatible with uniform bucket-level access
        validation: 'crc32c',
      });

      await new Promise((resolve, reject) => {
        stream.on('error', reject);
        stream.on('finish', resolve);
        stream.end(file.buffer);
      });

      // Generate public URL
      const publicUrl = this._config.publicBaseUrl 
        ? `${this._config.publicBaseUrl}/${fileName}`
        : `https://storage.cloud.google.com/${this._config.bucketName}/${fileName}`;

      return {
        filename: fileName,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer,
        originalname: file.originalname,
        fieldname: file.fieldname,
        path: publicUrl,
        destination: publicUrl,
        encoding: file.encoding,
        stream: file.buffer as any,
        // GCS specific properties
        bucketName: this._config.bucketName,
        isReference: false,
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error}`);
    }
  }

  /**
   * Remove file from GCS (implements IUploadProvider)
   */
  async removeFile(filePath: string): Promise<void> {
    try {
      // Handle both full URLs and file paths
      let fileName = filePath;
      if (filePath.includes('storage.googleapis.com') || filePath.includes('storage.cloud.google.com')) {
        const url = new URL(filePath);
        fileName = url.pathname.split('/').slice(2).join('/'); // Remove /bucket/ prefix
      } else if (this._config.publicBaseUrl && filePath.startsWith(this._config.publicBaseUrl)) {
        fileName = filePath.replace(`${this._config.publicBaseUrl}/`, '');
      } else if (filePath.startsWith('/')) {
        fileName = filePath.substring(1);
      }

      const file = this._bucket.file(fileName);
      const [exists] = await file.exists();
      
      if (exists) {
        await file.delete();
        
        // Clear from caches
        this._metadataCache.delete(fileName);
        // Clear path cache entries that might reference this file
        for (const [key, value] of this._pathCache.entries()) {
          if (value.result.sanitizedPath === fileName) {
            this._pathCache.delete(key);
          }
        }
      }
    } catch (error) {
      // Log error but don't throw for non-existent files
      console.warn(`Failed to remove file ${filePath}: ${error}`);
    }
  }

  /**
   * Check if file exists in GCS
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const metadata = await this.getFileMetadata(filePath);
      return metadata.exists;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file info without downloading
   */
  async getFileInfo(filePath: string, userId?: string): Promise<FileMetadata> {
    if (this._config.allowFileReference) {
      const pathValidation = this.validateFilePath(filePath, userId);
      if (!pathValidation.isValid) {
        throw new Error(`Invalid file path: ${pathValidation.errors?.join(', ')}`);
      }
      filePath = pathValidation.sanitizedPath;
    }

    const metadata = await this.getFileMetadata(filePath);
    if (metadata.exists) {
      // Generate signed URL for secure access
      metadata.signedUrl = await this.generateSignedUrl(filePath);
    }
    
    return metadata;
  }

  /**
   * List files in a directory/prefix
   */
  async listFiles(prefix: string, userId?: string, maxResults = 100): Promise<FileMetadata[]> {
    if (this._config.allowFileReference && userId) {
      const pathValidation = this.validateFilePath(prefix + '/', userId);
      if (!pathValidation.isValid) {
        throw new Error(`Invalid path prefix: ${pathValidation.errors?.join(', ')}`);
      }
      prefix = pathValidation.sanitizedPath.replace(/\/$/, '');
    }

    try {
      const [files] = await this._bucket.getFiles({
        prefix: prefix,
        maxResults: maxResults,
      });

      const fileInfos: FileMetadata[] = [];
      for (const file of files) {
        const [metadata] = await file.getMetadata();
        fileInfos.push({
          name: metadata.name || '',
          size: parseInt(String(metadata.size || '0')),
          contentType: metadata.contentType || 'application/octet-stream',
          lastModified: new Date(metadata.updated || metadata.timeCreated),
          etag: metadata.etag || '',
          exists: true,
        });
      }

      return fileInfos;
    } catch (error) {
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  /**
   * Clear caches manually
   */
  clearCaches(): void {
    this._pathCache.clear();
    this._metadataCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { pathCache: number; metadataCache: number } {
    return {
      pathCache: this._pathCache.size,
      metadataCache: this._metadataCache.size,
    };
  }

  /**
   * Get configuration (excluding sensitive data)
   */
  getConfig(): Partial<GCSConfiguration> {
    const { credentials, keyFilename, ...safeConfig } = this._config;
    return safeConfig;
  }
}

export { GCSStorage };
export default GCSStorage;