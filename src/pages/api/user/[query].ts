import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.query);
  if (req.method === "GET") {
    const name = req.query.name as string;
    try {
      const user = await prisma.user.findUnique({
        where: { name },
      });
      return res.status(200).send(user);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error });
    }
  }

  if (req.method === "POST") {
    try {
      const name = req.body.name;
      const userCreated = await prisma.user.create({ data: { name } });
      return res.status(200).json(userCreated);
    } catch (error) {
      console.log(error);
      res.status(400).json(error);
    }
  }
};

export default handler;
