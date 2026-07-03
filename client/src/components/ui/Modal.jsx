/**
 * Modal — PrnvRooms Design System
 *
 * Clean light-mode modal with Framer Motion animation.
 */

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIZE_WIDTHS = { sm: 420, md: 540, lg: 700, xl: 880 };

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnBackdrop = true,
  children,
  footer,
}) {
  const handleKeyDown = useCallback(
    (e) => { if (e.key === 'Escape' && isOpen) onClose?.(); },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown, isOpen]);

  const maxWidth = SIZE_WIDTHS[size] || 540;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 'var(--z-modal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          {/* Backdrop */}
          <div
            onClick={closeOnBackdrop ? onClose : undefined}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(4px)',
            }}
          />

          {/* Dialog panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth,
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-2xl)',
              overflow: 'hidden',
            }}
          >
            {title && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px',
                  borderBottom: '1px solid var(--border-default)',
                }}
              >
                <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h2>
                <button
                  onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                    background: 'transparent', border: 'none',
                    color: 'var(--text-muted)', cursor: 'pointer',
                    transition: 'all var(--transition-base)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <div style={{ padding: '24px' }}>{children}</div>

            {footer && (
              <div
                style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--border-default)',
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'flex-end',
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
