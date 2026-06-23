import { motion } from 'framer-motion';

export const AdminDashboardPage = () => {
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            <h1 className="text-2xl font-bold text-white tracking-wide">Dashboard</h1>
          </div>
          <p className="text-gray-500 text-sm capitalize">{today}</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-[#0A2F1D] text-[#10B981] px-3 py-1.5 rounded-full border border-[#10B981]/20">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
          <span className="text-xs font-semibold">Sistema activo</span>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingresos */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#161616] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">S/ 0.00</h2>
          <p className="text-sm font-medium text-gray-300">Ingresos totales</p>
          <p className="text-[10px] text-gray-600 mt-1">Confirmado · Enviado · Finalizado</p>
          <div className="absolute top-4 right-4 w-1 h-1 bg-white/20 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        </motion.div>

        {/* Total Pedidos */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#161616] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">0</h2>
          <p className="text-sm font-medium text-gray-300">Total pedidos</p>
          <p className="text-[10px] text-gray-600 mt-1">0 en proceso</p>
          <div className="absolute top-4 right-4 w-1 h-1 bg-white/20 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        </motion.div>

        {/* Alfa Points */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#161616] p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">0</h2>
          <p className="text-sm font-medium text-gray-300">AlfaPoints</p>
          <p className="text-[10px] text-gray-600 mt-1">Puntos distribuidos</p>
          <div className="absolute top-4 right-4 w-1 h-1 bg-white/20 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Estado de Pedidos */}
          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Estado de pedidos
              </div>
              <span className="text-[10px] text-gray-500">0 total</span>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'En Proceso', count: 0, percent: 0, color: 'bg-[#F59E0B]' },
                { label: 'Confirmado', count: 0, percent: 0, color: 'bg-[#10B981]' },
                { label: 'Enviado', count: 0, percent: 0, color: 'bg-[#3B82F6]' },
                { label: 'Finalizado', count: 0, percent: 0, color: 'bg-primary' },
                { label: 'Cancelado', count: 0, percent: 0, color: 'bg-[#EF4444]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center text-xs">
                  <span className="w-24 text-gray-400">{item.label}</span>
                  <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden mx-4">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                  </div>
                  <span className="w-8 text-right text-gray-300 font-medium">{item.count}</span>
                  <span className="w-10 text-right text-gray-600">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pedidos Recientes */}
          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Pedidos recientes
              </div>
              <button className="text-[10px] text-primary hover:text-primary-dark uppercase tracking-wider">Ver todos →</button>
            </div>
            <div className="flex flex-col items-center justify-center h-40 text-center border-t border-white/5 pt-6">
              <p className="text-gray-500 text-sm">No hay pedidos recientes</p>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Productos */}
          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                Productos
              </div>
              <button className="text-[10px] text-primary hover:text-primary-dark uppercase tracking-wider">Ver →</button>
            </div>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-3xl font-bold text-white">0</h3>
              <span className="text-[10px] text-gray-600 mb-1">registrados</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative w-16 h-16 flex items-center justify-center rounded-full border-4 border-white/5">
                <span className="text-xs font-bold text-gray-400">0%</span>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div><span className="text-gray-400">Disponibles</span></div><span className="text-white">0</span></div>
                <div className="flex justify-between items-center"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#EF4444]"></div><span className="text-gray-400">Agotados</span></div><span className="text-white">0</span></div>
              </div>
            </div>
          </div>

          {/* Cupones */}
          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-gray-300 font-medium text-sm">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                Cupones
              </div>
              <button className="text-[10px] text-primary hover:text-primary-dark uppercase tracking-wider">Ver →</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-[#10B981]">0</p>
                <p className="text-[9px] text-gray-500 mt-1">Activos</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center border-x border-white/5">
                <p className="text-xl font-bold text-[#F59E0B]">0</p>
                <p className="text-[9px] text-gray-500 mt-1">Expirados</p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-xl font-bold text-[#EF4444]">0</p>
                <p className="text-[9px] text-gray-500 mt-1">Agotados</p>
              </div>
            </div>
          </div>

          {/* Top Clientes */}
          <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2 text-gray-300 font-medium text-sm mb-6">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              Top clientes
            </div>
            <div className="flex flex-col items-center justify-center h-20 text-center border-t border-white/5 pt-4">
              <p className="text-gray-500 text-sm">No hay clientes aún</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
