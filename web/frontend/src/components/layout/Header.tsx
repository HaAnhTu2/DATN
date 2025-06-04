import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByToken, logout } from '../../services/authService';
import { User } from '../../types/user';
import logo from '../../assets/img/logo.png';
import HeaderMenu from './HeaderMenu';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const fetchedUser = await getUserByToken(token);
        setUser(fetchedUser.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const handleCartClick = () => {
    if (!user) {
      console.error('Không tìm thấy người dùng. Đang chuyển hướng đến mục đăng nhập.');
      navigate('/login');
      return;
    }
    navigate(`/cart/${user.user_id}`);
  };

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await logout();
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  const isLoggedIn = Boolean(user);

  return (
    <>
      <header>
        <div id="top-header">
          <div className="container">
            <ul className="header-links pull-left">
              <li><a href="#" className='text-decoration-none'><i className="fa fa-phone"></i> +123-45-67-89</a></li>
              <li><a href="#" className='text-decoration-none'><i className="fa fa-envelope-o"></i> Tusha123@email.com</a></li>
              <li><a href="#" className='text-decoration-none'><i className="fa fa-map-marker"></i> Tây Tựu, Bắc Từ Liêm, Hà Nội</a></li>
            </ul>
            <ul className="header-links pull-right">
              {isLoggedIn ? (
                <>
                  <li><Link to={`/user/${user?.user_id}`} className='text-decoration-none'><i className="fa fa-user-o"></i> Hello, {user?.email}</Link></li>
                  <li><Link to={`/cart/${user?.user_id}`} className='text-decoration-none' onClick={handleCartClick}><i className="fa fa-shopping-cart"></i> Giỏ hàng</Link></li>
                  <li><Link to="/logout" className='text-decoration-none' onClick={handleLogout}><i className="fa fa-sign-out"></i> Đăng xuất</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="text-decoration-none login-link">Đăng Nhập</Link></li>
                  <li><Link to="/signup" className="text-decoration-none signup-link">Đăng Ký</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div id="header">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="header-logo">
                  <Link to="/" className="logo">
                    <img src={logo} alt="logo" />
                  </Link>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
