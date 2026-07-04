/**
 * Landing Page — PrnvRooms
 *
 * Premium SaaS landing page inspired by Linear, Vercel, and Notion.
 * Light mode, clean typography, minimal animations.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Video, MessageSquare, Monitor, PenTool, FolderOpen,
  ShieldCheck, ArrowRight, ExternalLink, Zap, Users, Check,
  ChevronRight, Star
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

// ─── Data ──────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Video,
    title: 'HD Video Meetings',
    description: 'Crystal-clear peer-to-peer video powered by WebRTC. No downloads, no plugins — runs entirely in your browser.',
  },
  {
    icon: MessageSquare,
    title: 'Real-Time Chat',
    description: 'Instant messaging that syncs live across all participants. Messages persist through the duration of your meeting.',
  },
  {
    icon: Monitor,
    title: 'Screen Sharing',
    description: 'Share your entire screen, a specific window, or a browser tab with a single click — perfect for demos and collaboration.',
  },
  {
    icon: PenTool,
    title: 'Collaborative Whiteboard',
    description: 'A shared canvas that syncs in real time. Draw, annotate, and brainstorm together as if you were in the same room.',
  },
  {
    icon: FolderOpen,
    title: 'File Sharing',
    description: 'Share documents and files directly within your meeting — no third-party services, all handled in-browser.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security',
    description: 'JWT authentication, bcrypt hashing, Helmet headers, CORS, and rate limiting built-in from day one.',
  },
];

const TECH_STACK = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Node.js', color: '#8CC84B' },
  { name: 'WebRTC', color: '#F59E0B' },
  { name: 'Socket.io', color: '#010101' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Express', color: '#64748B' },
];

const PARTICIPANTS = [
  { initials: 'AC', color: '#2563EB', name: 'Alex Chen', speaking: true },
  { initials: 'SK', color: '#7C3AED', name: 'Sarah Kim', speaking: false },
  { initials: 'JR', color: '#059669', name: 'James Roy', speaking: false },
  { initials: 'MP', color: '#D97706', name: 'Maya Patel', speaking: false },
];

// ─── Fade animation variant ─────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] },
});

// ─── Component ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg-surface)', overflowX: 'hidden' }}>
      <Navbar user={null} />
      <HeroSection />
      <TechBadgeSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        minHeight: '100vh',
        paddingTop: 100,
        paddingBottom: 80,
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, #E2E8F0 1px, transparent 0)`,
          backgroundSize: '40px 40px',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />
      {/* Blue glow top-right */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 32px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
        }}
      >
        {/* Left — Text */}
        <div>
          {/* Badge */}
          <motion.div
            {...fadeUp(0)}
            style={{ marginBottom: 24 }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 12px',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                borderRadius: 'var(--radius-full)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.02em',
                border: '1px solid #BFDBFE',
              }}
            >
              <Star size={11} fill="currentColor" />
              Open Source Portfolio Project
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.05)}
            style={{
              fontSize: 'clamp(36px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              marginBottom: 24,
            }}
          >
            Meet.{' '}
            <span style={{ color: 'var(--color-primary)' }}>Collaborate.</span>
            <br />
            Create.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            {...fadeUp(0.1)}
            style={{
              fontSize: 18,
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: 40,
              maxWidth: 480,
            }}
          >
            PrnvRooms brings your team together with HD video calling, real-time chat,
            and collaborative tools — all in one secure, open platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.15)}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <Link to="/register">
              <button
                className="btn btn-primary btn-lg"
                style={{ fontSize: 15, padding: '13px 24px' }}
              >
                Get started free
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/login">
              <button
                className="btn btn-outline btn-lg"
                style={{ fontSize: 15, padding: '13px 24px' }}
              >
                Sign in
              </button>
            </Link>
          </motion.div>

          {/* Social proof line */}
          <motion.div
            {...fadeUp(0.2)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 32,
              fontSize: 13,
              color: 'var(--text-muted)',
            }}
          >
            <Check size={14} color="var(--color-success)" strokeWidth={2.5} />
            No credit card required
            <span style={{ margin: '0 4px', color: 'var(--border-strong)' }}>·</span>
            <Check size={14} color="var(--color-success)" strokeWidth={2.5} />
            No download needed
            <span style={{ margin: '0 4px', color: 'var(--border-strong)' }}>·</span>
            <Check size={14} color="var(--color-success)" strokeWidth={2.5} />
            Open source
          </motion.div>
        </div>

        {/* Right — Product mockup */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <MeetingMockup />
        </motion.div>
      </div>
    </section>
  );
}

// ─── Meeting mockup card ──────────────────────────────────────────────────────
function MeetingMockup() {
  const [speaking, setSpeaking] = useState(0);

  return (
    <div
      style={{
        background: '#0D1117',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        boxShadow: '0 32px 64px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57', '#FFBD2E', '#28CA42'].map((c, i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 6,
            padding: '4px 10px',
            fontSize: 11,
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace',
          }}
        >
          prnvrooms.app/meeting/weekly-standup
        </div>
      </div>

      {/* Meeting header */}
      <div
        style={{
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            Weekly Standup
          </span>
        </div>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          {PARTICIPANTS.length} participants
        </span>
      </div>

      {/* Video grid */}
      <div style={{ padding: '0 12px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {PARTICIPANTS.map((p, i) => (
          <div
            key={p.name}
            onClick={() => setSpeaking(i)}
            style={{
              aspectRatio: '4/3',
              borderRadius: 12,
              background: `linear-gradient(135deg, ${p.color}22, ${p.color}0a)`,
              border: `1.5px solid ${speaking === i ? p.color : 'rgba(255,255,255,0.06)'}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
              boxShadow: speaking === i ? `0 0 0 2px ${p.color}40` : 'none',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: p.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 17,
                fontWeight: 700,
                color: '#fff',
                marginBottom: 6,
              }}
            >
              {p.initials}
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
              {p.name}
            </span>

            {/* Speaking indicator */}
            {speaking === i && (
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
                {[3, 6, 4, 7, 3].map((h, j) => (
                  <div
                    key={j}
                    style={{
                      width: 2.5,
                      height: h,
                      borderRadius: 2,
                      background: p.color,
                      animation: `pulse 0.${6 + j}s ease-in-out infinite`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Control bar mock */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        {['🎤', '📷', '🖥', '💬'].map((icon, i) => (
          <div
            key={i}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: i === 3 ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255,255,255,0.07)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 15,
              cursor: 'pointer',
            }}
          >
            {icon}
          </div>
        ))}
        <div
          style={{
            width: 38, height: 38,
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          📵
        </div>
      </div>
    </div>
  );
}

// ─── Tech Badge Section ───────────────────────────────────────────────────────
function TechBadgeSection() {
  return (
    <div
      style={{
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-secondary)',
        padding: '24px 32px',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Built with
        </span>
        {TECH_STACK.map((tech) => (
          <div
            key={tech.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: tech.color,
                flexShrink: 0,
              }}
            />
            {tech.name}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="features" style={{ padding: '100px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 64 }}
        >
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 12,
            }}
          >
            Everything you need
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              marginBottom: 16,
            }}
          >
            Built for real collaboration
          </h2>
          <p
            style={{
              fontSize: 17,
              color: 'var(--text-secondary)',
              maxWidth: 520,
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Built from scratch with WebRTC and Socket.io — no third-party media servers or monthly fees.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: 24,
          }}
        >
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -2 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 28px',
        cursor: 'default',
        transition: 'box-shadow var(--transition-slow)',
      }}
      onHoverStart={e => { e.target.style.boxShadow = 'var(--shadow-lg)'; }}
      onHoverEnd={e => { e.target.style.boxShadow = 'none'; }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: 'var(--color-primary-light)',
          border: '1px solid #BFDBFE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          color: 'var(--color-primary)',
        }}
      >
        <Icon size={20} strokeWidth={2} />
      </div>
      <h3
        style={{
          fontSize: 16,
          fontWeight: 700,
          marginBottom: 10,
          color: 'var(--text-primary)',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section style={{ padding: '80px 32px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: 800,
          margin: '0 auto',
          background: 'var(--color-primary)',
          borderRadius: 24,
          padding: '72px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Get started for free
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              marginBottom: 16,
            }}
          >
            Start your first meeting in 60 seconds
          </h2>
          <p
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.7)',
              marginBottom: 40,
              lineHeight: 1.6,
            }}
          >
            No credit card required. No downloads. Just sign up and start collaborating.
          </p>
          <Link to="/register">
            <button
              className="btn btn-xl"
              style={{
                background: '#fff',
                color: 'var(--color-primary)',
                border: 'none',
                fontSize: 15,
                fontWeight: 700,
              }}
            >
              Create free account
              <ChevronRight size={18} />
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-default)',
        padding: '32px 32px',
        background: 'var(--bg-surface)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Video size={14} color="#fff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            PrnvRooms
          </span>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Built with React · Node.js · WebRTC · Socket.io · MongoDB
        </p>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'color var(--transition-fast)',
          }}
        >
          <ExternalLink size={16} />
          View on GitHub
        </a>
      </div>
    </footer>
  );
}
