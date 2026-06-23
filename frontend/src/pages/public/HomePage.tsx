import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { WhatsAppProductButton } from '../../components/ui/WhatsAppButton';
import api from '../../lib/api';
import { useLanguageStore } from '../../stores/languageStore';

const Particles = () => {
  const [particles] = useState(() => 
    Array.from({ length: 100 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1.5,
      duration: Math.random() * 25 + 15,
      delay: Math.random() * 8
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, boxShadow: '0 0 15px rgba(212,175,55,1)' }}
          animate={{ y: ['0vh', '-100vh'], opacity: [0, 1, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

export const HomePage = () => {
  const { t } = useLanguageStore();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parallax setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth - 0.5) * 40);
      mouseY.set((e.clientY / innerHeight - 0.5) * 40);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const x = useTransform(mouseX, [-20, 20], [20, -20]);
  const y = useTransform(mouseY, [-20, 20], [20, -20]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?featured=true'),
          api.get('/categories')
        ]);
        // Si no hay productos destacados, mostrar algunos normales
        let prods = prodRes.data?.data || [];
        if (prods.length === 0) {
          const allProdRes = await api.get('/products');
          prods = allProdRes.data?.data?.slice(0, 3) || [];
        }
        setProducts(prods);
        setCategories(catRes.data?.data || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-[#050505]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-10">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80" 
            alt="Luxury Texture" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/90 to-[#050505]" />
        </div>

        <Particles />
        
        <div className="relative z-20 text-center px-4 max-w-7xl mx-auto flex flex-col items-center justify-center w-full mt-4">
          
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col items-center relative z-30"
          >
            <h2 className="text-primary tracking-[0.5em] uppercase text-[10px] md:text-xs mb-4 font-light flex items-center gap-4 opacity-80">
              <span className="w-16 h-[1px] bg-primary/50 hidden md:block"></span>
              {t('hero.forged_in_darkness')}
              <span className="w-16 h-[1px] bg-primary/50 hidden md:block"></span>
            </h2>
            <h1 className="text-5xl md:text-[5.5rem] font-serif text-white mb-4 leading-[1] uppercase tracking-wide drop-shadow-2xl">
              {t('hero.dominate')} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA8C2C] drop-shadow-[0_0_5px_rgba(212,175,55,0.2)]">
                {t('hero.presence')}
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-lg mb-6 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
              {t('hero.desc')}
            </p>

            <motion.div 
              style={{ x, y }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="relative w-[200px] md:w-[300px] lg:w-[350px] h-auto mb-8 flex justify-center group cursor-default"
            >
              <div className="absolute inset-0 bg-primary/30 blur-[80px] rounded-full mix-blend-screen pointer-events-none scale-125 animate-pulse-slow"></div>
              
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full h-full flex justify-center"
              >
                <img 
                  src="/logo-v3.png" 
                  alt="Alfa Dark Logo" 
                  className="w-full h-auto object-contain relative z-10 drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                />
              </motion.div>
            </motion.div>

            {/* Categorías en forma de botones "Pills" arribita de los productos */}
            <div className="flex flex-wrap justify-center gap-3 w-full max-w-4xl mx-auto mb-10">
              {categories.map((cat) => (
                <Link key={cat.id} to={`/catalog?category=${cat.slug}`}>
                  <button className="border border-white/20 text-white hover:border-primary hover:text-primary bg-black/50 px-6 py-2 rounded-full transition-all duration-300 font-light tracking-widest uppercase text-[10px] shadow-sm backdrop-blur-sm">
                    {cat.name}
                  </button>
                </Link>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-xl">
              <Link to="/catalog" className="w-full">
                <button className="btn-primary w-full">{t('hero.view_collection')}</button>
              </Link>
              <a href="https://wa.me/51912167936?text=Hola,%20busco%20asesoría%20VIP%20para%20una%20pieza%20de%20alta%20gama." target="_blank" rel="noopener noreferrer" className="w-full">
                <button className="btn-outline w-full">{t('nav.vip_advisory')}</button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Productos Reales o Estado Vacío */}
      <section className="py-32 container mx-auto px-6 relative z-20 border-t border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-primary/30 to-transparent" />
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">{t('home.exclusive_pieces')}</h2>
          <p className="text-gray-500 tracking-widest uppercase text-sm">{t('home.whatsapp_sales')}</p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-sm bg-black/40 backdrop-blur-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif text-white mb-4">{t('home.empty_title')}</h3>
            <p className="text-gray-500 font-light tracking-wider">{t('home.empty_desc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className="group relative bg-[#0a0a0a] border border-white/5 hover:border-primary/30 rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]"
              >
                <div className="aspect-square overflow-hidden rounded-xl mb-6 relative bg-black/40 border border-white/5">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-50 transition-opacity duration-500 z-10" />
                  <img 
                    src={product.images?.[0]?.imageUrl || product.images?.[0] || '/logo-v3.png'} 
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                    <WhatsAppProductButton 
                      productName={product.name} 
                      className="bg-primary text-secondary px-8 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:bg-[#F3E5AB] transition-colors"
                    />
                  </div>
                </div>
                <div className="text-center px-2 pb-2">
                  <h3 className="text-xl text-white font-serif mb-2 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
                  <p className="text-gray-400 font-light tracking-widest text-sm mb-1 uppercase">Edición Limitada</p>
                  <p className="text-primary font-medium tracking-wider text-lg">S/ {Number(product.price).toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* About Us Section */}
        <div className="mt-32 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-serif text-white mb-6 uppercase tracking-widest">Sobre Nosotros</h2>
          <div className="w-16 h-0.5 bg-primary mx-auto mb-8"></div>
          <p className="text-gray-400 font-light text-lg leading-relaxed mb-6">
            ALFA DARK nació de la obsesión por crear piezas que no solo se vean bien, sino que proyecten poder, misterio y exclusividad. No hacemos joyería convencional; forjamos amuletos de alta gama para el hombre moderno que entiende que su presencia es su mejor carta de presentación.
          </p>
          <p className="text-gray-400 font-light text-lg leading-relaxed">
            Cada joya de nuestra bóveda es meticulosamente diseñada y elaborada con metales preciosos (Plata 925, Oro 18K) para garantizar durabilidad y un acabado impecable. Bienvenidos al siguiente nivel de elegancia masculina.
          </p>
        </div>

        <div className="text-center mt-20">
          <Link to="/catalog">
            <button className="text-gray-400 hover:text-primary transition-colors uppercase tracking-[0.2em] text-xs font-light pb-2 border-b border-white/20 hover:border-primary">
              {t('home.explore_all')}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};
