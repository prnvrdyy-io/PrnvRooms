/**
 * Navbar — Top application navigation bar
 *
 * Auth-aware: renders different content when user is logged in vs out.
 * The `user` prop will come from AuthContext in Phase 3.
 * For Phase 2 we accept it as a prop with a sensible default.
 *
 * Props:
 *  user      — user object or null
 *  onLogout  — logout handler
 */

import { Link, useLocation } from 'react-router-dom';
import { HiVideoCamera, HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

export function Navbar({ user = null, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 'var(--z-dropdown)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: 64,
        background: 'rgba(10, 15, 30, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      {/* Brand */}
      <Link
        to={user ? '/dashboard' : '/'}
        style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HiVideoCamera style={{ color: '#fff', fontSize: 16 }} />
        </div>
        <span
          style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            background: 'linear-gradient(135deg, #fff, var(--color-primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          NexMeet
        </span>
      </Link>

      {/* Desktop Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {user ? (
          // Authenticated navigation
          <>
            <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
            <div
              style={{
                width: 1,
                height: 20,
                background: 'var(--border-subtle)',
                margin: '0 8px',
              }}
            />
            <Avatar name={user.username} src={user.profileImage} size="sm" online />
            <Link to="/profile">
              <button
                className="btn btn-ghost"
                style={{ fontSize: 13, padding: '6px 12px' }}
              >
                {user.username}
              </button>
            </Link>
            <Button variant="outline" size="sm" onClick={onLogout}>
              Sign Out
            </Button>
          </>
        ) : (
          // Public navigation
          <>
            <a href="/#features" style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500, padding: '6px 12px' }}>
              Features
            </a>
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to}>
      <button
        className="btn btn-ghost"
        style={{
          fontSize: 14,
          padding: '6px 14px',
          color: active ? 'var(--color-primary-light)' : 'var(--text-secondary)',
          background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
          borderRadius: 'var(--radius-md)',
        }}
      >
        {children}
      </button>
    </Link>
  );
}
