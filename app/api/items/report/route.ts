import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

type ReportType = "LOST" | "FOUND";

export async function POST(req: NextRequest) {
  // Destructure the request body to get the necessary fields
  //   instead of writing this
  //   const body = await req.json();
  //   const name = body.name;
  // ......
  //we destructure the object directly
  const {
    name,
    description = null,
    image = null,
    type,
    reportedby,
    location = null,
    category = null,
    contactnumber = null, // Optional field for contact number
    //reads the request body and extracts it as JSON
  } = await req.json();

  if (!name || !reportedby) {
    return NextResponse.json(
      { error: "Required: name, reportedBy" },
      { status: 400 }
    );
  }

  if (contactnumber) {
    await query(`UPDATE users SET contactnumber = $1 WHERE userid = $2`, [
      contactnumber,
      reportedby,
    ]);
  }
  //This line is using destructuring (which we just talked about) to pull out
  //  the rows property from the object returned by the query() function
  const { rows } = await query(
    `INSERT INTO items (name, description, image, type, reportedby, location, category) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      name,
      description,
      image,
      type as ReportType,
      reportedby,
      location,
      category,
    ]
  );

  //Send a JSON response back to the client with the newly created item inside it, and let the client know this was a successful creation by using HTTP status code 201
  return NextResponse.json({ item: rows[0] }, { status: 201 });
}
