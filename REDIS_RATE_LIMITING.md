# Redis Rate Limiting Configuration

This document explains how to set up and use Redis for rate limiting in your Next.js application.

## Overview

Rate limiting is implemented using Redis as a storage backend and the `rate-limiter-flexible` package. This setup allows you to:

- Limit the number of requests per time window
- Apply rate limiting to specific API routes
- Block excessive requests to protect your application from abuse

## Setup Instructions

### 1. Redis Configuration

You have two options for Redis:

#### Option A: Local Redis (Development)

1. Install Redis locally:
   - **Windows**: Use [Redis for Windows](https://github.com/tporadowski/redis/releases) or WSL2
   - **Mac**: `brew install redis`
   - **Linux**: `sudo apt install redis-server`

2. Start Redis server:
   - **Windows**: Start the Redis service
   - **Mac/Linux**: `redis-server`

#### Option B: Upstash Redis (Production)

1. Create an account at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and TOKEN from the Upstash console

### 2. Environment Variables

Update your `.env` file with the Redis configuration:

```env
# For Upstash Redis
UPSTASH_REDIS_URL=your-upstash-redis-url
UPSTASH_REDIS_TOKEN=your-upstash-redis-token

# For standard Redis (alternative)
REDIS_URL=redis://localhost:6379
```

### 3. Rate Limiting Configuration

The rate limiting is configured in `lib/rate-limiter.ts`. You can adjust the following parameters:

```typescript
const rateLimiterOptions = {
  // Number of points (requests)
  points: 10, // 10 requests
  // Per duration in seconds
  duration: 60, // per 1 minute
  // Block duration in seconds if consumed more than points
  blockDuration: 60, // Block for 1 minute if exceeded
};
```

## Usage

### Global Rate Limiting

The `middleware.ts` file applies rate limiting to all API routes by default. You can modify the `RATE_LIMITED_PATHS` array to include or exclude specific paths.

### Per-Route Rate Limiting

For individual API routes, use the `withRateLimit` higher-order function:

```typescript
import { withRateLimit } from '@/lib/rate-limiter';

async function handler(req, res) {
  // Your API logic here
}

// Apply rate limiting to this handler
export const GET = withRateLimit(handler);
export const POST = withRateLimit(handler);
```

### Custom Rate Limiting

For more advanced use cases, you can create custom rate limiters with different configurations:

```typescript
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from '@/lib/redis';

// Create a stricter rate limiter for sensitive endpoints
const strictRateLimiter = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'ratelimit:strict:',
  points: 5,
  duration: 60,
});
```

## Testing Rate Limiting

To test if rate limiting is working:

1. Make multiple requests to an API endpoint in quick succession
2. After exceeding the limit (default: 10 requests per minute), you should receive a 429 status code with the message "Too many requests, please try again later."

## Monitoring

You can monitor rate limiting by:

1. Checking your Redis instance for keys with the prefix `ratelimit:`
2. Reviewing your application logs for rate limiting messages
3. Setting up alerts for excessive rate limiting events

## Troubleshooting

- **Redis Connection Issues**: Ensure Redis is running and accessible
- **Rate Limiting Not Working**: Check that the middleware is properly configured
- **Too Strict/Lenient Limits**: Adjust the `points` and `duration` parameters in the rate limiter options