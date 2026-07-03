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
  HiDesktopComputer,
  HiHand,
  HiOutlineHand,
  HiStop,
  HiRecord,
  HiVolumeOff
} from 'react-icons/hi';
import toast from 'react-hot-toast';

import { useWebRTC } from '@/hooks/useWebRTC';
import { useChat } from '@/hooks/useChat';
import { meetingService } from '@/services/meetingService';
import { useAuth } from '@/hooks/useAuth';
import { PageLoader } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { ChatPanel } from '@/components/meeting/ChatPanel';

// Video helper component to attach MediaStream to HTMLVideoElement
const VideoPlayer = ({ stream, isLocal = false, username, isHandRaised = false }) => {
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
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>
        {username} {isLocal && '(You)'}
        {isHandRaised && <span style={{ color: 'var(--color-warning)' }}><HiHand size={16} /></span>}
      </div>
    </div>
  );
};

export default function MeetingPage() {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [meeting, setMeeting] = useState(null);

  // Toggle states
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Recording Refs
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // Initialize WebRTC and Chat
  const { 
    localStream, 
    remoteStreams, 
    toggleAudio, 
    toggleVideo, 
    toggleScreenShare, 
    isScreenSharing,
    isHandRaised,
    toggleHandRaise,
    adminMuteAll
  } = useWebRTC(meetingId, {
    onForceMute: () => setIsAudioEnabled(false)
  });

  const { messages, sendMessage, unreadCount, markAsRead } = useChat(meetingId);

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
    navigate('/dashboard');
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      toast.success('Recording saved to your computer');
    } else {
      try {
        // We use getDisplayMedia to record the entire layout as the user sees it
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        
        let options = { mimeType: 'video/webm; codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm' };
        }
        
        mediaRecorderRef.current = new MediaRecorder(screenStream, options);
        recordedChunks.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) recordedChunks.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(recordedChunks.current, { type: options.mimeType });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = `Meeting_Recording_${new Date().toISOString()}.webm`;
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
      } catch (err) {
        console.error('Error starting recording', err);
        toast.error('Could not start recording. You must grant permission.');
      }
    }
  };

  if (isVerifying) return <PageLoader message="Joining meeting..." />;

  // Determine if user is host
  const isHost = meeting?.host === user?._id || meeting?.host?._id === user?._id;

  // Calculate grid layout dynamically based on participants
  const totalParticipants = 1 + remoteStreams.length;
  const gridTemplateColumns = totalParticipants === 1 ? '1fr' : totalParticipants <= 4 ? '1fr 1fr' : 'repeat(auto-fit, minmax(300px, 1fr))';

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', background: 'var(--bg-default)' }}>
      {/* Main Content Area (Video + Controls) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Top Bar */}
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-card)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
            {meeting?.title || 'Meeting Room'}
            {isRecording && <span style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', fontSize: '0.9rem', gap: 4, animation: 'pulse 2s infinite' }}><HiRecord /> Recording</span>}
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {totalParticipants} Participant{totalParticipants !== 1 && 's'}
          </div>
        </div>

        {/* Video Grid Area */}
        <div style={{ flex: 1, padding: 24, display: 'grid', gridTemplateColumns, gap: 16, overflowY: 'auto', alignContent: 'center' }}>
          {/* Local User */}
          <VideoPlayer stream={localStream} isLocal={!isScreenSharing} username="Me" isHandRaised={isHandRaised} />

          {/* Remote Users */}
          {remoteStreams.map(remote => (
            <VideoPlayer key={remote.socketId} stream={remote.stream} username={remote.username} isHandRaised={remote.isHandRaised} />
          ))}
        </div>

        {/* Control Bar */}
        <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'center', gap: 12, borderTop: '1px solid var(--border-default)', background: 'var(--bg-card)' }}>
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
            variant={isHandRaised ? "primary" : "outline"} 
            onClick={toggleHandRaise}
            style={{ width: 56, height: 56, borderRadius: '50%', padding: 0 }}
            title={isHandRaised ? "Lower Hand" : "Raise Hand"}
          >
            {isHandRaised ? <HiHand size={24} /> : <HiOutlineHand size={24} />}
          </Button>

          <div style={{ width: '2px', background: 'var(--border-default)', margin: '0 8px' }} />

          {isHost && (
            <Button 
              variant="outline" 
              onClick={adminMuteAll}
              style={{ width: 56, height: 56, borderRadius: '50%', padding: 0, color: 'var(--color-warning)' }}
              title="Admin: Mute All Participants"
            >
              <HiVolumeOff size={24} />
            </Button>
          )}

          <Button 
            variant={isRecording ? "danger" : "outline"} 
            onClick={toggleRecording}
            style={{ width: 56, height: 56, borderRadius: '50%', padding: 0 }}
            title={isRecording ? "Stop Recording" : "Record Meeting"}
          >
            {isRecording ? <HiStop size={24} /> : <HiRecord size={24} />}
          </Button>

          <Button 
            variant={isChatOpen ? "primary" : "outline"} 
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              if (!isChatOpen) markAsRead();
            }}
            style={{ width: 56, height: 56, borderRadius: '50%', padding: 0, position: 'relative' }}
            title="Chat"
          >
            <HiChatAlt2 size={24} />
            {!isChatOpen && unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'var(--color-danger)',
                color: '#fff',
                borderRadius: '50%',
                width: 18,
                height: 18,
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {unreadCount}
              </span>
            )}
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
          messages={messages}
          onSendMessage={sendMessage}
          onClose={() => setIsChatOpen(false)} 
        />
      )}
    </div>
  );
}
