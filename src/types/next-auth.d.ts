// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
      fullName?: string;
    };
  }

  interface User {
    id: string;
    isAdmin?: boolean;
    fullName?: string;
  }
  declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    fullName?: string; // ✅ Add this too
    isAdmin?: boolean;
  }
}
}
