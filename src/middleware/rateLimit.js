import { NextResponse } from 'next/server';
import redis from 'redis';

// Redis client for rate limiting
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.connect();

export async function rateLimitMiddleware(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const path = request.nextUrl.pathname;
  const key = `rate_limit:${ip}:${path}`;
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000; // 15 minutes
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;

  try {
    const current = await redisClient.get(key);
    const requests = current ? parseInt(current) : 0;

    if (requests >= maxRequests) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Please try again later',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(windowMs / 1000).toString(),
          },
        }
      );
    }

    // Increment request count
    const pipeline = redisClient.multi();
    pipeline.incr(key);
    pipeline.expire(key, Math.ceil(windowMs / 1000));
    await pipeline.exec();

    return NextResponse.next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    // If Redis fails, allow the request
    return NextResponse.next();
  }
}
