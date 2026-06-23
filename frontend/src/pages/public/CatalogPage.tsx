import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import { useLanguageStore } from '../../stores/languageStore';
import { WhatsAppProductButton } from '../../components/ui/WhatsAppButton';

export const CatalogPage = () => {
  const { t } = useLanguageStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize active category from URL or default to 'all'
  const urlCategory = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'all');
  
  const [searchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([{ id: 'all', name: 'Todos', slug: 'all', count: 0 }]);

  // Sync activeCategory with URL changes if user uses back/forward browser buttons
  useEffect(() => {
    const currentCat = searchParams.get('category') || 'all';
    if (currentCat !== activeCategory) {
      setActiveCategory(currentCat);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        const fetchedProducts = productsRes.data.data || [];
        setProducts(fetchedProducts);
        
        // Build category counts
        const cats = [{ id: 'all', name: 'Todos', slug: 'all', count: fetchedProducts.length }];
        const fetchedCats = categoriesRes.data.data || [];
        fetchedCats.forEach((c: any) => {
          cats.push({
            id: c.id,
            name: c.name,
            slug: c.slug,
            count: fetchedProducts.filter((p: any) => p.categoryId === c.id).length
          });
        });
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category?.slug === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header with Official Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 flex flex-col items-center"
        >
          <h2 className="text-primary tracking-[0.3em] uppercase text-xs mb-4 font-semibold">{t('catalog.exclusive_collection')}</h2>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">{t('catalog.our_jewelry')}</h1>
          <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg font-light leading-relaxed">
            {t('catalog.desc')}
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 w-full max-w-5xl mx-auto mb-16">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-6 py-2 rounded-full transition-all duration-300 font-light tracking-widest uppercase text-[10px] shadow-sm backdrop-blur-sm border ${
                activeCategory === cat.slug 
                  ? 'bg-primary text-black border-primary' 
                  : 'border-white/20 text-white hover:border-primary hover:text-primary bg-black/50'
              }`}
            >
              {cat.slug === 'all' ? t('catalog.all') : cat.name} <span className="opacity-50 ml-1">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Catalog Content */}
        <div className="w-full mt-10">
          {isLoading ? (
            <div className="max-w-3xl mx-auto text-center py-20 glass-panel rounded-2xl flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-primary tracking-widest uppercase text-sm">{t('catalog.loading')}</p>
            </div>
          ) : filtered.length > 0 ? (
            /* Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group relative bg-[#0a0a0a] border border-white/5 hover:border-primary/30 rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)] flex flex-col"
                >
                  {/* Image */}
                  <div className="aspect-square overflow-hidden rounded-xl mb-4 relative bg-black/40 border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-50 transition-opacity duration-500 z-10" />
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                    
                    {product.category && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="bg-black/60 backdrop-blur-sm text-primary text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-primary/20 shadow-sm">
                          {product.category.name}
                        </span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300">
                      <WhatsAppProductButton 
                        productName={product.name}
                        price={Number(product.price)}
                        className="bg-primary text-secondary px-6 py-2.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 hover:bg-[#F3E5AB] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="text-center px-2 pb-2 mt-auto">
                    <h3 className="text-xl text-white font-serif mb-2 group-hover:text-primary transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 font-light tracking-widest text-sm mb-1 uppercase">Colección Exclusiva</p>
                    <p className="text-primary font-medium tracking-wider text-lg">
                      S/ {Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center py-20 glass-panel rounded-2xl"
            >
              <svg className="w-16 h-16 text-primary/50 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-2xl font-serif text-white mb-2">{t('catalog.prep_title')}</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {t('catalog.prep_desc')}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
