import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { query } = await import("@/lib/db");
    const res = await query("SELECT * FROM users");
    return NextResponse.json(
      {
        users: res.rows,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
      },
      { status: 500 }
    );
  }
}
