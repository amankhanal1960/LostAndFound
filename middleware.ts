// middleware.ts
import { withAuth } from "next-auth/middleware";

// Wrap withAuth around nothing—just use its built‑in JWT/session check
export default withAuth(() => {}, {
  callbacks: {
    // Only allow onward if we have a valid session token
    authorized: ({ token }) => !!token,
  },
});

// Only run the middleware match on paths that should be protected.
// We exclude:
// - NextAuth’s own API routes: /api/auth/*
// - Your public signup endpoint: /api/users
// - Next.js internals: /_next/*
// - Favicon
// - Your login & register pages
export const config = {
  matcher: [
    "/((?!api/auth|api/users|_next|favicon.ico|auth/login|auth/register).*)",
  ],
};
