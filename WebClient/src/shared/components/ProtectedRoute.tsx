import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { UserRole } from '../types/user';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
    publicOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    allowedRoles, 
    publicOnly = false 
}) => {
    const { isAuthenticated, user } = useAppSelector(state => state.auth);
    const location = useLocation();

    // If route is publicOnly (like Login/Register) and user is authenticated
    if (publicOnly && isAuthenticated && user) {
        if (user.role === UserRole.ADMIN) {
            return <Navigate to="/admin" replace />;
        } else if (user.role === UserRole.PROVIDER) {
            return <Navigate to="/provider" replace />;
        } else {
            return <Navigate to="/explore" replace />;
        }
    }

    // If route requires authentication and user is not authenticated
    if (!publicOnly && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If route requires specific roles and user does not have one
    if (!publicOnly && allowedRoles && allowedRoles.length > 0 && user) {
        // Always allow ADMIN to access everything
        if (user.role !== UserRole.ADMIN && !allowedRoles.includes(user.role as UserRole)) {
            return <Navigate to="/403" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
