
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Roles } from '../../constants/auth';

export const PremiumGuard = () => {
 const { status, role } = useAuth();
 
 if (status === 'initializing') {
 return <div className="flex h-screen items-center justify-center">Loading...</div>;
 }
 
 const allowedRoles = [Roles.PREMIUM_TRAVELER, Roles.PROVIDER_APPROVED, Roles.ADMIN];
 
 if (!allowedRoles.includes(role)) {
 return <Navigate to="/upgrade" replace />;
 }
 
 return <Outlet />;
};
