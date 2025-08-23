import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/users"];

// Define public routes that don't require authentication
const publicRoutes = ["/login", "/"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the token from cookies
    const token = request.cookies.get("token")?.value;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    // If trying to access protected route without token, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    // If authenticated user tries to access login page, redirect to dashboard
    if (pathname === "/login" && token) {
        const dashboardUrl = new URL("/dashboard", request.url);
        return NextResponse.redirect(dashboardUrl);
    }

    // Allow the request to continue
    return NextResponse.next();
}

export const config = {
    // Match all paths except static files and API routes
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
