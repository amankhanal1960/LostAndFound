// app/api/dashboard/summary/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { query } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId =
    typeof session?.user?.id === "string"
      ? parseInt(session.user.id, 10)
      : session?.user?.id;

  // 1) Total reports by me (e.g. lost items I’ve reported)
  const reportedRes = await query(
    `SELECT COUNT(*)::int AS count
       FROM items
      WHERE reportedby = $1`,
    [userId]
  );

  // 2) Active claims by me
  const claimsRes = await query(
    `SELECT COUNT(*)::int AS count
       FROM claims
      WHERE claims.claimerid = $1 AND claims.status = 'PENDING'`,
    [userId]
  );

  // 3) Successful returns (my items that are now resolved)
  const returnsRes = await query(
    `SELECT COUNT(*)::int AS count
       FROM items
      WHERE reportedby = $1
        AND status = 'RESOLVED'`,
    [userId]
  );

  return NextResponse.json({
    reportedCount: reportedRes.rows[0].count,
    activeClaimsCount: claimsRes.rows[0].count,
    successfulReturnsCount: returnsRes.rows[0].count,
  });
}
