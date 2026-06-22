
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Roles } from '../../constants/auth';
import { useGetProviderStatusQuery } from '../../store/apis/providerApi';

export const ProviderGuard = () => {
  const { status, role } = useAuth();
  const { data: provider, isLoading } = useGetProviderStatusQuery(undefined, {
    skip: status !== 'authenticated' || role === Roles.ADMIN,
  });
  const providerStatus = String(provider?.status ?? provider?.trangThai ?? '').toUpperCase();
  
  if (status === 'initializing' || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (
    role === Roles.PROVIDER_APPROVED ||
    role === Roles.ADMIN ||
    providerStatus === 'ACTIVE' ||
    providerStatus === 'APPROVED'
  ) {
    return <Outlet />;
  }
  
  if (role === Roles.PROVIDER_PENDING || providerStatus === 'PENDING') {
    return <Navigate to="/provider/pending" replace />;
  }
  
  if (role === Roles.GUEST) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Default fallback for travelers who haven't registered
  return <Navigate to="/provider/registration" replace />;
};
