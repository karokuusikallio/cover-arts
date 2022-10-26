import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  const searchword = req.query.searchword as string;

  if (session && searchword) {
    const searchParams = new URLSearchParams([
      ["query", searchword],
      ["type", "album"],
      ["limit", "10"],
    ]);

    const response = await fetch(
      `https://api.spotify.com/v1/search?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const search = await response.json();

    return res.status(200).send(search);
  }

  return res.status(401).json({ error: "no valid session or searchword" });
};

export default handler;
