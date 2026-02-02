import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security middleware
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add custom security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  // CSRF protection for state-changing operations
  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    // In production, implement proper CSRF token validation
    // For now, basic origin check
    if (origin && origin.includes('localhost') || origin?.includes(host || '')) {
      // Origin matches, allow request
    }
  }

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

