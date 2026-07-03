/**
 * Badge Component
 *
 * Used for: status indicators, participant counts, notification dots,
 * meeting state labels, file type labels, etc.
 *
 * Props:
 *  variant  — 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary'
 *  dot      — boolean (renders as a small coloured circle, no text)
 *  size     — 'sm' | 'md'
 */

const BADGE_COLORS = {
  success: { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80', border: 'rgba(34,197,94,0.3)' },
  warning: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  danger:  { bg: 'rgba(239,68,68,0.15)',  color: '#f87171', border: 'rgba(239,68,68,0.3)' },
  info:    { bg: 'rgba(34,211,238,0.15)', color: '#22d3ee', border: 'rgba(34,211,238,0.3)' },
  primary: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8', border: 'rgba(99,102,241,0.3)' },
  default: { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' },
};

export function Badge({ children, variant = 'default', dot = false, size = 'md', style = {} }) {
  const colors = BADGE_COLORS[variant] || BADGE_COLORS.default;
  const isSmall = size === 'sm';

  if (dot) {
    return (
      <span
        style={{
          display: 'inline-block',
          width: isSmall ? 6 : 8,
          height: isSmall ? 6 : 8,
          borderRadius: '50%',
          background: colors.color,
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: isSmall ? '2px 8px' : '3px 10px',
        borderRadius: 'var(--radius-full)',
        background: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/**
 * StatusBadge — convenience wrapper for user online status
 */
export function StatusBadge({ status }) {
  const map = {
    online:  { variant: 'success', label: 'Online' },
    away:    { variant: 'warning', label: 'Away' },
    busy:    { variant: 'danger',  label: 'Busy' },
    offline: { variant: 'default', label: 'Offline' },
  };
  const { variant, label } = map[status] || map.offline;
  return <Badge variant={variant} size="sm">{label}</Badge>;
}
