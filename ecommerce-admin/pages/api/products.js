import { prisma } from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "GET") {
    const { id } = req.query;

    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      }

      return res.json(product);
    } else {
      const products = await prisma.product.findMany();
      return res.json(products);
    }
  }

  if (method === "POST") {
    try {
      const { name, description, price, stock, category } = req.body;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          category,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error("Erro ao criar o produto", error);
      return res.status(500).json({ error: "Erro ao criar o produto" });
    }
  }

  if (method === "PUT") {
    try {
      const { name, description, price, stock, category, id } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID do produto é obrigatório" });
      }

      const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name: name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          category,
        },
      });

      return res.status(200).json(product);
    } catch (error) {
      console.error("Erro ao atualizar o produto", error);
      return res.status(500).json({ error: "Erro ao atualizar o produto" });
    }
  }

  if (method === "DELETE") {
    try {
      const { id } = req.query;
      
      if(id) {
        const product = await prisma.product.delete({
          where: {
            id: id,
          }
        })
      }

      return res.status(200).json(product)

    } catch (error) {
      console.error("Erro ao deletar o produto", error);
      return res.status(500).json({ error: "Erro ao  deletar o produto"})
    }

  }

  return res.status(405).json({ error: "Método não permitido" });
}

