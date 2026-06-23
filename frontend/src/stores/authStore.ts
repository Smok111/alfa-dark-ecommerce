import { create } from 'zustand';
import api from '../lib/api';

interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
}

const safeJSONParse = (str: string | null) => {
  if (!str) return null;
  try {
    return JSON.parse(str);
  } catch (e) {
    // Silently handle corrupted storage and clear it
    localStorage.removeItem('alfa_dark_user');
    localStorage.removeItem('alfa_dark_token');
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: safeJSONParse(localStorage.getItem('alfa_dark_user')),
  token: localStorage.getItem('alfa_dark_token'),
  isAuthenticated: !!localStorage.getItem('alfa_dark_token'),
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, tokens } = response.data.data;
      const accessToken = tokens?.accessToken;
      
      localStorage.setItem('alfa_dark_token', accessToken);
      localStorage.setItem('alfa_dark_user', JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al iniciar sesión';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  register: async (registerData: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/register', registerData);
      const { user, tokens } = response.data.data;
      const accessToken = tokens?.accessToken;

      localStorage.setItem('alfa_dark_token', accessToken);
      localStorage.setItem('alfa_dark_user', JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al crear la cuenta';
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  logout: () => {
    localStorage.removeItem('alfa_dark_token');
    localStorage.removeItem('alfa_dark_user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
