//mercado pago conection

import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ message: "ACCESS_TOKEN do Mercado Pago não encontrado." });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: 'pendente'
      },
    });

    const statusMap = {
      approved: "pago",
      pending: "pendente",
      in_process: "pendente",
      cancelled: "cancelado",
      refunded: "cancelado",
      rejected: "cancelado",
    };

    let updatedCount = 0;

    for (const order of orders) {
      const response = await fetch(`https://api.mercadopago.com/v1/orders/${order.id_mercado_pago}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const payment = await response.json();

      const novoStatus = statusMap[payment.status] || "pendente";

      if (novoStatus !== order.status) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: novoStatus,
          },
        });

        await prisma.orderStatusHistory.create({
          data: {
            orderId: order.id,
            status: novoStatus,
          },
        });

        updatedCount++;
      }
    }

    return res.status(200).json({
      message: `Atualização concluída. ${updatedCount} pedido(s) alterado(s).`,
    });
  } catch (error) {
    console.error("Erro ao atualizar pedidos:", error);
    return res.status(500).json({ message: "Erro ao atualizar pedidos", error: error.message });
  }
}
