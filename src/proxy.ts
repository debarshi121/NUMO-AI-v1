import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/profile-setup",
  "/profile",
  "/report",
  "/unlock-report",
  "/vehicle-numerology",
];

// Routes that should redirect authenticated users away (auth pages)
const AUTH_ROUTES = ["/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await auth();
  const isAuthenticated = !!session?.user;
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Unauthenticated user trying to access protected route
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access login — redirect appropriately
  if (isAuthRoute && isAuthenticated) {
    const destination = session.user.profileSetup
      ? "/vehicle-numerology"
      : "/profile-setup";
    return NextResponse.redirect(new URL(destination, req.url));
  }

  // Authenticated user on a protected route but profile not set up yet
  if (
    isAuthenticated &&
    isProtected &&
    !session.user.profileSetup &&
    pathname !== "/profile-setup"
  ) {
    return NextResponse.redirect(new URL("/profile-setup", req.url));
  }

  // Authenticated user with completed profile trying to access profile-setup again
  if (isAuthenticated && session.user.profileSetup && pathname === "/profile-setup") {
    return NextResponse.redirect(new URL("/vehicle-numerology", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     * - API routes (auth handles its own)
     */
    "/((?!_next/static|_next/image|favicon.ico|pngs|svgs|api/auth).*)",
  ],
};
