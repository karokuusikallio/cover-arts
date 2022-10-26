import NextAuth, { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import refreshAccessToken from "../../../server/spotify/refreshAccessToken";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && account.expires_at && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    session({ session, token }) {
      if (session.accessToken && token.accessToken) {
        session.accessToken = token.accessToken;
      }

      if (session.error && token.error) {
        session.error = token.error;
      }

      if (token.user && session.user) {
        session.user.id = token.user.id;
      }

      return session;
    },
  },
  providers: [
    SpotifyProvider({
      authorization: env.SPOTIFY_AUTH_URL,
      clientId: env.SPOTIFY_CLIENT_ID,
      clientSecret: env.SPOTIFY_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
