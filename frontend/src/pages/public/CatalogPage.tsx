import { useState, useEffect, memo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useLanguageStore } from '../../stores/languageStore';
import { WhatsAppProductButton } from '../../components/ui/WhatsAppButton';

// ─── Optimized Image with lazy load + blur placeholder ───
const OptimizedImage = memo(({ src, alt }: { src: string; alt: string }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className="w-full h-full relative">
      {/* Blur placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] transition-opacity duration-500 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            isLoaded ? 'opacity-90 group-hover:opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
});
OptimizedImage.displayName = 'OptimizedImage';

// ─── Skeleton loader ───
const ProductSkeleton = () => (
  <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 animate-pulse flex flex-col h-full">
    <div className="aspect-square bg-white/5 rounded-xl mb-4 w-full"></div>
    <div className="h-6 bg-white/5 rounded w-3/4 mx-auto mb-3"></div>
    <div className="h-4 bg-white/5 rounded w-1/2 mx-auto mb-4"></div>
    <div className="h-5 bg-white/5 rounded w-1/3 mx-auto mt-auto"></div>
  </div>
);

// ─── Memoized Product Card ───
const ProductCard = memo(({ product, index }: { product: any; index: number }) => {
  const imageUrl = product.images?.[0]?.imageUrl;

  return (
    <motion.div
      key={product.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -10 }}
      className="group relative bg-[#0a0a0a]/80 backdrop-blur-sm border border-white/5 hover:border-primary/40 rounded-2xl p-4 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] flex flex-col h-full"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-xl mb-5 relative bg-black/40 border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-10" />
        {imageUrl ? (
          <OptimizedImage src={imageUrl} alt={product.name} />
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
          <WhatsAppProductButton 
            productName={product.name}
            price={Number(product.price)}
            className="bg-primary text-secondary px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_5px_20px_rgba(212,175,55,0.4)] flex items-center gap-2 hover:bg-[#F3E5AB] hover:scale-105 transition-all"
          />
        </div>
      </div>

      {/* Info */}
      <div className="text-center px-2 pb-2 mt-auto">
        <p className="text-gray-500 font-light tracking-[0.2em] text-[10px] mb-2 uppercase">Alfa Dark</p>
        <h3 className="text-lg text-white/90 font-serif mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
          {product.name}
        </h3>
        {product.material && <p className="text-gray-400 font-light tracking-widest text-[10px] mb-2 uppercase">{product.material}</p>}
        <p className="text-primary font-medium tracking-widest text-lg">
          S/ {Number(product.price).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = 'ProductCard';

// ─── Fetch function for React Query ───
const fetchCatalog = async ({ category, page, search }: { category: string; page: number; search: string }) => {
  const params: Record<string, any> = { page, limit: 12 };
  if (category !== 'all') params.category = category;
  if (search) params.search = search;
  
  const res = await api.get('/products/catalog', { params });
  return res.data.data; // TransformInterceptor wraps in { data: ... }
};

// ─── Main Catalog Page ───
export const CatalogPage = () => {
  const { t } = useLanguageStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  const activeCategory = searchParams.get('category') || 'all';
  const [page, setPage] = useState(1);
  const [searchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Reset page when category changes
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [activeCategory]);

  // React Query — cached, deduped, auto-stale
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['catalog', activeCategory, page, searchTerm],
    queryFn: () => fetchCatalog({ category: activeCategory, page, search: searchTerm }),
    placeholderData: (previousData) => previousData, // Keep showing old data while fetching
  });

  // Update accumulated products when data arrives
  useEffect(() => {
    if (!data) return;

    // Update categories from first page response
    if (data.categories) {
      const totalProducts = data.categories.reduce((sum: number, c: any) => sum + (c._count?.products || 0), 0);
      const cats = [
        { id: 'all', name: 'Todos', slug: 'all', count: totalProducts },
        ...data.categories.map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          count: c._count?.products || 0,
        })),
      ];
      setCategories(cats);
    }

    // Accumulate products for "load more" pagination
    if (page === 1) {
      setAllProducts(data.products || []);
    } else {
      setAllProducts(prev => {
        const existingIds = new Set(prev.map((p: any) => p.id));
        const newProducts = (data.products || []).filter((p: any) => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
    }
  }, [data, page]);

  const hasMore = data?.meta ? data.meta.page < data.meta.totalPages : false;
  const isLoadingMore = page > 1 && isFetching;

  // Prefetch next page for instant pagination
  useEffect(() => {
    if (hasMore && data?.meta) {
      queryClient.prefetchQuery({
        queryKey: ['catalog', activeCategory, page + 1, searchTerm],
        queryFn: () => fetchCatalog({ category: activeCategory, page: page + 1, search: searchTerm }),
      });
    }
  }, [data, hasMore, activeCategory, page, searchTerm, queryClient]);

  const handleCategoryClick = useCallback((slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoadingMore, hasMore]);

  const showInitialLoading = isLoading && page === 1;

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
          {categories.length === 0 ? (
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
          {showInitialLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : allProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {allProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i % 12} />
                ))}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
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
