import * as Minio from 'minio';
// import type internal from 'stream';

export const s3Client = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT,
  port: process.env.S3_PORTS3,
  accessKey: process.env.S3_ACESS_KEY,
  secretKey: process.env.S3_SECRET_KEY,
  useSSL: false
})

export async function createBucketIfNotExists(bucketName) {
  const bucketExists = await s3Client.bucketExists(bucketName)
  if(!bucketExists) {
    await s3Client.makeBucket(bucketName)
  }
}

// export { s3Client };