export interface IUploadProvider {
  uploadSimple(path: string): Promise<string>;
  uploadFile(file: Express.Multer.File): Promise<any>;
  removeFile(filePath: string): Promise<void>;
  // Upload for persistent storage (like avatars) - optional for compatibility
  uploadPersistent?(path: string, bucketName?: string): Promise<string>;
}

// Extended interface for providers that support file referencing (like GCS)
export interface IExtendedUploadProvider extends IUploadProvider {
  // Reference existing files without uploading
  referenceFile?(options: {
    filePath: string;
    userId?: string;
    validatePath?: boolean;
    generateThumbnail?: boolean;
    skipSizeCheck?: boolean;
  }): Promise<any>;

  // Check if file exists
  fileExists?(filePath: string): Promise<boolean>;

  // Get file metadata without downloading
  getFileInfo?(filePath: string, userId?: string): Promise<{
    name: string;
    size: number;
    contentType: string;
    lastModified: Date;
    etag: string;
    exists: boolean;
    signedUrl?: string;
    thumbnailUrl?: string;
  }>;

  // List files in directory/prefix
  listFiles?(prefix: string, userId?: string, maxResults?: number): Promise<{
    name: string;
    size: number;
    contentType: string;
    lastModified: Date;
    etag: string;
    exists: boolean;
  }[]>;

  // Clear provider caches
  clearCaches?(): void;

  // Get provider configuration (safe)
  getConfig?(): any;
}
