import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerAuthSession({ req, res });

  if (session) {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    const availableSeeds = await response.json();
    return res.status(200).send(availableSeeds);
  }

  return res.status(401).json({ error: "no valid session" });
};

export default handler;
