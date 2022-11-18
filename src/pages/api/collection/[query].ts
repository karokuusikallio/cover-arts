import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId, collectionId, collectionName } = req.query;

  if (req.method === "GET") {
    if (userId) {
      if (collectionId) {
        try {
          const collection = await prisma.collection.findFirst({
            where: { userName: userId as string, id: collectionId as string },
            include: { albums: true },
          });
          return res.status(200).json(collection);
        } catch (error) {
          return res.status(400).json({ error });
        }
      }

      try {
        const collections = await prisma.collection.findMany({
          where: { userName: userId as string },
          include: { albums: true },
        });
        return res.status(200).json(collections);
      } catch (error) {
        return res.status(400).json({ error });
      }
    }
  }

  if (req.method === "POST") {
    if (collectionName && userId) {
      try {
        const collectionCreated = await prisma.collection.create({
          data: { userName: userId as string, name: collectionName as string },
          include: { albums: true },
        });
        return res.status(200).json(collectionCreated);
      } catch (error) {
        console.log(error);
        res.status(400).json({ error });
      }
    }
  }

  if (req.method === "DELETE") {
    if (collectionId) {
      try {
        const collectionDeleted = await prisma.collection.delete({
          where: { id: collectionId as string },
        });
        return res.status(200).json(collectionDeleted);
      } catch (error) {
        console.log(error);
        res.status(400).json({ error });
      }
    }
  }
};

export default handler;
