import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/s3";

export default async function handle(req, res) {
  const { type } = req.query;

  const { method } = req;

  if (type === "product") {

    if (method === "GET") {
      const { id } = req.query;
      const links = [];
  
      if (id) {
        const image = await prisma.FileImagesProduct.findUnique({
          where: {
            id: id,
          },
        });
  
        if (!image) {
          return res.status(404).json({ error: "Imagem não encontrado" });
        } 

        return res.json(image);

      } else {
        const images = await prisma.image.findMany();
        return res.json(images);
      }
    }
  
    if (method === "PUT") {
      try {
        const { bucket, fileName, originalName, size, productId, isTemporary } = req.body;
  
        if (!id) {
          return res.status(400).json({ error: "ID da imagem é obrigatório" });
        }
  
        const image = await prisma.fileImagesProduct.update({
          where: { id: id },
          data: {
            bucket: bucket,
            fileName: fileName,
            originalName: originalName, 
            size: parseFloat(size),
            productId: parseInt(productId),
            isTemporary: isTemporary
          },
        });
  
        return res.status(200).json(image);
      } catch (error) {
        console.error("Erro ao atualizar a imagem", error);
        return res.status(500).json({ error: "Erro ao atualizar a imagem" });
      }
    }
  
    if (method === "DELETE") {
      try {
        const { id } = req.query;
  
        if(id) {
          const image = await prisma.fileImagesProduct.delete({
            where: {
              id: id,
            },
          })

          await s3Client.removeObject(image.bucket, image.fileName);          

          return res.status(200).json(image)
        }
  
  
      } catch (error) {
        console.error("Erro ao deletar a imagem", error);
        return res.status(500).json({ error: "Erro ao  deletar a imagem"})
      }
  
    }
  
    return res.status(405).json({ error: "Método não permitido" });
  }

  }  
