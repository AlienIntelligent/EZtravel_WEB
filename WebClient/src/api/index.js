import apiClient from './client';
import { authApi } from './auth.api';

// User API
export const userApi = {
    getAll: (params) => apiClient.get('/users', { params }),
    getById: (id) => apiClient.get(`/users/${id}`),
    create: (data) => apiClient.post('/users', data),
    update: (id, data) => apiClient.put(`/users/${id}`, data),
    delete: (id) => apiClient.delete(`/users/${id}`),
};

// Place API
export const placeApi = {
    getAll: (params) => apiClient.get('/places', { params }),
    getById: (id) => apiClient.get(`/places/${id}`),
    create: (data) => apiClient.post('/places', data),
    update: (id, data) => apiClient.put(`/places/${id}`, data),
    delete: (id) => apiClient.delete(`/places/${id}`),
};

// Trip API
export const tripApi = {
    getAll: (params) => apiClient.get('/trips', { params }),
    getById: (id) => apiClient.get(`/trips/${id}`),
    create: (data) => apiClient.post('/trips', data),
    update: (id, data) => apiClient.put(`/trips/${id}`, data),
    delete: (id) => apiClient.delete(`/trips/${id}`),
};

// Booking API
export const bookingApi = {
    create: (data) => apiClient.post('/bookings', data),
    getMyBookings: () => apiClient.get('/bookings/my'),
    getById: (id) => apiClient.get(`/bookings/${id}`),
    cancel: (id) => apiClient.put(`/bookings/${id}/cancel`),
};

export const productApi = placeApi;
export const categoryApi = {
    getAll: () => apiClient.get('/categories'),
    getById: (id) => apiClient.get(`/categories/${id}`),
};

export { apiClient, authApi };
