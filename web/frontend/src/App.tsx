import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import "../src/assets/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../src/assets/css/font-awesome.min.css";
import "../src/assets/css/nouislider.min.css";
import "../src/assets/css/slick-theme.css";
import "../src/assets/css/slick.css";
import "../src/assets/css/style.css";
import UserHomePage from './pages/user/Home/page';
import Navigation from './components/layout/Navigation';
import { AuthProvider } from './pages/auth/AuthContext';
import Header from './components/layout/Header';
import CartPage from './pages/user/Cart/CartPage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import ProductManagementPage from './pages/admin/Product/ProductManagementPage';
import UserManagementPage from './pages/admin/User/UserManagementPage';
import Footer from './components/layout/Footer';
import DetailProductPage from './pages/user/Product/ProductDetailPage';
import UserUpdate from './components/sections/admin/User/edit/[id]/page';
import CategoryManagementPage from './pages/admin/Category/CategoryManagementPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Navigation />
        <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <main style={{flex: 1}}>
        <Routes>
          
          <Route path="/" element={<UserHomePage />} />
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/update/product" element={<ProductManagementPage />} />
          <Route path="/product/:id" element={<DetailProductPage />} />
          <Route path="/update/category" element={<CategoryManagementPage />} />
          <Route path="/cart/:id" element={<CartPage />} />
          <Route path="/update/user" element={<UserManagementPage />} />
          <Route path="/user/edit/:id" element={<UserUpdate />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
       </main>
      <Footer />
    </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
