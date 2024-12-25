import React, { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { logout } from '../api/api';
const Header: React.FC = () => {
  const [, setError] = useState('');

  const handleLogout = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await logout();
      setError('');
    } catch (error) {
      setError('Error logging out');
    }
  };
  const isLoggedIn = localStorage.getItem('token');

  let menu;

  if (!isLoggedIn) {
    menu = (
      <ul>
        <li>
          <Link to="/login" className="login-link">Login</Link>
        </li>
        <li>
          <Link to="/signup" className="signup-link">Register</Link>
        </li>
      </ul>
    );
  } else {
    menu = (
      <ul>
        <div className="dropdown">
          <button className="dropbtn"><i className="fa fa-user-o"></i>user</button>
          <div className="dropdown-content">
            <a href="#">Link 1</a>
            <a href="#">Link 2</a>
            <Link to="/login" onClick={handleLogout}>Logout</Link>
          </div>
        </div>
      </ul>
    );
  }
  return <>
    <header>
      <div id="top-header">
        <div className="container">
          <ul className="header-links pull-left">
            <li><a href="#"><i className="fa fa-phone"></i> +123-45-67-89</a></li>
            <li><a href="#"><i className="fa fa-envelope-o"></i> Tusha123@email.com</a></li>
            <li><a href="#"><i className="fa fa-map-marker"></i> Tây Tựu, Bắc Từ Liêm, Hà Nội</a></li>
          </ul>
          <ul className="header-links pull-right">
            <li><a href="#"><i className="fa fa-user-o"></i> My Account</a></li>
            <li><Link to="/login" className="login-link">Login</Link></li>
            <li><Link to="/create/user" className="signup-link">Sign Up</Link></li>
          </ul>
        </div>
      </div>

      <div id="header">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="header-logo">
                <Link to="/" className="logo">
                <img src="./src/assets/img/logo.png" alt="logo" />
                </Link>
              </div>
            </div>

            <div className="col-md-6">
            </div>
            <div className="col-md-3 clearfix">
              <div className="header-ctn">
                <div className="dropdown">
                  <Link to="/listcart" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                    <i className="fa fa-shopping-cart"></i>
                    <span>Your Cart</span>
                  </Link>
                </div>

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
}

export default Header;