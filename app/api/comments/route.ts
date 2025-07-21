import { query } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";

// Define a type for comments
interface Comment {
  commentid: number;
  userid: number;
  itemid: number;
  parentid: number | null;
  content: string;
  createdat: string;
  updatedat: string;
  author: string;
  avatar: string;
  replies?: Comment[];
}

// Helper to build nested comment structure
const buildCommentTree = (comments: Comment[]): Comment[] => {
  const map = new Map<number, Comment>();
  const tree: Comment[] = [];

  comments.forEach((comment) => {
    map.set(comment.commentid, { ...comment, replies: [] });
  });

  map.forEach((comment) => {
    if (comment.parentid) {
      const parent = map.get(comment.parentid);
      if (parent) {
        parent.replies = parent.replies || [];
        parent.replies.push(comment);
      }
    } else {
      tree.push(comment);
    }
  });

  return tree;
};

// GET /api/comments?item_id=...
export async function GET(request: NextRequest) {
  const itemId = request.nextUrl.searchParams.get("itemid");

  if (!itemId) {
    return NextResponse.json(
      { message: "Item ID is required." },
      { status: 400 }
    );
  }

  try {
    const { rows } = await query(
      `
      SELECT
        c.commentid,
        c.userid ,
        c.itemid ,
        c.parentid,
        c.content,
        c.createdat,
        c.updatedat,
        u.fullname AS author,
        u.image AS avatar
      FROM comments AS c
      JOIN users AS u ON c.userid = u.userid
      WHERE c.itemid = $1
      ORDER BY c.createdat DESC
      `,
      [itemId]
    );

    const nestedComments = buildCommentTree(rows);
    return NextResponse.json(nestedComments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Failed to fetch comments." },
      { status: 500 }
    );
  }
}

// POST /api/comments
export async function POST(request: NextRequest) {
  const { itemid, userid, content, parentid } = await request.json();

  if (!itemid || !userid || !content) {
    return NextResponse.json(
      { error: "Item ID, User ID and content are required." },
      { status: 400 }
    );
  }

  try {
    const { rows } = await query(
      `
      INSERT INTO comments (itemid, userid, parentid, content)
      VALUES ($1, $2, $3, $4)
      RETURNING commentid, itemid, userid, parentid, content, createdat, updatedat
      `,
      [itemid, userid, parentid || null, content]
    );

    const userRes = await query(
      `
      SELECT fullname AS author, image AS avatar
      FROM users
      WHERE userid = $1
      `,
      [userid]
    );

    const dbComment = rows[0];
    const user = userRes.rows[0];

    const newComment: Comment = {
      commentid: dbComment.commentid,
      itemid: dbComment.itemid,
      userid: dbComment.userid,
      parentid: dbComment.parentid,
      content: dbComment.content,
      createdat: dbComment.createdat,
      updatedat: dbComment.updatedat,
      author: user.author,
      avatar: user.avatar,
      replies: [],
    };

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Failed to add comment." },
      { status: 500 }
    );
  }
}
