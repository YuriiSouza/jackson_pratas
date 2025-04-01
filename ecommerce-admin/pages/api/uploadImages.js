import multiparty from "multiparty";
import { s3Client } from "@/lib/s3";
import fs from "fs";
import mime from "mime-types";
import { url } from "inspector";
import { prisma } from "@/lib/prisma";

const bucketName = "pratasimages";

export default async function handle(req, res) {
  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const {productId} = req.query;

    if (!productId) {
      return res.status(400).json({ error: "ID do produto é obrigatório" });
    }

    const imageLinks = [];

    for (const file of files.file) {
      const ext = file.originalFilename.split(".").pop();
      const newFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = file.path;
      const contentType = mime.lookup(filePath);
      const fileSize = fs.statSync(filePath).size;

      // Upload para o MinIO
      await s3Client.fPutObject(bucketName, newFilename, filePath, {
        "Content-Type": contentType,
        "x-amz-acl": "public-read",
      });

      // URL pública
      const imageUrl = `http://localhost:9000/${bucketName}/${newFilename}`;

      // Salvar no Prisma
      const savedImage = await prisma.fileImagesProduct.create({
        data: {
          bucket: bucketName,
          fileName: newFilename,
          originalName: file.originalFilename,
          size: fileSize,
          productId: parseInt(productId),
        },
      });

      // imageLinks.push({
      //   id: savedImage.id,
      //   url: imageUrl,
      //   originalName: savedImage.originalName,
      // });
    
      imageLinks.push(imageUrl)
    }

    return res.json({ images: imageLinks });
  } catch (error) {
    console.error("Erro ao processar upload:", error);
    return res.status(500).json({ error: "Erro interno ao salvar imagem" });
  }
}

export const config = {
  api: { bodyParser: false },
};
