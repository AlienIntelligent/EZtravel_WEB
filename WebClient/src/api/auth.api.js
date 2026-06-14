import apiClient from './client';

export const authApi = {
    login: (email, password) => apiClient.post('/auth/login', { email, matKhau: password }),
    register: (data) => apiClient.post('/auth/register', {
        hoTen: data.username || data.hoTen,
        email: data.email,
        matKhau: data.password || data.matKhau
    }),
};
