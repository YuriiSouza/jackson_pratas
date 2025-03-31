import multiparty from 'multiparty'
import { s3Client } from '@/lib/s3';
import fs from 'fs';
import mime, { contentType } from 'mime-types';

const bucketName = 'pratasimages'

export default async function handle(req, res) {
  const form = new multiparty.Form();

  const { fields, files} = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject (err);
        resolve({fields,files});
      });
    })

    console.log(files.file);

    const links = [];

    //iterar pelos arquivos e guardaos, os nomes e dados estão no const file
    for (const file of files.file) {
      const ext = file.originalFilename.split('.').pop();
      const newFilename = Date.now() + '.' + ext;
      const body_ = fs.readFileSync(file.path);
      const acl = 'public-read';
      const contentType = mime.lookup(file.path)

      
      // await s3Client.send(new PutOb)
    
      const link = `http://${bucketName}.localhost:9000/${newFilename}`;
    
      links.push(link);
    }

    return res.json({links});
}

export const config = {
  api: {bodyParser: false} 
}