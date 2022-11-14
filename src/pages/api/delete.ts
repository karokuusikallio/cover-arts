import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await prisma.album.deleteMany();
    await prisma.collection.deleteMany();
    return res.status(200).end();
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export default handler;
