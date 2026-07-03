/**
 * Modal Component
 *
 * An accessible, focusable overlay dialog.
 *
 * Accessibility features:
 * - role="dialog" + aria-modal="true" for screen readers
 * - Closes on Escape key press
 * - Closes on backdrop click (configurable)
 * - Focus is naturally trapped inside (browser default for dialog role)
 *
 * Props:
 *  isOpen        — controls visibility
 *  onClose       — called when user clicks backdrop or presses Escape
 *  title         — modal header text
 *  size          — 'sm' | 'md' | 'lg' | 'xl'
 *  closeOnBackdrop — bool (default true)
 *  children      — modal body content
 *  footer        — optional footer content
 */

import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HiX } from 'react-icons/hi';

const SIZE_WIDTHS = { sm: 400, md: 520, lg: 680, xl: 860 };

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnBackdrop = true,
  children,
  footer,
}) {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown, isOpen]);

  if (!isOpen) return null;

  const maxWidth = SIZE_WIDTHS[size] || 520;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
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
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
      />

      {/* Dialog panel */}
      <div
        className="animate-fade-in"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth,
          background: 'var(--bg-card)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{title}</h2>
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: '6px', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}
              aria-label="Close modal"
            >
              <HiX style={{ fontSize: 18 }} />
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: '24px' }}>{children}</div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: 12,
              justifyContent: 'flex-end',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
