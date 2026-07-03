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
import { ProtectedRoute, PublicRoute } from './routes/RouteGuards';

// Pages
import LandingPage    from './pages/LandingPage';
import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import NotFoundPage   from './pages/NotFoundPage';

// Placeholder pages — replaced in their respective phases
const DashboardPlaceholder = () => (
  <div className="placeholder-page">Dashboard — coming in Phase 4</div>
);
const MeetingPlaceholder = () => (
  <div className="placeholder-page">Meeting Room — coming in Phase 5</div>
);
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
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '10px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
        }}
      />

      {/* AuthProvider must be inside BrowserRouter (needs useNavigate) */}
      <AuthProvider>
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
                <DashboardPlaceholder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/meeting/:meetingId"
            element={
              <ProtectedRoute>
                <MeetingPlaceholder />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
