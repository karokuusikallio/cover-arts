import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { collectionId } = req.query;

  if (req.method === "POST" && collectionId) {
    try {
      const albumId = req.body.albumId as string;
      const albumAdded = await prisma.album.upsert({
        where: { albumId },
        update: { collections: { connect: { id: collectionId as string } } },
        create: {
          albumId,
          collections: { connect: { id: collectionId as string } },
        },
      });

      const collectionUpdated = await prisma.collection.update({
        where: { id: collectionId as string },
        data: { albums: { connect: { albumId } } },
      });

      await Promise.all([albumAdded, collectionUpdated]);

      return res.status(200).json({ albumAdded, collectionUpdated });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
};

export default handler;
