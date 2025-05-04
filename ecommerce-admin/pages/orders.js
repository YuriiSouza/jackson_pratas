import Layout from "@/components/layout";
import {useEffect, useState} from "react";
import axios from "axios";

export default function OrdersPage() {
  const [orders,setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);

  const statusColors = {
    pendente: 'text-yellow-500',
    pago: 'text-green-600',
    enviado: 'text-blue-500',
    entregue: 'text-green-800',
    cancelado: 'text-red-600',
  };
  
  function updateOrders() {
    axios.get('/api/mp').then(response => {
      setOrders(response.data);
    });
  }

  return (
    <Layout>
      <div className="flex flex-row justify-between">
        <h1>Orders</h1>
        <button className="btn-primary py-1" onClick={() => updateOrders()}>
          atualizar
        </button>
      </div>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
        {orders.length > 0 && orders.map(order => (
          <tr key={order.id}>
            <td>{(new Date(order.createdAt)).toLocaleString()}
            </td>
            <td className={statusColors[order.status] || 'text-gray-500'}>
              {order.status}
            </td>
            <td>
              {order.name} {order.email}<br />
              {order.city} {order.postalCode} {order.country}<br />
              {order.streetAddress}
            </td>
            <td>
              {order.items.map(l => (
                <>
                  {l.product.name.split(" ").slice(0, 2).join(" ")} x
                  {l.quantity}<br />
                </>
              ))}
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </Layout>
  );
}