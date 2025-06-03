import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeaderMenu = ({ user, isLoggedIn, handleCartClick, handleLogout }: any) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="w-full bg-gray-100 px-4 py-2">
      {/* Menu Toggle (mobile only) */}
      <div className="menu-toggle block md:hidden mb-2">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm text-gray-700"
        >
          <i className="fa fa-bars"></i>
          <span>Menu</span>
        </button>
      </div>

      {/* Dropdown menu content */}
      {menuOpen && (
        <ul className="block md:hidden space-y-2 text-sm text-gray-700 mb-4">
          {user?.role !== "Admin" && (
            <>
              <li>
                <Link to="/home" className="text-dark">Trang chủ</Link>
              </li>
              <li>
                <Link to="/category" className="text-dark">Máy tính</Link>
              </li>
              <li>
                <Link to="/category" className="text-dark">Điện thoại</Link>
              </li>
              <li>
                <Link to="/category" className="text-dark">Phụ Kiện</Link>
              </li>
            </>
          )}

          {user?.role === "Admin" && (
            <>
              <li>
                <Link to="/update/user" className="text-dark">Quản lý khách hàng</Link>
              </li>
              <li>
                <Link to="/update/product" className="text-dark">Quản lý sản phẩm</Link>
              </li>
              <li>
                <Link to="/update/category" className="text-dark">Quản lý loại sản phẩm</Link>
              </li>
              <li>
                <Link to="/update/order" className="text-dark">Quản lý đơn hàng</Link>
              </li>
              <li>
                <Link to="/update/producer" className="text-dark">Quản lý nhà sản xuất</Link>
              </li>
              <li>
                <Link to="/update/voucher" className="text-dark">Quản lý mã giảm giá</Link>
              </li>
            </>
          )}
        </ul>
      )}

      {/* Desktop menu */}
      <div className="container mx-auto hidden md:flex justify-between items-center">
        <ul className="flex space-x-6 text-sm text-gray-700">
          <li>
            <a href="#" className="flex items-center gap-1"><i className="fa fa-phone"></i> +123-45-67-89</a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-1"><i className="fa fa-envelope-o"></i> Tusha123@email.com</a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-1"><i className="fa fa-map-marker"></i> Tây Tựu, Bắc Từ Liêm, Hà Nội</a>
          </li>
        </ul>

        <ul className="flex space-x-6 text-sm text-gray-700">
          {isLoggedIn ? (
            <>
              <li>
                <Link to={`/user/${user?.user_id}`} className="flex items-center gap-1"><i className="fa fa-user-o"></i> Hello, {user?.email}</Link>
              </li>
              <li>
                <Link to={`/cart/${user?.user_id}`} onClick={handleCartClick} className="flex items-center gap-1"><i className="fa fa-shopping-cart"></i> Giỏ hàng</Link>
              </li>
              <li>
                <Link to="/logout" onClick={handleLogout} className="flex items-center gap-1"><i className="fa fa-sign-out"></i> Đăng xuất</Link>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="text-decoration-none">Đăng Nhập</Link></li>
              <li><Link to="/signup" className="text-decoration-none">Đăng Ký</Link></li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeaderMenu;
