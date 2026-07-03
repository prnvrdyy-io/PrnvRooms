/**
 * Spinner Component
 * A lightweight, accessible loading indicator using a pure CSS animation.
 * Used inline within Button (isLoading) and as a standalone page loader.
 */

export function Spinner({ size = 20, color = 'currentColor', style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin"
      aria-label="Loading"
      role="status"
      style={style}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.416"
        strokeDashoffset="10"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Full-page loading overlay
 */
export function PageLoader({ message = 'Loading...' }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: 'var(--bg-base)',
        zIndex: 'var(--z-modal)',
      }}
    >
      <Spinner size={40} color="var(--color-primary)" />
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{message}</p>
    </div>
  );
}
