import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { messageAPI } from '../services/api';
import { Send, X, User, CheckCheck, Clock } from 'lucide-react';

export default function ChatDrawer({ targetUser, onClose, bookingId = null }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!targetUser?.id) return;
    try {
      const res = await messageAPI.getThread(targetUser.id);
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (e) {
      console.warn('Failed to load chat thread:', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000); // Polling for new incoming messages
    return () => clearInterval(interval);
  }, [targetUser?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      const res = await messageAPI.send({
        receiver_id: targetUser.id,
        booking_id: bookingId,
        message: messageText
      });

      if (res.success && res.sentMessage) {
        setMessages((prev) => [...prev, res.sentMessage]);
      }
    } catch (error) {
      showToast(error.message || 'Failed to send message', 'error');
      setInputMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  if (!targetUser) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{
          maxWidth: '460px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src={targetUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUser.name}`} 
              alt={targetUser.name}
              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff' }}
            />
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                {targetUser.name || targetUser.business_name}
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }}></span>
                {targetUser.role === 'provider' ? 'Service Provider' : 'Customer'} • Online
              </span>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div style={{
          flex: 1,
          padding: '1rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          background: '#f8fafc'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto' }}>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto' }}>
              <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>No messages yet</p>
              <p style={{ fontSize: '0.82rem' }}>Send a message to start the conversation!</p>
            </div>
          ) : (
            messages.map((m) => {
              const isMine = m.sender_id === user?.id;
              const timeStr = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    alignSelf: isMine ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div
                    style={{
                      background: isMine ? 'var(--primary)' : '#ffffff',
                      color: isMine ? '#ffffff' : 'var(--text-main)',
                      padding: '0.7rem 0.95rem',
                      borderRadius: 'var(--radius-lg)',
                      borderBottomRightRadius: isMine ? '2px' : 'var(--radius-lg)',
                      borderBottomLeftRadius: !isMine ? '2px' : 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)',
                      fontSize: '0.88rem',
                      lineHeight: '1.4',
                      wordBreak: 'break-word',
                      border: isMine ? 'none' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {m.message}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem', padding: '0 0.3rem' }}>
                    {timeStr}
                  </span>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <form 
          onSubmit={handleSend}
          style={{
            padding: '0.75rem',
            background: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={{ borderRadius: 'var(--radius-full)', padding: '0.6rem 1rem' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!inputMessage.trim() || sending}
            style={{
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              padding: 0,
              flexShrink: 0
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
