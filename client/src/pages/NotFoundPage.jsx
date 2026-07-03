/**
 * NotFoundPage — PrnvRooms
 *
 * Premium 404 page.
 */

import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-default)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={{ textAlign: 'center', maxWidth: 480 }}
      >
        {/* 404 */}
        <p
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: 'var(--border-default)',
            lineHeight: 1,
            letterSpacing: '-0.05em',
            marginBottom: 16,
            userSelect: 'none',
          }}
        >
          404
        </p>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginBottom: 12,
          }}
        >
          Page not found
        </h1>

        <p
          style={{
            fontSize: 16,
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline btn-lg"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <Link to="/">
            <button className="btn btn-primary btn-lg">
              <Home size={16} />
              Home
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
