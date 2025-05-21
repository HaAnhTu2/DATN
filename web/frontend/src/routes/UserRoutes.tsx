// UserRoutes.tsx
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/user/Home/page';
import ProductPage from '../pages/user/ProductPage';
import CartPage from '../pages/user/Cart/CartPage';

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
