/**
 * Register Page
 *
 * Features:
 * - Username, Email, Password, Confirm Password
 * - Real-time field validation
 * - Password strength indicator
 * - Show/hide password toggle
 * - Terms acknowledgement checkbox
 * - API error display
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiVideoCamera } from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Password strength scorer
const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
};

const STRENGTH_CONFIG = [
  { label: 'Very Weak', color: '#ef4444' },
  { label: 'Weak',      color: '#f97316' },
  { label: 'Fair',      color: '#f59e0b' },
  { label: 'Good',      color: '#22c55e' },
  { label: 'Strong',    color: '#10b981' },
];

export default function RegisterPage() {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiErrors, setApiErrors] = useState([]); // field-level errors from server

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthConfig = STRENGTH_CONFIG[passwordStrength];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username)) {
      newErrors.username = 'Username must be 3-30 chars, letters/numbers/underscores only';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');
    setApiErrors([]);

    try {
      const { username, email, password } = formData;
      await register({ username, email, password });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors?.length) {
        setApiErrors(data.errors);
      } else {
        setApiError(data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
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

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>Create account</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Join NexMeet and start collaborating in minutes
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
            marginBottom: 16,
          }}
        >
          ⚠ {apiError}
        </div>
      )}

      {/* Server field errors */}
      {apiErrors.length > 0 && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            marginBottom: 16,
          }}
        >
          {apiErrors.map((err, i) => (
            <p key={i} style={{ color: '#f87171', fontSize: 13, margin: '2px 0' }}>
              ⚠ {err.message}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Input
            label="Username"
            type="text"
            name="username"
            id="register-username"
            placeholder="e.g. alex_chen"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            leftIcon={<HiUser />}
            hint="Letters, numbers, underscores — 3 to 30 characters"
            autoComplete="username"
            autoFocus
          />

          <Input
            label="Email address"
            type="email"
            name="email"
            id="register-email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            leftIcon={<HiMail />}
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="register-password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              leftIcon={<HiLockClosed />}
              autoComplete="new-password"
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

            {/* Password strength bar */}
            {formData.password && (
              <div style={{ marginTop: 8 }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    marginBottom: 4,
                  }}
                >
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: 3,
                        borderRadius: 2,
                        background: i < passwordStrength
                          ? strengthConfig.color
                          : 'var(--border-default)',
                        transition: 'background 0.2s ease',
                      }}
                    />
                  ))}
                </div>
                <span style={{ fontSize: 12, color: strengthConfig.color, fontWeight: 600 }}>
                  {strengthConfig.label}
                </span>
              </div>
            )}
          </div>

          <Input
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            id="register-confirm-password"
            placeholder="Repeat your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            leftIcon={<HiLockClosed />}
            autoComplete="new-password"
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            style={{ marginTop: 4, padding: '13px' }}
          >
            {isLoading ? 'Creating account…' : 'Create Account'}
          </Button>
        </div>
      </form>

      <div
        style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 14,
          color: 'var(--text-muted)',
        }}
      >
        Already have an account?{' '}
        <Link
          to="/login"
          style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}
        >
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
