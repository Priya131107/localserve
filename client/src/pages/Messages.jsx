import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { messageAPI } from '../services/api';
import { joinChatRoom, sendRealtimeMessage, onReceiveMessage } from '../services/socket';
import { MessageSquare, Send, User, Search, Clock, CheckCheck, Sparkles } from 'lucide-react';

export default function Messages() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef(null);

  const loadConversations = async () => {
    try {
      const res = await messageAPI.getConversations();
      if (res.success) {
        setConversations(res.conversations || []);
        // Auto-select first conversation if none selected
        if (!selectedUser && res.conversations?.length > 0) {
          setSelectedUser(res.conversations[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load conversations:', e.message);
    } finally {
      setLoadingConv(false);
    }
  };

  const loadThread = async (userId) => {
    if (!userId) return;
    setLoadingThread(true);
    try {
      const res = await messageAPI.getThread(userId);
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch (e) {
      console.warn('Failed to load thread:', e.message);
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUser?.userId && user?.id) {
      loadThread(selectedUser.userId);

      const roomId = `room_${[user.id, selectedUser.userId].sort().join('_')}`;
      joinChatRoom(roomId);

      const unsubscribe = onReceiveMessage((incomingMsg) => {
        if (
          (incomingMsg.sender_id === selectedUser.userId && incomingMsg.receiver_id === user.id) ||
          (incomingMsg.sender_id === user.id && incomingMsg.receiver_id === selectedUser.userId)
        ) {
          setMessages((prev) => {
            if (prev.some(m => m.id === incomingMsg.id)) return prev;
            return [...prev, incomingMsg];
          });
        }
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedUser || sending) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    try {
      const res = await messageAPI.send({
        receiver_id: selectedUser.userId,
        message: messageText
      });

      if (res.success && res.sentMessage) {
        setMessages((prev) => [...prev, res.sentMessage]);
        const roomId = `room_${[user.id, selectedUser.userId].sort().join('_')}`;
        sendRealtimeMessage(roomId, res.sentMessage);
        loadConversations();
      }
    } catch (error) {
      showToast(error.message || 'Failed to send message', 'error');
      setInputMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.business_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '2.5rem 0 5rem', background: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            Chat & Direct Inquiries
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Communicate directly with your service provider or customer regarding timing and requirements.
          </p>
        </div>

        {/* 2-Column Chat Box */}
        <div className="glass-card" style={{
          height: '620px',
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          background: '#ffffff',
          overflow: 'hidden',
          padding: 0
        }}>
          
          {/* LEFT: Conversation Threads */}
          <div style={{
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffff'
          }}>
            {/* Search contacts */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'var(--bg-subtle)',
                padding: '0.45rem 0.8rem',
                borderRadius: 'var(--radius-md)'
              }}>
                <Search size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.85rem',
                    width: '100%'
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loadingConv && conversations.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.85rem' }}>
                  Loading chats...
                </p>
              ) : filteredConversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  <MessageSquare size={32} color="var(--border-subtle)" style={{ marginBottom: '0.5rem' }} />
                  <p style={{ fontSize: '0.85rem', margin: 0 }}>No conversations yet.</p>
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const isSelected = selectedUser?.userId === c.userId;
                  return (
                    <div
                      key={c.userId}
                      onClick={() => setSelectedUser(c)}
                      style={{
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--primary-light)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                        transition: 'background 0.15s'
                      }}
                    >
                      <img
                        src={c.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.name}`}
                        alt={c.name}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.business_name || c.name}
                          </strong>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            {new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.lastMessage}
                        </p>
                      </div>

                      {c.unreadCount > 0 && (
                        <span style={{
                          background: 'var(--primary)',
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT: Active Chat Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc' }}>
            {selectedUser ? (
              <>
                {/* Active Chat Header */}
                <div style={{
                  padding: '0.85rem 1.25rem',
                  background: '#ffffff',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <img
                    src={selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.name}`}
                    alt={selectedUser.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
                      {selectedUser.business_name || selectedUser.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                      {selectedUser.role === 'provider' ? 'Service Provider' : 'Customer'} • Online
                    </span>
                  </div>
                </div>

                {/* Messages Body */}
                <div style={{
                  flex: 1,
                  padding: '1.25rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {loadingThread ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                      Loading conversation...
                    </p>
                  ) : messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
                      <Sparkles size={28} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                      <p style={{ fontWeight: '600', margin: 0 }}>Start your conversation</p>
                      <p style={{ fontSize: '0.8rem' }}>Discuss details, timings, or location directions.</p>
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
                            maxWidth: '75%',
                            alignSelf: isMine ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div
                            style={{
                              background: isMine ? 'var(--primary)' : '#ffffff',
                              color: isMine ? '#ffffff' : 'var(--text-main)',
                              padding: '0.75rem 1rem',
                              borderRadius: 'var(--radius-lg)',
                              borderBottomRightRadius: isMine ? '2px' : 'var(--radius-lg)',
                              borderBottomLeftRadius: !isMine ? '2px' : 'var(--radius-lg)',
                              boxShadow: 'var(--shadow-sm)',
                              fontSize: '0.88rem',
                              border: isMine ? 'none' : '1px solid var(--border-subtle)',
                              wordBreak: 'break-word'
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

                {/* Input Strip */}
                <form
                  onSubmit={handleSend}
                  style={{
                    padding: '0.85rem 1.25rem',
                    background: '#ffffff',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    style={{ borderRadius: 'var(--radius-full)' }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!inputMessage.trim() || sending}
                    style={{ borderRadius: '50%', width: '42px', height: '42px', padding: 0, flexShrink: 0 }}
                  >
                    <Send size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
                <MessageSquare size={48} color="var(--border-subtle)" style={{ marginBottom: '0.75rem' }} />
                <p style={{ fontWeight: '600', fontSize: '1.1rem', margin: 0 }}>Select a Conversation</p>
                <p style={{ fontSize: '0.85rem' }}>Choose a contact from the left list to view chat history.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
