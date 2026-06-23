import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { showSuccess, showError } from '../../lib/toast';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('No se pudieron cargar las categorías');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      return showError('Nombre y Slug son obligatorios');
    }
    
    setIsSaving(true);
    try {
      await api.post('/categories', formData);
      showSuccess('Categoría creada exitosamente');
      setIsModalOpen(false);
      setFormData({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch (err: any) {
      showError(err.response?.data?.message || 'Error al crear la categoría');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Seguro que deseas eliminar esta categoría?')) {
      try {
        await api.delete(`/categories/${id}`);
        showSuccess('Categoría eliminada');
        fetchCategories();
      } catch (err) {
        showError('No se pudo eliminar la categoría');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif text-white mb-2">Gestión de Categorías</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Clasificación del catálogo</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-secondary px-6 py-2 rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-primary-light transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          + Añadir Categoría
        </button>
      </div>

      <div className="bg-[#161616] rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="py-4 px-6 text-gray-500 text-xs uppercase tracking-widest font-semibold">Nombre</th>
              <th className="py-4 px-6 text-gray-500 text-xs uppercase tracking-widest font-semibold">Slug</th>
              <th className="py-4 px-6 text-gray-500 text-xs uppercase tracking-widest font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={3} className="py-10 text-center"><div className="w-8 h-8 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin"></div></td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-500">No hay categorías registradas.</td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6 text-white font-semibold">{cat.name}</td>
                  <td className="py-4 px-6 text-gray-400">{cat.slug}</td>
                  <td className="py-4 px-6 text-right space-x-4">
                    <button onClick={() => handleDelete(cat.id)} className="text-red-400 hover:text-red-300 transition-colors">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Creational Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
            <h2 className="text-2xl font-serif text-white mb-6">Nueva Categoría</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Nombre *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Slug (URL amigable) *</label>
                <input 
                  type="text" 
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancelar</button>
                <button type="submit" disabled={isSaving} className="bg-primary text-secondary px-6 py-2 rounded-lg font-bold hover:bg-primary-light disabled:opacity-50">
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
