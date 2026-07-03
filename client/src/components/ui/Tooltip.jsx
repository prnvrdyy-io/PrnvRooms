/**
 * Tooltip Component
 *
 * Lightweight hover tooltip for icon buttons and other elements
 * where labelling the control via visible text isn't practical.
 * Pure CSS-based — no third-party dependencies.
 *
 * Props:
 *  text      — tooltip label string
 *  position  — 'top' | 'bottom' | 'left' | 'right' (default: 'top')
 *  children  — the element the tooltip wraps
 */

export function Tooltip({ text, position = 'top', children }) {
  const positionStyles = {
    top:    { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top:    'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' },
    left:   { right:  'calc(100% + 8px)', top:  '50%', transform: 'translateY(-50%)' },
    right:  { left:   'calc(100% + 8px)', top:  '50%', transform: 'translateY(-50%)' },
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      role="group"
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: 'absolute',
          ...positionStyles[position],
          background: 'var(--bg-elevated)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-sm)',
          padding: '5px 10px',
          fontSize: 12,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity var(--transition-fast)',
          zIndex: 'var(--z-dropdown)',
          boxShadow: 'var(--shadow-sm)',
        }}
        className="tooltip-text"
      >
        {text}
      </span>

      <style>{`
        div:hover > .tooltip-text { opacity: 1 !important; }
      `}</style>
    </div>
  );
}

/**
 * IconButton — circular button optimised for icons, with built-in Tooltip
 */
export function IconButton({ icon, label, onClick, variant = 'ghost', size = 36, active = false, danger = false, style = {} }) {
  const bg = active
    ? 'rgba(99, 102, 241, 0.2)'
    : danger
    ? 'rgba(239, 68, 68, 0.15)'
    : 'var(--glass-bg)';

  const color = active
    ? 'var(--color-primary-light)'
    : danger
    ? 'var(--color-danger)'
    : 'var(--text-secondary)';

  return (
    <Tooltip text={label} position="top">
      <button
        onClick={onClick}
        aria-label={label}
        title={label}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '1px solid',
          borderColor: active
            ? 'rgba(99, 102, 241, 0.4)'
            : danger
            ? 'rgba(239, 68, 68, 0.3)'
            : 'var(--border-default)',
          background: bg,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: size * 0.44,
          transition: 'all var(--transition-fast)',
          flexShrink: 0,
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = active
            ? 'rgba(99, 102, 241, 0.3)'
            : danger
            ? 'rgba(239, 68, 68, 0.25)'
            : 'var(--bg-elevated)';
          e.currentTarget.style.color = 'var(--text-primary)';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = bg;
          e.currentTarget.style.color = color;
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
