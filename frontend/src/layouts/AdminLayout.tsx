import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useState } from 'react';

export const AdminLayout = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Productos', path: '/admin/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Categorías', path: '/admin/categories', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' },
    { name: 'Pedidos', path: '#', locked: true, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { name: 'Usuarios', path: '#', locked: true, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { name: 'Cupones', path: '#', locked: true, icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-300 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-white/5 flex flex-col hidden md:flex">
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-v3.png" alt="Alfa Dark Admin" className="h-8 w-auto object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
          <div className="flex flex-col">
            <span className="text-white font-serif tracking-widest text-sm leading-tight">ALFA DARK</span>
            <span className="text-[9px] text-primary uppercase tracking-[0.3em]">Joyería</span>
          </div>
          <span className="ml-auto bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full border border-primary/30 uppercase font-bold tracking-wider">
            Admin
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.path !== '#' && (pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path)));
            
            if (item.locked) {
              return (
                <div key={item.name} className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium opacity-50 cursor-not-allowed text-gray-400">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    {item.name}
                  </div>
                  <span>🔒</span>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen h-screen overflow-hidden bg-[#0A0A0A]">
        {/* Topbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A0A]">
          <h2 className="text-sm font-medium text-gray-300">Panel de administración</h2>
          
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-full transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-sm text-gray-200 font-medium hidden sm:block mr-1">Admin</span>
              <svg className="w-4 h-4 text-gray-500 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#161616] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                  <p className="text-sm font-semibold text-white">Admin AlfaDark</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link to="/" className="flex items-center gap-2 px-4 py-2text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  Inicio
                </Link>
                <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors mt-2 border-t border-white/5 pt-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
