import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { config } from '../config';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

export function rateLimitMiddleware(request: NextRequest) {
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const windowMs = config.rateLimit.windowMs;
  const maxRequests = config.rateLimit.maxRequests;

  // Clean up old entries
  for (const [key, value] of rateLimit.entries()) {
    if (now > value.resetTime) {
      rateLimit.delete(key);
    }
  }

  // Get or create rate limit entry
  const rateLimitInfo = rateLimit.get(ip) || {
    count: 0,
    resetTime: now + windowMs,
  };

  // Increment request count
  rateLimitInfo.count++;
  rateLimit.set(ip, rateLimitInfo);

  // Check if rate limit exceeded
  if (rateLimitInfo.count > maxRequests) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests',
        retryAfter: Math.ceil((rateLimitInfo.resetTime - now) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimitInfo.resetTime - now) / 1000).toString(),
        },
      }
    );
  }

  return null;
} 