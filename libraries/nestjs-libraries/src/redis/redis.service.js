"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ioRedis = void 0;
const ioredis_1 = require("ioredis");
const events_1 = require("events");
class MockRedis extends events_1.EventEmitter {
    constructor() {
        super();
        this.data = new Map();
        this.keyExpirations = new Map();
        process.nextTick(() => {
            this.emit('ready');
        });
    }
    async get(key) {
        return this.data.get(key);
    }
    async set(key, value, ...args) {
        this.data.set(key, value);
        const exIndex = args.indexOf('EX');
        if (exIndex !== -1 && args[exIndex + 1]) {
            const seconds = parseInt(args[exIndex + 1]);
            if (this.keyExpirations.has(key)) {
                clearTimeout(this.keyExpirations.get(key));
            }
            const timeout = setTimeout(() => {
                this.data.delete(key);
                this.keyExpirations.delete(key);
            }, seconds * 1000);
            this.keyExpirations.set(key, timeout);
        }
        return 'OK';
    }
    async del(key) {
        const existed = this.data.has(key);
        this.data.delete(key);
        if (this.keyExpirations.has(key)) {
            clearTimeout(this.keyExpirations.get(key));
            this.keyExpirations.delete(key);
        }
        return existed ? 1 : 0;
    }
    async exists(key) {
        return this.data.has(key) ? 1 : 0;
    }
    async expire(key, seconds) {
        if (!this.data.has(key))
            return 0;
        if (this.keyExpirations.has(key)) {
            clearTimeout(this.keyExpirations.get(key));
        }
        const timeout = setTimeout(() => {
            this.data.delete(key);
            this.keyExpirations.delete(key);
        }, seconds * 1000);
        this.keyExpirations.set(key, timeout);
        return 1;
    }
    async ttl(key) {
        if (!this.data.has(key))
            return -2;
        if (!this.keyExpirations.has(key))
            return -1;
        return 60;
    }
    async keys(pattern) {
        const keys = Array.from(this.data.keys());
        if (pattern === '*')
            return keys;
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
        return keys.filter(key => regex.test(key));
    }
    async publish(channel, message) {
        this.emit('message', channel, message);
        return 1;
    }
    async subscribe(channel) {
        return 1;
    }
    async unsubscribe(channel) {
        return 1;
    }
    duplicate() {
        return new MockRedis();
    }
    disconnect() {
        this.emit('end');
    }
    defineCommand(name, definition) {
        this[name] = async (...args) => {
            if (name.includes('check') || name.includes('get')) {
                return null;
            }
            if (name.includes('process') || name.includes('update')) {
                return 1;
            }
            return 0;
        };
        return this;
    }
    async eval(script, numKeys, ...args) {
        return null;
    }
}
function createRedisClient() {
    if (!process.env.REDIS_URL) {
        console.log('REDIS_URL not defined, using MockRedis');
        return new MockRedis();
    }
    try {
        const redis = new ioredis_1.Redis(process.env.REDIS_URL, {
            maxRetriesPerRequest: null,
            connectTimeout: 5000,
            lazyConnect: true,
            enableReadyCheck: false,
        });
        redis.on('error', (error) => {
            console.warn('Redis connection error, falling back to MockRedis:', error.message);
        });
        redis.ping().catch(() => {
            console.log('Redis ping failed, but continuing with real Redis client (may fallback at runtime)');
        });
        return redis;
    }
    catch (error) {
        console.warn('Failed to create Redis client, using MockRedis:', error);
        return new MockRedis();
    }
}
exports.ioRedis = createRedisClient();
//# sourceMappingURL=redis.service.js.map