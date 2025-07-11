import { NextResponse, NextRequest } from "next/server";
//NextRequest is used to handle incoming requests
//NextResponse is used to send responses back to the client
import { query } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    // 1) Parse and validate input
    const body = await request.json();
    const { name, email, password } = body;
    const normalizedEmail = email.toLowerCase();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required." },
        { status: 400 }
      );
    }

    // 2) checking for exiting user
    //$1 is the placeholder for the parameter
    const existing = await query("SELECT userid FROM users WHERE email = $1", [
      normalizedEmail,
    ]);

    // if the query returned one or more rows then the user already exists so you send a 409 conflict response
    if (existing.rows.length > 0) {
      // Fixed: Access .rows property
      return NextResponse.json(
        { message: "A user with that email already exists." },
        { status: 409 }
      );
    }

    // 3) Hash password
    //salt is just random data that gets mixed into your password
    //this means that two users with same password will end up having different hashed code
    const saltRounds = 10;
    //10 is the cost factor, tells bcrypt how many times to internally re-hash the salt+password combo
    const passwordHash = await bcrypt.hash(password, saltRounds); // Added salt rounds

    // 4) Insert new user
    const newUser = await query(
      `INSERT INTO users (fullname, passwordhash, email, oauth_provider) 
       VALUES ($1, $2, $3, 'credentials') 
       RETURNING userid, fullname, email, createdat`, // Fixed column names
      [name, passwordHash, normalizedEmail]
    );

    // 5) Return the HTTP response back to the client
    return NextResponse.json(
      { user: newUser.rows[0] }, // Return first row of result
      { status: 201 }
    );
    //This JSON is replied
    // {
    //   "user": {
    //     "userid": 123,
    //     "username": "aman",
    //     "email": "aman@example.com",
    //     "createdat": "2025-07-09T10:00:00Z"
    //   }
    // }
  } catch (error: unknown) {
    console.error("Database error", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
