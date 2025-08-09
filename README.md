# Lost & Found Management System

Simple web application for a Lost & Found app built with Next.js (App Router), PostgreSQL, NextAuth, and Supabase Storage.

---

## What is this

A minimal project that lets users sign up, sign in (Google + email/password), report lost or found items, upload images, and view a small per-user dashboard summary.

---

## Features

- Register & login (NextAuth + credentials + Google)
- Create / list LOST and FOUND items
- Image uploads to Supabase Storage (returns public URL)
- Dashboard summary for logged-in users (counts of reports, claims, resolved items)

---

## Tech stack

- Node.js + Next.js (App Router)
- PostgreSQL (`pg` + connection pool)
- NextAuth (Google + Credentials)
- Supabase Storage (image uploads)
- bcrypt for password hashing

---

## Getting started (quick)

### Prerequisites

- Node.js 18+
- PostgreSQL (local or hosted)
- Supabase project (for file storage)
- (Optional) Google OAuth credentials

### Install & run

```bash
git clone https://github.com/amankhanal1960/lost-and-found.git

cd lost-and-found

npm install
# create .env.local (see below)
npm run dev

# build
npm run build
# start
npm start
```

## Database schema (quick)

This project uses PostgreSQL. Full DDL/migrations are in `sql/schema.sql`.

Main tables:

- `users` — auth & profile
- `items` — lost/found posts
- `claims` — user claims against items

Minimal example (for quick reference):

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text,
  name text,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  type text CHECK (type IN ('LOST','FOUND')),
  title text,
  image_url text,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
CREATE TABLE claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id),
  claimer_id uuid REFERENCES users(id),
  status text DEFAULT 'PENDING',
  created_at timestamptz DEFAULT now()
);

```

## Environment variables

You can also see the .env.example for the environment variables

### Create a `.env.local` in the project root (do not commit this file) and set values like:

POSTGRES_URL=postgresql://<dbuser>:<dbpass>@localhost:5432/lost_and_found
DATABASE_POSTGRES_URL=postgresql://<produser>:<prodpass>@<host>:5432/<dbname>
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<a-strong-secret>
GOOGLE_CLIENT_ID=<optional>
GOOGLE_CLIENT_SECRET=<optional>
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<server-only-key>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<optional>
NODE_ENV=development

## Notes:

- keep SUPABASE_SERVICE_ROLE_KEY and DB credentials secret and set them in your production host’s environment settings (Vercel, Render, etc.).

- SUPABASE_SERVICE_ROLE_KEY is powerful — never expose it to client code. Store it only in server envs (Vercel/Render/Heroku project settings).

- If you ever accidentally commit secrets, rotate them immediately and remove from Git history.

- For production, set NODE_ENV=production and use DATABASE_POSTGRES_URL + platform env settings.

- This project is open source. You are free to use, modify, and distribute it for any purpose, with or without changes, without asking for permission. Provided “as is” without warranty of any kind.
