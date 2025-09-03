import 'multer';
import { IExtendedUploadProvider } from './upload.interface';
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
    allowFileReference?: boolean;
    allowedPathPatterns?: string[];
    maxFileSize?: number;
    signedUrlExpiry?: number;
    enableCaching?: boolean;
    cacheMaxAge?: number;
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
declare class GCSStorage implements IExtendedUploadProvider {
    private _storage;
    private _bucket;
    private _config;
    private _pathCache;
    private _metadataCache;
    private readonly PATH_CACHE_TTL;
    private readonly METADATA_CACHE_TTL;
    constructor(config: GCSConfiguration);
    private validateFilePath;
    private cachePathResult;
    private getFileMetadata;
    private generateSignedUrl;
    referenceFile(options: FileReferenceOptions): Promise<any>;
    uploadSimple(path: string): Promise<string>;
    uploadFile(file: Express.Multer.File): Promise<any>;
    removeFile(filePath: string): Promise<void>;
    fileExists(filePath: string): Promise<boolean>;
    getFileInfo(filePath: string, userId?: string): Promise<FileMetadata>;
    listFiles(prefix: string, userId?: string, maxResults?: number): Promise<FileMetadata[]>;
    clearCaches(): void;
    getCacheStats(): {
        pathCache: number;
        metadataCache: number;
    };
    getConfig(): Partial<GCSConfiguration>;
}
export { GCSStorage };
export default GCSStorage;
