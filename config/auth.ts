import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";

//by default, NextAuth's Session.user object doesnt include an id field
// so we extend it to include user.id
declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      //When a user signs in with Google, NextAuth calls your profile(profile) hook and passes it the raw Google profile object, which includes things like profile.email, profile.name, and profile.picture.
      async profile(profile) {
        // 1) Try to find existing user
        //This runs a SQL query against your Postgres users table, searching for a row whose email matches the Google account’s email.
        // findRes.rows will be an array of matches
        const findRes = await query(
          `SELECT userid, username, email, image
             FROM users
            WHERE email = $1
            LIMIT 1`,
          [profile.email]
        );

        // if a row is found, return it in the format NextAuth expects
        //you take that database row(u) and return an object with the properties id, name, email, and image.
        if (findRes.rows.length > 0) {
          const user = findRes.rows[0];
          return {
            id: user.userid.toString(),
            name: user.username,
            email: user.email,
            image: user.image,
          };
        }

        // 2) Insert new user AND return it
        //creates a new row in the users table with the username, email, and image from the Google profile.
        //$1, $2,$3 are the parameter place holder, filled by the array you passed
        const insertRes = await query(
          `INSERT INTO users (username, email, image, oauth_provider)
           VALUES ($1, $2, $3, 'google')
           RETURNING userid, username, email, image`,
          [profile.name, profile.email, profile.picture]
        );
        //grab the inserted new row
        //map to the nextauths expected user shape
        //this snippet runs only when Google tells you about a user you haven’t seen before. It creates their account in your Postgres users table, then hands NextAuth the newly created record so it can establish the session and JWT.
        const user = insertRes.rows[0];

        return {
          id: user.userid.toString(),
          name: user.username,
          email: user.email,
          image: user.image,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        //defines the field you expect
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        //if either field is empty you reject immediately returning null tells nemtauth "invalid login"
        if (!credentials?.email || !credentials.password) return null;

        //fetch the users hashed password and other information from the postgres
        const res = await query(
          `SELECT userid, username, email, passwordhash
             FROM users
            WHERE email = $1
            LIMIT 1`,
          [credentials.email]
        );
        //if no match you repturn null
        if (res.rows.length === 0) return null;

        const user = res.rows[0];
        //compare the password using bcrypt.compare, it does secured hash comparision
        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordhash
        );
        if (!valid) return null;

        //finally returns the users data after valid login
        return {
          id: user.userid.toString(),
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],

  //override NextAuth's built-in UI routes with your own.
  //signIn tells nextauth to send to /login when they need to sign in, instead its default api/auth/signin page
  pages: {
    signIn: "/login",
  },

  callbacks: {
    // signIn runs after you sucessfully authenticates oauth or credentials
    //returning true allows the signin; returning false would abort it
    async signIn() {
      return true;
    },

    //controls where the user lands after signing in or signing out
    async redirect({ baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
    // You receive the current session (with user: { name, email, image }) and the raw JWT token.
    // Here you inject token.sub (the user’s ID) into session.user.id, so your front‑end can read session.user.id directly.
    async session({ session, token }) {
      // NextAuth by default puts:
      // session.user = { name: token.name, email: token.email, image: token.image }
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
      // the session object that your react code ends up as

      //   user: {
      //     name:  string;    // from token.name
      //     email: string;    // from token.email
      //     image: string;    // from token.image
      //     id:    string;    // from token.sub, via your session callback
      //   },
      //   expires: string    // when the session will expire
    },

    // By setting token.sub = user.id, you ensure the user’s database ID is carried forward in the JWT.
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
