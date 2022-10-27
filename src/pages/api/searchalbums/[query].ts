import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const searchword = req.query.name as string;
  const accessToken = req.query.accessToken;

  if (searchword) {
    const searchParams = new URLSearchParams([
      ["query", searchword],
      ["type", "album"],
      ["limit", "10"],
    ]);

    const response = await fetch(
      `https://api.spotify.com/v1/search?${searchParams}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const search = await response.json();

    return res.status(200).send(search);
  }

  return res.status(401).json({ error: "no valid searchword" });
};

export default handler;
