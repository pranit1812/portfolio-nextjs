import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/rate-limiter';

/**
 * Example API route with rate limiting
 * This demonstrates how to apply rate limiting to a specific API endpoint
 */
async function handler(req: NextRequest) {
  // Your API logic here
  return NextResponse.json({ 
    message: 'API request successful',
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.nextUrl.pathname,
  });
}

// Apply rate limiting to this handler
export const GET = withRateLimit(handler);
export const POST = withRateLimit(handler);