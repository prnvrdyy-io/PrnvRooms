/**
 * Meeting Page
 * 
 * Handles the UI for a live meeting room.
 * Displays local and remote video grids, and media controls.
 */

import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiMicrophone, 
  HiVideoCamera, 
  HiPhoneMissedCall, 
  HiOutlineMicrophone, 
  HiOutlineVideoCamera,
  HiChatAlt2,
  HiDesktopComputer
} from 'react-icons/hi';
import toast from 'react-hot-toast';

import { useWebRTC } from '@/hooks/useWebRTC';
import { meetingService } from '@/services/meetingService';
import { PageLoader } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { ChatPanel } from '@/components/meeting/ChatPanel';

// Video helper component to attach MediaStream to HTMLVideoElement
const VideoPlayer = ({ stream, isLocal = false, username }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal} // ALWAYS mute local video to prevent feedback loop
        style={{ width: '100%', height: '100%', objectFit: 'contain', transform: isLocal ? 'scaleX(-1)' : 'none' }}
      />
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        background: 'rgba(0,0,0,0.6)',
        padding: '4px 10px',
        borderRadius: 'var(--radius-md)',
        color: '#fff',
        fontSize: '0.85rem',
        backdropFilter: 'blur(4px)'
      }}>
        {username} {isLocal && '(You)'}
      </div>
    </div>
  );
};

export default function MeetingPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [meeting, setMeeting] = useState(null);

  // Toggle states
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Initialize WebRTC
  const { 
    localStream, 
    remoteStreams, 
    toggleAudio, 
    toggleVideo, 
    toggleScreenShare, 
    isScreenSharing 
  } = useWebRTC(meetingId);

  // 1. Verify meeting exists before showing the room
  useEffect(() => {
    const verifyMeeting = async () => {
      try {
        const res = await meetingService.getMeetingDetails(meetingId);
        setMeeting(res.data.data.meeting);
      } catch (err) {
        toast.error('Meeting not found or you do not have access');
        navigate('/dashboard');
      } finally {
        setIsVerifying(false);
      }
    };
    verifyMeeting();
  }, [meetingId, navigate]);

  // Handlers
  const handleToggleAudio = () => {
    const newState = toggleAudio();
    setIsAudioEnabled(newState);
  };

  const handleToggleVideo = () => {
    if (isScreenSharing) {
      toast.error("Stop sharing your screen first to toggle camera.");
      return;
    }
    const newState = toggleVideo();
    setIsVideoEnabled(newState);
  };

  const handleLeave = () => {
    // Navigating away will trigger the cleanup in useWebRTC (stopping tracks, closing sockets)
    navigate('/dashboard');
  };

  if (isVerifying) return <PageLoader message="Joining meeting..." />;

  // Calculate grid layout dynamically based on participants
  const totalParticipants = 1 + remoteStreams.length;
  const gridTemplateColumns = totalParticipants === 1 ? '1fr' : totalParticipants <= 4 ? '1fr 1fr' : 'repeat(auto-fit, minmax(300px, 1fr))';

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', background: 'var(--bg-default)' }}>
      {/* Main Content Area (Video + Controls) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Top Bar */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-card)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
            {meeting?.title || 'Meeting Room'}
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {totalParticipants} Participant{totalParticipants !== 1 && 's'}
          </div>
        </div>

        {/* Video Grid Area */}
        <div style={{ flex: 1, padding: 24, display: 'grid', gridTemplateColumns, gap: 16, overflowY: 'auto', alignContent: 'center' }}>
          {/* Local User */}
          <VideoPlayer stream={localStream} isLocal={!isScreenSharing} username="Me" />

          {/* Remote Users */}
          {remoteStreams.map(remote => (
            <VideoPlayer key={remote.socketId} stream={remote.stream} username={remote.username} />
          ))}
        </div>

        {/* Control Bar */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', gap: 16, borderTop: '1px solid var(--border-default)', background: 'var(--bg-card)' }}>
          <Button 
            variant={isAudioEnabled ? "outline" : "danger"} 
            onClick={handleToggleAudio}
            style={{ width: 56, height: 56, borderRadius: '50%', padding: 0 }}
            title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
          >
            {isAudioEnabled ? <HiMicrophone size={24} /> : <HiOutlineMicrophone size={24} />}
          </Button>

          <Button 
            variant={isVideoEnabled ? "outline" : "danger"} 
            onClick={handleToggleVideo}
            disabled={isScreenSharing}
            style={{ width: 56, height: 56, borderRadius: '50%', padding: 0 }}
            title={isVideoEnabled ? "Turn off Camera" : "Turn on Camera"}
          >
            {isVideoEnabled ? <HiVideoCamera size={24} /> : <HiOutlineVideoCamera size={24} />}
          </Button>

          <Button 
            variant={isScreenSharing ? "primary" : "outline"} 
            onClick={toggleScreenShare}
            style={{ width: 56, height: 56, borderRadius: '50%', padding: 0 }}
            title={isScreenSharing ? "Stop sharing screen" : "Share screen"}
          >
            <HiDesktopComputer size={24} />
          </Button>

          <Button 
            variant={isChatOpen ? "primary" : "outline"} 
            onClick={() => setIsChatOpen(!isChatOpen)}
            style={{ width: 56, height: 56, borderRadius: '50%', padding: 0 }}
            title="Chat"
          >
            <HiChatAlt2 size={24} />
          </Button>

          <div style={{ width: '2px', background: 'var(--border-default)', margin: '0 8px' }} />

          <Button 
            variant="danger" 
            onClick={handleLeave}
            style={{ width: 72, height: 56, borderRadius: '28px', padding: 0 }}
            title="Leave Meeting"
          >
            <HiPhoneMissedCall size={24} />
          </Button>
        </div>
      </div>

      {/* Chat Panel Side Drawer */}
      {isChatOpen && (
        <ChatPanel 
          roomId={meetingId} 
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
}
