import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route protection.
 *
 * Next.js 16 renamed `middleware.ts` to `proxy.ts` (same mechanism, new
 * name/export — see the "Migration to Proxy" section of the Next.js docs).
 * This still runs before the route renders, on every request matched by
 * `config.matcher` below.
 *
 * This is an OPTIMISTIC check only: it just looks for the cookie's
 * presence, it does not verify a signature or expiry. That's intentional —
 * proxy/middleware runs on every request (including prefetches) and should
 * stay cheap, so it's not the place for a database lookup.
 *
 * To wire this up to real JWT auth:
 *   1. On login, set an httpOnly, signed cookie (e.g. via `next-auth`,
 *      Auth.js, or your own `Set-Cookie` header) instead of the demo
 *      `auth-token=demo-session` cookie set in `src/app/login/page.tsx`.
 *   2. Replace the `hasAuthCookie` check below with a real verification,
 *      e.g. `jwtVerify(token, secret)` from `jose` (works on the Edge
 *      runtime) — redirect on a missing OR invalid/expired token.
 *   3. Keep this check optimistic (signature/expiry only). Do any
 *      authorization that needs a database round-trip inside the page/
 *      layout itself (or a Server Action), not here.
 */
const AUTH_COOKIE_NAME = "auth-token";

export function proxy(request: NextRequest) {
  const hasAuthCookie = request.cookies.has(AUTH_COOKIE_NAME);

  if (!hasAuthCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
