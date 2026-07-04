/**
 * Navbar — PrnvRooms
 *
 * Premium SaaS navbar. Fully responsive with hamburger menu on mobile.
 */

import { Link, useLocation } from 'react-router-dom';
import { Video, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Avatar } from '../ui/Avatar';

export function Navbar({ user = null, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 'var(--z-dropdown)',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid var(--border-default)' : '1px solid transparent',
          transition: 'border-color var(--transition-slow), box-shadow var(--transition-slow)',
          boxShadow: scrolled ? 'var(--shadow-sm)' : 'none',
        }}
      >
        {/* Brand */}
        <Link
          to={user ? '/dashboard' : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Video size={16} color="#fff" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            PrnvRooms
          </span>
        </Link>

        {/* Desktop links */}
        <div className="navbar-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {user ? (
            <>
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              <div style={{ width: 1, height: 20, background: 'var(--border-default)', margin: '0 6px' }} />
              <Link
                to="/profile"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '5px 10px', borderRadius: 'var(--radius-md)',
                  textDecoration: 'none', transition: 'background var(--transition-base)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Avatar name={user.username} size="sm" />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.username}
                </span>
              </Link>
              <button onClick={onLogout} className="btn btn-outline btn-sm" style={{ marginLeft: 4 }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <a href="#features" style={{ padding: '6px 12px', fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', borderRadius: 'var(--radius-md)' }}>
                Features
              </a>
              <Link to="/login"><button className="btn btn-ghost btn-sm">Sign in</button></Link>
              <Link to="/register"><button className="btn btn-primary btn-sm">Get started</button></Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-mobile-menu"
          onClick={() => setMobileOpen(v => !v)}
          style={{
            display: 'none', // show-on-mobile CSS handles this
            alignItems: 'center',
            justifyContent: 'center',
            width: 40, height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            border: '1px solid var(--border-default)',
            cursor: 'pointer',
            color: 'var(--text-primary)',
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 60,
            left: 0,
            right: 0,
            zIndex: 'var(--z-dropdown)',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-default)',
            boxShadow: 'var(--shadow-lg)',
            padding: '16px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {user ? (
            <>
              {/* User info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0 16px', borderBottom: '1px solid var(--border-default)', marginBottom: 8 }}>
                <Avatar name={user.username} size="md" />
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{user.username}</p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user.email}</p>
                </div>
              </div>
              <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
              <MobileNavLink to="/profile">Profile</MobileNavLink>
              <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />
              <button
                onClick={onLogout}
                style={{
                  width: '100%', padding: '12px 16px', textAlign: 'left',
                  fontSize: 15, fontWeight: 600, color: 'var(--color-danger)',
                  background: 'var(--color-danger-light)', border: 'none',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <MobileNavLink to="/login">Sign in</MobileNavLink>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="btn btn-primary btn-full" style={{ padding: '12px', fontSize: 15 }}>
                  Get started free
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button
        style={{
          padding: '6px 12px', fontSize: 14, fontWeight: 500,
          color: active ? 'var(--color-primary)' : 'var(--text-secondary)',
          background: active ? 'var(--color-primary-light)' : 'transparent',
          border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
          transition: 'all var(--transition-base)', fontFamily: 'inherit',
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
      >
        {children}
      </button>
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <button
        style={{
          width: '100%', padding: '12px 16px', textAlign: 'left',
          fontSize: 15, fontWeight: 600, color: 'var(--text-primary)',
          background: 'transparent', border: 'none',
          borderRadius: 'var(--radius-md)', cursor: 'pointer',
          fontFamily: 'inherit', transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {children}
      </button>
    </Link>
  );
}
