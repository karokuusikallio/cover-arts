import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  if (req.method === "GET") {
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
};

export default handler;
