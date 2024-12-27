import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "../src/assets/css/bootstrap.min.css";
import "../src/assets/css/font-awesome.min.css";
import "../src/assets/css/nouislider.min.css";
import "../src/assets/css/slick-theme.css";
import "../src/assets/css/slick.css";
import "../src/assets/css/style.css";
import UserHomePage from './pages/user/HomePage';
import Navigation from './components/layout/Navigation';
import { AuthProvider } from './pages/auth/AuthContext';
import Header from './components/layout/Header';
import CartPage from './pages/user/CartPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import Footer from './components/layout/Footer';
import DetailProductPage from './pages/user/ProductDetailPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Navigation />
        <Routes>
          <Route path="/" element={<UserHomePage />} />
          <Route path="/home" element={<UserHomePage />} />
          {/* <Route path="/create/user" element={<CreateUserPage />} /> */}
          {/* <Route path="/create/product" element={<CreateProductPage />} /> */}
          <Route path="/update/product" element={<ProductManagementPage />} />
          <Route path="/product/:id" element={<DetailProductPage />} />
          <Route path="/cart/:id" element={<CartPage />} />
          <Route path="/update/user" element={<UserManagementPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/logout" element={<Logout />} /> */}
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
