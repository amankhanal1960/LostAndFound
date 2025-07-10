// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth(() => {}, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

// Middleware will run on all routes except the listed public ones
export const config = {
  matcher: [
    "/((?!api/auth|api/users|_next|favicon.ico|auth/login|auth/register|$).*)",
  ],
};
