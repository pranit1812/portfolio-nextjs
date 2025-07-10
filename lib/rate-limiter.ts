import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from './redis';
import { NextRequest, NextResponse } from 'next/server';

// Configure rate limiter options
const rateLimiterOptions = {
  // Use the Redis instance
  storeClient: redis,
  // Key prefix for Redis
  keyPrefix: 'ratelimit:',
  // Number of points (requests)
  points: 10, // 10 requests
  // Per duration in seconds
  duration: 60, // per 1 minute
  // Custom error message
  customMessage: 'Too many requests, please try again later.',
  // Block duration in seconds if consumed more than points
  blockDuration: 60, // Block for 1 minute if exceeded
};

// Create a rate limiter instance
export const rateLimiter = new RateLimiterRedis(rateLimiterOptions);

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
    const ip = identifier || req.ip || '127.0.0.1';
    
    // Consume points
    await rateLimiter.consume(ip);
    
    // If successful (not rate limited), return null to continue
    return null;
  } catch (error) {
    // If rate limit exceeded
    if (error instanceof Error) {
      console.warn(`Rate limit exceeded for ${req.ip || 'unknown IP'}: ${error.message}`);
    }
    
    // Return rate limit exceeded response
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { status: 429, headers: { 'Retry-After': '60' } }
    );
  }
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