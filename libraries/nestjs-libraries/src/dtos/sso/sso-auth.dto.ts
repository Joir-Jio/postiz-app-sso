/**
 * DTOs for multi-product SSO authentication endpoints
 * Provides comprehensive request/response types following Postiz patterns
 * 
 * @fileoverview SSO authentication DTOs for API endpoints
 * @version 1.0.0
 */

import { 
  IsString, 
  IsEmail, 
  IsOptional, 
  IsArray, 
  IsBoolean, 
  IsEnum,
  IsUUID,
  IsUrl,
  IsObject,
  ValidateNested,
  Length,
  Matches
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsValidProductKey,
  IsValidExternalUserId,
  IsValidJwtToken,
  IsTrustedEmailDomain,
  SanitizeProductKey,
  SanitizeExternalUserId,
  NormalizeEmail,
  SanitizeString,
  RequiredIf,
  ValidateJsonSchema
} from '../../decorators/sso-validation.decorators';
import { TrustDomainScope } from '../../types/sso/core.types';
import { IntegrationType } from '../../types/sso/integration.types';

/**
 * SSO login initiation request DTO
 */
export class SsoLoginInitiateDto {
  @ApiProperty({
    description: 'Product key identifier',
    example: 'video-generation',
    pattern: '^[a-zA-Z][a-zA-Z0-9-]{1,49}$'
  })
  @IsValidProductKey()
  @SanitizeProductKey()
  productKey: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsEmail()
  @NormalizeEmail()
  email: string;

  @ApiProperty({
    description: 'External user ID from the originating product',
    example: 'ext_user_123',
    pattern: '^[a-zA-Z0-9][a-zA-Z0-9_\\-\\.]{0,254}$'
  })
  @IsValidExternalUserId()
  @SanitizeExternalUserId()
  externalUserId: string;

  @ApiPropertyOptional({
    description: 'User display name',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString()
  @SanitizeString()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg'
  })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({
    description: 'Redirect URL after successful authentication',
    example: 'https://video-gen.example.com/auth/callback'
  })
  @IsUrl()
  redirectUrl: string;

  @ApiPropertyOptional({
    description: 'State parameter for CSRF protection',
    example: 'random-state-string'
  })
  @IsOptional()
  @IsString()
  @Length(8, 255)
  state?: string;

  @ApiPropertyOptional({
    description: 'Requested OAuth-like scopes for trust domain',
    example: ['sso:login', 'user:read', 'media:access'],
    enum: TrustDomainScope,
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsEnum(TrustDomainScope, { each: true })
  scopes?: TrustDomainScope[];

  @ApiPropertyOptional({
    description: 'Additional user metadata',
    example: { plan: 'premium', lastLogin: '2025-01-01T00:00:00Z' }
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Auto-create user if they do not exist',
    example: true,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  autoCreateUser?: boolean = true;

  @ApiPropertyOptional({
    description: 'Organization name for auto-creation',
    example: 'Acme Corp'
  })
  @IsOptional()
  @IsString()
  @SanitizeString()
  @RequiredIf('autoCreateUser', true)
  @Length(1, 255)
  organizationName?: string;
}

/**
 * SSO login response DTO
 */
export class SsoLoginResponseDto {
  @ApiProperty({
    description: 'Whether the login was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Authentication URL to redirect user to',
    example: 'https://postiz.com/auth/sso/video-generation?token=...'
  })
  authUrl: string;

  @ApiProperty({
    description: 'Temporary authentication token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  temporaryToken: string;

  @ApiProperty({
    description: 'Challenge string for security',
    example: 'challenge_abc123'
  })
  challenge: string;

  @ApiProperty({
    description: 'Token expiration timestamp',
    example: '2025-01-01T01:00:00Z'
  })
  expiresAt: Date;

  @ApiPropertyOptional({
    description: 'State parameter passed back',
    example: 'random-state-string'
  })
  state?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { sessionId: 'sess_123', newUser: false }
  })
  metadata?: Record<string, unknown>;
}

/**
 * SSO callback/complete request DTO
 */
export class SsoCallbackDto {
  @ApiProperty({
    description: 'Temporary authentication token from login initiation',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsValidJwtToken()
  temporaryToken: string;

  @ApiProperty({
    description: 'Challenge response',
    example: 'challenge_response_xyz789'
  })
  @IsString()
  @Length(8, 255)
  challenge: string;

  @ApiPropertyOptional({
    description: 'State parameter for CSRF validation',
    example: 'random-state-string'
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'Authorization code from OAuth flow',
    example: 'auth_code_123'
  })
  @IsOptional()
  @IsString()
  code?: string;
}

/**
 * SSO callback success response DTO
 */
export class SsoCallbackResponseDto {
  @ApiProperty({
    description: 'Whether the callback was successful',
    example: true
  })
  success: boolean;

  @ApiProperty({
    description: 'Access token for API calls',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken: string;

  @ApiPropertyOptional({
    description: 'Refresh token for token renewal',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'Token expiration in seconds',
    example: 3600
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    default: 'Bearer'
  })
  tokenType: string = 'Bearer';

  @ApiProperty({
    description: 'User information',
    type: 'object'
  })
  user: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    externalUserId: string;
  };

  @ApiProperty({
    description: 'Organization information',
    type: 'object'
  })
  organization: {
    id: string;
    name: string;
  };

  @ApiProperty({
    description: 'Final redirect URL',
    example: 'https://video-gen.example.com/dashboard'
  })
  redirectUrl: string;

  @ApiProperty({
    description: 'Whether this was the user\'s first login',
    example: false
  })
  firstLogin: boolean;

  @ApiPropertyOptional({
    description: 'Granted scopes',
    example: ['sso:login', 'user:read'],
    isArray: true
  })
  scopes?: string[];

  @ApiPropertyOptional({
    description: 'Session metadata',
    example: { sessionId: 'sess_123', dataAccessLevel: 'full' }
  })
  metadata?: Record<string, unknown>;
}

/**
 * Token validation request DTO
 */
export class TokenValidationDto {
  @ApiProperty({
    description: 'JWT token to validate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsValidJwtToken()
  token: string;

  @ApiPropertyOptional({
    description: 'Expected product key for audience validation',
    example: 'video-generation'
  })
  @IsOptional()
  @IsValidProductKey()
  expectedProduct?: string;

  @ApiPropertyOptional({
    description: 'Expected token type',
    example: 'sso:access'
  })
  @IsOptional()
  @IsString()
  expectedType?: string;
}

/**
 * Token validation response DTO
 */
export class TokenValidationResponseDto {
  @ApiProperty({
    description: 'Whether the token is valid',
    example: true
  })
  valid: boolean;

  @ApiPropertyOptional({
    description: 'Token payload if valid',
    type: 'object'
  })
  payload?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Error message if invalid',
    example: 'Token expired'
  })
  error?: string;

  @ApiProperty({
    description: 'Whether the token is expired',
    example: false
  })
  expired: boolean;

  @ApiProperty({
    description: 'Whether the token is not yet active',
    example: false
  })
  notBefore: boolean;

  @ApiPropertyOptional({
    description: 'Token expiration timestamp',
    example: '2025-01-01T01:00:00Z'
  })
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'User context if token is valid',
    type: 'object'
  })
  userContext?: {
    userId: string;
    organizationId: string;
    externalUserId: string;
    email: string;
    scopes: string[];
  };
}

/**
 * Token refresh request DTO
 */
export class TokenRefreshDto {
  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsValidJwtToken()
  refreshToken: string;

  @ApiPropertyOptional({
    description: 'Product key for context',
    example: 'video-generation'
  })
  @IsOptional()
  @IsValidProductKey()
  productKey?: string;
}

/**
 * Token refresh response DTO
 */
export class TokenRefreshResponseDto {
  @ApiProperty({
    description: 'Whether the refresh was successful',
    example: true
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'New access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  accessToken?: string;

  @ApiPropertyOptional({
    description: 'New refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  refreshToken?: string;

  @ApiProperty({
    description: 'Token expiration in seconds',
    example: 3600
  })
  expiresIn: number;

  @ApiProperty({
    description: 'Token type',
    example: 'Bearer',
    default: 'Bearer'
  })
  tokenType: string = 'Bearer';

  @ApiPropertyOptional({
    description: 'Error message if unsuccessful',
    example: 'Invalid refresh token'
  })
  error?: string;
}

/**
 * SSO logout request DTO
 */
export class SsoLogoutDto {
  @ApiProperty({
    description: 'Access token to invalidate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsValidJwtToken()
  accessToken: string;

  @ApiPropertyOptional({
    description: 'Refresh token to invalidate',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsOptional()
  @IsValidJwtToken()
  refreshToken?: string;

  @ApiPropertyOptional({
    description: 'Post-logout redirect URL',
    example: 'https://video-gen.example.com/goodbye'
  })
  @IsOptional()
  @IsUrl()
  redirectUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether to logout from all products',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  logoutEverywhere?: boolean = false;
}

/**
 * SSO logout response DTO
 */
export class SsoLogoutResponseDto {
  @ApiProperty({
    description: 'Whether the logout was successful',
    example: true
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'Redirect URL after logout',
    example: 'https://video-gen.example.com/goodbye'
  })
  redirectUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional logout URLs for cross-product logout',
    example: ['https://shopify-app.example.com/logout', 'https://analytics.example.com/logout'],
    isArray: true
  })
  additionalLogoutUrls?: string[];

  @ApiPropertyOptional({
    description: 'Logout metadata',
    example: { sessionId: 'sess_123', duration: 3600 }
  })
  metadata?: Record<string, unknown>;
}

/**
 * User context request DTO for cross-product sharing
 */
export class UserContextRequestDto {
  @ApiProperty({
    description: 'Product key requesting the context',
    example: 'video-generation'
  })
  @IsValidProductKey()
  @SanitizeProductKey()
  productKey: string;

  @ApiProperty({
    description: 'User ID in Postiz system',
    example: 'user_123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({
    description: 'Specific data types to include',
    example: ['profile', 'integrations', 'media'],
    isArray: true
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includes?: string[];

  @ApiPropertyOptional({
    description: 'Permission level for data access',
    example: 'read',
    enum: ['read', 'write', 'admin']
  })
  @IsOptional()
  @IsEnum(['read', 'write', 'admin'])
  permissionLevel?: 'read' | 'write' | 'admin' = 'read';
}

/**
 * User context response DTO
 */
export class UserContextResponseDto {
  @ApiProperty({
    description: 'Whether the request was successful',
    example: true
  })
  success: boolean;

  @ApiPropertyOptional({
    description: 'User profile data',
    type: 'object'
  })
  profile?: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    preferences: Record<string, unknown>;
    metadata: Record<string, unknown>;
  };

  @ApiPropertyOptional({
    description: 'Organization data',
    type: 'object'
  })
  organization?: {
    id: string;
    name: string;
    settings: Record<string, unknown>;
  };

  @ApiPropertyOptional({
    description: 'Connected social integrations',
    type: 'array'
  })
  integrations?: Array<{
    platform: string;
    connected: boolean;
    username?: string;
    permissions?: string[];
  }>;

  @ApiPropertyOptional({
    description: 'Available media files',
    type: 'array'
  })
  media?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    thumbnail?: string;
  }>;

  @ApiPropertyOptional({
    description: 'Permission level granted',
    example: 'read'
  })
  permissionLevel?: string;

  @ApiPropertyOptional({
    description: 'Context expiration time',
    example: '2025-01-01T01:00:00Z'
  })
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Error message if unsuccessful',
    example: 'Insufficient permissions'
  })
  error?: string;
}

/**
 * Export all SSO auth DTOs
 */
export const SsoAuthDtos = {
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
} as const;