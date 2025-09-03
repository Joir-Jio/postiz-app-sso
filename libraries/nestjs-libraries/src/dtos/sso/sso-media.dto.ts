/**
 * DTOs for multi-product SSO media operations
 * Handles GCS file access and media sharing between products
 * 
 * @fileoverview SSO media management DTOs for API endpoints
 * @version 1.0.0
 */

import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsBoolean, 
  IsEnum,
  IsUUID,
  IsUrl,
  IsInt,
  IsNumber,
  Min,
  Max,
  Length,
  ValidateNested,
  IsObject,
  IsDateString,
  ArrayMinSize
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsValidProductKey,
  IsValidGcsPath,
  IsValidMediaType,
  SanitizeProductKey,
  ValidateJsonSchema
} from '../../decorators/sso-validation.decorators';

/**
 * Media access request DTO
 */
export class MediaAccessRequestDto {
  @ApiProperty({
    description: 'Product key requesting media access',
    example: 'video-generation'
  })
  @IsValidProductKey()
  @SanitizeProductKey()
  productKey: string;

  @ApiProperty({
    description: 'Media reference IDs to access',
    example: ['media_123e4567-e89b-12d3-a456-426614174000'],
    isArray: true
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  mediaIds: string[];

  @ApiProperty({
    description: 'Access level required',
    example: 'read',
    enum: ['read', 'write', 'delete']
  })
  @IsEnum(['read', 'write', 'delete'])
  accessLevel: 'read' | 'write' | 'delete' = 'read';

  @ApiPropertyOptional({
    description: 'Token expiry in seconds',
    example: 3600,
    minimum: 300,
    maximum: 86400
  })
  @IsOptional()
  @IsInt()
  @Min(300)  // 5 minutes minimum
  @Max(86400) // 24 hours maximum
  expiresIn?: number = 3600;

  @ApiPropertyOptional({
    description: 'Whether to include thumbnail URLs',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  includeThumbnails?: boolean = true;

  @ApiPropertyOptional({
    description: 'Additional metadata to include',
    example: { includeProcessingStatus: true, includeAnalytics: false }
  })
  @IsOptional()
  @IsObject()
  options?: Record<string, unknown>;
}

/**
 * Media access response DTO
 */
export class MediaAccessResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Media access token for GCS operations',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: '2025-01-01T01:00:00Z'
  })
  expiresAt: Date;

  @ApiProperty({
    description: 'Media files with access URLs',
    type: 'array'
  })
  media: Array<{
    id: string;
    externalMediaId: string;
    name: string;
    type: string;
    size: number;
    mimeType: string;
    width?: number;
    height?: number;
    duration?: number;
    url: string;
    thumbnailUrl?: string;
    gcsPath: string;
    metadata: Record<string, unknown>;
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  }>;

  @ApiProperty({
    description: 'GCS bucket access details',
    type: 'object'
  })
  bucketAccess: {
    bucketName: string;
    basePath: string;
    permissions: string[];
  };

  @ApiPropertyOptional({
    description: 'Storage quota information',
    type: 'object'
  })
  quota?: {
    used: number;
    limit: number;
    percentage: number;
    unit: 'bytes' | 'mb' | 'gb';
  };

  @ApiPropertyOptional({
    description: 'Error message if unsuccessful',
    example: 'Media not found'
  })
  error?: string;
}

/**
 * Media upload request DTO
 */
export class MediaUploadRequestDto {
  @ApiProperty({
    description: 'Product key uploading media',
    example: 'video-generation'
  })
  @IsValidProductKey()
  @SanitizeProductKey()
  productKey: string;

  @ApiProperty({
    description: 'External media ID from source product',
    example: 'ext_media_abc123'
  })
  @IsString()
  @Length(1, 255)
  externalMediaId: string;

  @ApiProperty({
    description: 'Media file name',
    example: 'generated-video.mp4'
  })
  @IsString()
  @Length(1, 255)
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the media file',
    example: 'video/mp4'
  })
  @IsValidMediaType()
  mimeType: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 10485760,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  fileSize: number;

  @ApiPropertyOptional({
    description: 'Media width in pixels (for images/videos)',
    example: 1920,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  width?: number;

  @ApiPropertyOptional({
    description: 'Media height in pixels (for images/videos)',
    example: 1080,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  height?: number;

  @ApiPropertyOptional({
    description: 'Duration in seconds (for videos/audio)',
    example: 120.5,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({
    description: 'Original URL of the media file',
    example: 'https://source-product.com/media/file.mp4'
  })
  @IsOptional()
  @IsUrl()
  originalUrl?: string;

  @ApiProperty({
    description: 'Desired GCS path for the file',
    example: 'video-generation/2025/01/generated-video.mp4'
  })
  @IsValidGcsPath()
  gcsPath: string;

  @ApiPropertyOptional({
    description: 'Whether the file should be publicly accessible',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean = false;

  @ApiPropertyOptional({
    description: 'Additional media metadata',
    example: { 
      tags: ['generated', 'ai'], 
      project: 'campaign-2025',
      quality: 'high'
    }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Processing options for the media',
    type: 'object'
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  processingOptions?: {
    generateThumbnail?: boolean;
    thumbnailTimestamp?: number; // For videos
    optimizeForWeb?: boolean;
    extractMetadata?: boolean;
  };
}

/**
 * Media upload response DTO
 */
export class MediaUploadResponseDto {
  @ApiProperty({
    description: 'Whether the upload initiation was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Media reference ID in Postiz',
    example: 'media_123e4567-e89b-12d3-a456-426614174000'
  })
  mediaId: string;

  @ApiProperty({
    description: 'Signed upload URL for direct GCS upload',
    example: 'https://storage.googleapis.com/bucket/path?X-Goog-Signature=...'
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'Upload expiration timestamp',
    example: '2025-01-01T01:00:00Z'
  })
  uploadExpiresAt: Date;

  @ApiProperty({
    description: 'GCS path where file will be stored',
    example: 'video-generation/2025/01/generated-video.mp4'
  })
  gcsPath: string;

  @ApiPropertyOptional({
    description: 'Required headers for the upload request',
    example: { 'Content-Type': 'video/mp4', 'Cache-Control': 'no-cache' }
  })
  uploadHeaders?: Record<string, string>;

  @ApiPropertyOptional({
    description: 'Processing job ID if processing is enabled',
    example: 'job_abc123'
  })
  processingJobId?: string;

  @ApiPropertyOptional({
    description: 'Webhook URL for upload completion notification',
    example: 'https://postiz.com/api/webhooks/media/upload-complete'
  })
  webhookUrl?: string;

  @ApiPropertyOptional({
    description: 'Error message if unsuccessful',
    example: 'Insufficient storage quota'
  })
  error?: string;
}

/**
 * Media sharing request DTO
 */
export class MediaSharingRequestDto {
  @ApiProperty({
    description: 'Source product key',
    example: 'video-generation'
  })
  @IsValidProductKey()
  @SanitizeProductKey()
  sourceProduct: string;

  @ApiProperty({
    description: 'Target product key',
    example: 'analytics'
  })
  @IsValidProductKey()
  @SanitizeProductKey()
  targetProduct: string;

  @ApiProperty({
    description: 'Media IDs to share',
    example: ['media_123', 'media_456'],
    isArray: true
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  mediaIds: string[];

  @ApiProperty({
    description: 'Sharing permission level',
    example: 'read',
    enum: ['read', 'write', 'copy']
  })
  @IsEnum(['read', 'write', 'copy'])
  permissionLevel: 'read' | 'write' | 'copy';

  @ApiPropertyOptional({
    description: 'Share expiration in hours',
    example: 24,
    minimum: 1,
    maximum: 8760 // 1 year
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(8760)
  expiresInHours?: number = 24;

  @ApiPropertyOptional({
    description: 'Notify target product of the share',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  notifyTarget?: boolean = true;

  @ApiPropertyOptional({
    description: 'Additional sharing context',
    example: { reason: 'Analytics integration', campaign: 'Q1-2025' }
  })
  @IsOptional()
  @IsObject()
  context?: Record<string, unknown>;
}

/**
 * Media sharing response DTO
 */
export class MediaSharingResponseDto {
  @ApiProperty({
    description: 'Whether the sharing was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Share token for accessing shared media',
    example: 'share_token_xyz789'
  })
  shareToken: string;

  @ApiProperty({
    description: 'Access URLs for shared media',
    type: 'array'
  })
  sharedMedia: Array<{
    mediaId: string;
    accessUrl: string;
    thumbnailUrl?: string;
    permissionLevel: string;
  }>;

  @ApiProperty({
    description: 'Share expiration timestamp',
    example: '2025-01-02T00:00:00Z'
  })
  expiresAt: Date;

  @ApiPropertyOptional({
    description: 'Notification status',
    type: 'object'
  })
  notification?: {
    sent: boolean;
    method: 'webhook' | 'email';
    timestamp: Date;
  };

  @ApiPropertyOptional({
    description: 'Error message if unsuccessful',
    example: 'Target product not found'
  })
  error?: string;
}

/**
 * Media processing status request DTO
 */
export class MediaProcessingStatusDto {
  @ApiProperty({
    description: 'Processing job ID',
    example: 'job_abc123'
  })
  @IsString()
  @Length(1, 255)
  jobId: string;

  @ApiPropertyOptional({
    description: 'Product key for context',
    example: 'video-generation'
  })
  @IsOptional()
  @IsValidProductKey()
  productKey?: string;
}

/**
 * Media processing status response DTO
 */
export class MediaProcessingStatusResponseDto {
  @ApiProperty({
    description: 'Processing job status',
    example: 'processing',
    enum: ['pending', 'processing', 'completed', 'failed']
  })
  status: 'pending' | 'processing' | 'completed' | 'failed';

  @ApiProperty({
    description: 'Processing progress percentage',
    example: 75,
    minimum: 0,
    maximum: 100
  })
  progress: number;

  @ApiPropertyOptional({
    description: 'Estimated completion timestamp',
    example: '2025-01-01T01:30:00Z'
  })
  estimatedCompletion?: Date;

  @ApiPropertyOptional({
    description: 'Processing results if completed',
    type: 'object'
  })
  results?: {
    thumbnailGenerated: boolean;
    metadataExtracted: boolean;
    optimizedForWeb: boolean;
    thumbnailUrl?: string;
    extractedMetadata?: Record<string, unknown>;
  };

  @ApiPropertyOptional({
    description: 'Error details if failed',
    type: 'object'
  })
  error?: {
    code: string;
    message: string;
    details: Record<string, unknown>;
  };

  @ApiProperty({
    description: 'Processing timestamps',
    type: 'object'
  })
  timestamps: {
    started: Date;
    lastUpdated: Date;
    completed?: Date;
  };
}

/**
 * Media deletion request DTO
 */
export class MediaDeletionRequestDto {
  @ApiProperty({
    description: 'Product key requesting deletion',
    example: 'video-generation'
  })
  @IsValidProductKey()
  @SanitizeProductKey()
  productKey: string;

  @ApiProperty({
    description: 'Media IDs to delete',
    example: ['media_123', 'media_456'],
    isArray: true
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID(undefined, { each: true })
  mediaIds: string[];

  @ApiPropertyOptional({
    description: 'Whether to delete from GCS (permanent)',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  permanentDelete?: boolean = false;

  @ApiPropertyOptional({
    description: 'Reason for deletion',
    example: 'Content no longer needed'
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  reason?: string;
}

/**
 * Media deletion response DTO
 */
export class MediaDeletionResponseDto {
  @ApiProperty({
    description: 'Whether the deletion was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Deletion results per media ID',
    type: 'array'
  })
  results: Array<{
    mediaId: string;
    deleted: boolean;
    error?: string;
    gcsDeleted: boolean;
    thumbnailDeleted: boolean;
  }>;

  @ApiProperty({
    description: 'Summary of deletion operation',
    type: 'object'
  })
  summary: {
    total: number;
    successful: number;
    failed: number;
    bytesFreed: number;
  };

  @ApiPropertyOptional({
    description: 'Overall error message if applicable',
    example: 'Some files could not be deleted'
  })
  error?: string;
}

/**
 * Export all SSO media DTOs
 */
export const SsoMediaDtos = {
  MediaAccessRequestDto,
  MediaAccessResponseDto,
  MediaUploadRequestDto,
  MediaUploadResponseDto,
  MediaSharingRequestDto,
  MediaSharingResponseDto,
  MediaProcessingStatusDto,
  MediaProcessingStatusResponseDto,
  MediaDeletionRequestDto,
  MediaDeletionResponseDto,
} as const;

// Export MediaAccessRequestDto as alias for compatibility
export { MediaAccessRequestDto as SsoMediaDto };

// Media reference DTO for compatibility
export class MediaReferenceDto {
  @ApiProperty({ description: 'Media reference ID' })
  id: string;

  @ApiProperty({ description: 'External media ID' })
  externalMediaId: string;

  @ApiProperty({ description: 'Product key' })
  productKey: string;

  @ApiProperty({ description: 'GCS path' })
  gcsPath: string;

  @ApiProperty({ description: 'Media metadata' })
  metadata: Record<string, unknown>;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}