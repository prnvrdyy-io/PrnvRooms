/**
 * Input Component
 *
 * Wraps a <label>, <input> (or <textarea>), and error message into a
 * single composable unit. This prevents the common mistake of having
 * labels and inputs disconnected in the DOM — critical for accessibility.
 *
 * Props:
 *  label       — Field label text
 *  error       — Error string (shows red border + message)
 *  hint        — Helper text below the input
 *  leftIcon    — React element shown inside left side of input
 *  rightElement — React element on the right (e.g. show/hide password button)
 *  multiline   — Renders <textarea> instead of <input>
 *  rows        — textarea rows (default 4)
 *  ...rest     — forwarded to <input> / <textarea>
 */

import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightElement,
    multiline = false,
    rows = 4,
    id,
    style = {},
    ...rest
  },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

  const inputStyle = {
    paddingLeft: leftIcon ? '42px' : undefined,
    paddingRight: rightElement ? '48px' : undefined,
    borderColor: error ? 'var(--color-danger)' : undefined,
    boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.15)' : undefined,
    ...style,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            letterSpacing: '0.02em',
          }}
        >
          {label}
        </label>
      )}

      {/* Input wrapper */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {/* Left icon */}
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: 14,
              color: error ? 'var(--color-danger)' : 'var(--text-muted)',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {leftIcon}
          </span>
        )}

        {/* Input or Textarea */}
        {multiline ? (
          <textarea
            ref={ref}
            id={inputId}
            className="input"
            rows={rows}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            {...rest}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            className="input"
            style={inputStyle}
            {...rest}
          />
        )}

        {/* Right element (e.g. show-password icon) */}
        {rightElement && (
          <span
            style={{
              position: 'absolute',
              right: 12,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightElement}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <span style={{ fontSize: 12, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: 4 }}>
          ⚠ {error}
        </span>
      )}

      {/* Hint */}
      {!error && hint && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span>
      )}
    </div>
  );
});
