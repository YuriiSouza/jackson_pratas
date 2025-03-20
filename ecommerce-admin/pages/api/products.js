import { prisma } from "@/lib/prisma";

export default async function handle(req, res) {
  const {method} = req;

  if (method == 'POST') {
    // try {
    const{name, description, price} = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price)
      },
    });

    return res.status(201).json(product);
    // } catch (error) {
    //   console.error("Error to create the product", error);
    //   return res.status(500).json({error: "error to create the product"});
    // }
  // }

  // return res.status(405).json({error: "Method no permited"})
  }
}
