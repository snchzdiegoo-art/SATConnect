import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/api/protected(.*)',
]);

// Public routes are everything else, including /sign-in and /sign-up

export default clerkMiddleware(async (auth, req) => {
    // 1. Subdomain Redirect (app.satconnect.travel -> /dashboard)
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // Check if we are on the "app" subdomain (e.g. app.satconnect.travel or app.localhost)
    const isAppSubdomain = hostname.startsWith("app.");

    // If on app subdomain and trying to access root, redirect to dashboard
    if (isAppSubdomain && url.pathname === "/") {
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // 2. Protect Dashboard Routes
    if (isProtectedRoute(req)) {
        await auth.protect();
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};
