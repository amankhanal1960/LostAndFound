// app/api/items/[itemId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import { query } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const { itemId } = await params;
  // 1) Get the user session
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = String(session?.user?.id);

  // 2) Fetch the item owner from DB
  const { rows } = await query(
    `SELECT reportedby FROM items WHERE itemid = $1`,
    [itemId]
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const ownerId = String(rows[0].reportedby);

  // console.log("session.user.id:", session.user!.id, typeof session.user!.id);
  // console.log(
  //   "rows[0].reportedby:",
  //   rows[0].reportedby,
  //   typeof rows[0].reportedby
  // );

  // 3) Authorize
  if (ownerId !== userId) {
    return NextResponse.json(
      { error: "You do not have permission to delete this item." },
      { status: 403 }
    );
  }

  // 4) Safe to delete
  const { rowCount } = await query(`DELETE FROM items WHERE itemid = $1`, [
    itemId,
  ]);
  return NextResponse.json(
    { message: `Item ${params} deleted.` },
    { status: rowCount ? 200 : 404 }
  );
}
