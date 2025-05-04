import mercadopago from 'mercadopago';

mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN);

export default async function handler(req, res) {
  const paymentId = req.query.payment_id;

  try {
    const paymentData = await mercadopago.payment.findById(paymentId);

    if (paymentData.response.status === 'approved') {
      // O pagamento foi aprovado
      return res.json({ message: 'Pagamento aprovado!' });
    } else {
      // O pagamento falhou
      return res.json({ message: 'Pagamento não aprovado.' });
    }
  } catch (error) {
    console.error("Erro ao verificar pagamento:", error);
    return res.status(500).json({ message: "Erro ao verificar o pagamento." });
  }
}
