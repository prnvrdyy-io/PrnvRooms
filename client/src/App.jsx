/**
 * Root Application Component — Updated for Phase 3
 *
 * Provider hierarchy (outer to inner):
 *  BrowserRouter        — React Router context
 *    AuthProvider       — global auth state (needs Router for useNavigate)
 *      Routes + Guards  — route definitions
 *
 * Why AuthProvider is inside BrowserRouter?
 * AuthContext uses useNavigate() to redirect after login/logout.
 * useNavigate() requires a Router context — so AuthProvider must be nested inside BrowserRouter.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute, PublicRoute } from './routes/RouteGuards';

// Pages
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import NotFoundPage   from './pages/NotFoundPage';
import DashboardPage  from './pages/DashboardPage';
import MeetingPage    from './pages/MeetingPage';

// Placeholder pages — replaced in their respective phases
const ProfilePlaceholder = () => (
  <div className="placeholder-page">Profile — coming in Phase 3 extension</div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Global toast notification system */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#FFFFFF',
            color: '#0F172A',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            fontSize: '14px',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.1)',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: '#FFFFFF' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' } },
        }}
      />

      {/* AuthProvider must be inside BrowserRouter (needs useNavigate) */}
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* ── Public ─────────────────────────────────────────────────── */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth pages — redirect to dashboard if already logged in */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* ── Protected ──────────────────────────────────────────────── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/meeting/:meetingId"
              element={
                <ProtectedRoute>
                  <MeetingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePlaceholder />
                </ProtectedRoute>
              }
            />

            {/* ── Fallback ───────────────────────────────────────────────── */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
