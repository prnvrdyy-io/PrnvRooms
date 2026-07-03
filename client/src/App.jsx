/**
 * Root Application Component
 *
 * This is the composition root — it wires together:
 * - React Router (BrowserRouter + Routes)
 * - Global Context Providers (added per phase)
 * - Toast notifications (react-hot-toast)
 *
 * Route structure:
 *  /               → Landing page (public)
 *  /login          → Login page (public)
 *  /register       → Register page (public)
 *  /dashboard      → Dashboard (protected)
 *  /meeting/:id    → Meeting room (protected)
 *  /profile        → User profile (protected)
 *  *               → 404 Not Found
 *
 * Protected routes are implemented in Phase 3 alongside auth context.
 * For now they render placeholder components so routing is exercisable.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages — stubs for Phase 1, replaced progressively through phases
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';

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
          success: {
            iconTheme: { primary: '#22c55e', secondary: '#1e293b' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#1e293b' },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes — full pages built in Phase 3 */}
        <Route path="/login" element={<div className="placeholder-page">Login — Phase 3</div>} />
        <Route path="/register" element={<div className="placeholder-page">Register — Phase 3</div>} />

        {/* Protected Routes — guards added in Phase 3 */}
        <Route path="/dashboard" element={<div className="placeholder-page">Dashboard — Phase 4</div>} />
        <Route path="/meeting/:meetingId" element={<div className="placeholder-page">Meeting — Phase 5</div>} />
        <Route path="/profile" element={<div className="placeholder-page">Profile — Phase 3</div>} />

        {/* Fallback */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
