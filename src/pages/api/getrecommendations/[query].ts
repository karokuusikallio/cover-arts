import type { NextApiRequest, NextApiResponse } from "next";
import { DiscoverSearch } from "../../../types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const query = req.query;
  const seedgenres = query.seedgenres as string;
  const targetPopularity = query.popularity as string;

  const searchParams = new URLSearchParams([
    ["seed_genres", seedgenres],
    ["target_popularity", targetPopularity],
    ["limit", "100"],
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

    const { tracks } = (await response.json()) as DiscoverSearch;

    //Makes sure that albums in each fetch are unique.
    const ids = tracks.map((track) => track.album.id);
    const filtered = tracks.filter(
      (track, index) => !ids.includes(track.album.id, index + 1)
    );
    const albums = filtered.map((track) => track.album);

    return res.status(200).send(albums);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(401).json({ error });
    }
  }
};

export default handler;
