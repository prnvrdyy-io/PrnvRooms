/**
 * User Service — API calls for profile management
 */

import api from './api';

export const userService = {
  /** Get the current user's profile + stats */
  getProfile: () => api.get('/users/me'),

  /** Update username, email, or avatarColor */
  updateProfile: (data) => api.put('/users/profile', data),

  /** Change password — requires currentPassword + newPassword */
  changePassword: (data) => api.put('/users/password', data),

  /** Permanently delete account — requires password confirmation */
  deleteAccount: (data) => api.delete('/users/account', { data }),
};
