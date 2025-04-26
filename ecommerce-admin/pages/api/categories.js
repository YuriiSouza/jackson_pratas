import { prisma } from "@/lib/prisma";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const { id } = req.query;

      if (id) {
        const category = await prisma.category.findUnique({
          where: {
            id: id,
          },
          include: {
            properties: true,
            parent: true,
            children: true
          }
        });

        if (!category) {
          return res.status(404).json({ error: "Categoria não encontrada" });
        }

        return res.json(category);
      } else {
        const categories = await prisma.category.findMany({
          include: {
          properties: {
            include: {
              values: true
            },
          },
          parent: true,
          children: true
          },
        });
        
        return res.json(categories);
      }
    } catch (error) {
      console.error("Erro ao buscar categorias", error);
      return res.status(500).json({ error: "Erro ao buscar categorias" });
    }
  }

  if (method === "POST") {
    try {
      const { name, parentCategory, properties } = req.body;
  
      if (!name) {
        return res.status(400).json({ error: "Nome da categoria é obrigatório" });
      }
  
      const category = await prisma.category.create({
        data: {
          name,
          parent: parentCategory
            ? { connect: { id: parentCategory } }
            : undefined,
          properties: {
            create: properties.map(p => ({
              name: p.name,
              values: {
                create: p.values.map(v => ({
                  value: v,
                })),
              },
            })),
          },
        },
        include: {
          parent: true,
          properties: {
            include: {
              values: true,
            },
          },
        },
      });
  
      return res.status(201).json(category);
    } catch (error) {
      console.error("Erro ao criar categoria", error);
      return res.status(500).json({ error: "Erro ao criar categoria" });
    }
  }
  

  if (method === "PUT") {
    try {
      const { id, name, parentCategory, properties } = req.body;
  
      if (!id) {
        return res.status(400).json({ error: "ID da categoria é obrigatório" });
      }
  
      const categoryId = id;
  
      // Apaga tudo que for relacionado à properties e seus valores
      const oldProps = await prisma.property.findMany({
        where: { categoryId },
        select: { id: true },
      });
  
      const propIds = oldProps.map(p => p.id);
  
      await prisma.propertyValue.deleteMany({
        where: { propertyId: { in: propIds } },
      });
  
      await prisma.property.deleteMany({
        where: { categoryId },
      });
  
      const category = await prisma.category.update({
        where: { id: categoryId },
        data: {
          name,
          parent: parentCategory
            ? { connect: { id: parseInt(parentCategory, 10) } }
            : { disconnect: true },
          properties: {
            create: properties.map(p => ({
              name: p.name,
              values: {
                create: p.values.map(v => ({ value: v })),
              },
            })),
          },
        },
        include: {
          parent: true,
          properties: {
            include: { values: true },
          },
        },
      });
  
      return res.status(200).json(category);
    } catch (error) {
      console.error("Erro ao atualizar categoria", error);
      return res.status(500).json({ error: "Erro ao atualizar categoria" });
    }
  }
  

  if (method === "DELETE") {
    try {
      const { id } = req.query;
      var category = ''

      if(id) {
        category = await prisma.category.delete({
          where: {
            id: id,
          },
        })
      }

      return res.status(200).json(category)

    } catch (error) {
      console.error("Erro ao deletar a categoria", error);
      return res.status(500).json({ error: "Erro ao  deletar a categoria"})
    }

  }


  return res.status(405).json({ error: "Método não permitido" });
}
