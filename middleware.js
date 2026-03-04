import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/utils/rateLimit';

export async function middleware(request) {
  // Only apply rate limiting to API routes
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get client IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : request.ip || 'unknown';

  // Get pathname for specific rate limiting
  const pathname = request.nextUrl.pathname;
  const result = checkRateLimit(ip, pathname);

  // Create response
  const response = NextResponse.next();

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', result.limit.toString());
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
  response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());

  // If not allowed, return 429
  if (!result.allowed) {
    return new NextResponse(
      JSON.stringify({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
        }
      }
    );
  }

  return response;
}

export const config = {
  matcher: '/api/:path*'
};
