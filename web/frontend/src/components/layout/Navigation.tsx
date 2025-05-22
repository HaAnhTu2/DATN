import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserByToken } from '../../services/authService';
import { User } from '../../types/user';

const Navigation: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const fetchedUser = await getUserByToken(token);
        setUser(fetchedUser.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <nav id="navigation" className="py-2 bg-light">
        <div className="container">
          <div>Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav id="navigation" className="bg-light border-bottom">
      <div className="container">
        <div id="responsive-nav">
          <ul className="main-nav nav d-flex gap-3"
            style={{
              listStyle: 'none',
              display: 'flex',
              gap: '30px',
              margin: 0,
              padding: 0,
              alignItems: 'center',
              fontSize: '15px',
              fontWeight: '500',
            }}
          >
            {user?.role === 'User' && (
              <>
            <li>
              <Link to="/home" className="text-decoration-none text-dark">
                Trang chủ
              </Link>
              <Link to="/category" className="text-decoration-none text-dark">
                    Loại sản phẩm
                  </Link>
            </li>
            </>
            )}
            
            {user?.role === 'Admin' && (
              <>
                <li>
                  <Link to="/update/user" className="text-decoration-none text-dark">
                    Quản Lý khách hàng
                  </Link>
                </li>
                <li>
                  <Link to="/update/product" className="text-decoration-none text-dark">
                    Quản lý sản phẩm
                  </Link>
                </li>
                <li>
                  <Link to="/update/category" className="text-decoration-none text-dark">
                    Quản lý loại sản phẩm
                  </Link>
                </li>
                <li>
                  <Link to="/update/order" className="text-decoration-none text-dark">
                    Quản Lý đơn hàng
                  </Link>
                </li>
                <li>
                  <Link to="/update/producer" className="text-decoration-none text-dark">
                    Quản lý nhà sản xuất
                  </Link>
                </li>
                <li>
                  <Link to="/update/voucher" className="text-decoration-none text-dark">
                    Quản lý mã giảm giá
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
