import { Redis } from '@upstash/redis';

// Redis client for Upstash Redis
let redis: Redis | null = null;

// Initialize Redis client only if valid configuration is provided
try {
  if (
    process.env.UPSTASH_REDIS_URL &&
    process.env.UPSTASH_REDIS_TOKEN &&
    process.env.UPSTASH_REDIS_URL.startsWith('https://') &&
    !process.env.UPSTASH_REDIS_URL.includes('your-upstash-redis-url')
  ) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN,
    });
    console.log('Redis client initialized successfully with Upstash');
  } else {
    console.log('Redis not configured, falling back to in-memory storage');
  }
} catch (error) {
  console.error('Failed to initialize Redis client:', error);
  redis = null;
}

// Export Redis instance (can be null if not configured)
export default redis;

// Export a helper function to check if Redis is available
export const isRedisAvailable = (): boolean => {
  return redis !== null;
};

// Export Redis types for TypeScript
export type { Redis };