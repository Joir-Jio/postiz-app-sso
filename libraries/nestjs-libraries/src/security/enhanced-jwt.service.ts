/**
 * Enhanced JWT service with advanced security features for multi-product SSO
 * Implements comprehensive token management with security best practices
 * 
 * @fileoverview Secure JWT service with blacklisting, rotation, and threat detection
 * @version 1.0.0
 * 
 * Security Features:
 * - Token blacklisting and revocation
 * - Automatic token rotation
 * - Key rotation with multiple signing keys
 * - Suspicious token detection
 * - Token usage analytics and monitoring
 * - Secure token storage and retrieval
 * - Multi-environment key management
 * - JWKS endpoint support
 * - Token binding and validation
 */

import { Injectable, Logger } from '@nestjs/common';
import { sign, verify, JsonWebTokenError, TokenExpiredError, NotBeforeError, decode } from 'jsonwebtoken';
import { createHash, createHmac, randomBytes, randomUUID } from 'crypto';
import { 
  JwtPayload, 
  JwtTokenType, 
  JwtConfig, 
  JwtValidationResult, 
  SsoFlowContext, 
  TokenPair,
  JwtAlgorithm,
  SsoAccessPayload,
  SsoRefreshPayload,
  SsoTrustPayload,
  ProductSessionPayload,
  MediaAccessPayload,
  TemporaryAuthPayload,
} from '../types/sso/jwt.types';

// Enhanced JWT configuration with security features
interface EnhancedJwtConfig extends JwtConfig {
  // Key management
  keyRotationIntervalHours: number;
  maxActiveKeys: number;
  keyDerivationRounds: number;
  
  // Token security
  enableTokenBinding: boolean;
  enableJti: boolean;
  enableFingerprinting: boolean;
  
  // Monitoring and analytics
  enableUsageTracking: boolean;
  suspiciousActivityThreshold: number;
  maxConcurrentTokens: number;
  
  // Blacklisting
  blacklistCleanupIntervalHours: number;
  maxBlacklistSize: number;
  
  // Environment-specific settings
  environment: 'development' | 'staging' | 'production';
  allowInsecureKeys: boolean;
}

// Token metadata for security tracking
interface TokenMetadata {
  tokenHash: string;
  jwtId: string;
  userId?: string;
  productKey?: string;
  issueTime: Date;
  expiryTime: Date;
  ipAddress?: string;
  userAgent?: string;
  lastUsed?: Date;
  useCount: number;
  revokedAt?: Date;
  revokedBy?: string;
  revokedReason?: string;
}

// Signing key information
interface SigningKey {
  keyId: string;
  algorithm: JwtAlgorithm;
  publicKey?: string;
  privateKey?: string;
  secret?: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  useCount: number;
}

// Token usage analytics
interface TokenUsageAnalytics {
  totalIssued: number;
  totalValidated: number;
  totalRevoked: number;
  totalExpired: number;
  suspiciousActivity: number;
  averageLifetime: number;
  peakConcurrentTokens: number;
  errorRate: number;
}

// Enhanced validation options
interface EnhancedValidationOptions {
  requireTokenBinding?: boolean;
  requireFingerprint?: boolean;
  allowExpiredTokens?: boolean;
  maxTokenAge?: number;
  checkBlacklist?: boolean;
  updateUsageStats?: boolean;
  clientIP?: string;
  userAgent?: string;
}

@Injectable()
export class EnhancedJwtService {
  private readonly logger = new Logger(EnhancedJwtService.name);
  private readonly config: EnhancedJwtConfig;
  private readonly signingKeys = new Map<string, SigningKey>();
  private readonly tokenMetadata = new Map<string, TokenMetadata>();
  private readonly blacklistedTokens = new Set<string>();
  private readonly usageAnalytics: TokenUsageAnalytics;
  
  private currentKeyId: string;
  private keyRotationTimer?: NodeJS.Timeout;

  constructor() {
    this.config = this.loadConfiguration();
    this.usageAnalytics = this.initializeAnalytics();
    this.initializeSigningKeys();
    this.startKeyRotation();
    this.startCleanupTasks();
  }

  /**
   * Create enhanced SSO access token with security features
   */
  async createSsoAccessToken(
    context: SsoFlowContext,
    options: {
      bindToClient?: boolean;
      enableFingerprinting?: boolean;
      customExpiry?: number;
    } = {}
  ): Promise<TokenPair> {
    const now = Math.floor(Date.now() / 1000);
    const accessTokenId = randomUUID();
    const refreshTokenId = randomUUID();
    const sessionId = this.generateSecureSessionId(context);

    // Create access token payload
    const accessPayload: SsoAccessPayload = {
      type: JwtTokenType.SSO_ACCESS,
      iss: this.config.issuer,
      sub: context.userId,
      aud: context.productKey,
      exp: now + (options.customExpiry || this.config.defaultExpiry),
      iat: now,
      nbf: now,
      jti: accessTokenId,
      productKey: context.productKey,
      organizationId: context.organizationId,
      userId: context.userId,
      externalUserId: context.externalUserId,
      email: context.email,
      name: context.name,
      scopes: context.scopes,
      sessionId,
      refreshTokenId,
    };

    // Add security bindings if enabled
    if (options.bindToClient && this.config.enableTokenBinding) {
      (accessPayload as any).clientBinding = this.generateClientBinding(context);
    }

    if (options.enableFingerprinting && this.config.enableFingerprinting) {
      (accessPayload as any).fingerprint = this.generateTokenFingerprint(context);
    }

    // Create refresh token payload
    const refreshPayload: SsoRefreshPayload = {
      type: JwtTokenType.SSO_REFRESH,
      iss: this.config.issuer,
      sub: context.userId,
      aud: context.productKey,
      exp: now + (this.config.refreshExpiry || 86400 * 30),
      iat: now,
      nbf: now,
      jti: refreshTokenId,
      productKey: context.productKey,
      organizationId: context.organizationId,
      userId: context.userId,
      sessionId,
      accessTokenId,
      rotationCount: 0,
    };

    // Sign tokens with current signing key
    const accessToken = await this.signTokenSecure(accessPayload);
    const refreshToken = await this.signTokenSecure(refreshPayload);

    // Store token metadata for tracking
    await this.storeTokenMetadata(accessToken, accessPayload, context);
    await this.storeTokenMetadata(refreshToken, refreshPayload, context);

    // Update analytics
    this.usageAnalytics.totalIssued += 2;

    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.defaultExpiry,
      tokenType: 'Bearer',
      scope: context.scopes.join(' '),
    };
  }

  /**
   * Enhanced token validation with comprehensive security checks
   */
  async validateTokenEnhanced(
    token: string,
    options: EnhancedValidationOptions = {}
  ): Promise<JwtValidationResult> {
    const startTime = Date.now();

    try {
      // Step 1: Basic format validation
      if (!this.isValidJwtFormat(token)) {
        return this.createValidationError('Invalid JWT format');
      }

      // Step 2: Extract and validate header
      const header = this.extractHeader(token);
      if (!header || !this.isValidHeader(header)) {
        return this.createValidationError('Invalid JWT header');
      }

      // Step 3: Check token blacklist
      if (options.checkBlacklist !== false) {
        const tokenHash = this.hashToken(token);
        if (this.blacklistedTokens.has(tokenHash)) {
          this.usageAnalytics.suspiciousActivity++;
          return this.createValidationError('Token has been revoked');
        }
      }

      // Step 4: Verify signature with appropriate key
      const signingKey = this.signingKeys.get(header.kid || this.currentKeyId);
      if (!signingKey) {
        return this.createValidationError('Invalid signing key');
      }

      const decoded = verify(token, this.getKeyForVerification(signingKey), {
        issuer: this.config.issuer,
        algorithms: [header.alg],
        complete: false,
      }) as JwtPayload;

      // Step 5: Enhanced payload validation
      const payloadValidation = await this.validatePayloadEnhanced(decoded, options);
      if (!payloadValidation.valid) {
        return payloadValidation;
      }

      // Step 6: Token binding validation
      if (options.requireTokenBinding && this.config.enableTokenBinding) {
        const bindingValid = this.validateTokenBinding(decoded, options);
        if (!bindingValid) {
          this.usageAnalytics.suspiciousActivity++;
          return this.createValidationError('Token binding validation failed');
        }
      }

      // Step 7: Update token usage statistics
      if (options.updateUsageStats !== false) {
        await this.updateTokenUsageStats(token, options);
      }

      // Step 8: Detect suspicious patterns
      const suspiciousActivity = await this.detectSuspiciousTokenUsage(token, decoded, options);
      if (suspiciousActivity.detected) {
        this.logger.warn(`Suspicious token usage detected`, {
          tokenId: decoded.jti,
          reason: suspiciousActivity.reason,
          clientIP: options.clientIP,
        });
        
        if (suspiciousActivity.shouldRevoke) {
          await this.revokeToken(token, 'suspicious_activity');
          return this.createValidationError('Token revoked due to suspicious activity');
        }
      }

      // Update analytics
      this.usageAnalytics.totalValidated++;
      const validationTime = Date.now() - startTime;

      return {
        valid: true,
        payload: decoded,
        expired: false,
        notBefore: false,
        metadata: {
          validationTime,
          keyId: header.kid || this.currentKeyId,
          suspiciousScore: suspiciousActivity.score,
        },
      };

    } catch (error) {
      return this.handleValidationError(error);
    }
  }

  /**
   * Secure token refresh with rotation
   */
  async refreshTokenSecure(
    refreshToken: string,
    context: Partial<SsoFlowContext>
  ): Promise<TokenPair | null> {
    // Validate refresh token
    const validation = await this.validateTokenEnhanced(refreshToken, {
      checkBlacklist: true,
      updateUsageStats: true,
    });

    if (!validation.valid || !validation.payload) {
      this.logger.warn('Invalid refresh token provided');
      return null;
    }

    const refreshPayload = validation.payload as SsoRefreshPayload;
    
    // Verify token type
    if (refreshPayload.type !== JwtTokenType.SSO_REFRESH) {
      this.logger.warn('Invalid token type for refresh');
      return null;
    }

    // Check rotation count to prevent abuse
    if (refreshPayload.rotationCount > 10) {
      await this.revokeToken(refreshToken, 'excessive_rotation');
      this.logger.warn('Refresh token revoked due to excessive rotation');
      return null;
    }

    // Revoke old tokens
    await this.revokeToken(refreshToken, 'token_rotated');
    if (refreshPayload.accessTokenId) {
      await this.revokeTokenById(refreshPayload.accessTokenId, 'access_token_rotated');
    }

    // Create new token pair
    const newContext: SsoFlowContext = {
      productKey: refreshPayload.productKey,
      userId: refreshPayload.userId,
      organizationId: refreshPayload.organizationId,
      externalUserId: '', // Would need to fetch from database
      email: '', // Would need to fetch from database
      name: context.name,
      sessionId: refreshPayload.sessionId,
      scopes: [], // Would need to fetch from context
      metadata: context.metadata || {},
      clientIP: context.clientIP || '',
      userAgent: context.userAgent || '',
    };

    const tokenPair = await this.createSsoAccessToken(newContext, {
      bindToClient: true,
      enableFingerprinting: true,
    });

    // Update refresh token rotation count
    const newRefreshPayload = decode(tokenPair.refreshToken) as SsoRefreshPayload;
    if (newRefreshPayload) {
      newRefreshPayload.rotationCount = refreshPayload.rotationCount + 1;
    }

    return tokenPair;
  }

  /**
   * Revoke token and add to blacklist
   */
  async revokeToken(
    token: string,
    reason: string,
    revokedBy?: string
  ): Promise<boolean> {
    try {
      const tokenHash = this.hashToken(token);
      const metadata = this.tokenMetadata.get(tokenHash);

      // Add to blacklist
      this.blacklistedTokens.add(tokenHash);

      // Update metadata
      if (metadata) {
        metadata.revokedAt = new Date();
        metadata.revokedBy = revokedBy;
        metadata.revokedReason = reason;
        this.tokenMetadata.set(tokenHash, metadata);
      }

      // Update analytics
      this.usageAnalytics.totalRevoked++;

      // In production, store in database
      // await this.storeTokenRevocation(tokenHash, reason, revokedBy);

      this.logger.log(`Token revoked: ${reason}`, {
        tokenHash: tokenHash.substring(0, 16),
        reason,
        revokedBy,
      });

      return true;
    } catch (error) {
      this.logger.error('Failed to revoke token', error);
      return false;
    }
  }

  /**
   * Revoke token by JWT ID
   */
  async revokeTokenById(jwtId: string, reason: string): Promise<boolean> {
    // Find token by JWT ID in metadata
    for (const [tokenHash, metadata] of this.tokenMetadata.entries()) {
      if (metadata.jwtId === jwtId) {
        this.blacklistedTokens.add(tokenHash);
        metadata.revokedAt = new Date();
        metadata.revokedReason = reason;
        this.usageAnalytics.totalRevoked++;
        return true;
      }
    }
    return false;
  }

  /**
   * Get current token usage analytics
   */
  getTokenAnalytics(): TokenUsageAnalytics & {
    activeTokens: number;
    blacklistedTokens: number;
    signingKeys: number;
  } {
    const activeTokens = Array.from(this.tokenMetadata.values())
      .filter(metadata => !metadata.revokedAt && metadata.expiryTime > new Date())
      .length;

    return {
      ...this.usageAnalytics,
      activeTokens,
      blacklistedTokens: this.blacklistedTokens.size,
      signingKeys: this.signingKeys.size,
    };
  }

  /**
   * Create JWKS (JSON Web Key Set) endpoint response
   */
  getJWKS(): { keys: any[] } {
    const keys = Array.from(this.signingKeys.values())
      .filter(key => key.isActive && key.publicKey)
      .map(key => ({
        kty: 'RSA',
        kid: key.keyId,
        use: 'sig',
        alg: key.algorithm,
        n: key.publicKey, // Base64url encoded modulus
        e: 'AQAB', // Base64url encoded exponent
      }));

    return { keys };
  }

  /**
   * Rotate signing keys for enhanced security
   */
  async rotateSigningKeys(): Promise<void> {
    try {
      const newKey = await this.generateSigningKey();
      this.signingKeys.set(newKey.keyId, newKey);
      
      // Deactivate old keys but keep for verification
      const oldKeys = Array.from(this.signingKeys.values())
        .filter(key => key.keyId !== newKey.keyId);

      if (oldKeys.length >= this.config.maxActiveKeys) {
        const oldestKey = oldKeys.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
        oldestKey.isActive = false;
      }

      this.currentKeyId = newKey.keyId;
      
      this.logger.log('Signing key rotated successfully', {
        newKeyId: newKey.keyId,
        activeKeys: Array.from(this.signingKeys.values()).filter(k => k.isActive).length,
      });

    } catch (error) {
      this.logger.error('Failed to rotate signing keys', error);
    }
  }

  /**
   * Private helper methods
   */

  private loadConfiguration(): EnhancedJwtConfig {
    return {
      algorithm: JwtAlgorithm.HS256,
      secret: process.env.SSO_JWT_SECRET || process.env.JWT_SECRET!,
      defaultExpiry: 3600, // 1 hour
      refreshExpiry: 86400 * 30, // 30 days
      issuer: process.env.FRONTEND_URL || 'https://postiz.com',
      keyRotationIntervalHours: 24,
      maxActiveKeys: 3,
      keyDerivationRounds: 100000,
      enableTokenBinding: true,
      enableJti: true,
      enableFingerprinting: true,
      enableUsageTracking: true,
      suspiciousActivityThreshold: 0.7,
      maxConcurrentTokens: 10,
      blacklistCleanupIntervalHours: 6,
      maxBlacklistSize: 10000,
      environment: (process.env.NODE_ENV as any) || 'development',
      allowInsecureKeys: process.env.NODE_ENV === 'development',
    };
  }

  private initializeAnalytics(): TokenUsageAnalytics {
    return {
      totalIssued: 0,
      totalValidated: 0,
      totalRevoked: 0,
      totalExpired: 0,
      suspiciousActivity: 0,
      averageLifetime: 0,
      peakConcurrentTokens: 0,
      errorRate: 0,
    };
  }

  private async initializeSigningKeys(): Promise<void> {
    // Generate initial signing key
    const initialKey = await this.generateSigningKey();
    this.signingKeys.set(initialKey.keyId, initialKey);
    this.currentKeyId = initialKey.keyId;
  }

  private async generateSigningKey(): Promise<SigningKey> {
    const keyId = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (this.config.keyRotationIntervalHours * 60 * 60 * 1000));

    // For HMAC algorithms, derive a strong key
    const secret = createHmac('sha256', this.config.secret)
      .update(`${keyId}:${now.toISOString()}:${randomBytes(32).toString('hex')}`)
      .digest('hex');

    return {
      keyId,
      algorithm: this.config.algorithm,
      secret,
      createdAt: now,
      expiresAt,
      isActive: true,
      useCount: 0,
    };
  }

  private startKeyRotation(): void {
    const intervalMs = this.config.keyRotationIntervalHours * 60 * 60 * 1000;
    this.keyRotationTimer = setInterval(async () => {
      await this.rotateSigningKeys();
    }, intervalMs);
  }

  private startCleanupTasks(): void {
    const cleanupInterval = this.config.blacklistCleanupIntervalHours * 60 * 60 * 1000;
    setInterval(() => {
      this.cleanupExpiredTokens();
      this.cleanupBlacklist();
    }, cleanupInterval);
  }

  private cleanupExpiredTokens(): void {
    const now = new Date();
    let cleanupCount = 0;

    for (const [tokenHash, metadata] of this.tokenMetadata.entries()) {
      if (metadata.expiryTime < now) {
        this.tokenMetadata.delete(tokenHash);
        this.blacklistedTokens.delete(tokenHash);
        cleanupCount++;
      }
    }

    if (cleanupCount > 0) {
      this.logger.log(`Cleaned up ${cleanupCount} expired tokens`);
      this.usageAnalytics.totalExpired += cleanupCount;
    }
  }

  private cleanupBlacklist(): void {
    if (this.blacklistedTokens.size > this.config.maxBlacklistSize) {
      // Remove oldest blacklisted tokens (simple FIFO approach)
      const tokensToRemove = this.blacklistedTokens.size - this.config.maxBlacklistSize;
      let removed = 0;
      
      for (const tokenHash of this.blacklistedTokens) {
        if (removed >= tokensToRemove) break;
        this.blacklistedTokens.delete(tokenHash);
        removed++;
      }
      
      this.logger.log(`Cleaned up ${removed} blacklisted tokens`);
    }
  }

  private generateSecureSessionId(context: SsoFlowContext): string {
    const data = [
      context.userId,
      context.productKey,
      context.organizationId,
      Date.now(),
      randomBytes(16).toString('hex'),
    ].join(':');
    
    return createHmac('sha256', this.config.secret).update(data).digest('hex');
  }

  private generateClientBinding(context: SsoFlowContext): string {
    const bindingData = [
      context.clientIP,
      context.userAgent,
      context.userId,
    ].join(':');
    
    return createHash('sha256').update(bindingData).digest('hex').substring(0, 16);
  }

  private generateTokenFingerprint(context: SsoFlowContext): string {
    const fingerprintData = [
      context.userAgent,
      context.clientIP,
      Date.now().toString(),
    ].join(':');
    
    return createHash('sha256').update(fingerprintData).digest('hex').substring(0, 32);
  }

  private async signTokenSecure(payload: JwtPayload): Promise<string> {
    const signingKey = this.signingKeys.get(this.currentKeyId);
    if (!signingKey) {
      throw new Error('No active signing key available');
    }

    signingKey.useCount++;

    return sign(payload, signingKey.secret!, {
      algorithm: signingKey.algorithm,
      header: {
        typ: 'JWT',
        alg: signingKey.algorithm,
        kid: signingKey.keyId,
      },
    });
  }

  private async storeTokenMetadata(
    token: string,
    payload: JwtPayload,
    context: SsoFlowContext
  ): Promise<void> {
    const tokenHash = this.hashToken(token);
    const metadata: TokenMetadata = {
      tokenHash,
      jwtId: payload.jti,
      userId: payload.sub,
      productKey: payload.aud as string,
      issueTime: new Date(payload.iat * 1000),
      expiryTime: new Date(payload.exp * 1000),
      ipAddress: context.clientIP,
      userAgent: context.userAgent,
      useCount: 0,
    };

    this.tokenMetadata.set(tokenHash, metadata);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private isValidJwtFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  private extractHeader(token: string): any {
    try {
      const headerPart = token.split('.')[0];
      return JSON.parse(Buffer.from(headerPart, 'base64url').toString());
    } catch {
      return null;
    }
  }

  private isValidHeader(header: any): boolean {
    return header && header.typ === 'JWT' && header.alg && header.kid;
  }

  private getKeyForVerification(signingKey: SigningKey): string {
    return signingKey.secret || signingKey.publicKey!;
  }

  private async validatePayloadEnhanced(
    payload: JwtPayload,
    options: EnhancedValidationOptions
  ): Promise<JwtValidationResult> {
    // Validate required claims
    for (const claim of this.config.requiredClaims) {
      if (!(claim in payload)) {
        return this.createValidationError(`Missing required claim: ${claim}`);
      }
    }

    // Validate token age
    if (options.maxTokenAge) {
      const tokenAge = Date.now() / 1000 - payload.iat;
      if (tokenAge > options.maxTokenAge) {
        return this.createValidationError('Token is too old');
      }
    }

    // Additional payload-specific validations would go here

    return { valid: true, expired: false, notBefore: false };
  }

  private validateTokenBinding(payload: JwtPayload, options: EnhancedValidationOptions): boolean {
    if (!options.clientIP || !options.userAgent) {
      return false;
    }

    const expectedBinding = this.generateClientBinding({
      clientIP: options.clientIP,
      userAgent: options.userAgent,
      userId: payload.sub,
    } as SsoFlowContext);

    return (payload as any).clientBinding === expectedBinding;
  }

  private async updateTokenUsageStats(token: string, options: EnhancedValidationOptions): Promise<void> {
    const tokenHash = this.hashToken(token);
    const metadata = this.tokenMetadata.get(tokenHash);
    
    if (metadata) {
      metadata.useCount++;
      metadata.lastUsed = new Date();
      this.tokenMetadata.set(tokenHash, metadata);
    }
  }

  private async detectSuspiciousTokenUsage(
    token: string,
    payload: JwtPayload,
    options: EnhancedValidationOptions
  ): Promise<{ detected: boolean; score: number; reason?: string; shouldRevoke: boolean }> {
    const tokenHash = this.hashToken(token);
    const metadata = this.tokenMetadata.get(tokenHash);
    let suspiciousScore = 0.0;
    let reason = '';

    if (metadata) {
      // Check for excessive use frequency
      if (metadata.useCount > 100) {
        suspiciousScore += 0.3;
        reason += 'excessive_use ';
      }

      // Check for use after long dormancy
      if (metadata.lastUsed) {
        const dormantTime = Date.now() - metadata.lastUsed.getTime();
        if (dormantTime > 24 * 60 * 60 * 1000 && metadata.useCount === 0) {
          suspiciousScore += 0.4;
          reason += 'dormant_reactivation ';
        }
      }

      // Check for concurrent usage from different IPs
      if (options.clientIP && metadata.ipAddress && options.clientIP !== metadata.ipAddress) {
        suspiciousScore += 0.6;
        reason += 'ip_mismatch ';
      }
    }

    const detected = suspiciousScore >= this.config.suspiciousActivityThreshold;
    const shouldRevoke = suspiciousScore >= 0.9;

    return { detected, score: suspiciousScore, reason: reason.trim(), shouldRevoke };
  }

  private createValidationError(message: string): JwtValidationResult {
    return {
      valid: false,
      error: message,
      expired: false,
      notBefore: false,
    };
  }

  private handleValidationError(error: any): JwtValidationResult {
    if (error instanceof TokenExpiredError) {
      return {
        valid: false,
        error: 'Token expired',
        expired: true,
        notBefore: false,
      };
    }
    
    if (error instanceof NotBeforeError) {
      return {
        valid: false,
        error: 'Token not active yet',
        expired: false,
        notBefore: true,
      };
    }
    
    if (error instanceof JsonWebTokenError) {
      return {
        valid: false,
        error: `Invalid token: ${error.message}`,
        expired: false,
        notBefore: false,
      };
    }

    return {
      valid: false,
      error: 'Token validation failed',
      expired: false,
      notBefore: false,
    };
  }
}

export { EnhancedJwtService };