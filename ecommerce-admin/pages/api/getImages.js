import type { NextApiRequest, NextApiResponse } from 'next'
import type { FileProps } from '~/utils/types'
import { db } from '~/server/db'
 
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
  
  const filesWithProps = files.map((file) => ({
    id: file.id,
    originalFileName: file.originalName,
    fileSize: file.size,
  }))
 
  return res.status(200).json(filesWithProps)
}
 
export default handler