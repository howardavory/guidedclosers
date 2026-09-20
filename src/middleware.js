import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-local-dev-key');

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // 1. Check if the path is broadly protected
  const isProtectedPath = pathname.startsWith('/dashboard') || pathname.startsWith('/settings');

  if (isProtectedPath) {
    const token = req.cookies.get('auth_token')?.value;

    // 2. Global Security Wall: Redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      // 3. Verify JWT
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role;

      // 4. Role-Based Access Control (RBAC) boundaries
      const adminOnlyPaths = ['/settings/billing', '/settings/team', '/dashboard/analytics'];
      const managerAndAbovePaths = ['/dashboard/reports'];
      
      const isAdminPath = adminOnlyPaths.some(p => pathname.startsWith(p));
      const isManagerPath = managerAndAbovePaths.some(p => pathname.startsWith(p));

      if (isAdminPath && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      if (isManagerPath && !['ADMIN', 'MANAGER'].includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

    } catch (err) {
      // Invalid or expired token triggers security wall bounce
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('auth_token'); // Clear the bad cookie
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
  ],
};
