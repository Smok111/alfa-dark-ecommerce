import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80" 
          alt="Luxury Texture" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/90 to-[#050505]" />
      </div>

      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10 max-w-4xl">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4 tracking-wide drop-shadow-xl">
            Sobre Nosotros
          </h1>
          <h2 className="text-primary tracking-[0.3em] uppercase text-[10px] font-bold mb-10">
            NUESTRA ESENCIA Y POLÍTICAS
          </h2>
          
          <div className="text-gray-400 max-w-3xl mx-auto text-sm md:text-base font-light leading-relaxed space-y-6">
            <p>
              <span className="text-primary font-serif font-bold text-lg">ALFA DARK</span> nació de la obsesión por crear piezas que no solo se vean bien, sino que proyecten seguridad, elegancia y exclusividad. No hacemos joyería convencional; diseñamos accesorios de alta gama para la persona moderna que entiende que su presencia es su mejor carta de presentación.
            </p>
            <p>
              Cada joya de nuestra colección es meticulosamente confeccionada y seleccionada con materiales de la más alta calidad, garantizando un acabado perfecto, durabilidad excepcional y una presencia deslumbrante. Bienvenido al siguiente nivel de la joyería exclusiva.
            </p>
          </div>
          
          <div className="mt-12">
            <Link to="/catalog">
              <button className="px-8 py-3 rounded-full bg-transparent border border-primary text-primary uppercase tracking-widest text-xs font-bold hover:bg-primary/10 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                EXPLORAR LA COLECCIÓN
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Guía Oficial de Atención */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-24 mb-16 text-center"
        >
          <h2 className="text-3xl font-serif text-white mb-2">Guía Oficial de Atención</h2>
          <div className="w-16 h-[1px] bg-primary mx-auto mb-10"></div>
          
          <div className="flex justify-center">
            {/* Tarjeta de Contacto */}
            <div className="bg-[#0a0a0a]/80 border border-white/5 rounded-2xl p-8 max-w-sm w-full text-left shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-primary font-serif text-xl mb-6 flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Números de Contacto
              </h3>
              
              <div className="mb-6">
                <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1">SOLICITAR RECOJO:</p>
                <p className="text-white text-2xl font-bold tracking-wider">912 167 936</p>
                <p className="text-gray-600 text-[9px] mt-1">Límite: Hasta el sábado a las 1:00 p.m.</p>
              </div>
              
              <div>
                <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1">HACER PEDIDOS:</p>
                <p className="text-white text-2xl font-bold tracking-wider">912 167 936</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Separaciones y Métodos de Pago */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 bg-[#0a0a0a]/60 border border-primary/20 rounded-3xl p-8 md:p-12 text-center shadow-[0_0_40px_rgba(212,175,55,0.05)]"
        >
          <h3 className="text-primary font-serif text-2xl mb-4 flex items-center justify-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            Separaciones y Métodos de Pago
          </h3>
          <p className="text-gray-300 text-sm md:text-base font-light mb-10">
            La separación mínima es de S/ 20.00 mediante Yape.
          </p>
          
          {/* Tarjeta Yape */}
          <div className="bg-black border border-[#742284]/50 rounded-2xl p-6 inline-block mb-10 shadow-[0_0_20px_rgba(116,34,132,0.15)] relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#742284]/20 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
             <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <div className="bg-[#742284] p-3 rounded-xl flex items-center justify-center w-16 h-16 shadow-lg">
                   {/* Yape Logo aproximado (o texto) */}
                   <span className="text-white font-bold text-xl tracking-tight">yape</span>
                </div>
                <div className="text-center sm:text-left">
                   <p className="text-white text-4xl md:text-5xl font-bold tracking-wider mb-2">912 167 936</p>
                   <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">A NOMBRE DE: <span className="text-white">YUDITH AROCUTIPA</span></p>
                </div>
             </div>
          </div>
          
          {/* Opciones para abonar */}
          <div className="bg-black/50 border border-white/5 rounded-2xl p-6 md:p-8 text-left max-w-2xl mx-auto">
             <h4 className="text-white font-bold text-sm uppercase tracking-widest text-center mb-6">Opciones para abonar:</h4>
             <ul className="space-y-4 text-gray-300 text-sm md:text-base font-light">
                <li className="flex gap-3 items-start">
                   <span className="text-primary mt-1">✦</span>
                   <p>Separar tu joya con el monto mínimo de <span className="text-primary font-bold">S/ 20.00</span>.</p>
                </li>
                <li className="flex gap-3 items-start">
                   <span className="text-primary mt-1">✦</span>
                   <p>Pagar tu pedido en su totalidad.</p>
                </li>
                <li className="flex gap-3 items-start">
                   <span className="text-primary mt-1">✦</span>
                   <p>Abonar el monto que desees, siempre que <span className="text-primary font-bold">no sea menor a S/ 20.00</span>.</p>
                </li>
             </ul>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
};
