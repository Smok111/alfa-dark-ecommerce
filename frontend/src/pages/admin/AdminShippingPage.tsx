import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { showSuccess, showError } from '../../lib/toast';

export const AdminShippingPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching orders', error);
      showError('Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      showSuccess('Estado de pedido actualizado');
      fetchOrders();
    } catch (error) {
      console.error('Error updating status', error);
      showError('Error al actualizar el estado');
    }
  };

  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING');
  const shippedOrders = orders.filter(o => o.status === 'SHIPPED');
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getDate()} ${d.toLocaleString('es-ES', { month: 'short' })}`;
  };

  const OrderCard = ({ order, actionLabel, nextStatus, icon }: { order: any, actionLabel?: string, nextStatus?: string, icon?: React.ReactNode }) => (
    <div className="bg-[#111] border border-white/5 p-4 rounded-xl relative hover:border-white/10 transition-colors">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded text-gray-300">#{order.id.slice(0, 8).toUpperCase()}</span>
        <span className="text-[10px] border border-primary/30 text-primary px-2 py-0.5 rounded-full">{formatDate(order.createdAt)}</span>
      </div>
      <h4 className="text-white text-sm font-medium mb-1">Cliente Invitado</h4>
      <p className="text-gray-500 text-xs mb-4 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        Dirección pendiente de registro
      </p>
      <div className="flex justify-between items-center mt-2 border-t border-white/5 pt-3">
        <span className="text-white font-bold text-sm">S/ {Number(order.total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
        {actionLabel && nextStatus && (
          <button 
            onClick={() => updateOrderStatus(order.id, nextStatus)}
            className="flex items-center gap-1 text-xs px-3 py-1.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-gray-300"
          >
            {icon}
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8 flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Logística y Envíos</h1>
          <p className="text-gray-500 text-sm">Controla el flujo de despacho de tus productos.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Por Preparar */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                </div>
                <h3 className="text-white font-bold text-sm">Por Preparar</h3>
              </div>
              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full font-bold">{pendingOrders.length}</span>
            </div>
            <div className="space-y-4">
              {pendingOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  actionLabel="Despachar" 
                  nextStatus="SHIPPED"
                  icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>}
                />
              ))}
              {pendingOrders.length === 0 && <p className="text-center text-xs text-gray-500 py-4">No hay pedidos por preparar</p>}
            </div>
          </div>

          {/* Column 2: En Tránsito */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                </div>
                <h3 className="text-white font-bold text-sm">En Tránsito</h3>
              </div>
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-0.5 rounded-full font-bold">{shippedOrders.length}</span>
            </div>
            <div className="space-y-4">
              {shippedOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  actionLabel="Entregado" 
                  nextStatus="DELIVERED"
                  icon={<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                />
              ))}
              {shippedOrders.length === 0 && <p className="text-center text-xs text-gray-500 py-4">No hay pedidos en tránsito</p>}
            </div>
          </div>

          {/* Column 3: Entregados */}
          <div className="bg-[#161616] border border-white/5 rounded-2xl p-5 opacity-80">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-green-500/20 text-green-400 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-white font-bold text-sm">Entregados</h3>
              </div>
              <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-bold">{deliveredOrders.length}</span>
            </div>
            <div className="space-y-4">
              {deliveredOrders.map(order => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                />
              ))}
              {deliveredOrders.length === 0 && <p className="text-center text-xs text-gray-500 py-4">No hay pedidos entregados</p>}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
