import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const PublicRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuthStore();
    const isAuthenticated = !!user;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        if (isAdmin()) {
            return <Navigate to="/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PublicRoute;
