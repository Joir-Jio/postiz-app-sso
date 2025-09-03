/**
 * Multi-product SSO DTOs export file
 * Main export file for all SSO-related Data Transfer Objects
 * 
 * @fileoverview Complete DTO collection for SSO API endpoints
 * @version 1.0.0
 */

// Authentication DTOs
export * from './sso-auth.dto';
export * from './sso-media.dto';

// Re-export DTO bundles for convenience
export {
  SsoAuthDtos,
} from './sso-auth.dto';

export {
  SsoMediaDtos,
} from './sso-media.dto';

// Export all individual DTOs for direct imports
export {
  // Authentication DTOs
  SsoLoginInitiateDto,
  SsoLoginResponseDto,
  SsoCallbackDto,
  SsoCallbackResponseDto,
  TokenValidationDto,
  TokenValidationResponseDto,
  TokenRefreshDto,
  TokenRefreshResponseDto,
  SsoLogoutDto,
  SsoLogoutResponseDto,
  UserContextRequestDto,
  UserContextResponseDto,
} from './sso-auth.dto';

export {
  // Media DTOs
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
} from './sso-media.dto';

/**
 * Complete DTO registry for easy access
 */
export const SsoAllDtos = {
  // Authentication
  ...SsoAuthDtos,
  // Media
  ...SsoMediaDtos,
} as const;

/**
 * DTO type mappings for endpoint operations
 */
export interface SsoEndpointDtoMap {
  // Authentication endpoints
  'POST /api/sso/login': {
    request: SsoLoginInitiateDto;
    response: SsoLoginResponseDto;
  };
  'POST /api/sso/callback': {
    request: SsoCallbackDto;
    response: SsoCallbackResponseDto;
  };
  'POST /api/sso/validate': {
    request: TokenValidationDto;
    response: TokenValidationResponseDto;
  };
  'POST /api/sso/refresh': {
    request: TokenRefreshDto;
    response: TokenRefreshResponseDto;
  };
  'POST /api/sso/logout': {
    request: SsoLogoutDto;
    response: SsoLogoutResponseDto;
  };
  'GET /api/sso/user-context': {
    request: UserContextRequestDto;
    response: UserContextResponseDto;
  };
  
  // Media endpoints
  'POST /api/sso/media/access': {
    request: MediaAccessRequestDto;
    response: MediaAccessResponseDto;
  };
  'POST /api/sso/media/upload': {
    request: MediaUploadRequestDto;
    response: MediaUploadResponseDto;
  };
  'POST /api/sso/media/share': {
    request: MediaSharingRequestDto;
    response: MediaSharingResponseDto;
  };
  'GET /api/sso/media/status': {
    request: MediaProcessingStatusDto;
    response: MediaProcessingStatusResponseDto;
  };
  'DELETE /api/sso/media': {
    request: MediaDeletionRequestDto;
    response: MediaDeletionResponseDto;
  };
}

/**
 * Utility type to extract request DTO from endpoint
 */
export type SsoRequestDto<T extends keyof SsoEndpointDtoMap> = SsoEndpointDtoMap[T]['request'];

/**
 * Utility type to extract response DTO from endpoint
 */
export type SsoResponseDto<T extends keyof SsoEndpointDtoMap> = SsoEndpointDtoMap[T]['response'];

/**
 * Generic API response wrapper for all SSO endpoints
 */
export interface SsoApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  metadata?: {
    requestId: string;
    timestamp: Date;
    duration: number;
    version: string;
  };
}