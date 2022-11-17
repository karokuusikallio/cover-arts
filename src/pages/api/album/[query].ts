import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const collectionId = req.query.collectionId as string;
  const albumId = req.query.albumId as string;

  if (req.method === "POST" && collectionId && albumId) {
    try {
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

  if (req.method === "DELETE" && collectionId && albumId) {
    try {
      const albumRemoved = await prisma.album.update({
        where: { albumId },
        data: { collections: { disconnect: { id: collectionId as string } } },
      });

      const collectionUpdated = await prisma.collection.update({
        where: { id: collectionId as string },
        data: { albums: { disconnect: { albumId } } },
      });

      await Promise.all([albumRemoved, collectionUpdated]);

      return res.status(200).json({ albumRemoved, collectionUpdated });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
};

export default handler;
