/**
 * 404 Not Found Page
 * Shown when a user navigates to a route that doesn't exist.
 */

import { Link } from 'react-router-dom';
import { HiArrowLeft, HiVideoCamera } from 'react-icons/hi';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 48,
        }}
      >
        <HiVideoCamera style={{ color: 'var(--color-primary)', fontSize: 24 }} />
        <span
          style={{
            fontSize: '1.25rem',
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
      </div>

      {/* 404 Text */}
      <div
        className="gradient-text animate-fade-in"
        style={{
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: 16,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        404
      </div>

      <h1
        className="animate-fade-in"
        style={{
          fontSize: 'clamp(1.25rem, 3vw, 2rem)',
          fontWeight: 700,
          marginBottom: 16,
          animationDelay: '100ms',
        }}
      >
        Page Not Found
      </h1>

      <p
        className="animate-fade-in"
        style={{
          color: 'var(--text-secondary)',
          maxWidth: 400,
          lineHeight: 1.7,
          marginBottom: 40,
          animationDelay: '200ms',
        }}
      >
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      <Link to="/" className="animate-fade-in" style={{ animationDelay: '300ms' }}>
        <button className="btn btn-primary" style={{ fontSize: '15px', padding: '12px 28px' }}>
          <HiArrowLeft />
          Back to Home
        </button>
      </Link>
    </div>
  );
}
