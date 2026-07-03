/**
 * Avatar Component
 *
 * Displays a user's profile image with a graceful fallback to
 * coloured initials when no image is available. The colour is
 * deterministically derived from the user's name so it's always
 * consistent across sessions and page reloads.
 *
 * Props:
 *  src     — image URL (optional)
 *  name    — full name (used for initials + background colour)
 *  size    — number (pixel diameter) or preset: 'sm'|'md'|'lg'|'xl'
 *  online  — boolean (shows green online dot)
 *  style   — additional inline styles
 */

import { getInitials, getAvatarColor } from '@/utils/helpers';

const SIZE_MAP = { sm: 28, md: 36, lg: 48, xl: 64 };

export function Avatar({ src, name = '', size = 'md', online, style = {} }) {
  const diameter = typeof size === 'number' ? size : SIZE_MAP[size] || 36;
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  const fontSize = Math.floor(diameter * 0.38);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Image or initials circle */}
      <div
        title={name}
        style={{
          width: diameter,
          height: diameter,
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: src ? 'transparent' : bgColor,
          border: '2px solid var(--glass-border)',
          flexShrink: 0,
          userSelect: 'none',
        }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // If image fails to load, hide it and show initials
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <span
            style={{
              fontSize,
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            {initials}
          </span>
        )}
      </div>

      {/* Online status dot */}
      {online !== undefined && (
        <span
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: Math.max(8, Math.floor(diameter * 0.25)),
            height: Math.max(8, Math.floor(diameter * 0.25)),
            borderRadius: '50%',
            background: online ? 'var(--color-success)' : 'var(--text-muted)',
            border: '2px solid var(--bg-base)',
          }}
        />
      )}
    </div>
  );
}

/**
 * AvatarGroup — renders overlapping avatars for a list of users
 */
export function AvatarGroup({ users = [], max = 4, size = 'sm' }) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;
  const diameter = typeof size === 'number' ? size : SIZE_MAP[size] || 28;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {visible.map((user, i) => (
        <div
          key={user._id || i}
          style={{
            marginLeft: i === 0 ? 0 : -(diameter * 0.3),
            zIndex: visible.length - i,
            position: 'relative',
          }}
        >
          <Avatar name={user.username || user.name} src={user.profileImage} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{
            marginLeft: -(diameter * 0.3),
            width: diameter,
            height: diameter,
            borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: '2px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-secondary)',
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
