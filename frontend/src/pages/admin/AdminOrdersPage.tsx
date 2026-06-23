import { useState, useEffect } from 'react';
import api from '../../lib/api';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching orders', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Gestión de Pedidos</h1>
        <p className="text-gray-500 text-sm">Administra los pedidos de los clientes</p>
      </div>

      <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
        {isLoading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay pedidos registrados.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-white/5">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">{order.userId}</td>
                  <td className="px-6 py-4 font-medium text-white">S/ {order.total}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">{order.status}</span></td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
