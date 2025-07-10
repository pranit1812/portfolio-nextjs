import { NextResponse, NextRequest } from 'next/server';
import { rateLimiterMiddleware } from './lib/rate-limiter';

// Define which routes should be rate limited
const RATE_LIMITED_PATHS = [
  '/api/',  // All API routes
];

/**
 * Next.js Middleware function
 * Applies rate limiting to specified routes
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the request path should be rate limited
  const shouldRateLimit = RATE_LIMITED_PATHS.some(path => pathname.startsWith(path));
  
  // If not a rate-limited path, continue with the request
  if (!shouldRateLimit) {
    return NextResponse.next();
  }
  
  // Apply rate limiting
  const rateLimitResult = await rateLimiterMiddleware(request);
  
  // If rate limited, return the rate limit response
  if (rateLimitResult) {
    return rateLimitResult;
  }
  
  // Otherwise, continue with the request
  return NextResponse.next();
}

// Configure which routes this middleware should run on
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
};