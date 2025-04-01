import type { NextApiRequest, NextApiResponse } from 'next'
import type { FileProps } from '~/utils/types'
 
const LIMIT_FILES = 10
 
const handler = async (req, res) => {

  const { id_ } = req.query;

  // Get the 10 latest files from the database
  const files = await prisma.FileImagesProduct.findMany({
    take: LIMIT_FILES,
    orderBy: {
      createdAt: 'desc',
    },
    where: {
      productId: id_,
    },
  })
  

  const links = [];
  
  for (const file of files) {
    const bucketName = file.bucket;
    const newFilename = file.fileName;

  
    const link = `http://${bucketName}.localhost:9000/${newFilename}`;
  
    links.push(link);
  }

  return res.status(200).json(links)
}
 
export default handler