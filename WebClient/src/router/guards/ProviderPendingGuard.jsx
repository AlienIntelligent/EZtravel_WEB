import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Roles } from '../../constants/auth';
import { useGetProviderStatusQuery } from '../../store/apis/providerApi';

export const ProviderPendingGuard = () => {
  const { status, role } = useAuth();
  const { data: provider, isLoading } = useGetProviderStatusQuery(undefined, {
    skip: status !== 'authenticated' || role === Roles.ADMIN,
  });
  const providerStatus = String(provider?.status ?? provider?.trangThai ?? '').toUpperCase();
  
  if (status === 'initializing' || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  // Only allow users with the PROVIDER_PENDING role
  if (
    role === Roles.PROVIDER_PENDING ||
    providerStatus === 'PENDING' ||
    providerStatus === 'REJECTED' ||
    providerStatus === 'INACTIVE'
  ) {
    return <Outlet />;
  }
  
  // Redirect other roles to their specific domains
  if (role === Roles.PROVIDER_APPROVED || providerStatus === 'ACTIVE' || providerStatus === 'APPROVED') {
    return <Navigate to="/provider/dashboard" replace />;
  }
  
  if (role === Roles.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (role === Roles.GUEST) {
    return <Navigate to="/auth/login" replace />;
  }
  
  // Default fallback for regular or premium travelers who have not registered
  return <Navigate to="/provider/registration" replace />;
};
