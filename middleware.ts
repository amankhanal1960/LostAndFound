// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(
  // Optional: you can inspect the request here if needed.
  () => {},
  {
    callbacks: {
      // Only allow if a valid NextAuth JWT/session token exists
      authorized: ({ token }) => !!token,
    },
  }
);

// Match everything EXCEPT these paths:
export const config = {
  matcher: [
    // "/dashboard/:path*",
    // "/lost-item/:path*",
    // "/found-item/:path*",
    // "/report-item/:path*",

    "/((?!api/auth|_next|favicon.ico|auth/login|auth/register|$).*)",
  ],
};
