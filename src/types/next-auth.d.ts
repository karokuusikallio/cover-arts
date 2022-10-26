import { DefaultSession, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

declare module "next-auth/jwt" {
  interface JWT {
    accessTokenExpires: number;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user?: User | AdapterUser;
  }
}

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    error: string;
    user?: {
      id: string;
    } & DefaultSession["user"];
  }
}
