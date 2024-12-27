// index.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import UserRoutes from './UserRoutes';
import AuthRoutes from './AuthRoutes';
import { useAuth } from '../hooks/useAuth'; // Giả sử bạn có một hook xác thực

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Router>
      <Routes>
        {isAuthenticated ? (
          isAdmin ? (
            <Route path="/*" element={<AdminRoutes />} />
          ) : (
            <Route path="/*" element={<UserRoutes />} />
          )
        ) : (
          <Route path="/*" element={<AuthRoutes />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
