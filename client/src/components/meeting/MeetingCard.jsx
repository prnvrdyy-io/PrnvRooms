/**
 * MeetingCard Component
 * 
 * Displays a single meeting in the dashboard list.
 */

import { HiVideoCamera, HiCalendar, HiLink, HiTrash } from 'react-icons/hi';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

export function MeetingCard({ meeting, onJoin }) {
  const { title, meetingId, status, createdAt } = meeting;

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${meetingId}`);
    toast.success('Meeting link copied to clipboard');
  };

  const getStatusVariant = () => {
    switch (status) {
      case 'active': return 'success';
      case 'waiting': return 'warning';
      case 'ended': return 'default';
      default: return 'info';
    }
  };

  return (
    <div
      className="glass-card animate-fade-in"
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        border: '1px solid var(--border-default)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>
            {title || 'Untitled Meeting'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <HiCalendar />
            <span>{formatTime(createdAt)}</span>
          </div>
        </div>
        <Badge variant={getStatusVariant()} size="sm">
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
        <Button 
          variant="primary" 
          size="sm" 
          fullWidth 
          leftIcon={<HiVideoCamera />}
          onClick={() => onJoin(meetingId)}
          disabled={status === 'ended'}
        >
          {status === 'active' ? 'Join Now' : 'Start'}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          leftIcon={<HiLink />}
          onClick={copyLink}
          title="Copy Link"
        >
          Copy
        </Button>
      </div>
    </div>
  );
}
