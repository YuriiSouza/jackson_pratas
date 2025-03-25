import { prisma } from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const { id } = req.query;

      if (id) {
        const category = await prisma.category.findUnique({
          where: {
            id: parseInt(id, 10), // Converte id para inteiro corretamente
          },
        });

        if (!category) {
          return res.status(404).json({ error: "Categoria não encontrada" });
        }

        return res.json(category);
      } else {
        const categories = await prisma.category.findMany();
        
        return res.json(categories);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
      return res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  }

  if (method === "POST") {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Nome da categoria é obrigatório" });
      }

      const category = await prisma.category.create({
        data: { name },
      });

      return res.status(201).json(category);
    } catch (error) {
      console.error("Erro ao criar categoria", error);
      return res.status(500).json({ error: "Erro ao criar categoria" });
    }
  }

  if (method === "PUT") {
    try {
      const { id } = req.query;
      const { name } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID da categoria é obrigatório" });
      }

      const category = await prisma.category.update({
        where: { id: parseInt(id, 10) },
        data: { name },
      });

      return res.status(200).json(category);
    } catch (error) {
      console.error("Erro ao atualizar categoria", error);
      return res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  }

  return res.status(405).json({ error: "Método não permitido" });
}
