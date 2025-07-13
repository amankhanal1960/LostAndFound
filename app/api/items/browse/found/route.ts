import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  //constructs an url object
  //this gives access to pathname, searchparams
  //helps you edit the url, like url.setParams.get("limit").
  const url = new URL(req.url);
  //Read the limit query parameter (eg. ? limit=20) and convert it to an integer
  //if no 'limit' exists , the deafult fallback 50 is applied
  //the second argument 10 ensures parseInt interperts the string as decimal
  const limit = parseInt(url.searchParams.get("limit") || "50", 10);

  //Read the offset query paramter, (eg. ? offset = 40) and convert it to an integer
  //if no offset is provided, default to 0(starts from the very first row)
  //again the 10 specifies the base-10 parsing
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);

  // fetch all items of type FOUND
  const { rows } = await query(
    `SELECT
       itemid,
       name,
       description,
       image,
       reportedby,
       reportedat,
       updatedat,
       status,
       location,
       category
     FROM items
     WHERE type = $1
     ORDER BY reportedat DESC
     LIMIT $2 OFFSET $3`,
    ["FOUND", limit, offset]
  );

  //sends the json request back to the client with the rows that we have selected
  return NextResponse.json({ items: rows });
}
