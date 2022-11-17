import { Session } from "next-auth";
import { getSession } from "next-auth/react";

const getSessionInfo = async (): Promise<Session | undefined | null> => {
  const session = await getSession();
  return session;
};

export default getSessionInfo;
