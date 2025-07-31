import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: claimId } = await params;

  try {
    // Attempt to delete the item by ID; if you have FK constraints
    // on related tables (lost/found), they’ll cascade or error appropriately.
    const { rowCount } = await query(
      `DELETE FROM claims
        WHERE claimid = $1
        RETURNING claimid`,
      [claimId]
    );

    if (rowCount === 0) {
      return NextResponse.json(
        { error: `No claim found with id ${claimId}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `claim ${claimId} deleted successfully.` },
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
