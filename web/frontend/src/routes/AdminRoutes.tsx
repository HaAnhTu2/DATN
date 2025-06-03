import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserByToken } from "../services/authService";
import { User } from "../types/user";
import NotAuthorized from "./NotAuthorized";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

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
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Đang kiểm tra quyền truy cập...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <NotAuthorized />;

  }

  return children;
};

export default ProtectedRoute;
