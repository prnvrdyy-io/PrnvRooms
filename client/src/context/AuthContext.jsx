/**
 * AuthContext — Global Authentication State
 *
 * Provides the entire application with:
 * - `user`        — current user object or null
 * - `isLoading`   — true while the initial auth check is running
 * - `isAuthenticated` — boolean shorthand
 * - `login()`     — logs in and updates state
 * - `register()`  — registers and updates state
 * - `logout()`    — clears state and redirects
 * - `updateUser()` — merges a partial user update into state
 *
 * Why Context API over Redux?
 * Auth state is truly global (every component might need it), but it's
 * simple enough that the overhead of Redux (actions, reducers, sagas)
 * would add noise without benefit at this scale.
 *
 * Token storage strategy:
 * - Tokens are kept in localStorage for persistence across page refreshes.
 * - In Phase 12 (Security), we'll move refresh tokens to httpOnly cookies.
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

// Storage keys — centralised to avoid typo bugs across the codebase
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true on mount — checking existing session
  const navigate = useNavigate();

  // ─── Persist helpers ──────────────────────────────────────────────────
  const saveSession = (userData, accessToken, refreshToken) => {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setUser(userData);
  };

  const clearSession = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  };

  // ─── Initial Session Restore ──────────────────────────────────────────
  // On mount, check if a valid token exists and fetch fresh user data
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Validate token with server and get fresh user data
        const res = await authService.getMe();
        setUser(res.data.data.user);
      } catch {
        // Token expired or invalid — try to refresh
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          try {
            const res = await authService.refreshToken(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = res.data.data;
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
            // Retry getMe with new token
            const meRes = await authService.getMe();
            setUser(meRes.data.data.user);
          } catch {
            clearSession(); // Refresh token also expired — force re-login
          }
        } else {
          clearSession();
        }
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ─── Register ─────────────────────────────────────────────────────────
  const register = useCallback(async (formData) => {
    const res = await authService.register(formData);
    const { user: userData, accessToken, refreshToken } = res.data.data;
    saveSession(userData, accessToken, refreshToken);
    toast.success(`Welcome to NexMeet, ${userData.username}! 🎉`);
    navigate('/dashboard');
    return userData;
  }, [navigate]);

  // ─── Login ────────────────────────────────────────────────────────────
  const login = useCallback(async (formData) => {
    const res = await authService.login(formData);
    const { user: userData, accessToken, refreshToken } = res.data.data;
    saveSession(userData, accessToken, refreshToken);
    toast.success(`Welcome back, ${userData.username}!`);
    navigate('/dashboard');
    return userData;
  }, [navigate]);

  // ─── Logout ───────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authService.logout(); // Invalidate server-side refresh token
    } catch {
      // If the request fails (network error, expired token), still clear locally
    } finally {
      clearSession();
      toast.success('Signed out successfully');
      navigate('/login');
    }
  }, [navigate]);

  // ─── Update user state (after profile edit) ───────────────────────────
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Named export so we can tree-shake
export { AuthContext };
