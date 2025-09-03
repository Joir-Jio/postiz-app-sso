/**
 * JWT payload structures and types for trust domain authentication
 * Provides comprehensive typing for multi-product SSO token handling
 * 
 * @fileoverview JWT token types for secure cross-product authentication
 * @version 1.0.0
 */

import { z } from 'zod';
import { TrustDomainScope } from './core.types';

/**
 * JWT token types for different authentication flows
 */
export enum JwtTokenType {
  SSO_ACCESS = 'sso:access',
  SSO_REFRESH = 'sso:refresh',
  TRUST_DOMAIN = 'trust:domain',
  PRODUCT_SESSION = 'product:session',
  MEDIA_ACCESS = 'media:access',
  TEMPORARY_AUTH = 'temp:auth',
}

/**
 * JWT algorithm types supported
 */
export enum JwtAlgorithm {
  HS256 = 'HS256',
  HS384 = 'HS384',
  HS512 = 'HS512',
  RS256 = 'RS256',
  RS384 = 'RS384',
  RS512 = 'RS512',
}

/**
 * Base JWT payload interface following RFC 7519
 */
export interface BaseJwtPayload {
  readonly iss: string; // Issuer (Postiz domain)
  readonly sub: string; // Subject (user ID)
  readonly aud: string | string[]; // Audience (product or array of products)
  readonly exp: number; // Expiration time (Unix timestamp)
  readonly iat: number; // Issued at (Unix timestamp)
  readonly nbf?: number; // Not before (Unix timestamp)
  readonly jti: string; // JWT ID (unique token identifier)
}

/**
 * Extended payload for SSO trust domain authentication
 */
export interface SsoTrustPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.TRUST_DOMAIN;
  readonly scopes: TrustDomainScope[];
  readonly productKey: string;
  readonly organizationId: string;
  readonly externalUserId: string;
  readonly sessionId: string;
  readonly permissions: Record<string, boolean>;
  readonly metadata: Record<string, unknown>;
}

/**
 * Payload for product-specific session tokens
 */
export interface ProductSessionPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.PRODUCT_SESSION;
  readonly productKey: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly externalUserId: string;
  readonly sessionId: string;
  readonly dataAccessLevel: string;
  readonly lastActivity: number;
  readonly refreshToken?: string;
}

/**
 * Payload for temporary authentication during SSO flow
 */
export interface TemporaryAuthPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.TEMPORARY_AUTH;
  readonly productKey: string;
  readonly challenge: string;
  readonly redirectUrl: string;
  readonly state: string;
  readonly nonce: string;
}

/**
 * Payload for media access tokens
 */
export interface MediaAccessPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.MEDIA_ACCESS;
  readonly productKey: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly mediaReferences: string[];
  readonly gcsPaths: string[];
  readonly accessLevel: 'read' | 'write' | 'delete';
  readonly bucketName: string;
}

/**
 * Payload for SSO access tokens
 */
export interface SsoAccessPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.SSO_ACCESS;
  readonly productKey: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly externalUserId: string;
  readonly email: string;
  readonly name?: string;
  readonly scopes: TrustDomainScope[];
  readonly sessionId: string;
  readonly refreshTokenId?: string;
}

/**
 * Payload for SSO refresh tokens
 */
export interface SsoRefreshPayload extends BaseJwtPayload {
  readonly type: JwtTokenType.SSO_REFRESH;
  readonly productKey: string;
  readonly organizationId: string;
  readonly userId: string;
  readonly sessionId: string;
  readonly accessTokenId: string;
  readonly rotationCount: number;
}

/**
 * Union type for all JWT payloads
 */
export type JwtPayload = 
  | SsoTrustPayload
  | ProductSessionPayload
  | TemporaryAuthPayload
  | MediaAccessPayload
  | SsoAccessPayload
  | SsoRefreshPayload;

/**
 * JWT header interface
 */
export interface JwtHeader {
  readonly alg: JwtAlgorithm;
  readonly typ: 'JWT';
  readonly kid?: string; // Key ID for multi-key scenarios
}

/**
 * Complete JWT structure
 */
export interface JwtToken<T extends JwtPayload = JwtPayload> {
  readonly header: JwtHeader;
  readonly payload: T;
  readonly signature: string;
  readonly raw: string;
}

/**
 * JWT configuration for different token types
 */
export interface JwtConfig {
  readonly algorithm: JwtAlgorithm;
  readonly secret: string;
  readonly publicKey?: string;
  readonly privateKey?: string;
  readonly defaultExpiry: number; // in seconds
  readonly refreshExpiry?: number; // in seconds
  readonly issuer: string;
  readonly keyId?: string;
}

/**
 * Product-specific JWT configuration
 */
export interface ProductJwtConfig extends JwtConfig {
  readonly productKey: string;
  readonly allowedDomains: string[];
  readonly customClaims?: Record<string, unknown>;
}

/**
 * JWT validation options
 */
export interface JwtValidationOptions {
  readonly issuer?: string | string[];
  readonly audience?: string | string[];
  readonly clockTolerance?: number;
  readonly ignoreExpiration?: boolean;
  readonly ignoreNotBefore?: boolean;
  readonly maxAge?: string | number;
  readonly subject?: string;
  readonly jwtid?: string;
  readonly algorithms?: JwtAlgorithm[];
}

/**
 * JWT validation result
 */
export interface JwtValidationResult<T extends JwtPayload = JwtPayload> {
  readonly valid: boolean;
  readonly payload?: T;
  readonly error?: string;
  readonly decoded?: JwtToken<T>;
  readonly expired: boolean;
  readonly notBefore: boolean;
}

/**
 * SSO flow context for token generation
 */
export interface SsoFlowContext {
  readonly productKey: string;
  readonly userId: string;
  readonly organizationId: string;
  readonly externalUserId: string;
  readonly email: string;
  readonly name?: string;
  readonly sessionId: string;
  readonly scopes: TrustDomainScope[];
  readonly metadata: Record<string, unknown>;
  readonly clientIP: string;
  readonly userAgent: string;
  readonly redirectUrl?: string;
}

/**
 * Token pair for access/refresh pattern
 */
export interface TokenPair {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
  readonly tokenType: 'Bearer';
  readonly scope: string;
}

/**
 * Zod schemas for runtime validation
 */
export const JwtTokenTypeSchema = z.nativeEnum(JwtTokenType);
export const JwtAlgorithmSchema = z.nativeEnum(JwtAlgorithm);
export const TrustDomainScopeSchema = z.nativeEnum(TrustDomainScope);

export const BaseJwtPayloadSchema = z.object({
  iss: z.string().min(1),
  sub: z.string().uuid(),
  aud: z.union([z.string(), z.array(z.string())]),
  exp: z.number().int().positive(),
  iat: z.number().int().positive(),
  nbf: z.number().int().positive().optional(),
  jti: z.string().uuid(),
});

export const SsoTrustPayloadSchema = BaseJwtPayloadSchema.extend({
  type: z.literal(JwtTokenType.TRUST_DOMAIN),
  scopes: z.array(TrustDomainScopeSchema),
  productKey: z.string().min(1).max(50),
  organizationId: z.string().uuid(),
  externalUserId: z.string().min(1),
  sessionId: z.string().min(1),
  permissions: z.record(z.boolean()),
  metadata: z.record(z.unknown()),
});

export const ProductSessionPayloadSchema = BaseJwtPayloadSchema.extend({
  type: z.literal(JwtTokenType.PRODUCT_SESSION),
  productKey: z.string().min(1).max(50),
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  externalUserId: z.string().min(1),
  sessionId: z.string().min(1),
  dataAccessLevel: z.string(),
  lastActivity: z.number().int().positive(),
  refreshToken: z.string().optional(),
});

export const TemporaryAuthPayloadSchema = BaseJwtPayloadSchema.extend({
  type: z.literal(JwtTokenType.TEMPORARY_AUTH),
  productKey: z.string().min(1).max(50),
  challenge: z.string().min(1),
  redirectUrl: z.string().url(),
  state: z.string().min(1),
  nonce: z.string().min(1),
});

export const MediaAccessPayloadSchema = BaseJwtPayloadSchema.extend({
  type: z.literal(JwtTokenType.MEDIA_ACCESS),
  productKey: z.string().min(1).max(50),
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  mediaReferences: z.array(z.string().uuid()),
  gcsPaths: z.array(z.string()),
  accessLevel: z.enum(['read', 'write', 'delete']),
  bucketName: z.string().min(1),
});

export const SsoAccessPayloadSchema = BaseJwtPayloadSchema.extend({
  type: z.literal(JwtTokenType.SSO_ACCESS),
  productKey: z.string().min(1).max(50),
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  externalUserId: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  scopes: z.array(TrustDomainScopeSchema),
  sessionId: z.string().min(1),
  refreshTokenId: z.string().uuid().optional(),
});

export const SsoRefreshPayloadSchema = BaseJwtPayloadSchema.extend({
  type: z.literal(JwtTokenType.SSO_REFRESH),
  productKey: z.string().min(1).max(50),
  organizationId: z.string().uuid(),
  userId: z.string().uuid(),
  sessionId: z.string().min(1),
  accessTokenId: z.string().uuid(),
  rotationCount: z.number().int().min(0),
});

export const JwtHeaderSchema = z.object({
  alg: JwtAlgorithmSchema,
  typ: z.literal('JWT'),
  kid: z.string().optional(),
});

export const JwtConfigSchema = z.object({
  algorithm: JwtAlgorithmSchema,
  secret: z.string().min(1),
  publicKey: z.string().optional(),
  privateKey: z.string().optional(),
  defaultExpiry: z.number().int().positive(),
  refreshExpiry: z.number().int().positive().optional(),
  issuer: z.string().url(),
  keyId: z.string().optional(),
});

export const SsoFlowContextSchema = z.object({
  productKey: z.string().min(1).max(50),
  userId: z.string().uuid(),
  organizationId: z.string().uuid(),
  externalUserId: z.string().min(1),
  email: z.string().email(),
  name: z.string().optional(),
  sessionId: z.string().min(1),
  scopes: z.array(TrustDomainScopeSchema),
  metadata: z.record(z.unknown()),
  clientIP: z.string().ip(),
  userAgent: z.string().min(1),
  redirectUrl: z.string().url().optional(),
});

/**
 * Type guards for JWT payloads
 */
export const isSsoTrustPayload = (payload: JwtPayload): payload is SsoTrustPayload => {
  return payload.type === JwtTokenType.TRUST_DOMAIN;
};

export const isProductSessionPayload = (payload: JwtPayload): payload is ProductSessionPayload => {
  return payload.type === JwtTokenType.PRODUCT_SESSION;
};

export const isTemporaryAuthPayload = (payload: JwtPayload): payload is TemporaryAuthPayload => {
  return payload.type === JwtTokenType.TEMPORARY_AUTH;
};

export const isMediaAccessPayload = (payload: JwtPayload): payload is MediaAccessPayload => {
  return payload.type === JwtTokenType.MEDIA_ACCESS;
};

export const isSsoAccessPayload = (payload: JwtPayload): payload is SsoAccessPayload => {
  return payload.type === JwtTokenType.SSO_ACCESS;
};

export const isSsoRefreshPayload = (payload: JwtPayload): payload is SsoRefreshPayload => {
  return payload.type === JwtTokenType.SSO_REFRESH;
};

/**
 * Utility types for token operations
 */
export type TokenTypeOf<T extends JwtPayload> = T extends { type: infer U } ? U : never;

export type PayloadByType<T extends JwtTokenType> = 
  T extends JwtTokenType.TRUST_DOMAIN ? SsoTrustPayload :
  T extends JwtTokenType.PRODUCT_SESSION ? ProductSessionPayload :
  T extends JwtTokenType.TEMPORARY_AUTH ? TemporaryAuthPayload :
  T extends JwtTokenType.MEDIA_ACCESS ? MediaAccessPayload :
  T extends JwtTokenType.SSO_ACCESS ? SsoAccessPayload :
  T extends JwtTokenType.SSO_REFRESH ? SsoRefreshPayload :
  never;

/**
 * Generic JWT factory type
 */
export interface JwtFactory<T extends JwtTokenType> {
  create(context: SsoFlowContext, options?: Partial<PayloadByType<T>>): Promise<string>;
  validate(token: string): Promise<JwtValidationResult<PayloadByType<T>>>;
  refresh?(refreshToken: string): Promise<TokenPair>;
  revoke?(tokenId: string): Promise<boolean>;
}

/**
 * Export all JWT schemas as a bundle
 */
export const JwtSchemas = {
  JwtTokenType: JwtTokenTypeSchema,
  JwtAlgorithm: JwtAlgorithmSchema,
  BaseJwtPayload: BaseJwtPayloadSchema,
  SsoTrustPayload: SsoTrustPayloadSchema,
  ProductSessionPayload: ProductSessionPayloadSchema,
  TemporaryAuthPayload: TemporaryAuthPayloadSchema,
  MediaAccessPayload: MediaAccessPayloadSchema,
  SsoAccessPayload: SsoAccessPayloadSchema,
  SsoRefreshPayload: SsoRefreshPayloadSchema,
  JwtHeader: JwtHeaderSchema,
  JwtConfig: JwtConfigSchema,
  SsoFlowContext: SsoFlowContextSchema,
} as const;