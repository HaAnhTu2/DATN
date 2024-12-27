// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Page/authentication/AuthContext';
import CreateUserPage from './Page/user/Create';
import HomePage from './Page/HomePage';
import UserHomePage from './Page/home/UserHomePage';
import UpdateUserPage from './Page/user/UpdateUser';
import LoginPage from './Page/authentication/Login';
import CreateProductPage from './Page/product/Create';
import UpdateProductPage from './Page/product/Update';
import Logout from './components/authentication/logout';
import DetailProductPage from './Page/product/Detail';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import "../src/assets/css/bootstrap.min.css";
import "../src/assets/css/font-awesome.min.css";
import "../src/assets/css/nouislider.min.css";
import "../src/assets/css/slick-theme.css";
import "../src/assets/css/slick.css";
import "../src/assets/css/style.css";
import CartPage from './Page/order/CartPage';
import SignupPage from './Page/authentication/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Navigation />
        <Routes>
          <Route path="/" element={<UserHomePage />} />
          <Route path="/home" element={<UserHomePage />} />
          <Route path="/create/user" element={<CreateUserPage />} />
          <Route path="/create/product" element={<CreateProductPage />} />
          <Route path="/update/product" element={<UpdateProductPage />} />
          <Route path="/product/:id" element={<DetailProductPage />} />
          <Route path="/cart/:id" element={<CartPage />} />
          <Route path="/update/user" element={<UpdateUserPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
