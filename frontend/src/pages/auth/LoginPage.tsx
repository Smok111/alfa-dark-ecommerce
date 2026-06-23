import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      const currentState = useAuthStore.getState();
      if (currentState.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.03)_0%,transparent_70%)]" />
      </div>

      {/* Login Card - Split Design */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]"
      >
        {/* Left Panel - Brand Showcase */}
        <div className="hidden lg:flex flex-col items-center justify-center p-16 relative bg-gradient-to-br from-[#0A0A0A] via-[#111] to-[#0A0A0A] border-r border-white/5">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1605100804763-247f6612148e?auto=format&fit=crop&q=80"
              alt="Luxury Men's Jewelry"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 to-[#0A0A0A]/80" />
          </div>
          
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <img
                src="/logo-v3.png"
                alt="Alfa Dark"
                className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-8 object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.4)] mix-blend-lighten"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="font-serif text-4xl text-white mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA8C2C]">
                "Diseñamos lo que imaginas"
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto"
            >
              Joyería premium que cuenta tu historia bajo la luz de la elegancia.
            </motion.p>

            {/* Category pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="flex flex-wrap gap-3 justify-center mt-10"
            >
              {['✦ Anillos', '✦ Collares', '✦ Pulseras'].map((cat) => (
                <span key={cat} className="px-4 py-1.5 rounded-full border border-primary/30 text-primary/70 text-xs tracking-wider">
                  {cat}
                </span>
              ))}
            </motion.div>

            {/* Decorative dots */}
            <div className="flex gap-2 justify-center mt-10">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-primary' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="glass-panel p-10 lg:p-16 flex flex-col justify-center bg-[#080808]/95">
          <div className="mb-10">
            <h1 className="font-serif text-3xl lg:text-4xl text-white mb-3">
              Bienvenid@ de vuelta
            </h1>
            <p className="text-gray-500 text-sm">
              Entra a tu universo de joyería exclusiva
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
              <button onClick={clearError} className="ml-auto text-red-400 hover:text-red-300">✕</button>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Correo electrónico</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@correo.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Contraseña</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#AA8C2C] via-[#D4AF37] to-[#F3E5AB] text-secondary font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
              ) : (
                <>
                  Ingresar al portal
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-primary hover:text-primary-light transition-colors font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
