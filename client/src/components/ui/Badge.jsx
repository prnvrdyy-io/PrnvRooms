/**
 * Badge — PrnvRooms Design System
 *
 * Updated to light theme palette.
 */

const BADGE_COLORS = {
  success: { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  warning: { bg: '#FFFBEB', color: '#92400E', border: '#FDE68A' },
  danger:  { bg: '#FEF2F2', color: '#B91C1C', border: '#FECACA' },
  info:    { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  primary: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  default: { bg: '#F1F5F9', color: '#64748B', border: '#E2E8F0' },
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
        padding: isSmall ? '2px 8px' : '4px 10px',
        borderRadius: 'var(--radius-full)',
        background: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        letterSpacing: '0.01em',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

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
