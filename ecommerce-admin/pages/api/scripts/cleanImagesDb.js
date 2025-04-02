import { prisma } from "@/lib/prisma";
import { s3Client } from "@/lib/s3";


//configure no servidor para rodas esse script todo dia, ou no tempo desejado, para evitar imagens orfans

async function limparImagensOrfas() {
  const limiteTempo = new Date();
  limiteTempo.setDate(limiteTempo.getDate() - 1); // 🗓️ Excluir imagens com mais de 1 dia

  const imagensParaExcluir = await prisma.fileImagesProduct.findMany({
    where: {
      isTemporary: true,
      createdAt: { lt: limiteTempo },
    },
  });

  for (const img of imagensParaExcluir) {
    try {
      // 🚀 Exclui do MinIO
      await s3Client.removeObject("pratasimages", img.fileName);
      
      // 🚀 Exclui do banco
      await prisma.fileImagesProduct.delete({
        where: { id: img.id },
      });

      console.log(`✅ Imagem ${img.fileName} removida.`);
    } catch (error) {
      console.error(`❌ Erro ao remover ${img.fileName}:`, error);
    }
  }

  console.log("🧹 Limpeza de imagens órfãs concluída.");
}

// Executa o script se rodado manualmente
limparImagensOrfas().then(() => process.exit());
