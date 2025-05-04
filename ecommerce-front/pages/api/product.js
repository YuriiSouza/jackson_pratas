import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const { typeReq, id } = req.query;

  try {
    // Se for busca por ID único, usar findUnique
    if (id) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id) },
        include: { images: true },
      });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      const serializedProduct = {
        ...product,
        price: product.price.toNumber(),
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        images: product.images.map(
          (image) => `http://localhost:9000/${image.bucket}/${image.fileName}`
        ),
      };

      return res.status(200).json(serializedProduct);
    }

    // Caso contrário, retorna todos ou os 12 mais recentes
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: true },
      ...(typeReq !== 'all' && { take: 12 }),
    });

    const serializedProducts = products.map((prod) => ({
      ...prod,
      price: prod.price.toNumber(),
      createdAt: prod.createdAt.toISOString(),
      updatedAt: prod.updatedAt.toISOString(),
      images: prod.images.map(
        (image) => `http://localhost:9000/${image.bucket}/${image.fileName}`
      ),
    }));

    res.status(200).json(serializedProducts);
  } catch (error) {
    console.error("Erro na API de produto:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
