import { updateSession } from '@/lib/supabase/proxy';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Handle trailing slash for webhook endpoint specifically
  if (url.pathname === '/api/payment/webhook/' && request.method === 'POST') {
    url.pathname = '/api/payment/webhook';
    return NextResponse.rewrite(url);
  }

  // Update session and handle authentication
  const response = await updateSession(request);

  // Skip auth check for auth routes
  if (
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return response;
  }

  // Special handling for admin routes
  if (request.nextUrl.pathname.startsWith('/og-admin')) {
    // If the user is not authenticated, redirect to login
    if (response.status === 307) {
      return response;
    }

    // The updateSession function already handles redirecting unauthenticated users
    // So we just need to check if the user is authenticated
    return response;
  }

  // For other routes, use the default behavior from updateSession
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
