/**
 * PageLayout & AuthLayout — PrnvRooms
 *
 * PageLayout: authenticated pages shell (Navbar + main content area)
 * AuthLayout: split layout for Login/Register (brand left, form right)
 */

import { Link } from 'react-router-dom';
import { Video, Users, MessageSquare, Monitor } from 'lucide-react';
import { Navbar } from './Navbar';

// ─── Main app layout (authenticated) ──────────────────────────────────────
export function PageLayout({ user, onLogout, children, maxWidth = 1200, noPadding = false }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-default)' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ paddingTop: 60, minHeight: '100vh' }}>
        <div
          style={{
            maxWidth: noPadding ? '100%' : maxWidth,
            margin: '0 auto',
            padding: noPadding ? 0 : '40px 32px',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

// ─── Auth split layout ─────────────────────────────────────────────────────
export function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
      }}
      className="auth-layout-grid"
    >
      <div
        className="auth-brand-panel"
        style={{
          background: 'var(--color-primary)',
          display: 'flex',
          flexDirection: 'column',
          padding: '48px 56px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle dot grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            textDecoration: 'none',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Video size={17} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
            PrnvRooms
          </span>
        </Link>

        {/* Brand copy */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
            maxWidth: 360,
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(28px, 3vw, 40px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.04em',
              lineHeight: 1.15,
              marginBottom: 20,
            }}
          >
            Meet.{'\u00A0'}Collaborate.
            <br />
            Create.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.65,
              marginBottom: 48,
            }}
          >
            The open-source video collaboration platform built for modern teams.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: Video,          label: 'HD video meetings with WebRTC' },
              { icon: MessageSquare,  label: 'Real-time chat & collaboration' },
              { icon: Monitor,        label: 'Screen sharing in one click' },
              { icon: Users,          label: 'Host & admin controls' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={15} color="rgba(255,255,255,0.9)" strokeWidth={2} />
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)', fontWeight: 500 }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', position: 'relative', zIndex: 1 }}>
          © 2025 PrnvRooms. Open source portfolio project.
        </p>
      </div>

      {/* Right panel — form */}
      <div
        className="auth-form-panel"
        style={{
          background: 'var(--bg-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 56px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
