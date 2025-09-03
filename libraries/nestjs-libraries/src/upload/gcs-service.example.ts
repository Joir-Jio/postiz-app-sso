import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UploadFactory } from './upload.factory';
import { GCSStorage } from './gcs.storage';
import { IExtendedUploadProvider } from './upload.interface';
import { GCSUtils } from './gcs.utils';

/**
 * Example service demonstrating GCS integration with Postiz
 * This service shows how to implement file upload and reference operations
 * with proper error handling and security validation
 */
@Injectable()
export class GCSFileService {
  private readonly storage: IExtendedUploadProvider;

  constructor() {
    this.storage = UploadFactory.createStorage();
    
    // Validate that we're using GCS storage for extended features
    if (!(this.storage instanceof GCSStorage)) {
      console.warn('GCS-specific features are only available when STORAGE_PROVIDER=gcs');
    }
  }

  /**
   * Upload a new file to GCS
   */
  async uploadFile(file: Express.Multer.File, userId?: string): Promise<{
    id: string;
    filename: string;
    url: string;
    size: number;
    contentType: string;
    uploadedAt: Date;
  }> {
    try {
      // Validate file
      this.validateFile(file);

      // Upload file
      const result = await this.storage.uploadFile(file);

      return {
        id: result.filename,
        filename: result.originalname,
        url: result.path,
        size: result.size,
        contentType: result.mimetype,
        uploadedAt: new Date(),
      };
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  /**
   * Reference an existing file in GCS without uploading
   * This is the key feature for the SSO system integration
   */
  async referenceFile(filePath: string, userId: string): Promise<{
    id: string;
    filename: string;
    url: string;
    size: number;
    contentType: string;
    isReference: boolean;
    gcsPath: string;
    expiresAt: Date;
  }> {
    if (!(this.storage instanceof GCSStorage)) {
      throw new BadRequestException('File referencing is only available with GCS storage');
    }

    try {
      // Reference the file
      const result = await this.storage.referenceFile({
        filePath,
        userId,
        validatePath: true,
      });

      // Calculate expiry time (from signed URL expiry)
      const config = this.storage.getConfig();
      const expiresAt = new Date(Date.now() + (config.signedUrlExpiry! * 1000));

      return {
        id: result.filename,
        filename: result.originalname,
        url: result.path,
        size: result.size,
        contentType: result.mimetype,
        isReference: true,
        gcsPath: result.gcsPath,
        expiresAt,
      };
    } catch (error) {
      if (error.message.includes('File does not exist')) {
        throw new NotFoundException(`File not found: ${filePath}`);
      }
      if (error.message.includes('Invalid file path')) {
        throw new ForbiddenException(`Access denied to file path: ${filePath}`);
      }
      throw new BadRequestException(`File reference failed: ${error.message}`);
    }
  }

  /**
   * Get file information without downloading
   */
  async getFileInfo(filePath: string, userId: string): Promise<{
    name: string;
    size: number;
    contentType: string;
    lastModified: Date;
    exists: boolean;
    accessUrl?: string;
  }> {
    if (!(this.storage instanceof GCSStorage)) {
      throw new BadRequestException('File info is only available with GCS storage');
    }

    try {
      const metadata = await this.storage.getFileInfo(filePath, userId);

      return {
        name: metadata.name,
        size: metadata.size,
        contentType: metadata.contentType,
        lastModified: metadata.lastModified,
        exists: metadata.exists,
        accessUrl: metadata.signedUrl,
      };
    } catch (error) {
      if (error.message.includes('Invalid file path')) {
        throw new ForbiddenException(`Access denied to file path: ${filePath}`);
      }
      throw new BadRequestException(`Failed to get file info: ${error.message}`);
    }
  }

  /**
   * List user's files
   */
  async listUserFiles(userId: string, prefix?: string, maxResults = 50): Promise<Array<{
    name: string;
    size: string; // Formatted size
    contentType: string;
    lastModified: Date;
  }>> {
    if (!(this.storage instanceof GCSStorage)) {
      throw new BadRequestException('File listing is only available with GCS storage');
    }

    try {
      // Construct user-specific prefix
      const userPrefix = prefix ? `${prefix}/${userId}` : `user-bucket/${userId}`;
      
      const files = await this.storage.listFiles(userPrefix, userId, maxResults);

      return files.map(file => ({
        name: file.name,
        size: GCSUtils.formatBytes(file.size),
        contentType: file.contentType,
        lastModified: file.lastModified,
      }));
    } catch (error) {
      throw new BadRequestException(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string, userId?: string): Promise<void> {
    // For GCS, validate user has permission to delete this file
    if (this.storage instanceof GCSStorage && userId) {
      try {
        // Validate user has access to this path
        await this.storage.getFileInfo(filePath, userId);
      } catch (error) {
        if (error.message.includes('Invalid file path')) {
          throw new ForbiddenException(`Access denied to delete file: ${filePath}`);
        }
      }
    }

    try {
      await this.storage.removeFile(filePath);
    } catch (error) {
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  /**
   * Batch reference multiple files (useful for SSO scenarios)
   */
  async referenceMultipleFiles(
    files: Array<{ path: string; userId: string }>,
    maxConcurrency = 5
  ): Promise<Array<{
    path: string;
    success: boolean;
    result?: any;
    error?: string;
  }>> {
    if (!(this.storage instanceof GCSStorage)) {
      throw new BadRequestException('Batch file referencing is only available with GCS storage');
    }

    // Process files in batches to avoid overwhelming the GCS API
    const results: Array<{
      path: string;
      success: boolean;
      result?: any;
      error?: string;
    }> = [];

    // Split into chunks for concurrent processing
    for (let i = 0; i < files.length; i += maxConcurrency) {
      const chunk = files.slice(i, i + maxConcurrency);
      
      const chunkResults = await Promise.allSettled(
        chunk.map(async ({ path, userId }) => {
          try {
            const result = await this.referenceFile(path, userId);
            return { path, success: true, result };
          } catch (error) {
            return { path, success: false, error: error.message };
          }
        })
      );

      results.push(...chunkResults.map(result => 
        result.status === 'fulfilled' ? result.value : {
          path: 'unknown',
          success: false,
          error: result.reason?.message || 'Unknown error'
        }
      ));
    }

    return results;
  }

  /**
   * Get storage statistics and health info
   */
  async getStorageStats(): Promise<{
    provider: string;
    cacheStats?: any;
    config?: any;
    healthy: boolean;
  }> {
    const stats: any = {
      provider: process.env.STORAGE_PROVIDER || 'unknown',
      healthy: false,
    };

    try {
      // Test basic functionality
      const testResult = await this.storage.uploadSimple('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
      
      if (testResult) {
        stats.healthy = true;
        
        // Clean up test file
        try {
          await this.storage.removeFile(testResult);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    } catch (error) {
      stats.error = error.message;
    }

    // Get GCS-specific stats
    if (this.storage instanceof GCSStorage) {
      stats.cacheStats = this.storage.getCacheStats();
      stats.config = this.storage.getConfig();
    }

    return stats;
  }

  /**
   * Clear all caches (useful for debugging)
   */
  async clearCaches(): Promise<void> {
    if (this.storage instanceof GCSStorage) {
      this.storage.clearCaches();
    }
  }

  /**
   * Validate uploaded file
   */
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Empty file');
    }

    // Check file size (example: 500MB limit)
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(`File too large. Maximum size: ${GCSUtils.formatBytes(maxSize)}`);
    }

    // Check file type (example: only allow common media types)
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'audio/mp3',
      'audio/wav',
      'application/pdf',
    ];

    if (!GCSUtils.isSupportedFileType(file.mimetype, allowedTypes)) {
      throw new BadRequestException(`File type not allowed: ${file.mimetype}`);
    }
  }
}

/**
 * Example controller showing how to use the GCS file service
 */
import { Controller, Post, Get, Delete, Param, Query, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('gcs-files')
export class GCSFilesController {
  constructor(private readonly fileService: GCSFileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('userId') userId?: string
  ) {
    return await this.fileService.uploadFile(file, userId);
  }

  @Post('reference')
  async referenceFile(@Body() body: { filePath: string; userId: string }) {
    return await this.fileService.referenceFile(body.filePath, body.userId);
  }

  @Post('reference-batch')
  async referenceBatch(@Body() body: { files: Array<{ path: string; userId: string }> }) {
    return await this.fileService.referenceMultipleFiles(body.files);
  }

  @Get('info')
  async getFileInfo(@Query('path') filePath: string, @Query('userId') userId: string) {
    return await this.fileService.getFileInfo(filePath, userId);
  }

  @Get('list/:userId')
  async listUserFiles(
    @Param('userId') userId: string,
    @Query('prefix') prefix?: string,
    @Query('limit') limit?: number
  ) {
    return await this.fileService.listUserFiles(userId, prefix, limit);
  }

  @Delete()
  async deleteFile(@Query('path') filePath: string, @Query('userId') userId?: string) {
    await this.fileService.deleteFile(filePath, userId);
    return { success: true };
  }

  @Get('stats')
  async getStorageStats() {
    return await this.fileService.getStorageStats();
  }

  @Post('clear-cache')
  async clearCaches() {
    await this.fileService.clearCaches();
    return { success: true };
  }
}

// Example usage in your application module
import { Module } from '@nestjs/common';

@Module({
  controllers: [GCSFilesController],
  providers: [GCSFileService],
  exports: [GCSFileService],
})
export class GCSFilesModule {}

/**
 * Example integration with external SSO system
 */
@Injectable()
export class SSOFileIntegrationService {
  constructor(private readonly fileService: GCSFileService) {}

  /**
   * Handle file references from external SSO products
   */
  async handleSSOFileReference(ssoPayload: {
    userId: string;
    productId: string;
    files: string[];
  }) {
    try {
      // Map external file paths to internal format
      const fileMappings = ssoPayload.files.map(filePath => ({
        path: this.mapExternalPathToGCS(filePath, ssoPayload.productId),
        userId: ssoPayload.userId,
      }));

      // Reference all files in batch
      const results = await this.fileService.referenceMultipleFiles(fileMappings);

      // Return successful references
      const successfulReferences = results
        .filter(result => result.success)
        .map(result => result.result);

      return {
        success: true,
        referencedFiles: successfulReferences,
        errors: results.filter(result => !result.success),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Map external product file paths to GCS paths
   */
  private mapExternalPathToGCS(externalPath: string, productId: string): string {
    // Example mapping for different external systems
    switch (productId) {
      case 'hyperhusk':
        // hyperhusk01-result-bucket/K7mN9pQx2R-DEV/1/video.mp4
        return externalPath;
      
      case 'media-processor':
        // Convert media-processor paths to standard format
        return `media-bucket/${externalPath}`;
      
      default:
        // Default mapping
        return `${productId}-bucket/${externalPath}`;
    }
  }
}