import { Link } from 'react-router-dom';

const NotAuthorized = () => {
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', color: '#dc3545' }}>403 - Không có quyền truy cập</h1>
      <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
        Bạn không có quyền truy cập vào trang này.
      </p>
      <Link to="/" style={{ fontSize: '1rem', color: '#007bff', textDecoration: 'underline' }}>
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default NotAuthorized;
