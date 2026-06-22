
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Roles } from '../../constants/auth';

export const AuthenticatedGuard = () => {
  const { status, role } = useAuth();
  
  if (status === 'initializing') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (role === Roles.GUEST) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <Outlet />;
};
