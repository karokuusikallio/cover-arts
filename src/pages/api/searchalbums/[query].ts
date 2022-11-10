import type { NextApiRequest, NextApiResponse } from "next";
import { AlbumSearch } from "../../../types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const searchword = req.query.name as string;
  const offset = req.query.offset as string;
  const accessToken = req.query.accessToken;

  if (searchword) {
    const searchParams = new URLSearchParams([
      ["query", searchword],
      ["type", "album"],
      ["offset", offset],
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

  return res.status(400).json({ error: "no valid searchword" });
};

export default handler;
