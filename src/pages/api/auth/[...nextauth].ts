import NextAuth, { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import refreshAccessToken from "../../../server/spotify/refreshAccessToken";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user, account }) {
      console.log("token from jwt: ", token);
      if (account && account.expires_at && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at * 1000,
          refreshToken: account.refresh_token,
          user,
        };
      }

      console.log("date now: ", new Date(Date.now()));
      console.log("expires: ", new Date(token.accessTokenExpires));

      if (Date.now() < token.accessTokenExpires) {
        console.log("no need to refresh");
        return token;
      }

      return refreshAccessToken(token);
    },
    session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      if (session.user && token.user) {
        session.user.id = token.user.id;
      }

      if (session.error && token.error) {
        session.error = token.error;
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
