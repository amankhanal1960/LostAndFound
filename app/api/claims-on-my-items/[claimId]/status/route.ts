import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { query } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  context: { params: { claimId: string } }
) {
  // 1) Extract and parse the dynamic claimId
  const { params } = context;
  const { claimId: rawClaimId } = await params; // must await
  const claimId = Number(rawClaimId);
  if (Number.isNaN(claimId)) {
    return NextResponse.json({ error: "Invalid claim ID" }, { status: 400 });
  }

  // 2) Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  // 3) Parse & validate body
  const { status, itemId } = await req.json();
  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status; must be ACCEPTED or REJECTED." },
      { status: 400 }
    );
  }
  if (typeof itemId !== "number") {
    return NextResponse.json(
      { error: "Missing or invalid itemId" },
      { status: 400 }
    );
  }

  try {
    // 4) Permission check: ensure this claim is on one of your items
    const { rows: ownership } = await query(
      `
      SELECT 1
        FROM claims AS c
        JOIN items  AS i ON i.itemid = c.itemid
       WHERE c.claimid   = $1
         AND i.reportedby = $2
      `,
      [claimId, userId]
    );
    if (ownership.length === 0) {
      return NextResponse.json(
        { error: "You do not own the item for this claim." },
        { status: 403 }
      );
    }

    // 5) Update this claim’s status
    await query(
      `
      UPDATE claims
         SET status = $1
       WHERE claimid = $2
      `,
      [status, claimId]
    );

    // 6) If accepted, resolve the item and reject other pending claims
    if (status === "ACCEPTED") {
      // a) Resolve the item
      await query(
        `
        UPDATE items
           SET status = 'RESOLVED'
         WHERE itemid    = $1
           AND reportedby = $2
        `,
        [itemId, userId]
      );

      // b) Reject other pending claims on that item
      await query(
        `
        UPDATE claims
           SET status = 'REJECTED'
         WHERE itemid    = $1
           AND claimid   != $2
           AND status    = 'PENDING'
        `,
        [itemId, claimId]
      );
    }

    // 7) Return success
    return NextResponse.json({
      success: true,
      message: `Claim ${status.toLowerCase()} successfully.`,
    });
  } catch (err) {
    console.error("Error updating claim status:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
