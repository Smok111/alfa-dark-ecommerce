import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { showSuccess, showError } from '../../lib/toast';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    productId: '',
    quantity: 1,
    price: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [ordersRes, prodsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products?limit=1000')
      ]);
      setOrders(ordersRes.data?.data || []);
      
      let prods = prodsRes.data?.data?.data || prodsRes.data?.data || [];
      if (!Array.isArray(prods)) prods = [];
      setProducts(prods);
    } catch (error) {
      console.error('Error fetching data', error);
      showError('Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    const prod = products.find(p => p.id === pId);
    setFormData({
      ...formData,
      productId: pId,
      price: prod ? Number(prod.price) : 0
    });
  };

  const handleRegisterSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || formData.quantity < 1 || formData.price < 0) {
      return showError('Por favor, completa los campos correctamente');
    }

    setIsSaving(true);
    try {
      await api.post('/orders/manual', {
        productId: formData.productId,
        quantity: Number(formData.quantity),
        price: Number(formData.price)
      });
      showSuccess('Venta de WhatsApp registrada exitosamente');
      setIsModalOpen(false);
      setFormData({ productId: '', quantity: 1, price: 0 });
      fetchData();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Error al registrar venta');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Gestión de Pedidos</h1>
          <p className="text-gray-500 text-sm">Administra los pedidos de los clientes y ventas manuales</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-green-500 transition-colors shadow-[0_0_15px_rgba(22,163,74,0.3)] flex items-center gap-2"
        >
          <span>+</span> Registrar Venta WhatsApp
        </button>
      </div>

      <div className="bg-[#161616] p-6 rounded-2xl border border-white/5 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay pedidos registrados.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-white/5">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Cliente ID</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado Pago</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4">{order.id.slice(0, 8)}...</td>
                  <td className="px-6 py-4">{order.userId.slice(0, 8)}...</td>
                  <td className="px-6 py-4 font-medium text-white">S/ {Number(order.total).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${order.paymentStatus === 'PAID' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal WhatsApp Sale */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] p-8 rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-serif text-white mb-2">Registrar Venta de WhatsApp</h2>
            <p className="text-gray-400 text-sm mb-6">Esto creará un pedido pagado y restará el stock de la joya automáticamente.</p>
            
            <form onSubmit={handleRegisterSale} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Joya Vendida *</label>
                <select 
                  required 
                  value={formData.productId} 
                  onChange={handleProductChange}
                  className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500"
                >
                  <option value="">Selecciona una joya</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id} disabled={p.stock < 1}>
                      {p.name} (Stock: {p.stock} - S/ {p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Cantidad *</label>
                  <input 
                    type="number" 
                    min="1" 
                    required 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                    className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Precio Total (S/) *</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    required 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-green-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-green-500 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Registrando...' : 'Confirmar Venta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
