/**
 * Axios API Service
 *
 * Why a configured Axios instance instead of raw fetch?
 * - Centralised baseURL — change once, applies everywhere
 * - Request interceptor auto-attaches JWT from localStorage
 * - Response interceptor handles 401 token expiry globally
 *   (redirects to /login without every component having to check)
 * - Consistent error shape for all API calls
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────────────────
// Attach the JWT access token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────
// Handle token expiry globally — redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and send to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      // Only redirect if not already on the auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
