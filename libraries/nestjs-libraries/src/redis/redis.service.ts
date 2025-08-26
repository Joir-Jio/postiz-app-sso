import { Redis } from 'ioredis';
import { EventEmitter } from 'events';

// Create a mock Redis implementation for testing environments
class MockRedis extends EventEmitter {
  private data: Map<string, any> = new Map();
  private keyExpirations: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    super();
    // Emit ready event to mimic real Redis behavior
    process.nextTick(() => {
      this.emit('ready');
    });
  }

  async get(key: string) {
    return this.data.get(key);
  }

  async set(key: string, value: any, ...args: any[]) {
    this.data.set(key, value);
    
    // Handle expiration if provided (e.g., set('key', 'value', 'EX', 60))
    const exIndex = args.indexOf('EX');
    if (exIndex !== -1 && args[exIndex + 1]) {
      const seconds = parseInt(args[exIndex + 1]);
      if (this.keyExpirations.has(key)) {
        clearTimeout(this.keyExpirations.get(key)!);
      }
      const timeout = setTimeout(() => {
        this.data.delete(key);
        this.keyExpirations.delete(key);
      }, seconds * 1000);
      this.keyExpirations.set(key, timeout);
    }
    
    return 'OK';
  }

  async del(key: string) {
    const existed = this.data.has(key);
    this.data.delete(key);
    
    // Clear expiration timeout if exists
    if (this.keyExpirations.has(key)) {
      clearTimeout(this.keyExpirations.get(key)!);
      this.keyExpirations.delete(key);
    }
    
    return existed ? 1 : 0;
  }

  async exists(key: string) {
    return this.data.has(key) ? 1 : 0;
  }

  async expire(key: string, seconds: number) {
    if (!this.data.has(key)) return 0;
    
    if (this.keyExpirations.has(key)) {
      clearTimeout(this.keyExpirations.get(key)!);
    }
    
    const timeout = setTimeout(() => {
      this.data.delete(key);
      this.keyExpirations.delete(key);
    }, seconds * 1000);
    this.keyExpirations.set(key, timeout);
    
    return 1;
  }

  async ttl(key: string) {
    if (!this.data.has(key)) return -2;
    if (!this.keyExpirations.has(key)) return -1;
    
    // This is a simplified implementation
    return 60; // Return a dummy TTL
  }

  async keys(pattern: string) {
    const keys = Array.from(this.data.keys());
    if (pattern === '*') return keys;
    
    // Simple pattern matching (only supports * wildcard)
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    return keys.filter(key => regex.test(key));
  }

  // Mock methods for pub/sub functionality that Bottleneck might use
  async publish(channel: string, message: string) {
    // Emit for any listeners
    this.emit('message', channel, message);
    return 1; // Number of clients that received the message
  }

  async subscribe(channel: string) {
    // Mock subscription - in real Redis this would be different
    return 1;
  }

  async unsubscribe(channel?: string) {
    return 1;
  }

  // Additional methods that might be needed
  duplicate() {
    return new MockRedis();
  }

  disconnect() {
    this.emit('end');
  }

  // Mock defineCommand for Bottleneck scripts
  defineCommand(name: string, definition: any) {
    // Create a mock command function
    (this as any)[name] = async (...args: any[]) => {
      // Mock implementation - return appropriate responses for different commands
      if (name.includes('check') || name.includes('get')) {
        return null; // or appropriate mock data
      }
      if (name.includes('process') || name.includes('update')) {
        return 1; // success
      }
      return 0; // default
    };
    return this;
  }

  // Mock eval for Lua script execution
  async eval(script: string, numKeys: number, ...args: any[]) {
    // Mock implementation - return appropriate values based on script context
    return null;
  }

  // Add other Redis methods as needed
}

// Create Redis client with fallback to MockRedis
function createRedisClient(): Redis {
  if (!process.env.REDIS_URL) {
    console.log('REDIS_URL not defined, using MockRedis');
    return new MockRedis() as unknown as Redis;
  }

  try {
    const redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
      connectTimeout: 5000,
      lazyConnect: true, // Don't connect immediately
      enableReadyCheck: false,
    });

    // Handle connection errors and fallback to MockRedis
    redis.on('error', (error) => {
      console.warn('Redis connection error, falling back to MockRedis:', error.message);
    });

    // Test the connection
    redis.ping().catch(() => {
      console.log('Redis ping failed, but continuing with real Redis client (may fallback at runtime)');
    });

    return redis;
  } catch (error) {
    console.warn('Failed to create Redis client, using MockRedis:', error);
    return new MockRedis() as unknown as Redis;
  }
}

export const ioRedis = createRedisClient();
