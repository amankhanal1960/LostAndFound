import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;
  try {
    const url = new URL(req.url);

    const limit = parseInt(url.searchParams.get("limit") || "50", 10);

    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const { rows } = await query(
      `SELECT c.claimid, c.itemid, c.claimerid, c.claimtext, c.claimedat, c.status, i.name, i.image, i.type, i.status, u.fullname AS claimer_name, u.image AS claimer_image
      FROM claims AS c JOIN items AS i on i.itemid = c.itemid
      JOIN users AS u ON u.userid = c.claimerid
      WHERE i.reportedby = $1
      ORDER BY c.claimedat DESC
      LIMIT $2 OFFSET $3 `,
      [userId, limit, offset]
    );

    return NextResponse.json({ claims: rows });
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
