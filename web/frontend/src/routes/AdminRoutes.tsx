// AdminRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/admin/DashboardPage';
import UserManagementPage from '../pages/admin/User/UserManagementPage';
import ProductManagementPage from '../pages/admin/Product/ProductManagementPage';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/users" element={<UserManagementPage />} />
      <Route path="/admin/products" element={<ProductManagementPage />} />
    </Routes>
  );
};

export default AdminRoutes;
