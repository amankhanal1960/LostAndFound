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
  const url = new URL(req.url);
  const countOnly = url.searchParams.get("countOnly") === "true";

  try {
    if (countOnly) {
      //only return the numbers of pending claims
      const { rows } = await query(
        `SELECT COUNT(*) AS count
           FROM claims c
           JOIN items i ON i.itemid = c.itemid
          WHERE i.reportedby = $1
            AND c.status = 'PENDING'`,
        [userId]
      );
      const count = Number(rows[0].count);
      return NextResponse.json({ count });
    }

    //otherwise the fallback
    const limit = parseInt(url.searchParams.get("limit") || "50", 10);

    const offset = parseInt(url.searchParams.get("offset") || "0", 10);

    const { rows } = await query(
      `SELECT c.claimid,
       c.itemid,
       c.claimerid,
       c.claimtext,
       c.claimedat,
       c.status AS "claimStatus",
       i.status AS "itemStatus",
       i.name, i.image, i.type,
       u.fullname AS "claimer_name",
       u.image AS claimer_image
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
