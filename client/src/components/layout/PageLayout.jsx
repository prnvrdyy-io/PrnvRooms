/**
 * Page Layout — Shared shell for authenticated pages
 *
 * Provides:
 * - Navbar at top (64px fixed)
 * - Optional sidebar
 * - Main content area with proper padding offset
 *
 * Usage:
 *   <PageLayout user={user} onLogout={logout}>
 *     <YourPageContent />
 *   </PageLayout>
 */

import { Navbar } from './Navbar';

export function PageLayout({ user, onLogout, children, maxWidth = 1200, noPadding = false }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Navbar user={user} onLogout={onLogout} />

      <main
        style={{
          paddingTop: 64, // offset for fixed navbar
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            maxWidth: noPadding ? '100%' : maxWidth,
            margin: '0 auto',
            padding: noPadding ? 0 : '32px 24px',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * AuthLayout — Centered layout for Login/Register pages
 * Full-viewport with ambient glow background
 */
export function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      {/* Auth card */}
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: 460,
          padding: '40px',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
}
