import { withAuth } from "next-auth/middleware";

export default withAuth(() => {}, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/((?!api/auth|api/users|_next|favicon.ico|auth/login|auth/register|$).*)",
  ],
};

// import { NextResponse } from "next/server";

// export function middleware() {
//   return NextResponse.next();
// }
