import axios from 'axios';

const API_BASE_URL = '/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests (Support both localStorage and sessionStorage)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors (Support 401 redirection to login)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// --- API Objects (Tham khảo cách phân nhóm của BaseCore) ---

// Auth API
export const authApi = {
    login: (email, password) => api.post('/auth/login', { email, matKhau: password }),
    register: (data) => api.post('/auth/register', {
        hoTen: data.username || data.hoTen,
        email: data.email,
        matKhau: data.password || data.matKhau
    }),
};

// User API
export const userApi = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Place API (Service địa điểm)
export const placeApi = {
    getAll: (params) => api.get('/places', { params }),
    getById: (id) => api.get(`/places/${id}`),
    create: (data) => api.post('/places', data),
    update: (id, data) => api.put(`/places/${id}`, data),
    delete: (id) => api.delete(`/places/${id}`),
};

// Trip API (Service chuyến đi)
export const tripApi = {
    getAll: (params) => api.get('/trips', { params }),
    getById: (id) => api.get(`/trips/${id}`),
    create: (data) => api.post('/trips', data),
    update: (id, data) => api.put(`/trips/${id}`, data),
    delete: (id) => api.delete(`/trips/${id}`),
};

// Booking API (Service đặt chỗ)
export const bookingApi = {
    create: (data) => api.post('/bookings', data),
    getMyBookings: () => api.get('/bookings/my'),
    getById: (id) => api.get(`/bookings/${id}`),
    cancel: (id) => api.put(`/bookings/${id}/cancel`),
};

// Aliases for compatibility with old components (Phase 2)
export const productApi = placeApi;
export const categoryApi = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
};

export default api;
