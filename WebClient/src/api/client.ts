import axios from 'axios';
import { normalizeApiPayload } from '../lib/textEncoding';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
let accessToken: string | null = null;
let refreshPromise: Promise<any> | null = null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
};

export const clearAccessToken = () => {
    accessToken = null;
};

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
apiClient.interceptors.request.use(
    (config) => {
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const refreshAccessToken = async () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
            .then((response) => {
                const payload = normalizeApiPayload(response.data?.data || response.data);
                if (!payload?.token) throw new Error('Refresh response does not contain an access token.');
                setAccessToken(payload.token);
                return payload;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

// Handle response errors and rotate an expired access token once.
apiClient.interceptors.response.use(
    (response) => {
        response.data = normalizeApiPayload(response.data);
        return response;
    },
    async (error) => {
        const config = error.config || {};
        const url = String(config.url || '');
        const authLifecycleRequest = /\/auth\/(login|register|refresh|logout)/.test(url);
        if (error.response?.status === 401 && !config.__eztravelRetried && !authLifecycleRequest) {
            config.__eztravelRetried = true;
            try {
                const session = await refreshAccessToken();
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${session.token}`;
                return apiClient(config);
            } catch {
                clearAccessToken();
                window.dispatchEvent(new Event('eztravel:session-expired'));
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
