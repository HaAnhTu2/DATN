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
import CategoryManagementPage from './pages/admin/Category/CategoryManagementPage';
import OrderManagementPage from './pages/admin/Order/OrderManagementPage';
import ProducerManagementPage from './pages/admin/Producer/ProducerManagementPage';
import VoucherManagementPage from './pages/admin/Voucher/VoucherManagementPage';
import OrderPage from './pages/user/Order/OrderPage';
import OrderSuccess from './pages/user/Order/Success';
import CreateProductPage from './pages/admin/Product/create/page';
import ProductDetailPage from './pages/admin/ProductDetail/page';
import CreateProductDetailPage from './pages/admin/ProductDetail/create/page';
import UpdateUserPage from './pages/admin/User/update/page';
import UpdateUserDetailPage from './pages/user/User/page';
import UpdateProductDetailPage from './pages/admin/ProductDetail/update/page';
import UpdateProductPage from './pages/admin/Product/update/page';
import CreateVoucherPage from './pages/admin/Voucher/create/page';
import UpdateVoucherPage from './pages/admin/Voucher/update/page';
import CreateproducerPage from './pages/admin/Producer/create/page';
import UpdateProducerPage from './pages/admin/Producer/update/page';
import CreateCategoryPage from './pages/admin/Category/create/page';
import UpdateCategoryPage from './pages/admin/Category/update/page';
import CategoryPage from './pages/user/Category/[id]/page';
import OrderUserPage from './pages/user/Order/OrderUser';
import ProtectedRoute from './routes/AdminRoutes';
import OrderDetailPage from './pages/user/Order/[id]/OrderDetailPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Navigation />
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<UserHomePage />} />
              <Route path="/home" element={<UserHomePage />} />
              <Route path="/create/category" element={<ProtectedRoute allowedRoles={['Admin']}><CreateCategoryPage /></ProtectedRoute>} />
              <Route path="/update/category/:id" element={<ProtectedRoute allowedRoles={['Admin']}><UpdateCategoryPage /></ProtectedRoute>} />
              <Route path="/update/category" element={<ProtectedRoute allowedRoles={['Admin']}><CategoryManagementPage /></ProtectedRoute>} />

              <Route path="/update/order" element={<ProtectedRoute allowedRoles={['Admin']}><OrderManagementPage /></ProtectedRoute>} />

              <Route path="/create/producer" element={<ProtectedRoute allowedRoles={['Admin']}><CreateproducerPage /></ProtectedRoute>} />
              <Route path="/update/producer/:id" element={<ProtectedRoute allowedRoles={['Admin']}><UpdateProducerPage /></ProtectedRoute>} />
              <Route path="/update/producer" element={<ProtectedRoute allowedRoles={['Admin']}><ProducerManagementPage /></ProtectedRoute>} />

              <Route path="/create/product" element={<ProtectedRoute allowedRoles={['Admin']}><CreateProductPage /></ProtectedRoute>} />
              <Route path="/update/product/:id" element={<ProtectedRoute allowedRoles={['Admin']}><UpdateProductPage /></ProtectedRoute>} />
              <Route path="/update/product" element={<ProtectedRoute allowedRoles={['Admin']}><ProductManagementPage /></ProtectedRoute>} />

              <Route path="/update/user" element={<ProtectedRoute allowedRoles={['Admin']}><UserManagementPage /></ProtectedRoute>} />

              <Route path="/creare/voucher" element={<ProtectedRoute allowedRoles={['Admin']}><CreateVoucherPage /></ProtectedRoute>} />
              <Route path="/update/voucher/:id" element={<ProtectedRoute allowedRoles={['Admin']}><UpdateVoucherPage /></ProtectedRoute>} />
              <Route path="/update/voucher" element={<ProtectedRoute allowedRoles={['Admin']}><VoucherManagementPage /></ProtectedRoute>} />

              <Route path="/productdetail/create/:id" element={<ProtectedRoute allowedRoles={['Admin']}><CreateProductDetailPage /></ProtectedRoute>} />
              <Route path="/productdetail/update/:id" element={<ProtectedRoute allowedRoles={['Admin']}><UpdateProductDetailPage /></ProtectedRoute>} />
              <Route path="/productdetail/:id" element={<ProtectedRoute allowedRoles={['Admin']}><ProductDetailPage /></ProtectedRoute>} />
              

              <Route path="/product/:id" element={<DetailProductPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />

              <Route path="/user/:id" element={<UpdateUserDetailPage />} />
              <Route path="/cart/:id" element={<CartPage />} />
              <Route path="/userorder/:id" element={<OrderUserPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/order/detail/:id" element={<OrderDetailPage />} />
              <Route path="/order/success" element={<OrderSuccess />} />

              <Route path="/user/update/:id" element={<UpdateUserPage />} />
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
