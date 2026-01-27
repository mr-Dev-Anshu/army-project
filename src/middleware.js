import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { setCurrentUserId } from "./lib/mongoose-plugins/auditsFields.js";
export const runtime = 'nodejs';
async function getUserFromCookie(req) {
  const token = req.cookies.get('auth_token')?.value;

  // Development bypass: check for hardcoded header
  const bypassRole = req.headers.get('x-user-role');
  if (bypassRole === 'superadmin') {
    return {
      id: '000000000000000000000000', // Placeholder ID for development bypass
      role: 'superadmin',
    };
  }

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return {
      id: decoded.userId,
      role: decoded.role,
    };
  } catch (err) {
    console.error('Token verification failed in middleware:', err.message);
    return null;
  }
}

async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and static assets
  if (
    pathname === '/login' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const user = await getUserFromCookie(request);

  // Protect API routes
  if (pathname.startsWith('/api/')) {
    if (
      pathname.startsWith('/api/auth/') ||
      pathname.startsWith('/api/public/')
    ) {
      return NextResponse.next();
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — please login' },
        { status: 401 }
      );
    }

    setCurrentUserId(user.id);

    const method = request.method;
    const response = NextResponse.next();
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-role', user.role);

    if (['PUT', 'PATCH', 'DELETE'].includes(method) && user.role !== 'superadmin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden — only superadmin allowed' },
        { status: 403 }
      );
    }

    return response;
  }

  // Protect page routes
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}


// export default middleware

// Temporary bypass middleware to disable authentication
export default function bypassMiddleware(request) {
  return NextResponse.next();
}
export const config = {
  matcher: ['/api/:path*', '/((?!_next|static).*)'],
}
