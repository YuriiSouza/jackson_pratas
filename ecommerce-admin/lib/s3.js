import { Client } from "minio";

export const s3Client = new Client({
  endPoint: "localhost", // Ou IP do seu servidor MinIO
  port: 9000,            // Porta padrão do MinIO
  useSSL: false,         // Se não estiver usando HTTPS, deixe `false`
  accessKey: process.env.S3_ACCESS_KEY, 
  secretKey: process.env.S3_SECRET_KEY,
});



export async function createBucketIfNotExists(bucketName) {
  const bucketExists = await s3Client.bucketExists(bucketName)
  if(!bucketExists) {
    await s3Client.makeBucket(bucketName)
  }
}

// export { s3Client };