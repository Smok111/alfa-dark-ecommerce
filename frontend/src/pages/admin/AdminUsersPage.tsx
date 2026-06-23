import { useState, useEffect } from 'react';
import api from '../../lib/api';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      setUsers(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-white mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-500 text-sm">Administra los usuarios registrados en la tienda</p>
      </div>

      <div className="bg-[#161616] p-6 rounded-2xl border border-white/5">
        {isLoading ? (
          <div className="flex justify-center p-10"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No hay usuarios registrados.</div>
        ) : (
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-500 uppercase bg-white/5">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Rol</th>
                <th className="px-6 py-3">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4 font-medium text-white">{user.name} {user.lastname}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'ADMIN' ? 'bg-primary/20 text-primary' : 'bg-gray-500/20 text-gray-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
