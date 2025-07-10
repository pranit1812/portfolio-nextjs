import Redis from 'ioredis';

// Initialize Redis client
// Check for Upstash Redis configuration first
const upstashRedisUrl = process.env.UPSTASH_REDIS_URL;
const upstashRedisToken = process.env.UPSTASH_REDIS_TOKEN;

// Fallback to generic Redis URL or localhost
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Create a Redis client instance
let redis: Redis;

// If Upstash Redis is configured, use it
if (upstashRedisUrl && upstashRedisToken) {
  console.log('Using Upstash Redis configuration');
  redis = new Redis(upstashRedisUrl, {
    password: upstashRedisToken,
    tls: {
      rejectUnauthorized: false
    }
  });
} else {
  // Otherwise use standard Redis configuration
  console.log('Using standard Redis configuration');
  redis = new Redis(redisUrl, {
    // Optional: Configure reconnect strategy
    reconnectOnError: (err) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        // Only reconnect when the error contains "READONLY"
        return true;
      }
      return false;
    },
    retryStrategy: (times) => {
      // Exponential backoff with a maximum of 10 seconds
      const delay = Math.min(times * 50, 10000);
      return delay;
    },
    // Optional: Configure connection timeout
    connectTimeout: 10000,
    // Optional: Configure max retries
    maxRetriesPerRequest: 5,
  });
}

// Handle Redis connection events
redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (error) => {
  console.error('Redis connection error:', error);
});

export default redis;