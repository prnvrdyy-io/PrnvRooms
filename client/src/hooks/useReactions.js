import { useState, useEffect, useCallback } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

export function useReactions(roomId) {
  const socket = useSocket();
  const { user } = useAuth();
  const [reactions, setReactions] = useState([]);

  // Listen for incoming reactions
  useEffect(() => {
    if (!socket || !roomId) return;

    const handleNewReaction = (reaction) => {
      // Add a local timestamp so we can track when to remove it
      const newReaction = { ...reaction, localId: Math.random().toString(36).substring(2, 9), createdAt: Date.now() };
      
      setReactions((prev) => [...prev, newReaction]);

      // Automatically remove after 3.5 seconds
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.localId !== newReaction.localId));
      }, 3500);
    };

    socket.on('meeting-reaction', handleNewReaction);

    return () => {
      socket.off('meeting-reaction', handleNewReaction);
    };
  }, [socket, roomId]);

  // Send a reaction to the room (and add it locally for ourselves)
  const sendReaction = useCallback((emoji) => {
    if (!socket || !roomId) return;

    const reactionData = {
      emoji,
      sender: user?.username || 'Guest',
      id: Math.random().toString(36).substring(2, 9), // Use this as global ID
    };

    // Emit to server (broadcasts to others)
    socket.emit('meeting-reaction', { roomId, emoji: reactionData.emoji, sender: reactionData.sender });

    // Render locally immediately
    const localReaction = { ...reactionData, localId: Math.random().toString(36).substring(2, 9), createdAt: Date.now() };
    setReactions((prev) => [...prev, localReaction]);

    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.localId !== localReaction.localId));
    }, 3500);

  }, [socket, roomId, user]);

  return { reactions, sendReaction };
}
