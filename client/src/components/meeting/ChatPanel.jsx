/**
 * ChatPanel — PrnvRooms
 *
 * Discord-inspired chat panel. Dark theme to match the meeting room.
 * Business logic 100% unchanged.
 */

import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export function ChatPanel({ messages, onSendMessage, onClose }) {
  const { user } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const formatTime = (isoString) =>
    new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const getInitials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const AVATAR_COLORS = ['#2563EB', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0891B2'];
  const getAvatarColor = (name = '') =>
    AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <div
      style={{
        width: 340,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D1117',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <MessageSquare size={16} color="rgba(255,255,255,0.5)" />
          <span style={{ fontSize: 14, fontWeight: 700, color: '#F0F6FC', letterSpacing: '-0.01em' }}>
            In-call messages
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            transition: 'background 150ms ease, color 150ms ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 12,
              padding: '0 24px',
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageSquare size={22} color="rgba(255,255,255,0.25)" />
            </div>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'center',
                lineHeight: 1.55,
              }}
            >
              Messages are visible to all participants and deleted when the call ends.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.isLocal || msg.sender === user?.username;
            const showMeta =
              idx === 0 ||
              messages[idx - 1]?.sender !== msg.sender;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: showMeta ? '12px 16px 4px' : '2px 16px',
                  display: 'flex',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                {/* Avatar (only on first message in group) */}
                {showMeta ? (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: getAvatarColor(msg.sender),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 700,
                      color: '#fff',
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {getInitials(msg.sender)}
                  </div>
                ) : (
                  <div style={{ width: 32, flexShrink: 0 }} />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Sender name + timestamp */}
                  {showMeta && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 8,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isMe ? '#93C5FD' : '#F0F6FC',
                        }}
                      >
                        {isMe ? 'You' : msg.sender}
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  )}

                  {/* Message bubble */}
                  <p
                    style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.82)',
                      lineHeight: 1.55,
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.message}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: '12px 16px 14px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        <form
          onSubmit={handleSend}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 12,
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '8px 12px',
            transition: 'border-color 150ms ease',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.5)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
        >
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message…"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 14,
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: inputValue.trim() ? 'var(--color-primary)' : 'transparent',
              border: 'none',
              color: inputValue.trim() ? '#fff' : 'rgba(255,255,255,0.2)',
              cursor: inputValue.trim() ? 'pointer' : 'default',
              transition: 'all 150ms ease',
              flexShrink: 0,
            }}
          >
            <Send size={15} />
          </button>
        </form>
        <p
          style={{
            fontSize: 11,
            color: 'rgba(255,255,255,0.2)',
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          Messages disappear when the call ends
        </p>
      </div>
    </div>
  );
}
