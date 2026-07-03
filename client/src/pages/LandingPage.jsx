/**
 * Landing Page
 *
 * The public-facing homepage. Goals:
 * 1. Establish the brand identity (NexMeet)
 * 2. Communicate value proposition instantly
 * 3. Drive CTA to Register / Login
 * 4. Demonstrate modern UI quality for portfolio purposes
 *
 * Built with pure CSS variables from our design system — no Tailwind
 * utilities hardcoded here. This keeps it maintainable and themeable.
 */

import { Link } from 'react-router-dom';
import {
  HiVideoCamera,
  HiChat,
  HiDesktopComputer,
  HiPencil,
  HiFolder,
  HiShieldCheck,
  HiArrowRight,
  HiStar,
} from 'react-icons/hi';

// ─── Feature Data ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: HiVideoCamera,
    title: 'HD Video Calling',
    description:
      'Crystal-clear multi-user video conferences powered by WebRTC. No plugins, no downloads — runs entirely in your browser.',
    color: '#6366f1',
  },
  {
    icon: HiChat,
    title: 'Real-Time Chat',
    description:
      'Instant messaging with emoji support, typing indicators, and timestamped history — all synced live across participants.',
    color: '#22d3ee',
  },
  {
    icon: HiDesktopComputer,
    title: 'Screen Sharing',
    description:
      'Share your entire screen, a specific window, or a browser tab with one click. Perfect for presentations and demos.',
    color: '#a78bfa',
  },
  {
    icon: HiPencil,
    title: 'Collaborative Whiteboard',
    description:
      'A shared canvas that syncs in real time. Draw, annotate, and brainstorm together as if you were in the same room.',
    color: '#34d399',
  },
  {
    icon: HiFolder,
    title: 'File Sharing',
    description:
      'Upload and share documents, images, and files directly in your meeting. Preview and download with a single click.',
    color: '#fbbf24',
  },
  {
    icon: HiShieldCheck,
    title: 'Enterprise Security',
    description:
      'JWT authentication, bcrypt password hashing, Helmet headers, CORS, and rate limiting — built-in from day one.',
    color: '#f87171',
  },
];

const STATS = [
  { value: 'WebRTC', label: 'P2P Media' },
  { value: 'Socket.io', label: 'Real-Time Events' },
  { value: 'JWT', label: 'Secure Auth' },
  { value: 'MongoDB', label: 'Persistent Storage' },
];

// ─── Component ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ overflowX: 'hidden' }}>
      <Nav />
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

// ─── Navigation ────────────────────────────────────────────────────────────
function Nav() {
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
        padding: '16px 48px',
        background: 'rgba(10, 15, 30, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HiVideoCamera style={{ color: '#fff', fontSize: 18 }} />
        </div>
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

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        <a href="#features" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>
          Features
        </a>
        <a href="#security" style={{ color: 'var(--text-secondary)', fontSize: '14px', fontWeight: 500 }}>
          Security
        </a>
        <Link to="/login">
          <button className="btn btn-ghost" style={{ fontSize: '14px' }}>
            Sign In
          </button>
        </Link>
        <Link to="/register">
          <button className="btn btn-primary" style={{ fontSize: '14px' }}>
            Get Started Free
          </button>
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background glows */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          right: '5%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.14) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Badge */}
      <div
        className="animate-fade-in"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(99, 102, 241, 0.12)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          marginBottom: 32,
          fontSize: 13,
          color: 'var(--color-primary-light)',
          fontWeight: 600,
        }}
      >
        <HiStar style={{ fontSize: 14 }} />
        Production-Quality Portfolio Project
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-in"
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          maxWidth: 900,
          marginBottom: 24,
          animationDelay: '100ms',
        }}
      >
        Collaborate Without{' '}
        <span className="gradient-text">Boundaries</span>
      </h1>

      {/* Subheading */}
      <p
        className="animate-fade-in"
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: 640,
          lineHeight: 1.7,
          marginBottom: 48,
          animationDelay: '200ms',
        }}
      >
        NexMeet brings your team together with HD video calling, real-time chat,
        collaborative whiteboards, and instant file sharing — all in one secure platform.
      </p>

      {/* CTA Buttons */}
      <div
        className="animate-fade-in"
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', animationDelay: '300ms' }}
      >
        <Link to="/register">
          <button
            className="btn btn-primary animate-pulse-glow"
            style={{ fontSize: '16px', padding: '14px 32px' }}
          >
            Start for Free
            <HiArrowRight />
          </button>
        </Link>
        <Link to="/login">
          <button className="btn btn-outline" style={{ fontSize: '16px', padding: '14px 32px' }}>
            Sign In
          </button>
        </Link>
      </div>

      {/* Hero Visual — Mock Video Grid */}
      <div
        className="animate-fade-in glass-card"
        style={{
          marginTop: 72,
          width: '100%',
          maxWidth: 900,
          padding: 24,
          animationDelay: '500ms',
        }}
      >
        <MockVideoGrid />
      </div>
    </section>
  );
}

// Mock video grid to visualize the product
function MockVideoGrid() {
  const participants = [
    { name: 'Alex Chen', color: '#6366f1', speaking: true },
    { name: 'Sarah Kim', color: '#22d3ee', speaking: false },
    { name: 'James Roy', color: '#a78bfa', speaking: false },
    { name: 'Maya Patel', color: '#34d399', speaking: false },
  ];

  return (
    <div>
      {/* Meeting toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Meeting: <strong style={{ color: 'var(--text-primary)' }}>Weekly Standup</strong>
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>4 participants</span>
      </div>

      {/* Video tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {participants.map((p) => (
          <div
            key={p.name}
            style={{
              aspectRatio: '16/9',
              borderRadius: 'var(--radius-md)',
              background: `linear-gradient(135deg, ${p.color}22, ${p.color}11)`,
              border: p.speaking ? `2px solid ${p.color}` : '2px solid var(--glass-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              position: 'relative',
              transition: 'border-color 0.3s ease',
              boxShadow: p.speaking ? `0 0 20px ${p.color}33` : 'none',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${p.color}, ${p.color}99)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {p.name.charAt(0)}
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
              {p.name}
            </span>
            {p.speaking && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-end',
                }}
              >
                {[3, 6, 4, 7, 3].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: 3,
                      height: h,
                      borderRadius: 2,
                      background: p.color,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Stats Bar ──────────────────────────────────────────────────────────────
function StatsBar() {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '40px 48px',
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 24,
          textAlign: 'center',
        }}
      >
        {STATS.map((s) => (
          <div key={s.label}>
            <div
              className="gradient-text"
              style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Features ──────────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '100px 48px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 16 }}>
            Everything your team needs,{' '}
            <span className="gradient-text">in one place</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto' }}>
            Built from scratch with WebRTC, Socket.io, and React — no third-party media servers.
          </p>
        </div>

        {/* Feature grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  return (
    <div
      className="glass-card"
      style={{ padding: 28 }}
    >
      {/* Icon badge */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-md)',
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <Icon style={{ fontSize: 22, color }} />
      </div>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{description}</p>
    </div>
  );
}

// ─── CTA Section ───────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section id="security" style={{ padding: '80px 48px' }}>
      <div
        className="glass"
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '64px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, marginBottom: 16 }}>
          Ready to collaborate?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
          Create your account and start your first meeting in under 60 seconds.
          No credit card required.
        </p>
        <Link to="/register">
          <button
            className="btn btn-primary"
            style={{ fontSize: '16px', padding: '14px 40px' }}
          >
            Create Free Account
            <HiArrowRight />
          </button>
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        padding: '32px 48px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <HiVideoCamera style={{ color: 'var(--color-primary)', fontSize: 18 }} />
        <span style={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>NexMeet</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        Built with React · Node.js · WebRTC · Socket.io · MongoDB
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        Portfolio Project — Phase 1 / 15
      </p>
    </footer>
  );
}
