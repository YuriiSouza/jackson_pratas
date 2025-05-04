// pages/api/checkout.js

import { MercadoPagoConfig, Order } from "mercadopago";
import { prisma } from '@/lib/prisma';
import { getSession } from "next-auth/react";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";


const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { timeout: 5000 },
});

const orderApi = new Order(client);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método não permitido' });
    return;
  }

  
  const session = await getServerSession(req, res, authOptions);

  const user = session?.user;
  

  const {
    name, email, city,
    postalCode, streetAddress, country,
    cartSummary, numberAdress, complementAdress, neighborhood, state
  } = req.body;

  const productIds = cartSummary.map(item => item.productId);
  const uniqueIds = [...new Set(productIds)];

  const productsInfos = await prisma.product.findMany({
    where: {
      id: { in: uniqueIds.filter(id => id !== null) },
    },
  });

  let totalAmount = 0;
  let description = [];

  for (const productId of uniqueIds) {
    const productInfo = productsInfos.find(p => p.id.toString() === productId);
    const quantity = productIds.filter(id => id === productId).length;

    if (quantity > 0 && productInfo) {
      totalAmount += quantity * productInfo.price;
      description.push(`${productInfo.title} x${quantity}`);
    }
  }

  const orderDoc = await prisma.order.create({
    data: {
      name,
      email,
      userId: user?.id || null,
      totalAmount: new Prisma.Decimal(totalAmount),
      paymentMethod: "mercado_pago",
      status: "pendente",
      items: {
        create: cartSummary
        .filter(item => item.productId !== null)
        .map(item => ({
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          priceAtPurchase: new Prisma.Decimal(item.total),
        })),
      },
      address: {
        create: {
          cep: postalCode,
          rua: streetAddress,
          numero: numberAdress || null,
          complemento: complementAdress || null,
          bairro: neighborhood || null,
          cidade: city,
          estado: state,
        },
      },
      statusHistory: {
        create: {
          status: "pendente",
        },
      },
    },
  });
  

  const body = {
    type: "online",
    processing_mode: "automatic",
    total_amount: totalAmount.toFixed(2),
    external_reference: orderDoc.id.toString(),
    payer: {
      email: email,
    },
    transactions: {
      payments: [
        {
          amount: totalAmount.toFixed(2),
          payment_method: {
            id: "visa", // ou outro método, você pode deixar dinâmico
            type: "credit_card",
            token: "<CARD_TOKEN>", // precisa ser gerado no front
            installments: 1,
            statement_descriptor: "Sua Loja",
          },
        },
      ],
    },
  };

  const requestOptions = {
    idempotencyKey: `order-${orderDoc.id}-${Date.now()}`,
  };

  try {
    const mpOrder = await orderApi.create({ body, requestOptions });
    res.status(200).json({ mpOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pedido no Mercado Pago" });
  }
}
