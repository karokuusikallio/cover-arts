import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (req.method === "GET") {
    if (id) {
      try {
        const collection = await prisma.collection.findUnique({
          where: { id: id as string },
        });
        return res.status(200).json(collection);
      } catch (error) {
        return res.status(400).json({ error });
      }
    }
  }
};

export default handler;
