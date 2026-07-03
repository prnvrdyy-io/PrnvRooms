/**
 * Auth Service — API calls for authentication
 *
 * All auth API calls are centralised here. Components/Context never call
 * the Axios instance directly — they go through this service layer.
 * This makes mocking for tests trivial and keeps components clean.
 */

import api from './api';

export const authService = {
  /**
   * Register a new user
   * @param {{ username, email, password }} data
   */
  register: (data) => api.post('/auth/register', data),

  /**
   * Login with email + password
   * @param {{ email, password }} data
   */
  login: (data) => api.post('/auth/login', data),

  /**
   * Logout — invalidates refresh token on server
   */
  logout: () => api.post('/auth/logout'),

  /**
   * Get the currently authenticated user
   */
  getMe: () => api.get('/auth/me'),

  /**
   * Refresh the access token using the refresh token
   * @param {string} refreshToken
   */
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),

  /**
   * Update user profile
   * @param {FormData | object} data
   */
  updateProfile: (data) =>
    api.patch('/auth/profile', data, {
      headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
    }),
};
