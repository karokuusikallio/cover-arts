import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      try {
        const user = await prisma.user.findUnique({
          where: { userName: userId as string },
        });

        return res.status(200).json(user);
      } catch (error) {
        console.log(error);
        return res.status(400).json({ error });
      }
    }
  }

  if (req.method === "POST") {
    if (userId) {
      try {
        const userCreated = await prisma.user.create({
          data: { userName: userId as string },
        });
        return res.status(200).json(userCreated);
      } catch (error) {
        console.log(error);
        res.status(400).json(error);
      }
    }
  }
};

export default handler;
