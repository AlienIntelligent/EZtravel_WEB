import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';

import MainLayout from '../layouts/MainLayout';
import UserLayout from '../layouts/UserLayout';

// Admin Pages
import Login from '../pages/admin_pages/Login';
import Dashboard from '../pages/admin_pages/Dashboard';
import Products from '../pages/admin_pages/Products';
import Users from '../pages/admin_pages/Users';
import Categories from '../pages/admin_pages/Categories';
import Register from '../pages/admin_pages/Register';

// User Pages
import Home from '../pages/user_pages/Home';
import Tours from '../pages/user_pages/Tours';
import Hotels from '../pages/user_pages/Hotels';
import Blogs from '../pages/user_pages/Blogs';
import About from '../pages/user_pages/About';
import Contact from '../pages/user_pages/Contact';
import HotelSingle from '../pages/user_pages/HotelSingle';
import BlogSingle from '../pages/user_pages/BlogSingle';

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute adminOnly={true}>
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <ProtectedRoute adminOnly={true}>
                        <MainLayout>
                            <Products />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <ProtectedRoute adminOnly={true}>
                        <MainLayout>
                            <Users />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/categories"
                element={
                    <ProtectedRoute adminOnly={true}>
                        <MainLayout>
                            <Categories />
                        </MainLayout>
                    </ProtectedRoute>
                }
            />

            {/* User Routes */}
            <Route
                path="/"
                element={
                    <UserLayout>
                        <Home />
                    </UserLayout>
                }
            />
            <Route path="/tours" element={<UserLayout><Tours /></UserLayout>} />
            <Route path="/hotels" element={<UserLayout><Hotels /></UserLayout>} />
            <Route path="/hotel-single" element={<UserLayout><HotelSingle /></UserLayout>} />
            <Route path="/blog" element={<UserLayout><Blogs /></UserLayout>} />
            <Route path="/blog-single" element={<UserLayout><BlogSingle /></UserLayout>} />
            <Route path="/about" element={<UserLayout><About /></UserLayout>} />
            <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
