import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { itemId, claimerId, claimText } = await req.json();

    if (!itemId || !claimerId || !claimText) {
      console.log("Missing fields:", { itemId, claimerId, claimText });
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { rows } = await query(
      `INSERT INTO claims (itemid, claimerid, claimtext)
    VALUES ($1, $2, $3) RETURNING *`,
      [itemId, claimerId, claimText]
    );

    return NextResponse.json({ claim: rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Error creating claim:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
      `SELECT c.claimid,
       c.itemid,
       c.claimerid,
       c.claimtext,
       c.claimedat,
       c.status AS "claimStatus",
       i.status AS "itemStatus",
       c.status,
       i.name,
       i.image,
       i.type,
       u.fullname AS "claimer_name",
       u.image AS claimer_image
      FROM claims AS c JOIN items AS i on i.itemid = c.itemid
      JOIN users AS u ON u.userid = c.claimerid
      WHERE c.claimerid = $1
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
