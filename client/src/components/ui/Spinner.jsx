/**
 * Spinner — PrnvRooms Design System
 */
export function Spinner({ size = 20, color = 'currentColor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
      aria-label="Loading"
      role="status"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

export function PageLoader({ message = 'Loading...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 16,
        background: 'var(--bg-default)',
      }}
    >
      <div style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '3px solid var(--border-default)',
        borderTopColor: 'var(--color-primary)',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>{message}</p>
    </div>
  );
}
