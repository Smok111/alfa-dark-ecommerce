import { Outlet, Link, useNavigate } from 'react-router-dom';
import { WhatsAppFloating } from '../components/ui/WhatsAppButton';
import { AccessibilityWidget } from '../components/ui/AccessibilityWidget';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';

export const MainLayout = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useLanguageStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary text-gray-200">
      <header className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled ? 'glass-panel py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo-v3.png"
              alt="Alfa Dark Joyería"
              className="h-24 md:h-28 w-auto object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            />
            <div className="flex flex-col justify-center">
              <span className="text-2xl md:text-3xl font-serif text-primary tracking-[0.25em] uppercase leading-tight">Alfa Dark</span>
              <span className="text-[10px] md:text-xs text-gray-500 tracking-[0.4em] uppercase mt-1">Joyería Exclusiva</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-[0.2em] font-semibold">
            <Link to="/" className="hover:text-primary transition-colors py-2">{t('nav.home')}</Link>
            <Link to="/catalog" className="hover:text-primary transition-colors py-2">{t('nav.vault')}</Link>
            <a href="https://wa.me/51912167936?text=Hola,%20busco%20asesoría%20VIP%20para%20una%20pieza%20de%20alta%20gama." target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors py-2">{t('nav.vip_advisory')}</a>
            
            {isAuthenticated && user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full pl-2 pr-4 py-1.5 hover:bg-primary/20 transition-all">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-secondary font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-primary text-xs">{user.name}</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 glass-panel rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="block w-full text-left px-4 py-2.5 text-sm text-primary hover:bg-white/5 transition-colors">
                      {t('nav.admin_panel')}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors">
                    {t('nav.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="bg-primary/10 border border-primary/20 text-primary px-5 py-2.5 rounded-full hover:bg-primary hover:text-secondary transition-all duration-300">
                {t('nav.vip_access')}
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-300 hover:text-primary transition-colors">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass-panel mt-3 mx-4 rounded-xl p-6 space-y-4 text-sm uppercase tracking-widest">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block hover:text-primary transition-colors py-2">{t('nav.home')}</Link>
            <Link to="/catalog" onClick={() => setMenuOpen(false)} className="block hover:text-primary transition-colors py-2">{t('nav.vault')}</Link>
            <a href="https://wa.me/51912167936" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="block hover:text-primary transition-colors py-2">{t('nav.vip_advisory')}</a>
            {isAuthenticated ? (
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block text-red-400 hover:text-red-300 py-2">{t('nav.logout')}</button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-primary hover:text-primary-light py-2">{t('nav.vip_access')}</Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <WhatsAppFloating />
      <AccessibilityWidget />

      <footer className="border-t border-white/5 bg-[#030303] py-16 mt-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h3 className="font-serif text-2xl text-primary mb-6">ALFA DARK</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t('footer.desc')}</p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-6">{t('footer.links')}</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link to="/catalog" className="hover:text-primary transition-colors">{t('footer.catalog')}</Link></li>
              <li className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                <span>{t('footer.my_account')}</span>
                <span>🔒</span>
              </li>
              <li><a href="https://www.tiktok.com/@alfa.dark.joyeria?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-6">{t('footer.exclusive_sales')}</h4>
            <p className="text-gray-500 text-sm mb-4">{t('footer.advisory_desc')}</p>
            <a href="https://wa.me/51912167936" target="_blank" rel="noopener noreferrer" className="text-primary font-serif text-xl hover:text-primary-light transition-colors block">+51 912 167 936</a>
          </div>
        </div>
        <div className="container mx-auto px-6 text-center mt-16 pt-8 border-t border-white/5 text-gray-600 text-xs tracking-widest">
          <p>{t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  );
};
