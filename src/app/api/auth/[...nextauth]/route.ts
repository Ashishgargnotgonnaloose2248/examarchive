// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import type {User as NextAuthUser} from "next-auth";

/* ──────────────  TYPE AUGMENTATIONS  ────────────── */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      fullName?: string | null;   // ← add
      isAdmin?: boolean | null;   // ← add
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    fullName?: string | null;     // ← add
    isAdmin?: boolean | null;     // ← add
  }
}

/* ──────────────  NEXTAUTH CONFIG  ────────────── */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "text"     },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, _req): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) return null;

        /* 1️⃣ Look up the user */
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) return null;

        /* 2️⃣ Validate password */
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          // console.log("❌ Invalid password"); // uncomment to debug 401
          return null;
        }

        /* 3️⃣ Return safe user object WITH fullName */
        return {
          id: user.id,
          name: user.name,               // keeps NextAuth happy
          fullName: user.fullName ?? user.name, // <— crucial change
          email: user.email,
          image: user.image,
          isAdmin: user.email === "admin@mitsgwl.ac.in",
        } as unknown as NextAuthUser;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        /* copy whichever we have */
        token.fullName = (user as any).fullName ?? user.name ?? null;
        token.isAdmin  = (user as any).isAdmin ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id       = token.id   as string;
        session.user.fullName = token.fullName as string | null;
        session.user.isAdmin  = token.isAdmin  as boolean | null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
