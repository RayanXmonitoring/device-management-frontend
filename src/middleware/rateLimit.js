import { NextResponse } from 'next/server';

const rateLimit = new Map();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export function rateLimitMiddleware(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const key = `rate_limit:${ip}`;

  // Get or create rate limit data
  if (!rateLimit.has(key)) {
    rateLimit.set(key, {
      requests: 0,
      resetTime: now + WINDOW_MS,
    });
  }

  const data = rateLimit.get(key);

  // Check if window has expired
  if (now > data.resetTime) {
    data.requests = 0;
    data.resetTime = now + WINDOW_MS;
  }

  // Increment request count
  data.requests++;

  // Check if limit exceeded
  if (data.requests > MAX_REQUESTS) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Please try again later',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((data.resetTime - now) / 1000).toString(),
        },
      }
    );
  }

  // Clean up old entries periodically
  if (rateLimit.size > 1000) {
    const now = Date.now();
    for (const [key, value] of rateLimit.entries()) {
      if (now > value.resetTime) {
        rateLimit.delete(key);
      }
    }
  }

  return NextResponse.next();
}

// Export for use in API routes
export const config = {
  matcher: '/api/:path*',
};
