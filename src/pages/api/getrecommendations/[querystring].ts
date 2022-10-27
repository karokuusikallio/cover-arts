import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const accessToken = query.accessToken;

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${query.seedgenres}&target_popularity=${query.popularity}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const result = await response.json();
    return res.status(200).send(result);
  } catch (error) {
    return res.status(401).json({ error });
  }
};

export default handler;
