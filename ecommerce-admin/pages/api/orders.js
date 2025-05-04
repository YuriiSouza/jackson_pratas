import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true
        }
      },
      statusHistory: true,
      user: {
        include: {
          address: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  
  const formattedOrders = orders.map(order => {
    const userAddress = order.user.address[0] || null;
    
    return {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,
      name: order.name,
      email: order.email,
      city: userAddress.cidade,
      postalCode: userAddress.cep,
      country: userAddress.pais,
      streetAddress: userAddress.rua,
      items: order.items
    };
  });
  

  res.status(200).json(formattedOrders);
}
