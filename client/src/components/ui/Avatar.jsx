/**
 * Avatar — PrnvRooms Design System
 *
 * Renders initials or profile image in a circular container.
 * Updated for light theme with modern color palette.
 */

const SIZES = {
  xs:  { size: 24, fontSize: 10 },
  sm:  { size: 30, fontSize: 12 },
  md:  { size: 40, fontSize: 15 },
  lg:  { size: 52, fontSize: 19 },
  xl:  { size: 72, fontSize: 26 },
};

const COLORS = [
  { bg: '#EFF6FF', color: '#1D4ED8' },
  { bg: '#F5F3FF', color: '#6D28D9' },
  { bg: '#F0FDF4', color: '#15803D' },
  { bg: '#FFFBEB', color: '#B45309' },
  { bg: '#FEF2F2', color: '#B91C1C' },
  { bg: '#F0FDFA', color: '#0F766E' },
];

function getColorIndex(name = '') {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % COLORS.length;
  return hash;
}

function getInitials(name = '') {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name = '', src, size = 'md', online = false, style = {} }) {
  const { size: px, fontSize } = SIZES[size] || SIZES.md;
  const colorIdx = getColorIndex(name);
  const palette  = COLORS[colorIdx];
  const initials = getInitials(name);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...style }}>
      {src ? (
        <img
          src={src}
          alt={name}
          style={{
            width: px,
            height: px,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--border-default)',
          }}
        />
      ) : (
        <div
          style={{
            width: px,
            height: px,
            borderRadius: '50%',
            background: palette.bg,
            border: `1.5px solid ${palette.bg}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: palette.color,
            fontSize,
            fontWeight: 700,
            fontFamily: 'Inter, system-ui, sans-serif',
            userSelect: 'none',
            flexShrink: 0,
          }}
          aria-label={name}
        >
          {initials}
        </div>
      )}

      {online && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: px * 0.28,
            height: px * 0.28,
            borderRadius: '50%',
            background: '#22C55E',
            border: `2px solid var(--bg-surface)`,
          }}
        />
      )}
    </div>
  );
}
