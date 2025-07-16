// db.ts
import pkg from "pg";
const { Pool } = pkg;

const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_POSTGRES_URL // Neon in production
    : process.env.POSTGRES_URL; // localhost in development

const pool = new Pool({
  connectionString,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params: unknown[] = []) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}
