const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

// 1. Tailwind Config
fs.writeFileSync(path.join(__dirname, 'tailwind.config.js'), `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4AF37', // Gold
          light: '#F3E5AB',
          dark: '#AA8C2C',
        },
        secondary: {
          DEFAULT: '#050505', // Deep Black
          light: '#111111',
        },
        surface: {
          DEFAULT: '#0A0A0A',
          dark: '#030303',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.8s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
`);

// 2. Index CSS
fs.writeFileSync(path.join(baseDir, 'index.css'), `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: 'Inter', sans-serif;
    scroll-behavior: smooth;
    background-color: #050505;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Playfair Display', serif;
  }

  body {
    @apply bg-secondary text-gray-200 font-sans antialiased;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary hover:bg-primary-dark text-secondary px-6 py-3 rounded-md transition-all duration-300 font-semibold tracking-wider uppercase text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)];
  }
  
  .btn-whatsapp {
    @apply bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-md transition-all duration-300 font-semibold tracking-wider uppercase text-sm shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:shadow-[0_0_25px_rgba(37,211,102,0.5)] flex items-center justify-center gap-2;
  }

  .btn-outline {
    @apply border border-primary text-primary hover:bg-primary hover:text-secondary px-6 py-3 rounded-md transition-all duration-300 font-semibold tracking-wider uppercase text-sm;
  }

  .glass-panel {
    @apply bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl;
  }
}
`);

// 3. WhatsApp Components
const whatsappContent = `
import React from 'react';
import { motion } from 'framer-motion';

export const WhatsAppFloating = () => {
  const whatsappUrl = "https://wa.me/51912167936?text=Hola,%20me%20gustar%C3%ADa%20recibir%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20joyas.";
  
  return (
    <motion.a 
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-shadow duration-300 flex items-center justify-center"
      aria-label="Contactar por WhatsApp"
    >
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    </motion.a>
  );
};

export const WhatsAppProductButton = ({ productName, price }: { productName: string, price: number }) => {
  const text = encodeURIComponent(\`Hola, me interesa comprar el producto "\${productName}" por $\${price}. ¿Me pueden dar más detalles?\`);
  const whatsappUrl = \`https://wa.me/51912167936?text=\${text}\`;
  
  return (
    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
      <button className="btn-whatsapp w-full">
        Comprar por WhatsApp
      </button>
    </a>
  );
};
`;
fs.writeFileSync(path.join(baseDir, 'components/ui/WhatsAppButton.tsx'), whatsappContent);

// 4. Main Layout
const layoutContent = `
import { Outlet, Link } from 'react-router-dom';
import { WhatsAppFloating } from '../components/ui/WhatsAppButton';
import { useState, useEffect } from 'react';

export const MainLayout = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-secondary text-gray-200">
      <header className={\`fixed w-full top-0 z-50 transition-all duration-500 \${scrolled ? 'glass-panel py-3' : 'bg-transparent py-6'}\`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="Alfa Dark Joyería" 
              className="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-110" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <span className="text-2xl font-serif text-primary tracking-widest uppercase">Alfa Dark</span>
          </Link>
          <nav className="hidden md:flex space-x-8 text-xs uppercase tracking-[0.2em] font-semibold">
            <Link to="/catalog" className="hover:text-primary transition-colors py-2">Colecciones</Link>
            <Link to="/nosotros" className="hover:text-primary transition-colors py-2">La Marca</Link>
            <Link to="/login" className="hover:text-primary transition-colors py-2">Mi Cuenta</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <WhatsAppFloating />

      <footer className="border-t border-white/5 bg-[#030303] py-16 mt-20">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h3 className="font-serif text-2xl text-primary mb-6">ALFA DARK</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Exclusividad, elegancia y oscuridad. Joyería fina diseñada para deslumbrar y perdurar en el tiempo.</p>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-6">Enlaces</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><Link to="/catalog" className="hover:text-primary transition-colors">Catálogo</Link></li>
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white uppercase tracking-widest text-sm font-semibold mb-6">Ventas Exclusivas</h4>
            <p className="text-gray-500 text-sm mb-4">Atención personalizada vía WhatsApp para clientes VIP.</p>
            <p className="text-primary font-serif text-xl">+51 912 167 936</p>
          </div>
        </div>
        <div className="container mx-auto px-6 text-center mt-16 pt-8 border-t border-white/5 text-gray-600 text-xs tracking-widest">
          <p>© 2026 ALFA DARK JOYERÍA. TODOS LOS DERECHOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  );
};
`;
fs.writeFileSync(path.join(baseDir, 'layouts/MainLayout.tsx'), layoutContent);

// 5. Home Page
const homeContent = `
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { WhatsAppProductButton } from '../../components/ui/WhatsAppButton';

export const HomePage = () => {
  const featuredProducts = [
    { id: 1, name: 'Anillo Diamante Élite', price: 2500, img: 'https://images.unsplash.com/photo-1605100804763-247f6612148e?auto=format&fit=crop&q=80' },
    { id: 2, name: 'Collar Obsidiana Real', price: 3200, img: 'https://images.unsplash.com/photo-1599643478514-4a4e08d1323f?auto=format&fit=crop&q=80' },
    { id: 3, name: 'Pulsera Oro Negro', price: 1800, img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="bg-secondary">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80" 
            alt="Luxury Jewelry" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/80 to-secondary" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-primary tracking-[0.3em] uppercase text-sm md:text-md mb-6 font-semibold">Nueva Colección 2026</h2>
            <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-tight">
              Elegancia <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA8C2C]">
                Atemporal
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Descubre nuestra exclusiva selección de joyería fina en tonos oscuros y dorados. Diseñada para deslumbrar.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/catalog">
                <button className="btn-primary w-full sm:w-auto">Ver Catálogo</button>
              </Link>
              <a href="https://wa.me/51912167936?text=Hola,%20quisiera%20asesor%C3%ADa%20VIP%20para%20comprar%20una%20joya." target="_blank" rel="noopener noreferrer">
                <button className="btn-outline w-full sm:w-auto">Asesoría VIP</button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 container mx-auto px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent via-primary/50 to-transparent" />
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Piezas Exclusivas</h2>
          <p className="text-gray-500 tracking-widest uppercase text-sm">Venta Directa por WhatsApp</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredProducts.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="group glass-panel rounded-lg overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                <img 
                  src={product.img} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <div className="p-8 flex flex-col flex-grow text-center relative z-10 bg-gradient-to-b from-black/60 to-black">
                <h3 className="text-xl font-serif text-white mb-2">{product.name}</h3>
                <p className="text-primary font-semibold text-lg mb-8">$\${product.price.toLocaleString()}</p>
                <div className="mt-auto">
                  <WhatsAppProductButton productName={product.name} price={product.price} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-20">
          <Link to="/catalog" className="inline-block border-b border-primary text-primary hover:text-white hover:border-white transition-colors duration-300 pb-1 tracking-widest uppercase text-sm font-semibold">
            Explorar todas las piezas
          </Link>
        </div>
      </section>
    </div>
  );
};
`;
fs.writeFileSync(path.join(baseDir, 'pages/public/HomePage.tsx'), homeContent);

console.log('Frontend Redesign applied successfully!');
