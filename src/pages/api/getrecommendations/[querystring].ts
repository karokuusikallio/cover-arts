import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });
  const query = req.query;

  if (session) {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${query.seedgenres}&target_popularity=${query.popularity}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const result = await response.json();
    return res.status(200).send(result);
  }

  return res.status(401).json({ error: "no valid session or querystring" });
};

export default handler;
