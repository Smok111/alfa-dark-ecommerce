import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { showSuccess, showError } from '../../lib/toast';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    material: '',
    weight: '',
    featured: false
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data?.data || []);
      setCategories(catRes.data?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId || !formData.stock) {
      return showError('Por favor, completa los campos obligatorios');
    }

    setIsSaving(true);
    try {
      let uploadedImageUrl = null;

      // 1. Subir imagen si existe
      if (file) {
        const formDataImage = new FormData();
        formDataImage.append('file', file);
        formDataImage.append('bucket', 'products');

        try {
          const uploadRes = await api.post('/storage/upload', formDataImage);
          // TransformInterceptor wraps response as: { success, data: { url, path }, message }
          // Axios adds its own .data wrapper, so: uploadRes.data = { success, data: { url, path }, ... }
          const resData = uploadRes.data;
          uploadedImageUrl = resData?.data?.url || resData?.data?.publicUrl || resData?.url || resData?.publicUrl || null;
          
          if (!uploadedImageUrl || typeof uploadedImageUrl !== 'string') {
            console.error('Upload response:', resData);
            throw new Error('No se pudo obtener la URL de la imagen subida');
          }
        } catch (err: any) {
          throw new Error(err.message || 'Error al subir la imagen. ¿Creaste el bucket "products" en Supabase?');
        }
      }

      // 2. Crear o Editar producto
      const payload: Record<string, any> = {
        name: formData.name,
        price: Number(formData.price),
        stock: Number(formData.stock),
        categoryId: formData.categoryId,
        featured: formData.featured
      };
      
      if (uploadedImageUrl) {
        payload.images = [uploadedImageUrl];
      }

      // Solo agregar campos opcionales si tienen valor
      if (formData.description) payload.description = formData.description;
      if (formData.material) payload.material = formData.material;
      if (formData.weight) payload.weight = Number(formData.weight);

      if (editingId) {
        await api.patch(`/products/${editingId}`, payload);
        showSuccess('Joya actualizada exitosamente');
      } else {
        await api.post('/products', payload);
        showSuccess('Joya creada exitosamente');
      }

      setIsModalOpen(false);
      setFile(null);
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', material: '', weight: '', featured: false });
      fetchData();
    } catch (err: any) {
      showError(err.message || err.response?.data?.message || 'Error al crear la joya');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      material: product.material || '',
      weight: product.weight || '',
      featured: product.featured
    });
    setFile(null);
    setIsModalOpen(true);
  };

  const executeDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      showSuccess('Joya eliminada');
      fetchData();
    } catch (error: any) {
      console.error('Delete error:', error);
      showError(error.response?.data?.message || 'Error al eliminar producto. Puede que esté en algún pedido.');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', stock: '', categoryId: '', material: '', weight: '', featured: false });
    setFile(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Gestión de Joyas</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Catálogo de productos</p>
        </div>
        <button 
          onClick={openNewModal}
          className="bg-primary text-secondary px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-primary-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          + Añadir Joya
        </button>
      </div>

      <div className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="py-4 px-6 text-gray-500 text-xs uppercase tracking-widest font-semibold">Producto</th>
                <th className="py-4 px-6 text-gray-500 text-xs uppercase tracking-widest font-semibold">Precio</th>
                <th className="py-4 px-6 text-gray-500 text-xs uppercase tracking-widest font-semibold">Stock</th>
                <th className="py-4 px-6 text-gray-500 text-xs uppercase tracking-widest font-semibold">Destacado</th>
                <th className="py-4 px-6 text-gray-500 text-xs uppercase tracking-widest font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center"><div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div></td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-500">No hay productos registrados. Haz clic en "Añadir Joya" para empezar.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded bg-black/50 overflow-hidden border border-white/5 flex-shrink-0">
                        {product.images?.[0] ? (
                          <img src={product.images[0].imageUrl || product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">Img</div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold line-clamp-1">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category?.name || 'Sin categoría'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-primary font-bold">S/ {Number(product.price).toLocaleString()}</td>
                    <td className="py-4 px-6 text-gray-300">{product.stock} u.</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase tracking-wider ${product.featured ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-gray-800 text-gray-400'}`}>
                        {product.featured ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-4">
                      <button onClick={() => handleEdit(product)} className="text-blue-400 hover:text-blue-300 transition-colors">Editar</button>
                      {confirmDeleteId === product.id ? (
                        <div className="inline-flex items-center gap-3">
                          <button onClick={() => executeDelete(product.id)} className="text-red-500 font-bold hover:text-red-400 transition-colors">Sí, eliminar</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="text-gray-400 hover:text-gray-300 transition-colors">Cancelar</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDeleteId(product.id)} className="text-red-400 hover:text-red-300 transition-colors">Eliminar</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111] p-8 rounded-2xl w-full max-w-2xl border border-white/10 shadow-2xl my-8">
            <h2 className="text-2xl font-serif text-white mb-6">{editingId ? 'Editar Joya' : 'Añadir Nueva Joya'}</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Nombre de la Joya *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Categoría *</label>
                  <select required value={formData.categoryId} onChange={(e) => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary">
                    <option value="">Selecciona una categoría</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Precio (S/) *</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Stock Inicial *</label>
                  <input type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Material</label>
                  <input type="text" placeholder="Ej: Oro 18K" value={formData.material} onChange={(e) => setFormData({...formData, material: e.target.value})} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary" />
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Imagen de la Joya</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                  <p className="text-xs text-gray-500 mt-2">Sube una imagen cuadrada de alta calidad.</p>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="form-checkbox h-5 w-5 text-primary rounded border-gray-600 bg-gray-700 focus:ring-primary" />
                    <span className="text-white">Marcar como Destacado (aparecerá en la portada)</span>
                  </label>
                </div>

              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="px-6 py-2 text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button type="submit" disabled={isSaving} className="bg-primary text-secondary px-8 py-2 rounded-lg font-bold hover:bg-primary-light transition-colors disabled:opacity-50">
                  {isSaving ? 'Guardando...' : (editingId ? 'Actualizar Joya' : 'Crear Joya')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
