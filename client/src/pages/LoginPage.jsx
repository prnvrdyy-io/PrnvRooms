/**
 * Login Page — PrnvRooms
 *
 * Clean, minimal form on the right panel of the split AuthLayout.
 * Business logic unchanged — only visual redesign.
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();

  const [formData, setFormData]     = useState({ email: '', password: '' });
  const [errors, setErrors]         = useState({});
  const [isLoading, setIsLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError]     = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      await login(formData);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
      >
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Sign in to continue to PrnvRooms
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-danger-light)',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            ⚠ {apiError}
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Input
              label="Email address"
              type="email"
              name="email"
              id="login-email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              leftIcon={<Mail size={16} />}
              autoComplete="email"
              autoFocus
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="login-password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftIcon={<Lock size={16} />}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4,
                    borderRadius: 4,
                    transition: 'color var(--transition-fast)',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
              size="lg"
              style={{ marginTop: 4 }}
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </div>
        </form>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '28px 0',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
        </div>

        {/* Footer link */}
        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Create one free
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
