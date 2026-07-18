import type { DefaultSession } from "next-auth";

// Augment NextAuth session/token types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      profileSetup: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    profileSetup?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    profileSetup?: boolean;
  }
}
