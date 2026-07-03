/**
 * Input — PrnvRooms Design System
 *
 * Clean, accessible input with icon support, error states, and hints.
 * Updated to use Lucide React icons and new design system tokens.
 */

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

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
    className = '',
    ...rest
  },
  ref
) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-secondary)',
            letterSpacing: '0.01em',
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: 12,
              color: error ? 'var(--color-danger)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {leftIcon}
          </span>
        )}

        {multiline ? (
          <textarea
            ref={ref}
            id={inputId}
            className={`input ${error ? 'input-error' : ''} ${className}`}
            rows={rows}
            style={{
              paddingLeft: leftIcon ? '42px' : undefined,
              paddingRight: rightElement ? '48px' : undefined,
              resize: 'vertical',
              lineHeight: 1.6,
            }}
            {...rest}
          />
        ) : (
          <input
            ref={ref}
            id={inputId}
            className={`input ${error ? 'input-error' : ''} ${className}`}
            style={{
              paddingLeft: leftIcon ? '42px' : undefined,
              paddingRight: rightElement ? '48px' : undefined,
            }}
            {...rest}
          />
        )}

        {rightElement && (
          <span
            style={{
              position: 'absolute',
              right: 12,
              display: 'flex',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            {rightElement}
          </span>
        )}
      </div>

      {error && (
        <span
          style={{
            fontSize: 12,
            color: 'var(--color-danger)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontWeight: 500,
          }}
        >
          <AlertCircle size={12} />
          {error}
        </span>
      )}

      {!error && hint && (
        <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
});
