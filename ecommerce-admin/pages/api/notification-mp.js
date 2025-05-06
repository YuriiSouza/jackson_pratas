const axios = require('axios');

// Configura o Access Token do Mercado Pago
const accessToken = 'SEU_ACCESS_TOKEN';

// Função para tratar webhook/postback
async function handleWebhook(req, res) {
  const { type, data } = req.body;

  try {
    switch (type) {
      case 'payment':
        // Requisição para obter detalhes do pagamento
        const payment = await axios.get(`https://api.mercadopago.com/v1/payments/${data.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Pagamento:', payment.data);
        break;

      case 'plan':
        // Requisição para obter detalhes do plano
        const plan = await axios.get(`https://api.mercadopago.com/preapproval_plan/${data.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Plano:', plan.data);
        break;

      case 'subscription':
        // Requisição para obter detalhes da assinatura
        const subscription = await axios.get(`https://api.mercadopago.com/preapproval/${data.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Assinatura:', subscription.data);
        break;

      case 'invoice':
        // Requisição para obter detalhes da fatura
        const invoice = await axios.get(`https://api.mercadopago.com/invoices/${data.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Fatura:', invoice.data);
        break;

      case 'point_integration_wh':
        // Se necessário, adicione lógica para o tipo point_integration_wh
        console.log('Webhook do Mercado Pago Point:', req.body);
        break;

      default:
        console.log('Tipo desconhecido:', type);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(500).send('Erro interno');
  }
}
