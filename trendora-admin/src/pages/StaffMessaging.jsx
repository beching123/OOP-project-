import { useState, useEffect, useRef } from 'react';
import { Search, Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { messagingService } from '../services/adminService';
import useAuthStore from '../stores/authStore';

export default function StaffMessaging() {
  const { user } = useAuthStore();
  const userId = user?.id || 1;
  const userName = user?.fullName || user?.username || 'Staff';

  const [conversations, setConversations] = useState([]);
  const [team, setTeam] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [search, setSearch] = useState('');
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
    loadTeam();
  }, [userId]);

  useEffect(() => {
    if (selectedPartner) {
      loadMessages(selectedPartner.id || selectedPartner.partnerId);
    }
  }, [selectedPartner]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const { data } = await messagingService.getConversations(userId);
      setConversations(data.conversations || []);
    } catch {}
  };

  const loadTeam = async () => {
    try {
      const { data } = await messagingService.getTeam();
      const members = (Array.isArray(data) ? data : []).filter(m => m.id !== userId);
      setTeam(members);
    } catch {}
  };

  const loadMessages = async (partnerId) => {
    try {
      const { data } = await messagingService.getConversation(partnerId, userId);
      setMessages(Array.isArray(data) ? data : []);
      await messagingService.getConversations(userId).then(({ data: d }) => setConversations(d.conversations || []));
    } catch {}
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedPartner) return;
    setSending(true);
    try {
      const partnerId = selectedPartner.id || selectedPartner.partnerId;
      const partnerName = selectedPartner.fullName || selectedPartner.username || selectedPartner.partnerName || 'Staff';
      const { data } = await messagingService.sendMessage({
        senderId: userId,
        senderName: userName,
        recipientId: partnerId,
        recipientName: partnerName,
        message: newMessage,
      });
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      loadConversations();
    } catch {}
    setSending(false);
  };

  const filteredTeam = team.filter(m => {
    if (!search) return true;
    const name = (m.username || '').toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const getPartnerName = (partnerId) => {
    const member = team.find(m => m.id === partnerId);
    return member?.username || `Staff #${partnerId}`;
  };

  const getRoleDisplay = (role) => {
    const r = (role || '').replace('ROLE_', '').replace('_', ' ');
    return r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 112px)', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {/* Left: Conversations + Team */}
      <div style={{
        width: 360,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Messages</h3>
            <button
              onClick={() => setShowCompose(!showCompose)}
              style={{
                padding: '6px 12px', borderRadius: 8,
                border: 'none', background: '#059669', color: '#fff',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              {showCompose ? 'Back' : 'New Message'}
            </button>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#f9fafb', borderRadius: 8, padding: '8px 12px',
          }}>
            <Search size={14} color="#9ca3af" />
            <input
              type="text"
              placeholder={showCompose ? "Search team members..." : "Search conversations..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, background: 'transparent' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {showCompose ? (
            /* Team member list for starting new conversation */
            filteredTeam.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No team members found</div>
            ) : (
              filteredTeam.map(member => (
                <div
                  key={member.id}
                  onClick={() => {
                    setSelectedPartner(member);
                    setShowCompose(false);
                    setSearch('');
                  }}
                  style={{
                    padding: '12px 16px', borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>
                      {(member.username || 'S')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{member.username}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{getRoleDisplay(member.role)}</div>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            /* Existing conversations */
            conversations.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No conversations yet</div>
            ) : (
              conversations.map(conv => (
                <div
                  key={conv.partnerId}
                  onClick={() => setSelectedPartner(conv)}
                  style={{
                    padding: '12px 16px', borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    background: (selectedPartner?.partnerId === conv.partnerId) ? 'rgba(5,150,105,0.04)' : 'transparent',
                    borderLeft: (selectedPartner?.partnerId === conv.partnerId) ? '3px solid #059669' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                      }}>
                        {(conv.partnerName || 'S')[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{conv.partnerName}</div>
                        <div style={{ fontSize: 12, color: '#6b7280', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {conv.lastMessage}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                      {conv.unreadFromPartner && (
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: '#059669', marginTop: 4,
                        }} />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>

      {/* Right: Conversation */}
      {selectedPartner ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
          {/* Header */}
          <div style={{
            padding: '14px 20px', background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 12, fontWeight: 700,
            }}>
              {(selectedPartner.partnerName || selectedPartner.username || 'S')[0].toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                {selectedPartner.fullName || selectedPartner.partnerName || selectedPartner.username}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>
                {getRoleDisplay(selectedPartner.role || '')}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                <div style={{ textAlign: 'center' }}>
                  <MessageCircle size={40} color="#d1d5db" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 14 }}>Start a conversation</div>
                </div>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMine = msg.senderId === userId;
                return (
                  <div key={msg.id || i} style={{
                    maxWidth: '70%',
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: isMine ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                      background: isMine ? '#059669' : '#fff',
                      color: isMine ? '#fff' : '#111827',
                      border: isMine ? 'none' : '1px solid #e5e7eb',
                      fontSize: 13, lineHeight: 1.5,
                    }}>
                      {msg.message}
                    </div>
                    <div style={{
                      fontSize: 10, color: '#9ca3af', marginTop: 3,
                      textAlign: isMine ? 'right' : 'left',
                    }}>
                      {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '14px 20px', background: '#fff',
            borderTop: '1px solid #e5e7eb',
            display: 'flex', gap: 10,
          }}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1, padding: '10px 14px',
                borderRadius: 10, border: '1px solid #e5e7eb',
                fontSize: 13, outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 10,
                border: 'none',
                background: newMessage.trim() ? 'linear-gradient(135deg, #059669, #10b981)' : '#d1d5db',
                color: '#fff', fontSize: 13, fontWeight: 600,
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              <Send size={14} />
              Send
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: '#f9fafb', color: '#9ca3af',
        }}>
          <MessageCircle size={48} color="#d1d5db" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 600 }}>Select a conversation</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Choose from existing chats or start a new one</div>
        </div>
      )}
    </div>
  );
}
