import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {

  const { id } = req.body;

  const response = await prisma.order.findMany({
    where: {
      userId: id,
    },
    include: {
      items: true,
      address: true,
    },
  });

  res.status(200).json(response);
}


