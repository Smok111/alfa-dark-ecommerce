import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary/3 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-2xl glass-panel rounded-2xl p-10 lg:p-14 bg-[#080808]/95"
      >
        <div className="text-center mb-10">
          <Link to="/">
            <img
              src="/logo-v3.png"
              alt="Alfa Dark"
              className="w-16 h-16 mx-auto mb-6 object-contain mix-blend-lighten"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </Link>
          <h1 className="font-serif text-3xl text-white mb-2">Crea tu cuenta exclusiva</h1>
          <p className="text-gray-500 text-sm">Únete al universo Alfa Dark y accede a joyería premium</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
          >
            <span>{error}</span>
            <button onClick={clearError} className="ml-auto text-red-400 hover:text-red-300">✕</button>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Nombre</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange} required
                placeholder="Tu nombre"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 text-sm"
              />
            </div>
            {/* Lastname */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Apellido</label>
              <input
                type="text" name="lastname" value={formData.lastname} onChange={handleChange} required
                placeholder="Tu apellido"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Correo electrónico</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange} required
                placeholder="tu@correo.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Teléfono <span className="text-gray-600">(opcional)</span></label>
            <input
              type="tel" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="+51 912 167 936"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Contraseña</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all duration-300 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#AA8C2C] via-[#D4AF37] to-[#F3E5AB] text-secondary font-bold py-4 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
            ) : (
              <>
                Crear cuenta exclusiva
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary hover:text-primary-light transition-colors font-semibold">
              Inicia sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
