import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    if (process.env.APP_ENV === "test") {
      try {
        await prisma.collection.deleteMany({});
        await prisma.user.deleteMany({});

        return res.status(200).end();
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
      }
    }

    return res.status(404).end();
  }
};

export default handler;
