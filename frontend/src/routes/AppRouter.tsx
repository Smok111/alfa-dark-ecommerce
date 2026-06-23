import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { HomePage } from '../pages/public/HomePage';
import { CatalogPage } from '../pages/public/CatalogPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { AdminGuard } from '../components/auth/AdminGuard';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';

import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';

import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminCouponsPage } from '../pages/admin/AdminCouponsPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="coupons" element={<AdminCouponsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
