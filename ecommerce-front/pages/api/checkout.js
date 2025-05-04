// pages/api/checkout.js

import { MercadoPagoConfig, Order, Preference } from "mercadopago";
import { prisma } from '@/lib/prisma';
import { getSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";


const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const orderApi = new Order(client);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  
  const session = await getServerSession(req, res, authOptions);

  const user = session?.user;

  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      order: {
        orderBy: {
          createdAt: 'desc',
        },
        take:1,
      }
    }
  })
  
  const {
    name, email, city,
    postalCode, streetAddress, country,
    cartSummary, numberAdress, complementAdress, neighborhood, state, total
  } = req.body;

  const productIds = cartSummary.map(item => item.productId);
  const uniqueIds = [...new Set(productIds)];

  const productsInfos = await prisma.product.findMany({
    where: {
      id: { in: uniqueIds.filter(id => id !== null) },
    },
  });

  const totalAmount = cartSummary.reduce((sum, item) => sum + item.total, 0);

  const address = await prisma.address.findFirst({
    where: {
      userId: user.id,
      cep: postalCode,
      rua: streetAddress,
      numero: numberAdress || null,
      complemento: complementAdress || null,
      bairro: neighborhood || null,
      cidade: city, 
      estado: state, 
    }
  });
  
  if (address) {
    // Endereço já existe, então vamos atualizar
    await prisma.address.update({
      where: {
        id: address.id,
      },
      data: {
        cep: postalCode,
        rua: streetAddress,
        numero: numberAdress || null,
        complemento: complementAdress || null,
        bairro: neighborhood || null,
        cidade: city,
        estado: state,
      },
    });
  } else {
    // Endereço não existe, então cria um novo
    await prisma.address.create({
      data: {
        cep: postalCode,
        rua: streetAddress,
        numero: numberAdress || null,
        complemento: complementAdress || null,
        bairro: neighborhood || null,
        cidade: city,
        estado: state,
        userId: user.id,
      },
    });
  };
  
  const preference = new Preference(client);
  
  try {
    const response = await preference.create({
      body: {
        back_urls: {
          success: "http://localhost:3000/account",
          failure: "http://localhost:3000/cart",
          pending: "http://localhost:3000/account"
        },
        items: cartSummary.map(item => ({
          id: item.id,
          title: item.name,
          quantity: item.quantity,
          unit_price: item.priceUnit,
        })),
        payer: {
          phone: { area_code: '', number: '' },
          address: {
            zip_code: address.cep,
            street_name: address.rua,
            street_number: address.numero
          },
          email: user.email,
          identification: { number: '', type: '' },
          name: user.name,
          surname: '',
          date_created: user.createdAt,
          last_purchase: user.order?.createdAt || null
        },
        total_amount: totalAmount,
      }
    });
  
    const id_MP = response.id;
  
    const orderDoc = await prisma.order.create({
      data: {
        name,
        email,
        userId: user.id,
        totalAmount: new Prisma.Decimal(total),
        paymentMethod: "mercado_pago",
        status: "pendente",
        id_mercado_pago: id_MP,
        items: {
          create: cartSummary
            .filter(item => item.productId !== null)
            .map(item => ({
              product: { connect: { id: item.productId } },
              quantity: item.quantity,
              priceAtPurchase: new Prisma.Decimal(item.priceUnit),
            })),
        },
        statusHistory: {
          create: {
            status: "pendente",
          },
        },
      },
    });

    const URL_init_point = response.init_point;

    console.log(response)
    return res.status(200).json({ URL_init_point });

  } catch (error) {
    return res.status(401)
    console.error("Erro ao criar preferência ou pedido:", error);
  }
  
}
