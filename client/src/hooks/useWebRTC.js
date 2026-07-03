/**
 * useWebRTC — Custom Hook
 * 
 * Handles all WebRTC logic for a Mesh topology.
 * In a Mesh, each user connects to every other user directly.
 * 
 * Flow when someone joins:
 * 1. Existing users receive 'user-connected' and create an RTCPeerConnection.
 * 2. They add their local stream to the connection.
 * 3. They create an SDP Offer and send it via socket.
 * 4. The new user receives the Offer, creates an RTCPeerConnection, sets RemoteDescription.
 * 5. New user creates an SDP Answer and sends it back.
 * 6. Both sides exchange ICE Candidates until the connection is established.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

// ICE Servers for STUN (gets public IP). 
// In production, you also need TURN servers (relays data if firewalls block STUN).
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ],
};

export function useWebRTC(roomId) {
  const socket = useSocket();
  const { user } = useAuth();
  
  const [localStream, setLocalStream] = useState(null);
  // Store remote streams in an array of objects: { socketId, stream, username }
  const [remoteStreams, setRemoteStreams] = useState([]);
  
  // Screen Share state
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const screenStreamRef = useRef(null);
  
  // Refs to keep track of Peer Connections without triggering re-renders
  const peerConnections = useRef({}); // { [socketId]: RTCPeerConnection }
  const localStreamRef = useRef(null);

  // 1. Initialize local media (Camera/Mic)
  const initLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Could not access camera or microphone');
      return null;
    }
  };

  // Helper to create a new Peer Connection for a specific remote user
  const createPeerConnection = useCallback((remoteSocketId, remoteUsername) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Add our local tracks to the connection
    const streamToShare = isScreenSharing ? screenStreamRef.current : localStreamRef.current;
    if (streamToShare) {
      streamToShare.getTracks().forEach(track => {
        pc.addTrack(track, streamToShare);
      });
    }

    // Handle incoming ICE candidates from STUN
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice-candidate', {
          candidate: event.candidate,
          to: remoteSocketId,
        });
      }
    };

    // Handle incoming remote video track
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      setRemoteStreams(prev => {
        // If stream already exists, don't add it again
        if (prev.find(s => s.socketId === remoteSocketId)) {
          return prev;
        }
        return [...prev, { socketId: remoteSocketId, stream: remoteStream, username: remoteUsername || 'Guest' }];
      });
    };

    // Store it in our ref
    peerConnections.current[remoteSocketId] = pc;
    return pc;
  }, [socket, isScreenSharing]);

  // 2. Main WebRTC setup effect
  useEffect(() => {
    if (!socket || !roomId) return;

    // We join the room *after* getting user media, so we only emit 'user-connected'
    // when we are ready to receive offers.
    const setupRoom = async () => {
      const stream = await initLocalStream();
      if (stream) {
        socket.emit('join-room', { roomId, user });
      }
    };
    setupRoom();

    // -- Event: A new user connected --
    // We (existing user) create an offer and send it to them
    const handleUserConnected = async ({ socketId, username }) => {
      console.log(`[WebRTC] User connected: ${username} (${socketId})`);
      const pc = createPeerConnection(socketId, username);
      
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { offer, to: socketId });
      } catch (err) {
        console.error('Error creating offer:', err);
      }
    };

    // -- Event: Received an offer --
    // We (new user) receive an offer, set it as remote description, create answer
    const handleReceiveOffer = async ({ offer, from }) => {
      console.log(`[WebRTC] Received offer from ${from}`);
      const pc = createPeerConnection(from, 'User'); // We don't have username yet in this simple flow, can improve later
      
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { answer, to: from });
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    };

    // -- Event: Received an answer --
    const handleReceiveAnswer = async ({ answer, from }) => {
      console.log(`[WebRTC] Received answer from ${from}`);
      const pc = peerConnections.current[from];
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (err) {
          console.error('Error setting remote description from answer:', err);
        }
      }
    };

    // -- Event: Received an ICE Candidate --
    const handleReceiveIceCandidate = async ({ candidate, from }) => {
      const pc = peerConnections.current[from];
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    // -- Event: User disconnected --
    const handleUserDisconnected = (socketId) => {
      console.log(`[WebRTC] User disconnected: ${socketId}`);
      if (peerConnections.current[socketId]) {
        peerConnections.current[socketId].close();
        delete peerConnections.current[socketId];
      }
      setRemoteStreams(prev => prev.filter(s => s.socketId !== socketId));
    };

    socket.on('user-connected', handleUserConnected);
    socket.on('offer', handleReceiveOffer);
    socket.on('answer', handleReceiveAnswer);
    socket.on('ice-candidate', handleReceiveIceCandidate);
    socket.on('user-disconnected', handleUserDisconnected);

    return () => {
      // Cleanup WebRTC connections on unmount
      socket.off('user-connected', handleUserConnected);
      socket.off('offer', handleReceiveOffer);
      socket.off('answer', handleReceiveAnswer);
      socket.off('ice-candidate', handleReceiveIceCandidate);
      socket.off('user-disconnected', handleUserDisconnected);
      
      // Stop all tracks in local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Close all peer connections
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
    };
  }, [socket, roomId, user, createPeerConnection]);

  // Methods to toggle media
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  };

  const toggleVideo = () => {
    if (localStream && !isScreenSharing) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return videoTrack.enabled;
      }
    }
    return false;
  };

  // --- Screen Sharing Logic using replaceTrack ---
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      // Stop Screen Share
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
      
      const videoTrack = localStreamRef.current?.getVideoTracks()[0];
      if (videoTrack) {
        // Replace screen track back with camera track on all peers
        Object.values(peerConnections.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(videoTrack);
        });
      }
      setLocalStream(localStreamRef.current);
      setIsScreenSharing(false);
    } else {
      // Start Screen Share
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        screenStreamRef.current = screenStream;
        
        const screenTrack = screenStream.getVideoTracks()[0];
        
        // Listen for user stopping screen share via browser UI (e.g. Chrome's "Stop sharing" button)
        screenTrack.onended = () => {
          toggleScreenShare(); // recursive call to stop it cleanly
        };

        // Replace camera track with screen track on all peers
        Object.values(peerConnections.current).forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        });
        
        // Update local UI to show the screen
        setLocalStream(screenStream);
        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
        // User likely hit "Cancel" on the prompt
      }
    }
  };

  return {
    localStream,
    remoteStreams,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    isScreenSharing
  };
}
