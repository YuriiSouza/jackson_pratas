// pages/api/products/new.js
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const products = await prisma.product.findMany({
    take: 12,
    orderBy: { createdAt: 'desc' },
    include: { images: true },
  });

  const serialized = products.map((prod) => ({
    ...prod,
    price: prod.price.toNumber(),
    createdAt: prod.createdAt.toISOString(),
    updatedAt: prod.updatedAt.toISOString(),
    images: prod.images.map(
      (image) => `http://localhost:9000/${image.bucket}/${image.fileName}`
    ),
  }));

  res.status(200).json(serialized);
}
