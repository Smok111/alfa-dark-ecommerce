const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src');

const dirs = [
  'api', 'components/ui', 'components/common', 'components/forms', 'components/admin',
  'hooks', 'layouts', 'pages/public', 'pages/private', 'pages/admin',
  'routes', 'services', 'store', 'types', 'utils'
];

dirs.forEach(d => {
  const full = path.join(baseDir, d);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

// 1. API Client
fs.writeFileSync(path.join(baseDir, 'api/client.ts'), `
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

export default api;
`);

// 2. Types
fs.writeFileSync(path.join(baseDir, 'types/index.ts'), `
export interface User {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: 'ADMIN' | 'CLIENT';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  images: { imageUrl: string }[];
  category: { id: string, name: string };
}
`);

// 3. Store
fs.writeFileSync(path.join(baseDir, 'store/auth.store.ts'), `
import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
`);

// 4. UI Components
fs.writeFileSync(path.join(baseDir, 'components/ui/Button.tsx'), `
import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => {
  const base = "px-6 py-3 rounded transition-all duration-300 font-medium tracking-wide flex items-center justify-center";
  const variants = {
    primary: "bg-primary hover:bg-primary-dark text-white",
    outline: "border border-secondary text-secondary hover:bg-secondary hover:text-white",
    ghost: "hover:bg-gray-100 text-secondary"
  };

  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
};
`);

// 5. Layouts
fs.writeFileSync(path.join(baseDir, 'layouts/MainLayout.tsx'), `
import { Outlet, Link } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-secondary text-white py-4 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-serif text-primary">ALFA DARK</Link>
          <nav className="flex space-x-6 text-sm uppercase tracking-widest">
            <Link to="/catalog" className="hover:text-primary transition-colors">Catálogo</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="font-serif text-xl text-primary mb-4">ALFA DARK JOYERÍA</p>
          <p className="text-sm opacity-75">© 2026 Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
`);

// 6. Pages
fs.writeFileSync(path.join(baseDir, 'pages/public/HomePage.tsx'), `
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-serif mb-6 text-primary">Elegancia Atemporal</h1>
          <p className="text-lg md:text-2xl mb-8 font-light">Descubre nuestra exclusiva colección de joyería fina, diseñada para deslumbrar.</p>
          <Link to="/catalog">
            <Button className="text-lg px-8 py-4">Ver Colección</Button>
          </Link>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 container mx-auto px-4 text-center">
        <h2 className="text-4xl font-serif mb-12">Piezas Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1,2,3].map(i => (
            <div key={i} className="group cursor-pointer">
              <div className="bg-surface aspect-square mb-6 overflow-hidden flex items-center justify-center">
                <div className="w-full h-full bg-gray-200 group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="text-xl font-serif mb-2">Anillo Diamante Élite</h3>
              <p className="text-primary font-medium">$2,500.00</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
`);

fs.writeFileSync(path.join(baseDir, 'pages/public/CatalogPage.tsx'), `
export const CatalogPage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif mb-12 text-center">Nuestro Catálogo</h1>
      <p className="text-center text-gray-500">Colección completa próximamente...</p>
    </div>
  );
};
`);

// 7. Routes
fs.writeFileSync(path.join(baseDir, 'routes/AppRouter.tsx'), `
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/public/HomePage';
import { CatalogPage } from '../pages/public/CatalogPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
`);

// 8. Main App Root
fs.writeFileSync(path.join(baseDir, 'App.tsx'), `
import { AppRouter } from './routes/AppRouter';

function App() {
  return <AppRouter />;
}

export default App;
`);

fs.writeFileSync(path.join(baseDir, 'main.tsx'), `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`);

console.log('Frontend boilerplate generated successfully!');
