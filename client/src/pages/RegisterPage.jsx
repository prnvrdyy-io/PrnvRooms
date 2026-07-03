/**
 * Register Page — PrnvRooms
 *
 * Same split-layout AuthLayout. Business logic 100% unchanged.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';

const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const STRENGTH_CONFIG = [
  { label: 'Very weak', color: '#EF4444' },
  { label: 'Weak',      color: '#F97316' },
  { label: 'Fair',      color: '#F59E0B' },
  { label: 'Good',      color: '#22C55E' },
  { label: 'Strong',    color: '#10B981' },
];

export default function RegisterPage() {
  const { register } = useAuth();

  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors]     = useState({});
  const [isLoading, setIsLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError]     = useState('');
  const [apiErrors, setApiErrors]   = useState([]);

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthConfig   = STRENGTH_CONFIG[passwordStrength];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username))
      newErrors.username = 'Username: 3-30 chars, letters/numbers/underscores';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
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
      if (data?.errors?.length) setApiErrors(data.errors);
      else setApiError(data?.message || 'Registration failed. Please try again.');
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
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Create your account
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            Start collaborating in under a minute
          </p>
        </div>

        {/* API Error banner */}
        {(apiError || apiErrors.length > 0) && (
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
            }}
          >
            {apiError && <p>⚠ {apiError}</p>}
            {apiErrors.map((e, i) => <p key={i}>⚠ {e.message}</p>)}
          </motion.div>
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
              leftIcon={<User size={16} />}
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
              leftIcon={<Mail size={16} />}
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
                leftIcon={<Lock size={16} />}
                autoComplete="new-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 4,
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              {/* Password strength bar */}
              {formData.password && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 2,
                          background: i < passwordStrength ? strengthConfig.color : 'var(--border-default)',
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
              leftIcon={<Lock size={16} />}
              autoComplete="new-password"
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
              size="lg"
              style={{ marginTop: 4 }}
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </Button>
          </div>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            margin: '24px 0',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border-default)' }} />
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
