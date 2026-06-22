
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Roles } from '../../constants/auth';

export const AdminGuard = () => {
  const { status, role } = useAuth();
  
  if (status === 'initializing') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (role !== Roles.ADMIN) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};
