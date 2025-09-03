import * as crypto from 'crypto';
import { PathValidationResult, FileMetadata, GCSConfiguration } from './gcs.types';

/**
 * Advanced caching utility with TTL and memory management
 */
export class GCSCacheManager<T> {
  private cache = new Map<string, { data: T; timestamp: number; accessCount: number }>();
  private readonly ttl: number;
  private readonly maxSize: number;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(ttl: number = 300000, maxSize: number = 1000) { // Default 5 minutes TTL, 1000 items max
    this.ttl = ttl;
    this.maxSize = maxSize;
    
    // Start periodic cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 300000);
  }

  /**
   * Get item from cache
   */
  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access count for LRU-like behavior
    item.accessCount++;
    return item.data;
  }

  /**
   * Set item in cache
   */
  set(key: string, data: T): void {
    // Check cache size limit
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 1,
    });
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete specific key
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; ttl: number; hitRate?: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl,
    };
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict least recently used item
   */
  private evictLeastUsed(): void {
    let lruKey: string | null = null;
    let lruAccessCount = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.accessCount < lruAccessCount) {
        lruAccessCount = item.accessCount;
        lruKey = key;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
    }
  }

  /**
   * Destroy cache manager and cleanup
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
    this.clear();
  }
}

/**
 * Advanced path validation and resolution utility
 */
export class GCSPathResolver {
  private readonly allowedPatterns: RegExp[];
  private readonly pathCache: GCSCacheManager<PathValidationResult>;

  constructor(
    allowedPathPatterns: string[] = [],
    enableCaching: boolean = true,
    cacheConfig?: { ttl: number; maxSize: number }
  ) {
    // Convert string patterns to RegExp objects
    this.allowedPatterns = allowedPathPatterns.map(pattern => new RegExp(pattern));
    
    // Initialize cache if enabled
    this.pathCache = enableCaching 
      ? new GCSCacheManager<PathValidationResult>(
          cacheConfig?.ttl || 300000, // 5 minutes
          cacheConfig?.maxSize || 500
        )
      : null as any;
  }

  /**
   * Validate and resolve file path with comprehensive security checks
   */
  validatePath(filePath: string, userId?: string, options: {
    allowTraversal?: boolean;
    normalizeCase?: boolean;
    strictPatterns?: boolean;
  } = {}): PathValidationResult {
    const cacheKey = this.generateCacheKey(filePath, userId, options);
    
    // Try cache first
    if (this.pathCache) {
      const cached = this.pathCache.get(cacheKey);
      if (cached) return cached;
    }

    const result = this.performValidation(filePath, userId, options);
    
    // Cache result
    if (this.pathCache) {
      this.pathCache.set(cacheKey, result);
    }

    return result;
  }

  /**
   * Extract user information from path patterns
   */
  extractUserInfo(filePath: string): {
    userId?: string;
    userFolder?: string;
    isDev: boolean;
    environment: 'dev' | 'prod' | 'unknown';
  } {
    const pathParts = filePath.split('/');
    
    // Look for user patterns in different positions
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      
      // Check for userId-DEV or userId patterns
      if (part.match(/^[a-zA-Z0-9_-]+(-DEV)?$/)) {
        const isDev = part.endsWith('-DEV');
        const userId = isDev ? part.replace('-DEV', '') : part;
        
        // Validate if this looks like a user ID (numeric or alphanumeric)
        if (userId.match(/^[a-zA-Z0-9_-]+$/)) {
          return {
            userId,
            userFolder: part,
            isDev,
            environment: isDev ? 'dev' : 'prod',
          };
        }
      }
    }

    return {
      isDev: false,
      environment: 'unknown',
    };
  }

  /**
   * Generate secure, normalized path variations for flexibility
   */
  generatePathVariations(filePath: string): string[] {
    const variations: string[] = [];
    const normalized = this.normalizePath(filePath);
    
    variations.push(normalized);
    
    // Add variation without leading slash
    if (normalized.startsWith('/')) {
      variations.push(normalized.substring(1));
    } else {
      variations.push('/' + normalized);
    }

    // Add variations with different separators normalized
    const unixPath = normalized.replace(/\\/g, '/');
    if (unixPath !== normalized) {
      variations.push(unixPath);
    }

    return [...new Set(variations)]; // Remove duplicates
  }

  /**
   * Check if path matches any allowed patterns
   */
  matchesAllowedPatterns(path: string): { matches: boolean; matchedPattern?: string } {
    for (let i = 0; i < this.allowedPatterns.length; i++) {
      const pattern = this.allowedPatterns[i];
      if (pattern.test(path)) {
        return { 
          matches: true, 
          matchedPattern: pattern.source 
        };
      }
    }
    
    return { matches: false };
  }

  /**
   * Normalize path by removing dangerous elements and standardizing format
   */
  private normalizePath(filePath: string): string {
    return filePath
      .trim()
      .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
      .replace(/\\/g, '/') // Normalize path separators
      .replace(/\/+/g, '/') // Remove duplicate slashes
      .replace(/\.\./g, ''); // Remove parent directory references
  }

  /**
   * Perform the actual path validation logic
   */
  private performValidation(
    filePath: string, 
    userId?: string, 
    options: {
      allowTraversal?: boolean;
      normalizeCase?: boolean;
      strictPatterns?: boolean;
    } = {}
  ): PathValidationResult {
    const result: PathValidationResult = {
      isValid: false,
      sanitizedPath: '',
      errors: []
    };

    try {
      // Basic normalization
      let sanitizedPath = this.normalizePath(filePath);
      
      if (options.normalizeCase) {
        sanitizedPath = sanitizedPath.toLowerCase();
      }

      // Security checks
      const securityErrors = this.performSecurityChecks(sanitizedPath, options);
      if (securityErrors.length > 0) {
        result.errors = securityErrors;
        return result;
      }

      // Pattern matching
      if (this.allowedPatterns.length > 0) {
        const patternResult = this.matchesAllowedPatterns(sanitizedPath);
        if (!patternResult.matches) {
          result.errors!.push(options.strictPatterns 
            ? 'Path does not match any allowed patterns'
            : 'Path format may not be optimal');
          
          if (options.strictPatterns) {
            return result;
          }
        }
      }

      // Extract user information
      const userInfo = this.extractUserInfo(sanitizedPath);
      
      // User ID validation
      if (userId && userInfo.userId && userInfo.userId !== userId) {
        result.errors!.push('User ID does not match path');
        return result;
      }

      // Success
      result.isValid = true;
      result.sanitizedPath = sanitizedPath;
      result.userFolder = userInfo.userFolder;
      result.isDev = userInfo.isDev;

    } catch (error) {
      result.errors!.push(`Path validation error: ${error}`);
    }

    return result;
  }

  /**
   * Perform security checks on the path
   */
  private performSecurityChecks(path: string, options: {
    allowTraversal?: boolean;
  } = {}): string[] {
    const errors: string[] = [];

    // Path traversal check
    if (!options.allowTraversal && (path.includes('..') || path.includes('\\..'))) {
      errors.push('Path traversal detected');
    }

    // Null byte injection check
    if (path.includes('\0')) {
      errors.push('Null byte injection detected');
    }

    // Check for suspicious characters
    const suspiciousChars = /[<>:"|?*]/;
    if (suspiciousChars.test(path)) {
      errors.push('Path contains suspicious characters');
    }

    // Check for extremely long paths
    if (path.length > 1000) {
      errors.push('Path too long');
    }

    // Check for empty path
    if (!path || path.length === 0) {
      errors.push('Empty path not allowed');
    }

    return errors;
  }

  /**
   * Generate cache key for path validation
   */
  private generateCacheKey(filePath: string, userId?: string, options: any = {}): string {
    const keyData = {
      path: filePath,
      user: userId || '',
      opts: JSON.stringify(options)
    };
    
    return crypto
      .createHash('md5')
      .update(JSON.stringify(keyData))
      .digest('hex');
  }

  /**
   * Get validation statistics
   */
  getStats(): any {
    return {
      allowedPatterns: this.allowedPatterns.length,
      cache: this.pathCache ? this.pathCache.getStats() : null,
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.pathCache) {
      this.pathCache.destroy();
    }
  }
}

/**
 * GCS API wrapper with retry logic and error handling
 */
export class GCSApiWrapper {
  private readonly maxRetries: number;
  private readonly baseDelay: number;
  private readonly maxDelay: number;

  constructor(config?: {
    maxRetries?: number;
    baseDelay?: number;
    maxDelay?: number;
  }) {
    this.maxRetries = config?.maxRetries || 3;
    this.baseDelay = config?.baseDelay || 1000;
    this.maxDelay = config?.maxDelay || 30000;
  }

  /**
   * Execute operation with exponential backoff retry
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationName: string = 'GCS Operation'
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        // If this is the last attempt, throw
        if (attempt === this.maxRetries) {
          throw new Error(`${operationName} failed after ${this.maxRetries} attempts. Last error: ${lastError.message}`);
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt - 1),
          this.maxDelay
        );

        // Add jitter
        const jitteredDelay = delay + (Math.random() * 1000);

        console.warn(`${operationName} attempt ${attempt} failed: ${lastError.message}. Retrying in ${jitteredDelay}ms...`);
        
        await this.sleep(jitteredDelay);
      }
    }

    throw lastError!;
  }

  /**
   * Check if error should not be retried
   */
  private isNonRetryableError(error: any): boolean {
    if (!error) return false;

    // HTTP status codes that shouldn't be retried
    const nonRetryableCodes = [400, 401, 403, 404];
    if (error.code && nonRetryableCodes.includes(error.code)) {
      return true;
    }

    // Specific error types
    if (error.message) {
      const message = error.message.toLowerCase();
      if (message.includes('permission denied') || 
          message.includes('unauthorized') ||
          message.includes('forbidden') ||
          message.includes('not found')) {
        return true;
      }
    }

    return false;
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Performance monitoring utility for GCS operations
 */
export class GCSPerformanceMonitor {
  private metrics: Map<string, {
    count: number;
    totalTime: number;
    minTime: number;
    maxTime: number;
    errors: number;
  }> = new Map();

  /**
   * Track operation performance
   */
  async trackOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    
    try {
      const result = await operation();
      this.recordMetric(operationName, Date.now() - startTime, false);
      return result;
    } catch (error) {
      this.recordMetric(operationName, Date.now() - startTime, true);
      throw error;
    }
  }

  /**
   * Record metric data
   */
  private recordMetric(operationName: string, duration: number, isError: boolean): void {
    const existing = this.metrics.get(operationName);
    
    if (existing) {
      existing.count++;
      existing.totalTime += duration;
      existing.minTime = Math.min(existing.minTime, duration);
      existing.maxTime = Math.max(existing.maxTime, duration);
      if (isError) existing.errors++;
    } else {
      this.metrics.set(operationName, {
        count: 1,
        totalTime: duration,
        minTime: duration,
        maxTime: duration,
        errors: isError ? 1 : 0,
      });
    }
  }

  /**
   * Get performance statistics
   */
  getStats(): Record<string, {
    count: number;
    avgTime: number;
    minTime: number;
    maxTime: number;
    errorRate: number;
  }> {
    const stats: any = {};
    
    for (const [name, metric] of this.metrics.entries()) {
      stats[name] = {
        count: metric.count,
        avgTime: metric.totalTime / metric.count,
        minTime: metric.minTime,
        maxTime: metric.maxTime,
        errorRate: metric.errors / metric.count,
      };
    }

    return stats;
  }

  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

/**
 * Utility functions for common GCS operations
 */
export class GCSUtils {
  /**
   * Generate secure filename
   */
  static generateSecureFilename(originalName?: string, extension?: string): string {
    const timestamp = Date.now();
    const random = crypto.randomBytes(6).toString('hex');
    
    if (extension) {
      return `${timestamp}_${random}.${extension}`;
    } else if (originalName) {
      const ext = originalName.split('.').pop() || 'bin';
      return `${timestamp}_${random}.${ext}`;
    } else {
      return `${timestamp}_${random}.bin`;
    }
  }

  /**
   * Extract file extension from content type or filename
   */
  static getFileExtension(contentType?: string, filename?: string): string {
    if (filename) {
      const parts = filename.split('.');
      if (parts.length > 1) {
        return parts.pop()!.toLowerCase();
      }
    }

    if (contentType) {
      const mimeToExt: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'video/mp4': 'mp4',
        'video/mpeg': 'mpg',
        'video/webm': 'webm',
        'audio/mp3': 'mp3',
        'audio/wav': 'wav',
        'application/pdf': 'pdf',
        'text/plain': 'txt',
        'application/json': 'json',
      };
      
      return mimeToExt[contentType] || 'bin';
    }

    return 'bin';
  }

  /**
   * Validate file size
   */
  static validateFileSize(size: number, maxSize: number): { valid: boolean; error?: string } {
    if (size > maxSize) {
      return {
        valid: false,
        error: `File size ${this.formatBytes(size)} exceeds maximum allowed size ${this.formatBytes(maxSize)}`
      };
    }
    
    return { valid: true };
  }

  /**
   * Format bytes in human readable format
   */
  static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Check if file type is supported
   */
  static isSupportedFileType(contentType: string, allowedTypes?: string[]): boolean {
    if (!allowedTypes || allowedTypes.length === 0) {
      return true; // Allow all if no restrictions
    }

    return allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return contentType.startsWith(type.slice(0, -1));
      }
      return contentType === type;
    });
  }
}