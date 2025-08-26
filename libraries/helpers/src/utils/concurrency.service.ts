import { ioRedis } from '@gitroom/nestjs-libraries/redis/redis.service';
import Bottleneck from 'bottleneck';
import { timer } from '@gitroom/helpers/utils/timer';
import { BadBody } from '@gitroom/nestjs-libraries/integrations/social.abstract';

// Check if we're using MockRedis (when Redis is not available)
const isUsingMockRedis = !process.env.REDIS_URL;

let connection: Bottleneck.IORedisConnection | undefined;

// Only create Redis connection if we have real Redis
if (!isUsingMockRedis) {
  try {
    connection = new Bottleneck.IORedisConnection({
      client: ioRedis,
    });
  } catch (error) {
    console.warn('Failed to create Bottleneck IORedisConnection, using local mode:', error);
  }
}

const mapper = {} as Record<string, Bottleneck>;

export const concurrency = async <T>(
  identifier: string,
  maxConcurrent = 1,
  func: (...args: any[]) => Promise<T>,
  ignoreConcurrency = false
) => {
  const strippedIdentifier = identifier.toLowerCase().split('-')[0];
  
  if (!mapper[strippedIdentifier]) {
    // Use Redis if available, otherwise use local mode
    const bottleneckConfig: any = {
      id: strippedIdentifier + '-concurrency-new',
      maxConcurrent,
      minTime: 1000,
    };

    if (connection && !isUsingMockRedis) {
      bottleneckConfig.datastore = 'ioredis';
      bottleneckConfig.connection = connection;
    } else {
      // Use local mode when Redis is not available
      bottleneckConfig.datastore = 'local';
      console.log(`Using local Bottleneck for ${strippedIdentifier} (Redis not available)`);
    }

    mapper[strippedIdentifier] = new Bottleneck(bottleneckConfig);
  }
  let load: T;

  if (ignoreConcurrency) {
    return await func();
  }

  try {
    load = await mapper[strippedIdentifier].schedule<T>(
      { expiration: 60000 },
      async () => {
        try {
          return await func();
        } catch (err) {}
      }
    );
  } catch (err) {
    console.log(err);
    throw new BadBody(
      identifier,
      JSON.stringify({}),
      {} as any,
      `Something is wrong with ${identifier}`
    );
  }

  return load;
};
