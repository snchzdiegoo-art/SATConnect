import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Protected routes - everything else is public by default
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/api/protected(.*)',
]);

// Explicitly public - never protected even if matched above
const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/marketplace(.*)',
    '/platform(.*)',
    '/pending-approval(.*)',
    '/api/webhooks(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    const url = req.nextUrl;
    const hostname = req.headers.get("host") || "";

    // Subdomain Redirects (only in production, skip on localhost)
    const isLocalhost = hostname.includes("localhost") || hostname.includes("127.0.0.1");
    if (!isLocalhost) {
        const isAppSubdomain = hostname.startsWith("app.");
        const isB2BridgeSubdomain = hostname.startsWith("B2Bridge.") || hostname.startsWith("b2bridge.");
        if (isAppSubdomain && url.pathname === "/") {
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }
        if (isB2BridgeSubdomain && url.pathname === "/") {
            url.pathname = "/marketplace";
            return NextResponse.redirect(url);
        }
    }

    // Only protect non-public routes
    if (isProtectedRoute(req) && !isPublicRoute(req)) {
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
