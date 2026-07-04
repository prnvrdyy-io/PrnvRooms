/**
 * Meeting Page — PrnvRooms
 *
 * Premium dark meeting room UI.
 * Business logic 100% unchanged — complete visual redesign using Lucide React icons.
 */

import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, Video, VideoOff,
  Monitor, MonitorOff, Hand, MessageSquare,
  PhoneOff, VolumeX, Circle, Square,
  Users, Wifi, Clock, Smile
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { useWebRTC } from '@/hooks/useWebRTC';
import { useChat } from '@/hooks/useChat';
import { meetingService } from '@/services/meetingService';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/Spinner';
import { ChatPanel } from '@/components/meeting/ChatPanel';
import { useReactions } from '@/hooks/useReactions';

// ─── Video Player ────────────────────────────────────────────────────────────
const VideoPlayer = ({ stream, isLocal = false, username, isHandRaised = false, isMuted = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#161B22',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: isLocal ? 'scaleX(-1)' : 'none',
        }}
      />

      {/* Bottom bar: name + hand indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 14px 12px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.65))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: 6,
          }}
        >
          {isMuted && <MicOff size={11} color="#F87171" />}
          <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>
            {username}{isLocal && ' (You)'}
          </span>
        </div>
        {isHandRaised && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              background: 'rgba(245, 158, 11, 0.9)',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 13,
            }}
          >
            ✋
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ─── Control Button ──────────────────────────────────────────────────────────
function ControlBtn({ onClick, title, active, danger, disabled, children, badge }) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }} title={title}>
      <button
        className="control-btn-meeting"
        onClick={onClick}
        disabled={disabled}
        style={{
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          background: danger
            ? '#EF4444'
            : active
            ? 'var(--color-primary)'
            : 'rgba(255,255,255,0.09)',
          color: danger || active ? '#fff' : 'rgba(255,255,255,0.85)',
          transition: 'all 150ms ease',
          outline: 'none',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          if (!disabled && !danger && !active)
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
        }}
        onMouseLeave={e => {
          if (!disabled && !danger && !active)
            e.currentTarget.style.background = 'rgba(255,255,255,0.09)';
        }}
      >
        {children}
      </button>
      {badge > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            background: '#EF4444',
            color: '#fff',
            borderRadius: '50%',
            width: 16,
            height: 16,
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #0D1117',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MeetingPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isVerifying, setIsVerifying] = useState(true);
  const [meeting, setMeeting]         = useState(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen]         = useState(false);
  const [isReactionMenuOpen, setIsReactionMenuOpen] = useState(false);
  const [isRecording, setIsRecording]       = useState(false);
  const [elapsed, setElapsed]               = useState(0);

  const mediaRecorderRef = useRef(null);
  const recordedChunks   = useRef([]);
  const timerRef         = useRef(null);

  const {
    localStream,
    remoteStreams,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isScreenSharing,
    isHandRaised,
    toggleHandRaise,
    adminMuteAll,
  } = useWebRTC(meetingId, {
    onForceMute: () => setIsAudioEnabled(false),
  });

  const { messages, sendMessage, unreadCount, markAsRead } = useChat(meetingId);
  const { reactions, sendReaction } = useReactions(meetingId);

  // Meeting verification
  useEffect(() => {
    const verifyMeeting = async () => {
      try {
        const res = await meetingService.getMeetingDetails(meetingId);
        setMeeting(res.data.data.meeting);
      } catch {
        toast.error('Meeting not found');
        navigate('/dashboard');
      } finally {
        setIsVerifying(false);
      }
    };
    verifyMeeting();
  }, [meetingId, navigate]);

  // Elapsed timer
  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const formatElapsed = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
      : `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const handleToggleAudio = () => {
    const newState = toggleAudio();
    setIsAudioEnabled(newState);
  };

  const handleToggleVideo = () => {
    if (isScreenSharing) {
      toast.error('Stop screen sharing first');
      return;
    }
    const newState = toggleVideo();
    setIsVideoEnabled(newState);
  };

  const handleLeave = () => navigate('/dashboard');

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      toast.success('Recording saved!');
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        let options = { mimeType: 'video/webm; codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { mimeType: 'video/webm' };

        mediaRecorderRef.current = new MediaRecorder(screenStream, options);
        recordedChunks.current   = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) recordedChunks.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunks.current, { type: options.mimeType });
          const url  = URL.createObjectURL(blob);
          const a    = document.createElement('a');
          a.href     = url;
          a.download = `Recording_${new Date().toISOString()}.webm`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          screenStream.getTracks().forEach(t => t.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast.success('Recording started');

        screenStream.getVideoTracks()[0].onended = () => {
          if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
          }
        };
      } catch {
        toast.error('Could not start recording.');
      }
    }
  };

  if (isVerifying) return <PageLoader message="Joining meeting…" />;

  const isHost = meeting?.host === user?._id || meeting?.host?._id === user?._id;
  const totalParticipants = 1 + remoteStreams.length;

  const getGridCols = () => {
    if (totalParticipants === 1) return '1fr';
    if (totalParticipants <= 2) return '1fr 1fr';
    if (totalParticipants <= 4) return '1fr 1fr';
    return 'repeat(3, 1fr)';
  };

  return (
    <div
      className="meeting-root"
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── Top Bar ──────────────────────────────────────────── */}
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: '#161B22',
          flexShrink: 0,
        }}
      >
        {/* Brand + meeting title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Video size={14} color="#fff" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#F0F6FC', letterSpacing: '-0.01em' }}>
              {meeting?.title || 'Meeting room'}
            </p>
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 10px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 600,
                color: '#F87171',
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#EF4444',
                  animation: 'pulse 1.2s ease-in-out infinite',
                }}
              />
              REC
            </motion.div>
          )}
        </div>

        {/* Right: stats */}
        <div className="meeting-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B949E', fontSize: 13 }}>
            <Clock size={14} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatElapsed(elapsed)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8B949E', fontSize: 13 }}>
            <Users size={14} />
            <span>{totalParticipants}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#22C55E', fontSize: 12, fontWeight: 600 }}>
            <Wifi size={14} />
            Connected
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Video grid */}
        <div
          className="meeting-video-grid"
          style={{
            flex: 1,
            padding: 16,
            display: 'grid',
            gridTemplateColumns: getGridCols(),
            gap: 12,
            alignContent: 'center',
            overflowY: 'auto',
          }}
        >
          <VideoPlayer
            stream={localStream}
            isLocal={!isScreenSharing}
            username={user?.username || 'Me'}
            isHandRaised={isHandRaised}
            isMuted={!isAudioEnabled}
          />
          {remoteStreams.map((remote) => (
            <VideoPlayer
              key={remote.socketId}
              stream={remote.stream}
              username={remote.username}
              isHandRaised={remote.isHandRaised}
            />
          ))}
        </div>

        {/* Floating Reactions Overlay */}
        <div style={{ position: 'absolute', bottom: 100, left: 32, pointerEvents: 'none', zIndex: 50, display: 'flex', flexDirection: 'column-reverse', gap: 8 }}>
          <AnimatePresence>
            {reactions.map((r) => (
              <motion.div
                key={r.localId}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 0.8 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(8px)',
                  padding: '8px 16px',
                  borderRadius: 100,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              >
                <span style={{ fontSize: 24 }}>{r.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{r.sender}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              className="meeting-chat-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ flexShrink: 0, overflow: 'hidden' }}
            >
              <ChatPanel
                messages={messages}
                onSendMessage={sendMessage}
                onClose={() => setIsChatOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Control Bar ───────────────────────────────────────── */}
      <div
        className="meeting-control-bar"
        style={{
          height: 88,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          background: '#161B22',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
          padding: '0 24px',
        }}
      >
        {/* Mic */}
        <ControlBtn
          onClick={handleToggleAudio}
          title={isAudioEnabled ? 'Mute' : 'Unmute'}
          active={false}
          danger={!isAudioEnabled}
        >
          {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
        </ControlBtn>

        {/* Camera */}
        <ControlBtn
          onClick={handleToggleVideo}
          title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          danger={!isVideoEnabled}
          disabled={isScreenSharing}
        >
          {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
        </ControlBtn>

        {/* Screen share */}
        <ControlBtn
          onClick={toggleScreenShare}
          title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
          active={isScreenSharing}
        >
          {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
        </ControlBtn>

        {/* Reactions */}
        <div style={{ position: 'relative' }}>
          <ControlBtn
            onClick={() => setIsReactionMenuOpen(!isReactionMenuOpen)}
            title="React"
            active={isReactionMenuOpen}
          >
            <Smile size={20} />
          </ControlBtn>

          <AnimatePresence>
            {isReactionMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: 12,
                  background: '#161B22',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 8,
                  display: 'flex',
                  gap: 4,
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                }}
              >
                {['👍', '❤️', '😂', '🎉', '🙌'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      sendReaction(emoji);
                      setIsReactionMenuOpen(false);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: 24,
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-md)',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hand raise */}
        <ControlBtn
          onClick={toggleHandRaise}
          title={isHandRaised ? 'Lower hand' : 'Raise hand'}
          active={isHandRaised}
        >
          <Hand size={20} />
        </ControlBtn>

        {/* Chat */}
        <ControlBtn
          onClick={() => {
            setIsChatOpen(!isChatOpen);
            if (!isChatOpen) markAsRead();
          }}
          title="Chat"
          active={isChatOpen}
          badge={!isChatOpen ? unreadCount : 0}
        >
          <MessageSquare size={20} />
        </ControlBtn>

        {/* Separator */}
        <div className="control-separator" style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)', margin: '0 6px' }} />

        {/* Host: mute all */}
        {isHost && (
          <ControlBtn
            onClick={() => { adminMuteAll(); }}
            title="Mute all participants"
          >
            <VolumeX size={20} />
          </ControlBtn>
        )}

        {/* Record */}
        <ControlBtn
          onClick={toggleRecording}
          title={isRecording ? 'Stop recording' : 'Record meeting'}
          danger={isRecording}
        >
          {isRecording ? <Square size={20} /> : <Circle size={20} />}
        </ControlBtn>

        {/* Separator */}
        <div className="control-separator" style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.08)', margin: '0 6px' }} />

        {/* Leave */}
        <button
          className="meeting-leave-btn"
          onClick={handleLeave}
          title="Leave meeting"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            height: 52,
            padding: '0 22px',
            borderRadius: 100,
            border: 'none',
            background: '#EF4444',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            transition: 'background 150ms ease',
            letterSpacing: '-0.01em',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#DC2626'}
          onMouseLeave={e => e.currentTarget.style.background = '#EF4444'}
        >
          <PhoneOff size={18} />
          Leave
        </button>
      </div>
    </div>
  );
}
