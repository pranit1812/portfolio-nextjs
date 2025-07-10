import { NextRequest, NextResponse } from 'next/server';
import redis, { isRedisAvailable } from './redis';

// Fallback to in-memory rate limit store if Redis is not configured
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

// Rate limiting configuration
const RATE_LIMIT = 10; // 10 requests
const WINDOW_MS = 60 * 1000; // per 1 minute
const REDIS_TTL = 60; // 60 seconds in Redis

/**
 * Rate limiting middleware for Next.js API routes
 * @param req - Next.js request object
 * @param identifier - Optional custom identifier (defaults to IP address)
 * @returns NextResponse or null if rate limit not exceeded
 */
export async function rateLimiterMiddleware(
  req: NextRequest,
  identifier?: string
): Promise<NextResponse | null> {
  try {
    // Get IP address or use custom identifier
    const ip = identifier || req.ip || req.headers.get('x-forwarded-for') || '127.0.0.1';
    const key = `ratelimit:${ip}`;
    
    let count: number;
    let isLimited = false;

    if (isRedisAvailable() && redis) {
      // Use Redis for rate limiting
      try {
        // Get current count
        const currentCount = await redis.get(key);
        count = currentCount ? parseInt(currentCount.toString()) + 1 : 1;
        
        // Set new count with TTL
        await redis.setex(key, REDIS_TTL, count);
        
        isLimited = count > RATE_LIMIT;
      } catch (redisError) {
        console.error('Redis error, falling back to in-memory:', redisError);
        // Fall back to in-memory if Redis fails
        isLimited = checkInMemoryRateLimit(ip);
      }
    } else {
      // Use in-memory rate limiting
      isLimited = checkInMemoryRateLimit(ip);
    }
    
    if (isLimited) {
      console.warn(`Rate limit exceeded for ${ip}`);
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }
    
    // If successful (not rate limited), return null to continue
    return null;
  } catch (error) {
    console.error('Rate limiter error:', error);
    // If there's any error, allow the request to continue
    return null;
  }
}

/**
 * In-memory rate limiting fallback
 */
function checkInMemoryRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(ip);
  
  if (!userLimit || now - userLimit.lastReset > WINDOW_MS) {
    // Reset or create new limit
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return false;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return true;
  }
  
  // Increment count
  userLimit.count++;
  return false;
}

/**
 * Higher-order function to apply rate limiting to API route handlers
 * @param handler - API route handler function
 * @returns Wrapped handler function with rate limiting
 */
export function withRateLimit(handler: Function) {
  return async (req: NextRequest, ...args: any[]) => {
    // Apply rate limiting
    const rateLimitResult = await rateLimiterMiddleware(req);
    
    // If rate limited, return the rate limit response
    if (rateLimitResult) {
      return rateLimitResult;
    }
    
    // Otherwise, proceed with the original handler
    return handler(req, ...args);
  };
}