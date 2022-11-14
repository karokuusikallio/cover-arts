import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const collections = await prisma.collection.findMany();
      return res.status(200).json(collections);
    } catch (error) {
      return res.status(400).json({ error });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      const collectionCreated = await prisma.collection.create({
        data: { userName: body.userName, name: body.collectionName },
      });
      return res.status(200).json(collectionCreated);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error });
    }
  }
};

export default handler;
