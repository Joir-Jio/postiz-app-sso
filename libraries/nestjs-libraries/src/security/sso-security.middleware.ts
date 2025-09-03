/**
 * Comprehensive security middleware for multi-product SSO integration
 * Provides defense-in-depth security for cross-product authentication
 * 
 * @fileoverview Security middleware with OWASP best practices implementation
 * @version 1.0.0
 * 
 * Security Features:
 * - Multi-product authentication validation
 * - JWT token validation and blacklist checking
 * - Rate limiting with adaptive thresholds
 * - Input validation and XSS prevention
 * - SQL injection protection
 * - CSRF token validation
 * - Request size limiting
 * - Suspicious activity detection
 * - Audit logging for all security events
 */

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';
import { z } from 'zod';

// Import SSO types and services
import { SsoJwtService } from '../services/sso/jwt.service';
import { JwtTokenType, JwtValidationResult } from '../types/sso/jwt.types';
import { SsoErrorFactory, SsoErrorCode, ErrorSeverity } from '../types/sso/validation.types';

// Security configuration interface
interface SecurityConfig {
  // Rate limiting
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  burstLimit: number;
  
  // Request validation
  maxRequestSize: number;
  maxHeaderSize: number;
  maxUrlLength: number;
  
  // JWT validation
  allowedTokenTypes: JwtTokenType[];
  maxTokenAge: number;
  requiredClaims: string[];
  
  // CSRF protection
  csrfTokenLength: number;
  csrfTokenExpiry: number;
  
  // Suspicious activity thresholds
  maxFailedAttempts: number;
  suspiciousActivityWindow: number;
  autoBlockThreshold: number;
}

// Default security configuration following OWASP recommendations
const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  maxRequestsPerMinute: 100,
  maxRequestsPerHour: 1000,
  burstLimit: 20,
  maxRequestSize: 1048576, // 1MB
  maxHeaderSize: 8192, // 8KB
  maxUrlLength: 2048,
  allowedTokenTypes: [
    JwtTokenType.SSO_ACCESS,
    JwtTokenType.SSO_REFRESH,
    JwtTokenType.TRUST_DOMAIN,
    JwtTokenType.PRODUCT_SESSION,
  ],
  maxTokenAge: 3600, // 1 hour
  requiredClaims: ['iss', 'sub', 'aud', 'exp', 'iat', 'jti'],
  csrfTokenLength: 32,
  csrfTokenExpiry: 1800, // 30 minutes
  maxFailedAttempts: 5,
  suspiciousActivityWindow: 300, // 5 minutes
  autoBlockThreshold: 3,
};

// Security context interface for request enrichment
interface SecurityContext {
  requestId: string;
  clientIP: string;
  userAgent: string;
  fingerprint: string;
  riskScore: number;
  validatedToken?: JwtValidationResult;
  productKey?: string;
  userId?: string;
  organizationId?: string;
  securityFlags: string[];
}

// Rate limiter instances for different endpoints
interface RateLimiters {
  general: RateLimiterMemory;
  auth: RateLimiterMemory;
  media: RateLimiterMemory;
  api: RateLimiterMemory;
}

@Injectable()
export class SsoSecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SsoSecurityMiddleware.name);
  private readonly config: SecurityConfig;
  private rateLimiters: RateLimiters;
  private readonly blockedIPs = new Set<string>();
  private readonly suspiciousActivity = new Map<string, number[]>();

  constructor(private readonly jwtService: SsoJwtService) {
    this.config = { ...DEFAULT_SECURITY_CONFIG };
    this.initializeRateLimiters();
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const securityContext: SecurityContext = {
      requestId: this.generateRequestId(),
      clientIP: this.extractClientIP(req),
      userAgent: req.get('User-Agent') || 'unknown',
      fingerprint: this.generateFingerprint(req),
      riskScore: 0.0,
      securityFlags: [],
    };

    try {
      // Step 1: Basic security validations
      await this.validateBasicSecurity(req, securityContext);
      
      // Step 2: Rate limiting with adaptive thresholds
      await this.enforceRateLimit(req, securityContext);
      
      // Step 3: Input validation and sanitization
      await this.validateAndSanitizeInput(req, securityContext);
      
      // Step 4: JWT token validation and blacklist check
      await this.validateJwtToken(req, securityContext);
      
      // Step 5: Multi-product access validation
      await this.validateMultiProductAccess(req, securityContext);
      
      // Step 6: CSRF protection for state-changing operations
      await this.validateCSRFToken(req, securityContext);
      
      // Step 7: Suspicious activity detection
      await this.detectSuspiciousActivity(req, securityContext);
      
      // Step 8: Set security headers
      this.setSecurityHeaders(res, securityContext);
      
      // Step 9: Enrich request with security context
      this.enrichRequest(req, securityContext);
      
      // Step 10: Log security event
      await this.logSecurityEvent('request_validated', 'info', securityContext, req);
      
      next();
    } catch (error) {
      await this.handleSecurityError(error, req, res, securityContext);
    }
  }

  /**
   * Validate basic security requirements
   */
  private async validateBasicSecurity(req: Request, context: SecurityContext): Promise<void> {
    // Check if IP is blocked
    if (this.blockedIPs.has(context.clientIP)) {
      context.securityFlags.push('blocked_ip');
      throw SsoErrorFactory.createSecurityError(
        SsoErrorCode.IP_BLOCKED,
        'IP address is blocked due to suspicious activity',
        undefined,
        ErrorSeverity.CRITICAL
      );
    }

    // Validate request size
    const contentLength = parseInt(req.get('Content-Length') || '0', 10);
    if (contentLength > this.config.maxRequestSize) {
      context.securityFlags.push('oversized_request');
      throw SsoErrorFactory.createValidationError(
        SsoErrorCode.REQUEST_TOO_LARGE,
        `Request size ${contentLength} exceeds limit ${this.config.maxRequestSize}`,
        [{ field: 'Content-Length', value: contentLength, constraint: `max ${this.config.maxRequestSize}`, message: 'Request too large' }]
      );
    }

    // Validate URL length
    if (req.url.length > this.config.maxUrlLength) {
      context.securityFlags.push('oversized_url');
      throw SsoErrorFactory.createValidationError(
        SsoErrorCode.URL_TOO_LONG,
        `URL length ${req.url.length} exceeds limit ${this.config.maxUrlLength}`,
        [{ field: 'url', value: req.url.length, constraint: `max ${this.config.maxUrlLength}`, message: 'URL too long' }]
      );
    }

    // Validate headers size
    const headersSize = JSON.stringify(req.headers).length;
    if (headersSize > this.config.maxHeaderSize) {
      context.securityFlags.push('oversized_headers');
      throw SsoErrorFactory.createValidationError(
        SsoErrorCode.HEADERS_TOO_LARGE,
        `Headers size ${headersSize} exceeds limit ${this.config.maxHeaderSize}`,
        [{ field: 'headers', value: headersSize, constraint: `max ${this.config.maxHeaderSize}`, message: 'Headers too large' }]
      );
    }

    // Basic XSS detection in URL
    if (this.containsXSSPatterns(req.url)) {
      context.securityFlags.push('xss_attempt');
      context.riskScore += 0.8;
      throw SsoErrorFactory.createSecurityError(
        SsoErrorCode.XSS_DETECTED,
        'Potential XSS attack detected in URL',
        undefined,
        ErrorSeverity.HIGH
      );
    }

    // SQL injection detection in query parameters
    const queryString = new URLSearchParams(req.query as any).toString();
    if (this.containsSQLInjectionPatterns(queryString)) {
      context.securityFlags.push('sqli_attempt');
      context.riskScore += 0.9;
      throw SsoErrorFactory.createSecurityError(
        SsoErrorCode.SQL_INJECTION_DETECTED,
        'Potential SQL injection detected',
        undefined,
        ErrorSeverity.HIGH
      );
    }
  }

  /**
   * Enforce rate limiting with adaptive thresholds
   */
  private async enforceRateLimit(req: Request, context: SecurityContext): Promise<void> {
    const rateLimiterKey = `${context.clientIP}:${this.getRateLimitCategory(req.path)}`;
    const rateLimiter = this.selectRateLimiter(req.path);

    try {
      await rateLimiter.consume(rateLimiterKey);
    } catch (rateLimiterRes) {
      context.securityFlags.push('rate_limited');
      
      // Escalate blocking for repeat offenders
      const failureCount = this.incrementSuspiciousActivity(context.clientIP);
      if (failureCount >= this.config.autoBlockThreshold) {
        this.blockedIPs.add(context.clientIP);
        context.securityFlags.push('auto_blocked');
        
        await this.logSecurityEvent('ip_auto_blocked', 'critical', context, req, {
          reason: 'repeated_rate_limit_violations',
          failureCount,
        });
      }

      throw SsoErrorFactory.createSecurityError(
        SsoErrorCode.RATE_LIMIT_EXCEEDED,
        'Rate limit exceeded',
        {
          resetTime: new Date(Date.now() + rateLimiterRes.msBeforeNext),
          totalRequests: rateLimiterRes.totalHits,
          remainingRequests: rateLimiterRes.remainingPoints,
        },
        ErrorSeverity.MEDIUM
      );
    }
  }

  /**
   * Validate and sanitize all input data
   */
  private async validateAndSanitizeInput(req: Request, context: SecurityContext): Promise<void> {
    // Sanitize query parameters
    if (req.query) {
      for (const [key, value] of Object.entries(req.query)) {
        if (typeof value === 'string') {
          // Remove potential XSS vectors
          const sanitized = DOMPurify.sanitize(value, { USE_PROFILES: { html: false } });
          if (sanitized !== value) {
            context.securityFlags.push('xss_sanitized');
            context.riskScore += 0.3;
          }
          req.query[key] = sanitized;
        }
      }
    }

    // Sanitize body data
    if (req.body && typeof req.body === 'object') {
      req.body = this.sanitizeObject(req.body, context);
    }

    // Validate specific SSO parameters
    if (req.body?.productKey) {
      const productKeySchema = z.string().min(1).max(50).regex(/^[a-zA-Z0-9_-]+$/);
      if (!productKeySchema.safeParse(req.body.productKey).success) {
        throw SsoErrorFactory.createValidationError(
          SsoErrorCode.INVALID_PRODUCT_KEY,
          'Invalid product key format',
          [{ field: 'productKey', value: req.body.productKey, constraint: 'alphanumeric with _ and -', message: 'Invalid product key format' }]
        );
      }
    }

    if (req.body?.email) {
      if (!validator.isEmail(req.body.email) || req.body.email.length > 320) {
        throw SsoErrorFactory.createValidationError(
          SsoErrorCode.INVALID_EMAIL,
          'Invalid email format or length',
          [{ field: 'email', value: req.body.email, constraint: 'valid email format', message: 'Invalid email format or length' }]
        );
      }
    }
  }

  /**
   * Validate JWT token and check against blacklist
   */
  private async validateJwtToken(req: Request, context: SecurityContext): Promise<void> {
    const token = this.extractToken(req);
    if (!token) {
      // Only require token for protected endpoints
      if (this.isProtectedEndpoint(req.path)) {
        throw SsoErrorFactory.createAuthenticationError(
          SsoErrorCode.MISSING_TOKEN,
          'Authentication token is required'
        );
      }
      return;
    }

    // Validate token format
    if (!this.isValidJwtFormat(token)) {
      context.securityFlags.push('malformed_token');
      throw SsoErrorFactory.createAuthenticationError(
        SsoErrorCode.INVALID_TOKEN_FORMAT,
        'Invalid JWT token format'
      );
    }

    // Check token blacklist (would need to implement database lookup)
    const tokenHash = createHash('sha256').update(token).digest('hex');
    if (await this.isTokenBlacklisted(tokenHash)) {
      context.securityFlags.push('blacklisted_token');
      throw SsoErrorFactory.createAuthenticationError(
        SsoErrorCode.TOKEN_REVOKED,
        'Token has been revoked'
      );
    }

    // Validate token with JWT service
    try {
      const validation = await this.jwtService.validateToken(token);
      if (!validation.valid) {
        context.securityFlags.push('invalid_token');
        throw SsoErrorFactory.createAuthenticationError(
          SsoErrorCode.TOKEN_INVALID,
          validation.error || 'Token validation failed'
        );
      }

      context.validatedToken = validation;
      context.productKey = validation.payload?.aud as string;
      context.userId = validation.payload?.sub;
      
      // Extract organization ID if available
      if ('organizationId' in validation.payload!) {
        context.organizationId = (validation.payload as any).organizationId;
      }

    } catch (error) {
      context.securityFlags.push('token_validation_error');
      throw SsoErrorFactory.createAuthenticationError(
        SsoErrorCode.TOKEN_INVALID,
        'Token validation failed'
      );
    }
  }

  /**
   * Validate multi-product access permissions
   */
  private async validateMultiProductAccess(req: Request, context: SecurityContext): Promise<void> {
    if (!context.validatedToken || !context.productKey) {
      return;
    }

    // Validate product exists and is active (would need database lookup)
    if (!(await this.isProductActive(context.productKey))) {
      context.securityFlags.push('inactive_product');
      throw SsoErrorFactory.createAuthorizationError(
        SsoErrorCode.PRODUCT_INACTIVE,
        'Product is not active',
        ['product:access'],
        [],
        'product',
        context.productKey
      );
    }

    // Validate user has access to this product (would need database lookup)
    if (context.userId && !(await this.hasProductAccess(context.userId, context.productKey, context.organizationId))) {
      context.securityFlags.push('unauthorized_product_access');
      throw SsoErrorFactory.createAuthorizationError(
        SsoErrorCode.PRODUCT_ACCESS_DENIED,
        'User does not have access to this product',
        ['product:access'],
        [],
        'product',
        context.productKey
      );
    }

    // Validate data isolation - ensure user can only access their own data
    if (req.body?.userId && req.body.userId !== context.userId) {
      context.securityFlags.push('data_isolation_violation');
      throw SsoErrorFactory.createAuthorizationError(
        SsoErrorCode.DATA_ISOLATION_VIOLATION,
        'Cannot access data for different user',
        ['user:self'],
        [],
        'user',
        req.body.userId
      );
    }

    if (req.body?.organizationId && req.body.organizationId !== context.organizationId) {
      context.securityFlags.push('org_isolation_violation');
      throw SsoErrorFactory.createAuthorizationError(
        SsoErrorCode.ORGANIZATION_ACCESS_DENIED,
        'Cannot access data for different organization',
        ['org:access'],
        [],
        'organization',
        req.body.organizationId
      );
    }
  }

  /**
   * Validate CSRF token for state-changing operations
   */
  private async validateCSRFToken(req: Request, context: SecurityContext): Promise<void> {
    if (!this.isStateChangingOperation(req.method)) {
      return;
    }

    const csrfToken = req.get('X-CSRF-Token') || req.body?.csrfToken;
    const sessionToken = req.get('Authorization');

    if (!csrfToken || !sessionToken) {
      context.securityFlags.push('missing_csrf_token');
      throw SsoErrorFactory.createSecurityError(
        SsoErrorCode.CSRF_TOKEN_MISSING,
        'CSRF token is required for this operation',
        undefined,
        ErrorSeverity.HIGH
      );
    }

    if (!this.validateCSRFTokenBinding(csrfToken, sessionToken)) {
      context.securityFlags.push('invalid_csrf_token');
      throw SsoErrorFactory.createSecurityError(
        SsoErrorCode.CSRF_TOKEN_INVALID,
        'Invalid CSRF token',
        undefined,
        ErrorSeverity.HIGH
      );
    }
  }

  /**
   * Detect suspicious activity patterns
   */
  private async detectSuspiciousActivity(req: Request, context: SecurityContext): Promise<void> {
    // Check for suspicious user agent patterns
    if (this.isSuspiciousUserAgent(context.userAgent)) {
      context.securityFlags.push('suspicious_user_agent');
      context.riskScore += 0.4;
    }

    // Check for rapid successive requests
    const recentRequests = this.getRecentRequests(context.clientIP);
    if (recentRequests.length > this.config.burstLimit) {
      context.securityFlags.push('burst_request_pattern');
      context.riskScore += 0.5;
    }

    // Check for unusual request patterns
    if (this.hasUnusualRequestPattern(req, context)) {
      context.securityFlags.push('unusual_pattern');
      context.riskScore += 0.3;
    }

    // Auto-block if risk score is too high
    if (context.riskScore >= 0.8) {
      this.blockedIPs.add(context.clientIP);
      context.securityFlags.push('high_risk_blocked');
      
      await this.logSecurityEvent('high_risk_blocked', 'critical', context, req, {
        riskScore: context.riskScore,
        flags: context.securityFlags,
      });

      throw SsoErrorFactory.createSecurityError(
        SsoErrorCode.SUSPICIOUS_ACTIVITY,
        'Suspicious activity detected - access blocked',
        undefined,
        ErrorSeverity.CRITICAL
      );
    }
  }

  /**
   * Set comprehensive security headers
   */
  private setSecurityHeaders(res: Response, context: SecurityContext): void {
    // OWASP recommended security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Strict Transport Security
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    
    // Content Security Policy
    res.setHeader('Content-Security-Policy', this.buildCSPHeader());
    
    // Custom security headers
    res.setHeader('X-Request-ID', context.requestId);
    res.setHeader('X-Rate-Limit-Remaining', '1000'); // Would be dynamic
    
    // Remove server information
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
  }

  /**
   * Helper methods for security validations
   */
  
  private generateRequestId(): string {
    return createHash('sha1').update(`${Date.now()}${Math.random()}`).digest('hex').substring(0, 16);
  }

  private extractClientIP(req: Request): string {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           (req.connection as any).socket?.remoteAddress || 
           '0.0.0.0';
  }

  private generateFingerprint(req: Request): string {
    const data = `${req.get('User-Agent')}:${req.get('Accept-Language')}:${req.get('Accept-Encoding')}`;
    return createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    // Check cookie
    return req.cookies?.auth || null;
  }

  private isValidJwtFormat(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  private containsXSSPatterns(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  private containsSQLInjectionPatterns(input: string): boolean {
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|union|exec|execute)\b)/gi,
      /('|(\\')|('')|(%27)|(%2527))/gi,
      /(\b(or|and)\b\s+\d+\s*=\s*\d+)/gi,
      /(;|--|\/\*|\*\/)/gi,
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  private sanitizeObject(obj: any, context: SecurityContext): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    const sanitized: any = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        const cleaned = DOMPurify.sanitize(value, { USE_PROFILES: { html: false } });
        if (cleaned !== value) {
          context.securityFlags.push('input_sanitized');
          context.riskScore += 0.1;
        }
        sanitized[key] = cleaned;
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeObject(value, context);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private initializeRateLimiters(): void {
    this.rateLimiters = {
      general: new RateLimiterMemory({
        points: this.config.maxRequestsPerMinute,
        duration: 60,
        blockDuration: 60,
      }),
      auth: new RateLimiterMemory({
        points: Math.floor(this.config.maxRequestsPerMinute / 4),
        duration: 60,
        blockDuration: 300, // 5 minutes
      }),
      media: new RateLimiterMemory({
        points: Math.floor(this.config.maxRequestsPerMinute / 2),
        duration: 60,
        blockDuration: 120,
      }),
      api: new RateLimiterMemory({
        points: this.config.maxRequestsPerMinute,
        duration: 60,
        blockDuration: 60,
      }),
    };
  }

  private getRateLimitCategory(path: string): string {
    if (path.includes('/auth/')) return 'auth';
    if (path.includes('/media/')) return 'media';
    if (path.includes('/api/')) return 'api';
    return 'general';
  }

  private selectRateLimiter(path: string): RateLimiterMemory {
    const category = this.getRateLimitCategory(path);
    return this.rateLimiters[category as keyof RateLimiters];
  }

  private isProtectedEndpoint(path: string): boolean {
    const protectedPaths = ['/api/sso/', '/api/products/', '/api/media/', '/api/admin/'];
    return protectedPaths.some(protectedPath => path.startsWith(protectedPath));
  }

  private isStateChangingOperation(method: string): boolean {
    return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
  }

  private buildCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' https:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
  }

  private incrementSuspiciousActivity(ip: string): number {
    const now = Date.now();
    const activities = this.suspiciousActivity.get(ip) || [];
    
    // Clean old activities outside the window
    const windowStart = now - (this.config.suspiciousActivityWindow * 1000);
    const recentActivities = activities.filter(timestamp => timestamp > windowStart);
    
    recentActivities.push(now);
    this.suspiciousActivity.set(ip, recentActivities);
    
    return recentActivities.length;
  }

  private getRecentRequests(ip: string): number[] {
    return this.suspiciousActivity.get(ip) || [];
  }

  private isSuspiciousUserAgent(userAgent: string): boolean {
    const suspiciousPatterns = [
      /curl/i,
      /wget/i,
      /python/i,
      /bot/i,
      /scanner/i,
      /crawl/i,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(userAgent));
  }

  private hasUnusualRequestPattern(req: Request, context: SecurityContext): boolean {
    // Check for unusual header combinations or missing common headers
    const hasAcceptHeader = req.get('Accept');
    const hasUserAgent = req.get('User-Agent');
    const hasReferer = req.get('Referer');
    
    // Suspicious if missing common browser headers
    if (!hasAcceptHeader || !hasUserAgent) {
      return true;
    }
    
    // Check for automation tools
    if (context.userAgent.includes('automation') || context.userAgent.includes('selenium')) {
      return true;
    }
    
    return false;
  }

  private validateCSRFTokenBinding(csrfToken: string, sessionToken: string): boolean {
    try {
      // In production, implement proper CSRF token validation
      // This is a simplified version
      const expectedToken = createHmac('sha256', process.env.CSRF_SECRET || 'default-secret')
        .update(sessionToken)
        .digest('hex')
        .substring(0, this.config.csrfTokenLength);
      
      return timingSafeEqual(
        Buffer.from(csrfToken, 'hex'),
        Buffer.from(expectedToken, 'hex')
      );
    } catch {
      return false;
    }
  }

  private enrichRequest(req: Request, context: SecurityContext): void {
    // Add security context to request for downstream middleware
    (req as any).security = context;
  }

  private async handleSecurityError(
    error: any,
    req: Request,
    res: Response,
    context: SecurityContext
  ): Promise<void> {
    await this.logSecurityEvent('security_error', 'error', context, req, {
      error: error.message,
      stack: error.stack,
    });

    // Return appropriate error response without leaking details
    if (error.code?.startsWith('SSO_')) {
      res.status(error.statusCode || 403).json({
        error: 'Security validation failed',
        code: error.code,
        requestId: context.requestId,
      });
    } else {
      res.status(500).json({
        error: 'Internal security error',
        requestId: context.requestId,
      });
    }
  }

  private async logSecurityEvent(
    eventType: string,
    severity: string,
    context: SecurityContext,
    req: Request,
    additionalData?: any
  ): Promise<void> {
    const logData = {
      eventType,
      severity,
      requestId: context.requestId,
      clientIP: context.clientIP,
      userAgent: context.userAgent,
      path: req.path,
      method: req.method,
      productKey: context.productKey,
      userId: context.userId,
      organizationId: context.organizationId,
      riskScore: context.riskScore,
      securityFlags: context.securityFlags,
      timestamp: new Date().toISOString(),
      ...additionalData,
    };

    // Log to application logger
    this.logger.warn(`Security Event: ${eventType}`, logData);

    // In production, also store in database for audit trail
    // await this.securityAuditService.logEvent(logData);
  }

  // Database lookup methods (to be implemented with actual database service)
  private async isTokenBlacklisted(tokenHash: string): Promise<boolean> {
    // TODO: Implement database lookup
    return false;
  }

  private async isProductActive(productKey: string): Promise<boolean> {
    // TODO: Implement database lookup
    return true;
  }

  private async hasProductAccess(userId: string, productKey: string, organizationId?: string): Promise<boolean> {
    // TODO: Implement database lookup
    return true;
  }
}

export default SsoSecurityMiddleware;