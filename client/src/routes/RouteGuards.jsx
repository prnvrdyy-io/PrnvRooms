/**
 * Route Guards
 *
 * ProtectedRoute — redirects to /login if user is not authenticated.
 *   Saves the original URL so after login the user is sent back there.
 *
 * PublicRoute — redirects authenticated users away from /login and /register.
 *   Prevents logged-in users from seeing auth forms.
 *
 * Both show a PageLoader while auth state is being initialised (the 
 * brief moment on mount where we're checking localStorage / fetching /me).
 * This prevents a flash of the wrong page.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '../components/ui/Spinner';

/**
 * Wrap any route that requires authentication.
 * Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
export function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <PageLoader message="Verifying session..." />;

  if (!isAuthenticated) {
    // Preserve the intended URL in state — LoginPage will redirect back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

/**
 * Wrap auth pages (/login, /register) to redirect authenticated users to dashboard.
 */
export function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
