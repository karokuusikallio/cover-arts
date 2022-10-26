import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import refreshAccessToken from "../spotify/refreshAccessToken";

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    nextAuthOptions
  );

  if (session) {
    const { access_token } = await refreshAccessToken(session.refreshToken);
    session.accessToken = access_token;
  }

  return session;
};
