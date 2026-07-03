/**
 * MeetingCard — PrnvRooms Design System
 *
 * Clean professional meeting card with hover state and actions.
 */

import { Video, Calendar, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const STATUS_MAP = {
  active:  { label: 'Active',   bg: 'var(--color-success-light)', color: '#15803D', dot: '#22C55E' },
  waiting: { label: 'Upcoming', bg: 'var(--color-warning-light)', color: '#92400E', dot: '#F59E0B' },
  ended:   { label: 'Ended',    bg: 'var(--bg-secondary)',        color: 'var(--text-muted)', dot: '#CBD5E1' },
};

export function MeetingCard({ meeting, onJoin }) {
  const { title, meetingId, status, createdAt } = meeting;
  const statusInfo = STATUS_MAP[status] || STATUS_MAP.waiting;

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${meetingId}`);
    toast.success('Meeting link copied!');
  };

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: 'var(--shadow-lg)' }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        cursor: 'pointer',
        transition: 'box-shadow var(--transition-slow)',
      }}
    >
      {/* Top: title + status badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 6,
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title || 'Untitled Meeting'}
          </h3>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: 'var(--text-muted)',
              fontSize: 13,
            }}
          >
            <Calendar size={13} />
            <span>{formatTime(createdAt)}</span>
          </div>
        </div>

        {/* Status badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: statusInfo.bg,
            color: statusInfo.color,
            fontSize: 12,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: statusInfo.dot,
            }}
          />
          {statusInfo.label}
        </div>
      </div>

      {/* Meeting ID */}
      <div
        style={{
          padding: '8px 12px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Video size={13} color="var(--text-muted)" />
        <span
          style={{
            fontSize: 12,
            color: 'var(--text-muted)',
            fontFamily: 'monospace',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {meetingId}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <Button
          variant="primary"
          size="sm"
          fullWidth
          onClick={() => onJoin(meetingId)}
          disabled={status === 'ended'}
          rightIcon={<ArrowRight size={14} />}
        >
          {status === 'active' ? 'Join now' : 'Start'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          title="Copy meeting link"
          iconOnly
        >
          <LinkIcon size={14} />
        </Button>
      </div>
    </motion.div>
  );
}
