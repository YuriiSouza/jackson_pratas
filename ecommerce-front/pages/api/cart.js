import { prisma } from "@/lib/prisma";

export default async function handle(req,res) {
  const ids = req.body.ids;

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: ids.filter(id => id !== null), // filtrando os `null`
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      images: true,
    },
  });

  const allProductsWithLinkImages = products.map((prod => ({
      ...prod,
      price: prod.price.toNumber(),
      createdAt: prod.createdAt.toISOString(),
      updatedAt: prod.updatedAt.toISOString(),
      images: prod.images.map(
        (image) => `http://localhost:9000/${image.bucket}/${image.fileName}`
      ),
    })
    )
  );

  res.json(allProductsWithLinkImages);
}