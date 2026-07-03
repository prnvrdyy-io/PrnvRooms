/**
 * useAuth — Custom hook to consume the AuthContext
 *
 * Using a custom hook instead of useContext(AuthContext) directly:
 * 1. Gives a clear error if used outside the provider (dev safety net)
 * 2. One import instead of two (no need to import both useContext + AuthContext)
 * 3. Makes the API consistent — all auth reads go through this hook
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside an <AuthProvider>. ' +
      'Make sure AuthProvider wraps your component tree in App.jsx.'
    );
  }

  return context;
}
