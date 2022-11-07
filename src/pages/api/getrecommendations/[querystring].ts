import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const seedgenres = query.seedgenres as string;
  const targetPopularity = query.popularity as string;
  const offset = query.offset as string;

  const searchParams = new URLSearchParams([
    ["seed_genres", seedgenres],
    ["target_popularity", targetPopularity],
    ["offset", offset],
  ]);

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/recommendations?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${query.accessToken}`,
        },
      }
    );

    const result = await response.json();

    const albums = result.tracks.map((track) => track.album);

    return res.status(200).send(albums);
  } catch (error) {
    return res.status(401).json({ error });
  }
};

export default handler;
