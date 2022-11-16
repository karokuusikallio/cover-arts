import type { NextApiRequest, NextApiResponse } from "next";
import { AlbumSearch } from "../../../types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { albumIds, accessToken, offset, search } = req.query;

  if (search && accessToken) {
    const searchParams = new URLSearchParams([
      ["query", search as string],
      ["type", "album"],
      ["offset", offset as string],
    ]);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { albums } = (await response.json()) as AlbumSearch;
      return res.status(200).send(albums.items);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  if (albumIds && accessToken) {
    const searchParams = new URLSearchParams([["ids", albumIds as string]]);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/albums?${searchParams}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { albums } = (await response.json()) as AlbumSearch;
      return res.status(200).send(albums);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }
  return res.status(400).json({ error: "Invalid query or access token" });
};

export default handler;
