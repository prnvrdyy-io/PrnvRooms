/**
 * Dashboard Page — PrnvRooms
 *
 * Premium dashboard with welcome card, quick actions, stats, and meeting history.
 * Business logic 100% unchanged — only visual redesign.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video, Plus, Users, Clock, BarChart2,
  ArrowRight, Hash, Search, Bell, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { useAuth } from '@/hooks/useAuth';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { MeetingCard } from '@/components/meeting/MeetingCard';
import { meetingService } from '@/services/meetingService';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [meetings, setMeetings]   = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen]             = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [joinMeetingId, setJoinMeetingId]     = useState('');
  const [isSubmitting, setIsSubmitting]       = useState(false);

  useEffect(() => { fetchMeetings(); }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const res = await meetingService.getMyMeetings();
      setMeetings(res.data.data.meetings);
    } catch {
      toast.error('Failed to load meetings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const res = await meetingService.createMeeting({ title: newMeetingTitle });
      const { meetingId } = res.data.data.meeting;
      toast.success('Meeting created!');
      setIsNewMeetingModalOpen(false);
      setNewMeetingTitle('');
      navigate(`/meeting/${meetingId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (!joinMeetingId.trim()) return;
    let finalId = joinMeetingId.trim();
    if (finalId.includes('/')) {
      const parts = finalId.split('/');
      finalId = parts[parts.length - 1];
    }
    navigate(`/meeting/${finalId}`);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'Meetings hosted',  value: meetings.length, icon: Video,     color: 'var(--color-primary)' },
    { label: 'Hours in calls',   value: '0',              icon: Clock,     color: '#7C3AED'               },
    { label: 'Participants met', value: '0',              icon: Users,     color: '#059669'               },
  ];

  return (
    <PageLayout user={user} onLogout={logout}>

      {/* ── Welcome Section ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="dashboard-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 40,
          flexWrap: 'wrap',
          gap: 20,
        }}
      >
        <div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 6 }}>
            {getGreeting()}, {user?.username} 👋
          </p>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Your workspace
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            Create or join a meeting to get started.
          </p>
        </div>

        <div className="dashboard-header-actions" style={{ display: 'flex', gap: 10 }}>
          <Button
            variant="outline"
            leftIcon={<Users size={15} />}
            onClick={() => setIsJoinModalOpen(true)}
          >
            Join meeting
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus size={15} />}
            onClick={() => setIsNewMeetingModalOpen(true)}
          >
            New meeting
          </Button>
        </div>
      </motion.div>

      {/* ── Stats Row ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 40,
        }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-xl)',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${stat.color}12`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
                flexShrink: 0,
              }}
            >
              <stat.icon size={20} strokeWidth={2} />
            </div>
            <div>
              <p
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {isLoading ? '–' : stat.value}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="quick-actions-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 16,
          marginBottom: 48,
        }}
      >
        {/* New Meeting card */}
        <QuickActionCard
          icon={Video}
          iconColor="var(--color-primary)"
          iconBg="var(--color-primary-light)"
          title="New meeting"
          description="Create a new room and invite people"
          actionLabel="Start now"
          onClick={() => setIsNewMeetingModalOpen(true)}
        />

        {/* Join Meeting card */}
        <QuickActionCard
          icon={Hash}
          iconColor="#7C3AED"
          iconBg="#F5F3FF"
          title="Join with ID"
          description="Enter a meeting ID or paste a link"
          actionLabel="Join room"
          onClick={() => setIsJoinModalOpen(true)}
        />
      </motion.div>

      {/* ── Meeting History ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            Your meetings
            {isLoading && <Spinner size={14} color="var(--text-muted)" />}
          </h2>
          {meetings.length > 0 && (
            <span
              style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                background: 'var(--bg-secondary)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
              }}
            >
              {meetings.length} meeting{meetings.length !== 1 && 's'}
            </span>
          )}
        </div>

        {!isLoading && meetings.length === 0 ? (
          <EmptyState onAction={() => setIsNewMeetingModalOpen(true)} />
        ) : (
          <div
            className="meetings-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 16,
            }}
          >
            {meetings.map((m, i) => (
              <motion.div
                key={m.meetingId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <MeetingCard meeting={m} onJoin={(id) => navigate(`/meeting/${id}`)} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Modals ─────────────────────────────────────────────── */}
      <Modal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        title="Create new meeting"
        size="sm"
      >
        <form onSubmit={handleCreateMeeting}>
          <Input
            label="Meeting title (optional)"
            placeholder="e.g. Weekly Sync"
            value={newMeetingTitle}
            onChange={(e) => setNewMeetingTitle(e.target.value)}
            hint="Leave blank for a quick unnamed meeting"
            autoFocus
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button type="button" variant="ghost" onClick={() => setIsNewMeetingModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Create meeting
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join a meeting"
        size="sm"
      >
        <form onSubmit={handleJoinMeeting}>
          <Input
            label="Meeting ID or link"
            placeholder="abc-defg-hij or full URL"
            value={joinMeetingId}
            onChange={(e) => setJoinMeetingId(e.target.value)}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button type="button" variant="ghost" onClick={() => setIsJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!joinMeetingId.trim()}>
              Join room
            </Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────
function QuickActionCard({ icon: Icon, iconColor, iconBg, title, description, actionLabel, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        cursor: 'pointer',
        transition: 'box-shadow var(--transition-slow)',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
      onHoverStart={e => e.target.style && (e.target.style.boxShadow = 'var(--shadow-md)')}
      onHoverEnd={e => e.target.style && (e.target.style.boxShadow = 'none')}
      onClick={onClick}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
        }}
      >
        <Icon size={22} strokeWidth={2} />
      </div>

      <div>
        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 6,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--color-primary)',
        }}
      >
        {actionLabel}
        <ArrowRight size={14} />
      </div>
    </motion.div>
  );
}

function EmptyState({ onAction }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '64px 24px',
        border: '1.5px dashed var(--border-default)',
        borderRadius: 'var(--radius-2xl)',
        background: 'var(--bg-secondary)',
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: 'var(--color-primary)',
        }}
      >
        <Video size={24} strokeWidth={2} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
        No meetings yet
      </h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, maxWidth: 280, margin: '0 auto 24px' }}>
        Create your first meeting and invite your team to collaborate.
      </p>
      <Button variant="primary" leftIcon={<Plus size={15} />} onClick={onAction}>
        Create your first meeting
      </Button>
    </div>
  );
}
