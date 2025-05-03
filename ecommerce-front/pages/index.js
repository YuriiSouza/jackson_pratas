import Featured from "@/components/featured";
import Header from "@/components/header";
import NewProducts from "@/components/newProducts";
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
  

  const serializedFeaturedProduct = {
    ...product,
    price: product?.price?.toNumber(), // Decimal → number
    createdAt: product?.createdAt?.toISOString(), // Date → string
    updatedAt: product?.updatedAt?.toISOString(), // Date → string
    images: links
  };

  const products = await prisma.product.findMany({
    take: 12,
    include: {
      images: true
    },
    orderBy: [
      {
        createdAt: 'desc'
      }
    ]
  })

  const newProducts = products.map((prod) => ({
    ...prod,
    price: prod.price.toNumber(),
    createdAt: prod.createdAt.toISOString(),
    updatedAt: prod.updatedAt.toISOString(),
    images: prod.images.map(
      (image) => `http://localhost:9000/${image.bucket}/${image.fileName}`
    ),
  }));

  return {
    props: { 
      featuredProduct: serializedFeaturedProduct,
      newProducts: newProducts
     },
  };
}

export default function HomePage({featuredProduct, newProducts}) {
  console.log(newProducts)

  return (
    <div>
      <Header />
      <Featured product={featuredProduct}/>
      <NewProducts products={newProducts} />
    </div>
  )
}

