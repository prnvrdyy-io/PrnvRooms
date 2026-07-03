/**
 * Chat Panel Component
 * 
 * Renders the real-time chat interface inside the meeting room.
 * Handles sending messages via Socket.io and displaying incoming messages.
 */

import { useState, useEffect, useRef } from 'react';
import { HiPaperAirplane, HiX } from 'react-icons/hi';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function ChatPanel({ messages, onSendMessage, onClose }) {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    onSendMessage(inputValue);
    setInputValue('');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      width: '320px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-card)',
      borderLeft: '1px solid var(--border-default)',
      animation: 'slide-in-right 0.3s ease-out forwards',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>In-call messages</h3>
        <button 
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
        >
          <HiX size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px', fontSize: '0.9rem' }}>
            Messages can only be seen by people in the call and are deleted when the call ends.
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.isLocal || msg.sender === user.username;
            return (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-end' : 'flex-start'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {isMe ? 'You' : msg.sender} • {formatTime(msg.timestamp)}
                </span>
                <div style={{
                  background: isMe ? 'var(--color-primary)' : 'var(--bg-default)',
                  color: isMe ? '#fff' : 'var(--text-primary)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-lg)',
                  borderTopRightRadius: isMe ? '4px' : 'var(--radius-lg)',
                  borderTopLeftRadius: !isMe ? '4px' : 'var(--radius-lg)',
                  maxWidth: '85%',
                  wordBreak: 'break-word',
                  fontSize: '0.9rem',
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Send a message"
            style={{ marginBottom: 0, flex: 1 }}
          />
          <Button type="submit" variant="primary" disabled={!inputValue.trim()} style={{ padding: '0 16px' }}>
            <HiPaperAirplane size={18} style={{ transform: 'rotate(90deg)' }} />
          </Button>
        </form>
      </div>
    </div>
  );
}
