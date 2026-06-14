import { create } from 'zustand';
import { authApi } from '../api';

const useAuthStore = create((set, get) => ({
    user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'),
    loading: false,
    error: null,

    login: async (email, password, rememberMe = false) => {
        set({ loading: true, error: null });
        try {
            const response = await authApi.login(email, password);
            // Backend returns BaseResponse<AuthResponse> -> response.data.data is the actual user
            const userData = response.data.data || response.data; 

            if (rememberMe) {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                localStorage.setItem('token', userData.token);
                localStorage.setItem('user', JSON.stringify(userData));
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                sessionStorage.setItem('token', userData.token);
                sessionStorage.setItem('user', JSON.stringify(userData));
            }

            set({ user: userData, loading: false });
            return { success: true, user: userData };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            set({ error: message, loading: false });
            return { success: false, message };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        set({ user: null });
    },

    isAdmin: () => {
        const user = get().user;
        const role = user?.role || user?.Role || user?.vaiTro || user?.VaiTro;
        return role?.toString().toLowerCase() === 'admin';
    },

    isAuthenticated: () => !!get().user,
}));

export default useAuthStore;
