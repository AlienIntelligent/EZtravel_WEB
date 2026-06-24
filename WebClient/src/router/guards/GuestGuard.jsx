import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Roles } from '../../constants/auth';

export const GuestGuard = () => {
 const { status, role } = useAuth();
 
 if (status === 'initializing') {
 return <div className="flex h-screen items-center justify-center">Loading...</div>;
 }
 
 if (status === 'authenticated') {
 if (role === Roles.ADMIN) {
 return <Navigate to="/admin/dashboard" replace />;
 }
 if (role === Roles.PROVIDER_APPROVED) {
 return <Navigate to="/provider/dashboard" replace />;
 }
 if (role === Roles.PROVIDER_PENDING) {
 return <Navigate to="/provider/pending" replace />;
 }
 // Traveler and Premium Traveler go to Home (/)
 return <Navigate to="/" replace />;
 }
 
 return <Outlet />;
};
