import { type NextRequest, NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers (supplement next.config.ts headers)
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // Rate limiting header hint for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('X-RateLimit-Policy', 'public-api');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
