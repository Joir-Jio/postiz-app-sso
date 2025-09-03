"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.concurrency = void 0;
const tslib_1 = require("tslib");
const redis_service_1 = require("@gitroom/nestjs-libraries/redis/redis.service");
const bottleneck_1 = tslib_1.__importDefault(require("bottleneck"));
const social_abstract_1 = require("@gitroom/nestjs-libraries/integrations/social.abstract");
const isUsingMockRedis = !process.env.REDIS_URL;
let connection;
if (!isUsingMockRedis) {
    try {
        connection = new bottleneck_1.default.IORedisConnection({
            client: redis_service_1.ioRedis,
        });
    }
    catch (error) {
        console.warn('Failed to create Bottleneck IORedisConnection, using local mode:', error);
    }
}
const mapper = {};
const concurrency = async (identifier, maxConcurrent = 1, func, ignoreConcurrency = false) => {
    const strippedIdentifier = identifier.toLowerCase().split('-')[0];
    if (!mapper[strippedIdentifier]) {
        const bottleneckConfig = {
            id: strippedIdentifier + '-concurrency-new',
            maxConcurrent,
            minTime: 1000,
        };
        if (connection && !isUsingMockRedis) {
            bottleneckConfig.datastore = 'ioredis';
            bottleneckConfig.connection = connection;
        }
        else {
            bottleneckConfig.datastore = 'local';
            console.log(`Using local Bottleneck for ${strippedIdentifier} (Redis not available)`);
        }
        mapper[strippedIdentifier] = new bottleneck_1.default(bottleneckConfig);
    }
    let load;
    if (ignoreConcurrency) {
        return await func();
    }
    try {
        load = await mapper[strippedIdentifier].schedule({ expiration: 60000 }, async () => {
            try {
                return await func();
            }
            catch (err) { }
        });
    }
    catch (err) {
        console.log(err);
        throw new social_abstract_1.BadBody(identifier, JSON.stringify({}), {}, `Something is wrong with ${identifier}`);
    }
    return load;
};
exports.concurrency = concurrency;
//# sourceMappingURL=concurrency.service.js.map