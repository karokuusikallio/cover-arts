import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === "GET" && id) {
    try {
      const albumsInCollection = await prisma.album.findMany({
        where: { collectionId: id as string },
      });
      return res.status(200).json(albumsInCollection);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  if (req.method === "POST" && id) {
    try {
      const body = req.body;
      const albumAdded = await prisma.album.create({
        data: { albumId: body.albumId, collectionId: id as string },
      });
      return res.status(200).json(albumAdded);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
};

export default handler;
