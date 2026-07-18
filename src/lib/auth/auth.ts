import NextAuth from "next-auth";
import { authConfig } from "./providers";

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
