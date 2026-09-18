import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Next.js Edge runtime requires 'jose' for JWT operations, not jsonwebtoken

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-local-dev-key');

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Define strict RBAC protected paths
  const adminOnlyPaths = ['/settings/billing', '/settings/team', '/dashboard/analytics'];
  const managerAndAbovePaths = ['/dashboard/reports'];
  
  const isAdminPath = adminOnlyPaths.some(p => pathname.startsWith(p));
  const isManagerPath = managerAndAbovePaths.some(p => pathname.startsWith(p));

  // If path is protected, verify token
  if (isAdminPath || isManagerPath) {
    const token = req.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      // In Edge runtime, we use `jose` to verify JWTs
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role;

      // Access checks
      if (isAdminPath && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      if (isManagerPath && !['ADMIN', 'MANAGER'].includes(role)) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

    } catch (err) {
      // Token invalid or expired
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/settings/:path*',
    '/dashboard/:path*',
  ],
};
