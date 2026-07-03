import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

export function useChat(roomId) {
  const socket = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
      setUnreadCount((prev) => prev + 1);
    };

    socket.on('chat-message', handleMessage);

    return () => {
      socket.off('chat-message', handleMessage);
    };
  }, [socket]);

  const sendMessage = (text) => {
    if (!text.trim() || !socket) return;

    const messageData = {
      roomId,
      message: text.trim(),
      sender: user.username,
    };

    // Emit to server
    socket.emit('chat-message', messageData);

    // Add locally immediately
    setMessages((prev) => [
      ...prev,
      { ...messageData, timestamp: new Date().toISOString(), isLocal: true }
    ]);
  };

  const markAsRead = () => {
    setUnreadCount(0);
  };

  return {
    messages,
    sendMessage,
    unreadCount,
    markAsRead
  };
}
