import axios from 'axios';
import env from '../config/env';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally and normalize response
api.interceptors.response.use(
  (response) => {
    // Return only the data part if it follows the success format
    if (response.data && response.data.status === 'success') {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    // Normalize error format
    const normalizedError = {
      status: 'error',
      message: error.response?.data?.message || error.message || 'Something went wrong',
      code: error.response?.status,
      data: error.response?.data?.data || null,
    };

    if (normalizedError.code === 401) {
      // Handle unauthorized (session expired)
      useAuthStore.getState().logout();
      // Potential redirect or state reset logic here
    }

    // Optional: Log errors in dev mode
    if (import.meta.env.DEV) {
      console.error('[API Error]:', normalizedError);
    }

    return Promise.reject(normalizedError);
  }
);

export default api;
