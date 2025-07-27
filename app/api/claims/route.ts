import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    debugger;
    const { itemId, claimerId, claimText } = await req.json();

    if (!itemId || !claimerId || !claimText) {
      debugger;
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
      `SELECT claims.claimid, claims.itemid, claims.claimerid, claims.claimtext, claims.claimedat, claims.status AS "claimStatus", items.status AS "itemStatus", claims.status, items.name, items.image, items.type
      FROM claims JOIN items on items.itemid = claims.itemid
      WHERE claims.claimerid = $1
      ORDER BY claims.claimedat DESC
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
