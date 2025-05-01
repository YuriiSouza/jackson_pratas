import multiparty from "multiparty";
import { s3Client } from "@/lib/s3";
import fs from "fs";
import mime from "mime-types";
import { url } from "inspector";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "./auth/[...nextauth]";

const bucketName = "pratasimages";

export default async function handle(req, res) {

  await isAdminRequest(req, res);
  
  const form = new multiparty.Form();

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const imageLinks = [];
    const imageIds = [];

    const fileArray = Object.values(files).flat();


    for (const file of fileArray) {
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
          size: fileSize
        },
      });

      imageIds.push(savedImage.id)
      imageLinks.push(imageUrl)
    }

    return res.json({ images: imageLinks, ids: imageIds });
  } catch (error) {
    console.error("Erro ao processar upload:", error);
    return res.status(500).json({ error: "Erro interno ao salvar imagem" });
  }
}

export const config = {
  api: { bodyParser: false },
};
