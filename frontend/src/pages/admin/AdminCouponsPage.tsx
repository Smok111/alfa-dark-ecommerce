import { useState, useEffect } from 'react';
import api from '../../lib/api';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/coupons');
      setCoupons(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching coupons', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Gestión de Cupones</h1>
        <p className="text-gray-500 text-sm">Administra los descuentos y cupones de la tienda</p>
      </div>

      <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
        {isLoading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : coupons.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay cupones registrados.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-white/5">
              <tr>
                <th className="px-6 py-3">Código</th>
                <th className="px-6 py-3">Descuento</th>
                <th className="px-6 py-3">Expiración</th>
                <th className="px-6 py-3">Activo</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4 font-medium text-white">{coupon.code}</td>
                  <td className="px-6 py-4">{coupon.discount}%</td>
                  <td className="px-6 py-4">{new Date(coupon.expiresAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${coupon.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {coupon.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
