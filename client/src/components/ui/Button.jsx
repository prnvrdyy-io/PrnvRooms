/**
 * Button Component
 *
 * A single component that handles every button variant in the design system.
 * Using a single `variant` prop instead of multiple boolean flags avoids
 * impossible states (e.g. variant="primary" AND variant="danger" simultaneously).
 *
 * Props:
 *  variant   — 'primary' | 'outline' | 'ghost' | 'danger' | 'success'
 *  size      — 'sm' | 'md' | 'lg'
 *  isLoading — shows spinner, disables click
 *  leftIcon  — React element (icon) before the label
 *  rightIcon — React element (icon) after the label
 *  fullWidth — stretches to fill container
 *  ...rest   — forwarded to <button> (onClick, disabled, type, etc.)
 */

import { Spinner } from './Spinner';

const VARIANT_CLASSES = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost:   'btn-ghost',
  danger:  'btn-danger',
  success: 'btn-success',
};

const SIZE_STYLES = {
  sm: { padding: '6px 14px', fontSize: '13px', gap: '6px' },
  md: { padding: '10px 20px', fontSize: '14px', gap: '8px' },
  lg: { padding: '13px 28px', fontSize: '16px', gap: '10px' },
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style = {},
  className = '',
  ...rest
}) {
  return (
    <button
      className={`btn ${VARIANT_CLASSES[variant] || 'btn-primary'} ${className}`}
      disabled={isLoading || rest.disabled}
      style={{
        ...SIZE_STYLES[size],
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
      {...rest}
    >
      {isLoading ? (
        <Spinner size={size === 'sm' ? 14 : 16} />
      ) : (
        leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>
      )}
    </button>
  );
}
