import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

export const AboutPage = () => {
  // Variantes para animaciones escalonadas
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Fondo Texturizado con Parallax ligero */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <img 
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80" 
          alt="Luxury Texture" 
          className="w-full h-full object-cover opacity-[0.07]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/90 to-[#050505]" />
      </motion.div>

      {/* Orbes de luz decorativos flotantes */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-1/4 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px] -z-10 pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          x: [0, -40, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-[#742284]/10 rounded-full blur-[150px] -z-10 pointer-events-none" 
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 relative z-10 max-w-4xl"
      >
        
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center mb-16 flex flex-col items-center">
          <motion.h1 
            whileHover={{ scale: 1.05 }}
            className="text-4xl md:text-6xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-primary/80 to-white mb-4 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-transform duration-300"
          >
            Sobre Nosotros
          </motion.h1>
          <h2 className="text-primary tracking-[0.4em] uppercase text-[10px] font-bold mb-10 border-b border-primary/30 pb-3">
            NUESTRA ESENCIA Y POLÍTICAS
          </h2>
          
          <div className="text-gray-300 max-w-3xl mx-auto text-sm md:text-base font-light leading-relaxed space-y-6">
            <p>
              <span className="text-primary font-serif font-bold text-xl drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">ALFA DARK</span> nació de la obsesión por crear piezas que no solo se vean bien, sino que proyecten seguridad, elegancia y exclusividad. No hacemos joyería convencional; diseñamos accesorios de alta gama para la persona moderna que entiende que su presencia es su mejor carta de presentación.
            </p>
            <p>
              Cada joya de nuestra colección es meticulosamente confeccionada y seleccionada con materiales de la más alta calidad, garantizando un acabado perfecto, durabilidad excepcional y una presencia deslumbrante. Bienvenido al siguiente nivel de la joyería exclusiva.
            </p>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="mt-14"
          >
            <Link to="/catalog">
              <button className="relative overflow-hidden group px-10 py-4 rounded-full bg-black border border-primary/50 text-primary uppercase tracking-widest text-xs font-bold transition-all shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                <span className="relative z-10">EXPLORAR LA COLECCIÓN</span>
                <div className="absolute inset-0 bg-primary/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Guía Oficial de Atención */}
        <motion.div variants={itemVariants} className="mt-28 mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Guía Oficial de Atención</h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-10"></div>
          
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ y: -10, scale: 1.02 }}
              className="group bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 hover:border-primary/40 rounded-3xl p-8 max-w-sm w-full text-left shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <h3 className="text-primary font-serif text-xl mb-6 flex items-center gap-3 relative z-10">
                <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Números de Contacto
              </h3>
              
              <div className="relative z-10">
                <p className="text-gray-500 uppercase tracking-widest text-[10px] font-bold mb-1 group-hover:text-primary/70 transition-colors">HACER PEDIDOS:</p>
                <p className="text-white text-2xl font-bold tracking-wider">912 167 936</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Separaciones y Métodos de Pago */}
        <motion.div variants={itemVariants} className="mt-8 relative">
          
          <div className="bg-[#0a0a0a]/70 backdrop-blur-lg border border-primary/10 hover:border-primary/30 rounded-[2.5rem] p-8 md:p-14 text-center shadow-[0_0_50px_rgba(212,175,55,0.03)] transition-all duration-500 relative overflow-hidden group">
            
            {/* Destello de fondo interactivo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#742284]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

            <h3 className="text-primary font-serif text-2xl md:text-3xl mb-4 flex items-center justify-center gap-3 relative z-10">
              <svg className="w-8 h-8 text-[#742284]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              Separaciones y Métodos de Pago
            </h3>
            <p className="text-gray-400 text-sm md:text-base font-light mb-12 relative z-10">
              La separación mínima es de S/ 20.00 mediante Yape.
            </p>
            
            {/* Tarjeta Yape - CON ANIMACIÓN FLOTANTE Y GLOW */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-black/90 border border-[#742284]/40 rounded-3xl p-6 md:p-8 inline-block mb-14 shadow-[0_0_30px_rgba(116,34,132,0.2)] relative overflow-hidden cursor-default hover:shadow-[0_0_50px_rgba(116,34,132,0.4)] hover:border-[#742284] transition-all duration-300"
            >
               <div className="absolute top-0 right-0 w-48 h-48 bg-[#742284]/20 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#742284]/10 rounded-full blur-[40px] -ml-10 -mb-10 pointer-events-none" />
               
               <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                  <div className="rounded-2xl flex items-center justify-center w-20 h-20 shadow-2xl overflow-hidden">
                     <img src="/yape-logo.svg" alt="Yape" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center sm:text-left">
                     <p className="text-white text-5xl md:text-6xl font-black tracking-widest mb-3 drop-shadow-[0_2px_10px_rgba(116,34,132,0.5)]">
                       967 362 630
                     </p>
                     <p className="text-gray-400 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">
                       A NOMBRE DE: <span className="text-primary tracking-widest ml-1 bg-primary/10 px-2 py-1 rounded">CRISTIAN ZARATE</span>
                     </p>
                  </div>
               </div>
            </motion.div>
            
            {/* Opciones para abonar */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="bg-black/60 backdrop-blur-md border border-white/10 hover:border-primary/20 rounded-2xl p-6 md:p-10 text-left max-w-2xl mx-auto transition-all relative z-10"
            >
               <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-[0.2em] text-center mb-8 border-b border-white/5 pb-4">
                 Opciones para abonar:
               </h4>
               <ul className="space-y-6 text-gray-300 text-sm md:text-base font-light">
                  <li className="flex gap-4 items-start group">
                     <span className="text-primary mt-1 transform group-hover:scale-125 transition-transform duration-300 text-xl">✦</span>
                     <p className="leading-relaxed">Separar tu joya con el monto mínimo de <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">S/ 20.00</span>.</p>
                  </li>
                  <li className="flex gap-4 items-start group">
                     <span className="text-primary mt-1 transform group-hover:scale-125 transition-transform duration-300 text-xl">✦</span>
                     <p className="leading-relaxed">Pagar tu pedido en su totalidad al instante.</p>
                  </li>
                  <li className="flex gap-4 items-start group">
                     <span className="text-primary mt-1 transform group-hover:scale-125 transition-transform duration-300 text-xl">✦</span>
                     <p className="leading-relaxed">Abonar el monto que desees, siempre que <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">no sea menor a S/ 20.00</span>.</p>
                  </li>
               </ul>
            </motion.div>
          </div>
        </motion.div>
        
      </motion.div>
    </div>
  );
};
