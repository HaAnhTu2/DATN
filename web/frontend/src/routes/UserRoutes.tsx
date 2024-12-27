// UserRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/user/HomePage';
import ProductPage from '../pages/user/ProductPage';
import CartPage from '../pages/user/CartPage';

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  );
};

export default UserRoutes;
