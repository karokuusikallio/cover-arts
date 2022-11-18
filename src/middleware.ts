import { withAuth } from "next-auth/middleware";
import { env } from "./env/server.mjs";

export default withAuth({
  pages: {
    signIn: "/auth/signIn",
  },
  secret: env.NEXTAUTH_SECRET,
});

export const config = { matcher: ["/search", "/discover"] };
