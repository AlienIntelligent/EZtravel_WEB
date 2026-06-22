
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const PublicGuard = () => {
  const { status } = useAuth();
  
  if (status === 'initializing') {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return <Outlet />;
};
