import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CatalogTestPage = () => {
  // Datos de prueba para el boceto
  const mockProducts = [
    {
      id: '1',
      name: 'ANILLO STONE MASON\'S (Carburo de Tungsteno y oro 18k)',
      price: 167.00,
      discount: '10% de descuento',
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b254a4?auto=format&fit=crop&q=80' }]
    },
    {
      id: '2',
      name: 'ANILLO KALEN (CARBURO DE TUNGSTENO Y ORO 18K)',
      price: 120.00,
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1599643478524-fb66f7cae6d0?auto=format&fit=crop&q=80' }]
    },
    {
      id: '3',
      name: 'ANILLO SEÑOR DE LOS ANILLOS (CARBURO DE TUNGSTENO Y BAÑADO EN ORO DE 18 K)',
      price: 120.00,
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80' }]
    },
    {
      id: '4',
      name: 'ANILLO POSEIDÓN (CARBURO DE TUNGSTENO Y ORO 18K)',
      price: 117.00,
      images: [{ imageUrl: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80' }]
    }
  ];

  return (
    <div className="bg-black min-h-screen pt-32 pb-32 text-white font-sans selection:bg-white selection:text-black">
      
      {/* Cabecera del Boceto */}
      <div className="max-w-7xl mx-auto px-6 text-center mb-20 border-b border-white/10 pb-8">
        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="uppercase tracking-[0.2em] text-gray-400 text-[10px] mb-4"
        >
          Boceto Estilo "Valyrio"
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl font-serif tracking-wider font-light"
        >
          Colección Minimalista
        </motion.h1>
      </div>

      {/* Grid de Productos Estilo Valyrio */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {mockProducts.map((product) => (
            <div key={product.id} className="group flex flex-col h-full">
              
              {/* Contenedor de Imagen (Sin bordes ni fondos grises) */}
              <div className="aspect-square relative overflow-hidden mb-6 flex items-center justify-center">
                {product.discount && (
                  <div className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-black text-white text-[10px] font-bold px-3 py-1.5 flex items-center gap-2">
                    {product.discount} <span className="text-gray-400 text-[8px]">X</span>
                  </div>
                )}
                {/* 
                  En tu tienda real, si las imágenes tienen fondo negro, se fusionarán perfecto.
                  Aquí usamos mix-blend-lighten (o simplemente fondo negro) para simular el efecto.
                */}
                <img 
                  src={product.images[0].imageUrl} 
                  alt={product.name} 
                  className="w-[85%] h-[85%] object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                />
              </div>

              {/* Información y Botón */}
              <div className="text-left flex flex-col flex-grow">
                <h3 className="text-[10px] md:text-xs font-bold uppercase mb-2 leading-snug line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm mb-6 mt-auto">
                  S/. {product.price.toFixed(2)} PEN
                </p>
                
                {/* Botón de ancho completo */}
                <button className="w-full border border-[#333] group-hover:border-white text-white py-4 text-[10px] md:text-xs uppercase font-semibold tracking-wider hover:bg-white hover:text-black transition-all duration-300">
                  Comprar por WhatsApp
                </button>
              </div>
              
            </div>
          ))}
        </div>
        
        {/* Paginación similar a la referencia */}
        <div className="flex justify-center items-center gap-6 mt-20 text-gray-500 text-xs">
          <button className="hover:text-white transition-colors">&lt;</button>
          <span className="text-white">1 / 5</span>
          <button className="hover:text-white transition-colors">&gt;</button>
        </div>

      </section>
      
    </div>
  );
};
