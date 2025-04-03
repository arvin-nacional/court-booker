import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/landing-page",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth();
  if (!isPublicRoute(req)) {
    if (!sessionClaims) {
      // Redirect unauthenticated users trying to access user routes
      const homeUrl = new URL("/landing-page", req.url);
      return NextResponse.redirect(homeUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
