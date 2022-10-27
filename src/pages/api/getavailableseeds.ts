import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.query.accessToken;

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const availableSeeds = await response.json();
    return res.status(200).send(availableSeeds);
  } catch (error) {
    return res.status(401).json({ error });
  }
};

export default handler;
