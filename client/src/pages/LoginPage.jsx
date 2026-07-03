/**
 * Login Page
 *
 * Features:
 * - Email + password form with validation
 * - Show/hide password toggle
 * - Loading state with spinner
 * - Error handling from API
 * - Redirect-aware: goes back to the original URL after login
 * - Link to Register
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiVideoCamera } from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
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
      // AuthContext handles the redirect
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setApiError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HiVideoCamera style={{ color: '#fff', fontSize: 18 }} />
        </div>
        <span
          style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            fontFamily: "'Space Grotesk', sans-serif",
            background: 'linear-gradient(135deg, #fff, var(--color-primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          NexMeet
        </span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>Welcome back</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Sign in to continue to your meetings
        </p>
      </div>

      {/* API Error Banner */}
      {apiError && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          ⚠ {apiError}
        </div>
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
            leftIcon={<HiMail />}
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
            leftIcon={<HiLockClosed />}
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
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiEyeOff fontSize={16} /> : <HiEye fontSize={16} />}
              </button>
            }
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            style={{ marginTop: 4, padding: '13px' }}
          >
            {isLoading ? 'Signing in…' : 'Sign In'}
          </Button>
        </div>
      </form>

      {/* Footer links */}
      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--text-muted)',
        }}
      >
        Don't have an account?{' '}
        <Link
          to="/register"
          style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}
        >
          Sign up free
        </Link>
      </div>
    </AuthLayout>
  );
}
