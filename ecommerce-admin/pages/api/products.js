import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/s3";

export default async function handle(req, res) {
  
  const { method } = req;

  if (method === "GET") {
    const { id } = req.query;
    const links = [];
    const ids = [];
    if (id) {
      const product = await prisma.product.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          // Incluindo as propriedades associadas ao produto
          productPropertyValues: {
            include: {
              propertyValue: true, // Incluindo o valor da propriedade
              property: true, // Incluindo a propriedade
            },
          },
        },
      });
  
      if (!product) {
        return res.status(404).json({ error: "Produto não encontrado" });
      } else {
        const images = await prisma.fileImagesProduct.findMany({
          where: {
            productId: product.id,
          },
        });
  
        // Construir links de imagens
        for (const image of images) {
          const bucketName = image.bucket;
          const fileName = image.fileName;
          const link = `http://localhost:9000/${bucketName}/${fileName}`;
          const id = image.id;
  
          ids.push(id);
          links.push(link);
        }
  
        // Construir o objeto de propriedades no formato { property: value }
        const properties = product.productPropertyValues.reduce((acc, { property, propertyValue }) => {
          if (property && propertyValue) {
            acc[property.name] = propertyValue.value;
          }
          return acc;
        }, {});
  
        const data = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          category: product.categoryId,
          images: links,
          allImagesIds: ids,
          properties, // Adicionando as propriedades no formato desejado
        };
  
        return res.json(data);
      }
    } else {
      const products = await prisma.product.findMany();
      return res.json(products);
    }
  }
  
  if (method === "POST") {
    try {
      const { name, description, price, stock, category, allImagesIds, properties } = req.body;
  
      // Cria o produto
      const product = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          category: {
            connect: {
              id: category,
            }
          }
        },
      });
  
      // Atualiza as imagens para associar ao produto criado
      if (allImagesIds && allImagesIds.length > 0) {
        for (const imageId of allImagesIds) {
          await prisma.fileImagesProduct.update({
            where: {
              id: imageId,
            },
            data: {
              isTemporary: false,
              productId: product.id,
            },
          });
        }
      }
  
      // Associa as propriedades (valores) ao produto
      if (properties && Object.keys(properties).length > 0) {
        for (const [propName, value] of Object.entries(properties)) {
          const existingValue = await prisma.propertyValue.findFirst({
            where: {
              value: value,
              property: {
                name: propName,
                categoryId: category,
              },
            },
          });

          console.log(existingValue)
      
          if (existingValue) {
            await prisma.productPropertyValue.create({
              data: {
                productId: product.id,
                propertyValueId: existingValue.id,
              },
            });
          }
        }
      }
  
      return res.status(201).json(product);
    } catch (error) {
      console.error("Erro ao criar o produto", error);
      return res.status(500).json({ error: "Erro ao criar o produto" });
    }
  }
  

  if (method === "PUT") {
    try {
      const { id, name, description, price, stock, category, allImagesIds, properties } = req.body;
  
      if (!id) {
        return res.status(400).json({ error: "ID do produto é obrigatório" });
      }
  
      // Atualiza o produto
      const product = await prisma.product.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          price: parseFloat(price),
          stock: parseInt(stock),
          category: {
            connect: {
              id: category,
            }
          },
        },
      });

      console.log(product)
  
      // Atualiza as imagens
      if (allImagesIds && allImagesIds.length > 0) {
        for (const imageId of allImagesIds) {
          await prisma.fileImagesProduct.update({
            where: {
              id: imageId,
            },
            data: {
              isTemporary: false,
              productId: product.id,
            },
          });
        }
      }
  
      // Primeiro apaga todas as propriedades antigas do produto
      await prisma.productPropertyValue.deleteMany({
        where: { productId: product.id },
      });
  
      // E insere as novas propriedades
      if (properties && Object.keys(properties).length > 0) {
        for (const [propName, value] of Object.entries(properties)) {
          const existingValue = await prisma.propertyValue.findFirst({
            where: {
              value: value,
              property: {
                name: propName,
                categoryId: category,
              },
            },
          });
      
          console.log(existingValue)

          if (existingValue) {
            await prisma.productPropertyValue.create({
              data: {
                productId: product.id, // Usando o productId corretamente
                propertyValueId: existingValue.id, // Usando o propertyValueId corretamente
                propertyId: existingValue.propertyId, // Assegure-se de que está associando o ID da propriedade corretamente
              },
            });
          }
        }
      }
  
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
         const images = await prisma.fileImagesProduct.findMany({
          where: {
            productId: Number(id)
          }
        });

        try {
          for (const image of images){
            await s3Client.removeObject(image.bucket, image.fileName);
          }
        } catch (error) {
          return res.status(500).json({error: "Erro ao deletar imagens."})
        }

        const product = await prisma.product.delete({
          where: {
            id: Number(id),
          },
        })


        return res.status(200).json(product)
      } else {
        return res.status(500).json({ error: "Id não encontrado"})
      }

    } catch (error) {
      console.error("Erro ao deletar o produto", error);
      return res.status(500).json({ error: "Erro ao  deletar o produto"})
    }

  }

  return res.status(405).json({ error: "Método não permitido" });
}

