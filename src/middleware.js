import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { setCurrentUserId } from "./lib/mongoose-plugins/auditsFields";
export const runtime = 'nodejs';  
async function getUserFromCookie(req) {
  const token = req.cookies.get('auth_token')?.value;
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

  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/api/public/')
  ) {
    return NextResponse.next();
  }

  const user = await getUserFromCookie(request);
   console.log(user , "this is user from the middleware")
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized — please login' },
      { status: 401 }
    );
  }

  setCurrentUserId(user.id);

  const method = request.method;
  if (['PUT', 'PATCH', 'DELETE'].includes(method) && user.role !== 'superadmin') {
    return NextResponse.json(
      { success: false, error: 'Forbidden — only superadmin allowed' },
      { status: 403 }
    );
  }

  const response = NextResponse.next();
  response.headers.set('x-user-id', user.id);
  response.headers.set('x-user-role', user.role);

  return response;
}


export default middleware 
  export const config =  {
    matcher: ['/api/:path*'],
  }
