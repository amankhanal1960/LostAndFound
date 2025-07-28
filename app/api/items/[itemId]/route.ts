import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  const { itemId } = await params;

  try {
    // Attempt to delete the item by ID; if you have FK constraints
    // on related tables (lost/found), they’ll cascade or error appropriately.
    const { rowCount } = await query(
      `DELETE FROM items
       WHERE itemid = $1
       RETURNING itemid`,
      [itemId]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: `No item found with id ${itemId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Item ${itemId} deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
