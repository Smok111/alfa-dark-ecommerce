import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import { useLanguageStore } from '../../stores/languageStore';
import { WhatsAppProductButton } from '../../components/ui/WhatsAppButton';

const ProductSkeleton = () => (
  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 animate-pulse flex flex-col h-full">
    <div className="aspect-square bg-white/5 rounded-xl mb-4 w-full"></div>
    <div className="h-6 bg-white/5 rounded w-3/4 mx-auto mb-3"></div>
    <div className="h-4 bg-white/5 rounded w-1/2 mx-auto mb-4"></div>
    <div className="h-5 bg-white/5 rounded w-1/3 mx-auto mt-auto"></div>
  </div>
);

export const CatalogPage = () => {
  const { t } = useLanguageStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const urlCategory = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState(urlCategory || 'all');
  
  const [searchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([{ id: 'all', name: 'Todos', slug: 'all', count: 0 }]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const currentCat = searchParams.get('category') || 'all';
    if (currentCat !== activeCategory) {
      setActiveCategory(currentCat);
      setPage(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        const fetchedCats = res.data.data || [];
        
        let totalProducts = 0;
        fetchedCats.forEach((c: any) => {
          totalProducts += c._count?.products || 0;
        });

        const cats = [{ id: 'all', name: 'Todos', slug: 'all', count: totalProducts }];
        fetchedCats.forEach((c: any) => {
          cats.push({
            id: c.id,
            name: c.name,
            slug: c.slug,
            count: c._count?.products || 0
          });
        });
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoaded(true);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categoriesLoaded) return;

    const fetchProducts = async () => {
      try {
        if (page === 1) setIsLoading(true);
        else setIsLoadingMore(true);
        
        let categoryId = undefined;
        if (activeCategory !== 'all') {
          const cat = categories.find(c => c.slug === activeCategory);
          if (cat) categoryId = cat.id;
        }

        const res = await api.get('/products', {
          params: {
            page,
            limit: 12,
            categoryId,
            search: searchTerm
          }
        });

        const newProducts = res.data.data?.data || [];
        const meta = res.data.data?.meta;

        if (page === 1) {
          setProducts(newProducts);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
        }
        
        if (meta) {
          setHasMore(meta.page < meta.totalPages);
        } else {
          setHasMore(false);
        }

      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };
    
    fetchProducts();
  }, [activeCategory, page, searchTerm, categoriesLoaded]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    setPage(1);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-20 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <h2 className="text-primary tracking-[0.3em] uppercase text-[10px] font-semibold">{t('catalog.exclusive_collection')}</h2>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 tracking-wide drop-shadow-xl">{t('catalog.our_jewelry')}</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            {t('catalog.desc')}
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl mx-auto mb-16">
          {!categoriesLoaded ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-32 bg-white/5 rounded-full animate-pulse border border-white/5" />
            ))
          ) : (
            categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-6 py-2.5 rounded-full transition-all duration-300 font-light tracking-widest uppercase text-[10px] sm:text-xs shadow-sm backdrop-blur-md border ${
                  activeCategory === cat.slug 
                    ? 'bg-gradient-to-r from-primary to-[#F3E5AB] text-black border-primary shadow-[0_0_20px_rgba(212,175,55,0.3)] font-medium scale-105' 
                    : 'border-white/10 text-gray-300 hover:border-primary/50 hover:text-primary bg-white/5 hover:bg-white/10'
                }`}
              >
                {cat.slug === 'all' ? t('catalog.all') : cat.name} <span className={`opacity-60 ml-1.5 text-[9px] ${activeCategory === cat.slug ? 'text-black' : 'text-gray-500'}`}>({cat.count})</span>
              </button>
            ))
          )}
        </div>

        {/* Catalog Content */}
        <div className="w-full">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {products.map((product, i) => (
                    <motion.div
                      layout
                      key={`${product.id}-${i}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: (i % 12) * 0.05 }}
                      whileHover={{ y: -10 }}
                      className="group relative bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/5 hover:border-primary/40 rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="aspect-square overflow-hidden rounded-xl mb-5 relative bg-black/40 border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10" />
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].imageUrl}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                        
                        {product.category && (
                          <div className="absolute top-3 left-3 z-20">
                            <span className="bg-black/50 backdrop-blur-md text-primary text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/20 shadow-sm">
                              {product.category.name}
                            </span>
                          </div>
                        )}

                        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-20 opacity-0 group-hover:opacity-100 transition-all translate-y-6 group-hover:translate-y-0 duration-500">
                          {product.stock > 0 ? (
                            <WhatsAppProductButton 
                              productName={product.name}
                              price={Number(product.price)}
                              imageUrl={product.images?.[0]?.imageUrl || product.images?.[0]}
                              className="bg-primary text-secondary px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_5px_20px_rgba(212,175,55,0.4)] flex items-center gap-2 hover:bg-[#F3E5AB] hover:scale-105 transition-all"
                            />
                          ) : (
                            <div className="bg-red-900/80 text-red-200 px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 cursor-not-allowed border border-red-500/30">
                              Agotado
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-center px-2 pb-2 mt-auto">
                        <p className="text-gray-500 font-light tracking-[0.2em] text-[10px] mb-2 uppercase">Alfa Dark</p>
                        <h3 className="text-lg text-white/90 font-serif mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        <div className="mb-2">
                          {product.stock !== undefined && product.stock <= 0 ? (
                            <span className="bg-red-900/50 text-red-400 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-red-500/20">Agotado</span>
                          ) : (
                            <span className="bg-green-900/50 text-green-400 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-green-500/20">Disponible</span>
                          )}
                        </div>
                        {product.material && <p className="text-gray-400 font-light tracking-widest text-[10px] mb-2 uppercase">{product.material}</p>}
                        <p className="text-primary font-medium tracking-widest text-lg">
                          S/ {Number(product.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="mt-16 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="group relative px-8 py-3 rounded-full bg-transparent border border-primary/30 text-primary uppercase tracking-widest text-xs font-medium hover:border-primary hover:bg-primary/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center gap-2">
                      {isLoadingMore ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          Cargando...
                        </>
                      ) : (
                        'Cargar Más Joyas'
                      )}
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center py-24 glass-panel rounded-3xl border border-white/5 bg-white/[0.02]"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-3xl font-serif text-white mb-4">{t('catalog.prep_title')}</h3>
              <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md mx-auto">
                {t('catalog.prep_desc')}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
