import Featured from "@/components/featured";
import Header from "@/components/header";
import { prisma } from "@/lib/prisma";

export async function getServerSideProps() {
  const featuredProductId = 14;

  const product = await prisma.product.findUnique({
    where: {
      id: featuredProductId,
    },
    include: {
      images: true,
    }
  });

  const links = product.images.map(
    image => `http://localhost:9000/${image.bucket}/${image.fileName}`
  );  
  

  const serializedProduct = {
    ...product,
    price: product?.price?.toNumber(), // Decimal → number
    createdAt: product?.createdAt?.toISOString(), // Date → string
    updatedAt: product?.updatedAt?.toISOString(), // Date → string
    images: links
  };

  return {
    props: { product: serializedProduct },
  };
}

export default function HomePage({product}) {

  return (
    <div>
      <Header />
      <Featured product={product}/>
    </div>
  )
}

