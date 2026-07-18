import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { verifyOtp } from "@/lib/auth/otp";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    // OTP credentials provider — receives a pre-verified userId
    // The actual OTP verification happens in the /api/auth/verify-otp route,
    // which calls this provider after a successful DB check.
    Credentials({
      id: "otp",
      name: "OTP",
      credentials: {
        userId: { label: "User ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.userId || typeof credentials.userId !== "string") {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { id: credentials.userId },
        });
        return user ?? null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        // Attach profileSetup flag so middleware can redirect
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
          select: { profileSetup: true },
        });
        token.profileSetup = dbUser?.profileSetup ?? false;
      }
      // Allow the client to push profileSetup=true into the token after setup
      if (trigger === "update" && session?.profileSetup !== undefined) {
        token.profileSetup = session.profileSetup;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.profileSetup = token.profileSetup as boolean;
      }
      return session;
    },
    async signIn({ user, account }) {
      // Google login: auto-create user if not exist (handled by PrismaAdapter).
      // For credentials (OTP), allow all.
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existing) {
          // PrismaAdapter handles creation — just allow
          return true;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};
