/**
 * Button — PrnvRooms Design System
 * 
 * Clean, professional button component matching the new light SaaS design.
 * Uses CSS classes from index.css for all styling.
 */

import { Spinner } from './Spinner';

const VARIANT_MAP = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  outline:   'btn-outline',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
  success:   'btn-success',
};

const SIZE_MAP = {
  xs: 'btn-sm',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  iconOnly = false,
  style = {},
  className = '',
  ...rest
}) {
  const variantClass = VARIANT_MAP[variant] || 'btn-primary';
  const sizeClass    = SIZE_MAP[size] || 'btn-md';
  const widthClass   = fullWidth ? 'btn-full' : '';
  const iconClass    = iconOnly ? 'btn-icon' : '';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${iconClass} ${className}`}
      disabled={isLoading || rest.disabled}
      style={style}
      {...rest}
    >
      {isLoading ? (
        <Spinner size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
      ) : (
        leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>
      )}
      {!iconOnly && children}
      {iconOnly && !isLoading && (leftIcon || children)}
      {!isLoading && !iconOnly && rightIcon && (
        <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>
      )}
    </button>
  );
}
