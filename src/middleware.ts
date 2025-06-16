import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define paths that are always accessible
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/register",
    "/api/auth/register",
    "/api/auth/session",
  ];

  // Check if the path starts with /api/products
  const isApiProductRoute = path.startsWith("/api/products");

  // Allow all GET requests to product APIs
  if (isApiProductRoute && request.method === "GET") {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath =
    publicPaths.includes(path) ||
    path.startsWith("/api/auth") ||
    path.match(/^\/products\/[^/]+$/); // Allow product detail pages

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({ req: request });

  // If there's no token and the path isn't public, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/products/:path*",
    "/api/products/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
