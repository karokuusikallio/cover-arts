import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await prisma.collection.deleteMany();
  await prisma.user.deleteMany();
  res.status(200).end();
};

export default handler;
