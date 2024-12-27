import React, { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByToken, logout } from '../api/api';
import { User } from '../type/user';
import { Button } from 'react-bootstrap';
import logo from '../assets/img/logo.png';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
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
      console.error('User not found. Redirecting to login.');
      navigate('/login');
      return;
    }
    navigate(`/cart/${user.id}`);
  };

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await logout();
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isLoggedIn = Boolean(user);

  return (
    <>
      <header>
        <div id="top-header">
          <div className="container">
            <ul className="header-links pull-left">
              <li><a href="#"><i className="fa fa-phone"></i> +123-45-67-89</a></li>
              <li><a href="#"><i className="fa fa-envelope-o"></i> Tusha123@email.com</a></li>
              <li><a href="#"><i className="fa fa-map-marker"></i> Tây Tựu, Bắc Từ Liêm, Hà Nội</a></li>
            </ul>
            <ul className="header-links pull-right">
              {isLoggedIn ? (
                <>
                  <li><a href="#"><i className="fa fa-user-o"></i> Hello, {user?.email}</a></li>
                  <li><Link to={`/cart/${user.id}`}><i className="fa fa-shopping-cart"></i> Cart</Link></li>
                  <li><Link to="/login" onClick={handleLogout}><i className="fa fa-sign-out"></i> Logout</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="login-link">Login</Link></li>
                  <li><Link to="/signup" className="signup-link">Sign Up</Link></li>
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

              <div className="col-md-6">
                {/* You can add more content here */}
              </div>

              <div className="col-md-3 clearfix">
                <div className="header-ctn">
                  <Button onClick={handleCartClick} className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                    <i className="fa fa-shopping-cart"></i>
                    <span>Your Cart</span>
                  </Button>

                  <div className="menu-toggle">
                    <a href="#">
                      <i className="fa fa-bars"></i>
                      <span>Menu</span>
                    </a>
                  </div>
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
