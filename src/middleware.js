import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { setCurrentUserId } from "./lib/mongoose-plugins/auditsFields.js";

export const runtime = "nodejs";

async function getUserFromCookie(req) {
  const token = req.cookies.get("auth_token")?.value;

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
    console.error("Token verification failed in middleware:", err.message);
    return null;
  }
}

async function middleware(request) {
  console.log("=== MIDDLEWARE CALLED ===");
  console.log("Middleware - Request received for:", request.nextUrl.pathname);

  const { pathname } = request.nextUrl;

  // Allow access to login page and static assets
  if (
    pathname === "/login" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  console.log("Middleware - Checking authentication for:", pathname);

  const user = await getUserFromCookie(request);
  console.log("Middleware - User result:", user);

  // Protect API routes
  if (pathname.startsWith("/api/")) {
    if (
      pathname.startsWith("/api/auth/") ||
      pathname.startsWith("/api/public/")
    ) {
      return NextResponse.next();
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized — please login" },
        { status: 401 }
      );
    }

    setCurrentUserId(user.id);
    const method = request.method;
    const response = NextResponse.next();

    // Permissions check for PUT, PATCH, DELETE
    if (["PUT", "PATCH", "DELETE"].includes(method)) {
      const isAdmin = user.role?.toLowerCase() === "superadmin" || user.role?.toLowerCase() === "admin";

      // Extract ID from /api/users/[id]
      const pathParts = pathname.split('/');
      const isSelfUpdate = pathParts[2] === 'users' && pathParts[3] === user.id;

      if (!isAdmin && !isSelfUpdate) {
        return NextResponse.json(
          { success: false, error: "Forbidden — insufficient permissions" },
          { status: 403 }
        );
      }
    }

    return response;
  }

  // Protect page routes
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  setCurrentUserId(user.id);
  console.log("Middleware - Set User ID for page route:", user.id);

  return NextResponse.next();
}

export default middleware;

export const config = {
  matcher: ["/api/:path*", "/((?!_next|static).*)"],
};




