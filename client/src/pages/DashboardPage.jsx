/**
 * Dashboard Page
 * 
 * Main authenticated landing page.
 * Shows user welcome, action buttons (New Meeting, Join Meeting), and recent meeting history.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiVideoCamera, HiPlus, HiUsers } from 'react-icons/hi';
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

  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  
  // Forms state
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [joinMeetingId, setJoinMeetingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const res = await meetingService.getMyMeetings();
      setMeetings(res.data.data.meetings);
    } catch (err) {
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
    
    // Basic cleanup of URL if user pasted a full link instead of just ID
    let finalId = joinMeetingId.trim();
    if (finalId.includes('/')) {
      const parts = finalId.split('/');
      finalId = parts[parts.length - 1];
    }
    
    navigate(`/meeting/${finalId}`);
  };

  return (
    <PageLayout user={user} onLogout={logout}>
      {/* Header Section */}
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>
            Welcome back, {user?.username} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Start a new meeting or join an existing one.
          </p>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div 
        className="glass-card animate-fade-in" 
        style={{ 
          padding: 30, 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: 24,
          marginBottom: 48,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              <HiVideoCamera />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>New Meeting</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Set up a new space</p>
            </div>
          </div>
          <Button variant="primary" fullWidth leftIcon={<HiPlus />} onClick={() => setIsNewMeetingModalOpen(true)}>
            Create Meeting
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              <HiUsers />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Join Meeting</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter via link or ID</p>
            </div>
          </div>
          <Button variant="outline" fullWidth onClick={() => setIsJoinModalOpen(true)}>
            Join with ID
          </Button>
        </div>
      </div>

      {/* Recent Meetings */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
          Your Meetings
          {isLoading && <Spinner size={16} />}
        </h2>

        {!isLoading && meetings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border-default)', borderRadius: 'var(--radius-xl)' }}>
            <p style={{ color: 'var(--text-muted)' }}>No meetings created yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {meetings.map((m, i) => (
              <div key={m.meetingId} style={{ animationDelay: `${i * 100}ms` }} className="animate-fade-in">
                <MeetingCard 
                  meeting={m} 
                  onJoin={(id) => navigate(`/meeting/${id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        title="Create New Meeting"
        size="sm"
      >
        <form onSubmit={handleCreateMeeting}>
          <Input 
            label="Meeting Title (Optional)" 
            placeholder="E.g., Weekly Sync" 
            value={newMeetingTitle}
            onChange={(e) => setNewMeetingTitle(e.target.value)}
            style={{ marginBottom: 24 }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setIsNewMeetingModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>Create</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        title="Join a Meeting"
        size="sm"
      >
        <form onSubmit={handleJoinMeeting}>
          <Input 
            label="Meeting ID or Link" 
            placeholder="abc-defg-hij" 
            value={joinMeetingId}
            onChange={(e) => setJoinMeetingId(e.target.value)}
            style={{ marginBottom: 24 }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button type="button" variant="ghost" onClick={() => setIsJoinModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={!joinMeetingId.trim()}>Join</Button>
          </div>
        </form>
      </Modal>

    </PageLayout>
  );
}
