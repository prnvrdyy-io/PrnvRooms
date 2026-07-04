/**
 * Profile Page — PrnvRooms
 *
 * Sections:
 *  1. Profile card — avatar with color picker, name, join date, stats
 *  2. Edit profile — update username / email
 *  3. Change password — current + new password with strength bar
 *  4. Danger zone — delete account with confirmation modal
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Eye, EyeOff, Save, ShieldAlert,
  Calendar, Video, Check, AlertTriangle, ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { userService } from '@/services/userService';

// ─── Avatar Color Palette ─────────────────────────────────────────────────────
const AVATAR_COLORS = [
  { hex: '#2563EB', label: 'Blue' },
  { hex: '#7C3AED', label: 'Violet' },
  { hex: '#059669', label: 'Emerald' },
  { hex: '#D97706', label: 'Amber' },
  { hex: '#DC2626', label: 'Red' },
  { hex: '#0891B2', label: 'Cyan' },
  { hex: '#DB2777', label: 'Pink' },
  { hex: '#65A30D', label: 'Lime' },
];

// ─── Password strength ────────────────────────────────────────────────────────
const getStrength = (p) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};
const STRENGTH = [
  { label: 'Very weak', color: '#EF4444' },
  { label: 'Weak',      color: '#F97316' },
  { label: 'Fair',      color: '#F59E0B' },
  { label: 'Good',      color: '#22C55E' },
  { label: 'Strong',    color: '#10B981' },
];

// ─── Section card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, description, children }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-default)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {title}
        </h2>
        {description && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{description}</p>
        )}
      </div>
      <div style={{ padding: '24px' }}>{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [profileData, setProfileData] = useState({ meetingsHosted: 0, createdAt: null });
  const [selectedColor, setSelectedColor] = useState(user?.avatarColor || '#2563EB');

  // Edit profile form
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Load profile stats
  useEffect(() => {
    (async () => {
      try {
        const res = await userService.getProfile();
        const u = res.data.data.user;
        setProfileData({ meetingsHosted: u.meetingsHosted || 0, createdAt: u.createdAt });
        setSelectedColor(u.avatarColor || '#2563EB');
      } catch {
        // silently ignore
      }
    })();
  }, []);

  const getInitials = (name = '') =>
    name.trim().slice(0, 2).toUpperCase();

  const formatDate = (iso) => {
    if (!iso) return '–';
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // ── Save profile ────────────────────────────────────────────────────────────
  const validateProfile = () => {
    const e = {};
    if (!profileForm.username.trim()) e.username = 'Username is required';
    else if (!/^[a-zA-Z0-9_]{3,30}$/.test(profileForm.username))
      e.username = '3–30 chars, letters/numbers/underscores';
    if (!profileForm.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileForm.email)) e.email = 'Invalid email';
    setProfileErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!validateProfile()) return;
    setSavingProfile(true);
    try {
      const res = await userService.updateProfile({
        username: profileForm.username,
        email: profileForm.email,
        avatarColor: selectedColor,
      });
      updateUser?.(res.data.data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Change password ─────────────────────────────────────────────────────────
  const validatePassword = () => {
    const e = {};
    if (!passwordForm.currentPassword) e.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword) e.newPassword = 'New password is required';
    else if (passwordForm.newPassword.length < 6) e.newPassword = 'Minimum 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setPasswordErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setSavingPassword(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  // ── Delete account ──────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (!deletePassword) { toast.error('Enter your password to confirm'); return; }
    setDeletingAccount(true);
    try {
      await userService.deleteAccount({ password: deletePassword });
      toast.success('Account deleted. Goodbye!');
      logout();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeletingAccount(false);
    }
  };

  const pwStrength = getStrength(passwordForm.newPassword);

  return (
    <PageLayout user={user} onLogout={logout}>
      {/* ── Page header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 32 }}
      >
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500,
            background: 'none', border: 'none', cursor: 'pointer',
            marginBottom: 20, padding: 0, fontFamily: 'inherit',
            transition: 'color var(--transition-fast)',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 6 }}>
          Your profile
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
          Manage your account details and security settings.
        </p>
      </motion.div>

      {/* ── Layout grid ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Left: Profile card ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
        >
          {/* Avatar card */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 24px',
              textAlign: 'center',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: selectedColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 800,
                color: '#fff',
                margin: '0 auto 16px',
                boxShadow: `0 8px 24px ${selectedColor}40`,
                transition: 'background 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {getInitials(user?.username)}
            </div>

            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
              {user?.username}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>{user?.email}</p>

            {/* Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 20,
              }}
            >
              {[
                { icon: Video, label: 'Meetings', value: profileData.meetingsHosted },
                { icon: Calendar, label: 'Joined', value: formatDate(profileData.createdAt) },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 8px',
                    textAlign: 'center',
                  }}
                >
                  <Icon size={14} color="var(--text-muted)" style={{ margin: '0 auto 4px' }} />
                  <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {value}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Color picker */}
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10, textAlign: 'left' }}>
                Avatar color
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {AVATAR_COLORS.map(({ hex, label }) => (
                  <button
                    key={hex}
                    title={label}
                    onClick={() => setSelectedColor(hex)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: hex,
                      border: selectedColor === hex ? `3px solid var(--text-primary)` : '3px solid transparent',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'border 0.15s ease, transform 0.15s ease',
                      transform: selectedColor === hex ? 'scale(1.15)' : 'scale(1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {selectedColor === hex && <Check size={12} color="#fff" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Right: Forms ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >

          {/* ── Edit profile ──────────────────────────────────────── */}
          <SectionCard
            title="Profile information"
            description="Update your public username and email address."
          >
            <form onSubmit={handleSaveProfile} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  id="profile-username"
                  value={profileForm.username}
                  onChange={(e) => {
                    setProfileForm(p => ({ ...p, username: e.target.value }));
                    if (profileErrors.username) setProfileErrors(p => ({ ...p, username: '' }));
                  }}
                  error={profileErrors.username}
                  leftIcon={<User size={16} />}
                  hint="Letters, numbers, underscores — 3 to 30 characters"
                />
                <Input
                  label="Email address"
                  type="email"
                  name="email"
                  id="profile-email"
                  value={profileForm.email}
                  onChange={(e) => {
                    setProfileForm(p => ({ ...p, email: e.target.value }));
                    if (profileErrors.email) setProfileErrors(p => ({ ...p, email: '' }));
                  }}
                  error={profileErrors.email}
                  leftIcon={<Mail size={16} />}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={savingProfile}
                    leftIcon={<Save size={15} />}
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </form>
          </SectionCard>

          {/* ── Change password ────────────────────────────────────── */}
          <SectionCard
            title="Change password"
            description="Use a strong password you don't use elsewhere."
          >
            <form onSubmit={handleChangePassword} noValidate>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Input
                  label="Current password"
                  type={showPasswords ? 'text' : 'password'}
                  id="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => {
                    setPasswordForm(p => ({ ...p, currentPassword: e.target.value }));
                    if (passwordErrors.currentPassword) setPasswordErrors(p => ({ ...p, currentPassword: '' }));
                  }}
                  error={passwordErrors.currentPassword}
                  leftIcon={<Lock size={16} />}
                  autoComplete="current-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPasswords(v => !v)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}
                    >
                      {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />

                <div>
                  <Input
                    label="New password"
                    type={showPasswords ? 'text' : 'password'}
                    id="new-password"
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm(p => ({ ...p, newPassword: e.target.value }));
                      if (passwordErrors.newPassword) setPasswordErrors(p => ({ ...p, newPassword: '' }));
                    }}
                    error={passwordErrors.newPassword}
                    leftIcon={<Lock size={16} />}
                    autoComplete="new-password"
                  />
                  {/* Strength bar */}
                  {passwordForm.newPassword && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
                        {[0, 1, 2, 3].map(i => (
                          <div
                            key={i}
                            style={{
                              flex: 1, height: 3, borderRadius: 2,
                              background: i < pwStrength ? STRENGTH[pwStrength].color : 'var(--border-default)',
                              transition: 'background 0.2s',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: STRENGTH[pwStrength].color }}>
                        {STRENGTH[pwStrength].label}
                      </span>
                    </div>
                  )}
                </div>

                <Input
                  label="Confirm new password"
                  type={showPasswords ? 'text' : 'password'}
                  id="confirm-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => {
                    setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }));
                    if (passwordErrors.confirmPassword) setPasswordErrors(p => ({ ...p, confirmPassword: '' }));
                  }}
                  error={passwordErrors.confirmPassword}
                  leftIcon={<Lock size={16} />}
                  autoComplete="new-password"
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={savingPassword}
                    leftIcon={<Save size={15} />}
                  >
                    Update password
                  </Button>
                </div>
              </div>
            </form>
          </SectionCard>

          {/* ── Danger Zone ────────────────────────────────────────── */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #FECACA', background: '#FEF2F2' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#B91C1C', display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldAlert size={16} />
                Danger zone
              </h2>
              <p style={{ fontSize: 13, color: '#DC2626', marginTop: 3 }}>
                Irreversible actions — please proceed with caution.
              </p>
            </div>
            <div
              style={{
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Delete your account</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
                  Permanently deletes your account and all hosted meetings.
                </p>
              </div>
              <Button
                variant="danger"
                onClick={() => setDeleteModalOpen(true)}
                leftIcon={<AlertTriangle size={15} />}
              >
                Delete account
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Delete account modal ─────────────────────────────────── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeletePassword(''); }}
        title="Delete your account"
        size="sm"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              padding: '12px 16px',
              background: 'var(--color-danger-light)',
              border: '1px solid #FECACA',
              borderRadius: 'var(--radius-md)',
              fontSize: 13,
              color: '#B91C1C',
              lineHeight: 1.55,
            }}
          >
            ⚠ This action is <strong>permanent and irreversible</strong>. Your account, profile, and all meetings you hosted will be deleted immediately.
          </div>

          <Input
            label="Confirm with your password"
            type="password"
            id="delete-password"
            placeholder="Your current password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            leftIcon={<Lock size={16} />}
            autoFocus
          />

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Button
              variant="ghost"
              onClick={() => { setDeleteModalOpen(false); setDeletePassword(''); }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              isLoading={deletingAccount}
              onClick={handleDeleteAccount}
              disabled={!deletePassword}
            >
              Yes, delete my account
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
