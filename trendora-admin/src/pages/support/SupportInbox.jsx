import { useState, useEffect, useRef } from 'react';
import { Search, Send, Headphones, Clock, CheckCircle2, MessageCircle, AlertTriangle, ArrowUpRight, Filter } from 'lucide-react';
import { supportService, notificationService } from '../../services/adminService';
import useAuthStore from '../../stores/authStore';

const STATUS_CONFIG = {
  open: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Open', icon: Headphones },
  in_progress: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'In Progress', icon: Clock },
  escalated: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Escalated', icon: AlertTriangle },
  waiting_customer: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Awaiting Reply', icon: MessageCircle },
  resolved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Resolved', icon: CheckCircle2 },
  closed: { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', label: 'Closed', icon: CheckCircle2 },
};

export default function SupportInbox() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await supportService.getTickets({ limit: 50 });
        setTickets(res.data?.content || res.data || []);
      } catch {}
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selected) {
      const fetchReplies = async () => {
        try {
          const res = await supportService.getTicket(selected.id);
          setReplies(res.data?.replies || []);
        } catch {}
      };
      fetchReplies();
    }
  }, [selected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [replies]);

  const handleSendReply = async () => {
    if (!newReply.trim() || !selected) return;
    setSending(true);
    try {
      await supportService.reply(selected.id, newReply);
      setReplies(prev => [...prev, {
        id: Date.now(),
        message: newReply,
        sender: 'staff',
        createdAt: new Date().toISOString(),
      }]);
      setNewReply('');
      try {
        await notificationService.create({
          userId: selected.customerId || 1,
          title: `Reply to ticket: ${selected.subject}`,
          message: `${user?.fullName || 'Support'} replied to your ticket`,
          type: 'ticket',
          referenceId: selected.id,
        });
      } catch {}
    } catch {}
    setSending(false);
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await supportService.updateStatus(ticketId, status);
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t));
      if (selected?.id === ticketId) setSelected(prev => ({ ...prev, status }));
    } catch {}
  };

  const handleEscalate = async (ticketId) => {
    try {
      await supportService.updateStatus(ticketId, 'escalated');
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'escalated' } : t));
      if (selected?.id === ticketId) setSelected(prev => ({ ...prev, status: 'escalated' }));
      try {
        await notificationService.create({
          userId: 1,
          title: `Ticket escalated: ${selected?.subject || 'Unknown'}`,
          message: `${user?.fullName || 'Support'} escalated ticket #T-${ticketId} to admin`,
          type: 'ticket',
          referenceId: ticketId,
        });
      } catch {}
    } catch {}
  };

  const filteredTickets = tickets.filter(t => {
    if (search) {
      const q = search.toLowerCase();
      if (!(t.subject || '').toLowerCase().includes(q) && !(t.customerName || '').toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const getStatusStyle = (status) => STATUS_CONFIG[status] || STATUS_CONFIG.open;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 112px)', gap: 0, borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
      {/* Left: Ticket List */}
      <div style={{
        width: 360,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Header + Search */}
        <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Inbox</h3>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12,
              background: 'rgba(5,150,105,0.1)', color: '#059669',
            }}>
              {filteredTickets.length} tickets
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#f9fafb',
            borderRadius: 8,
            padding: '8px 12px',
          }}>
            <Search size={14} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, background: 'transparent' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {['all', 'open', 'in_progress', 'escalated', 'waiting_customer', 'resolved'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: statusFilter === s ? '#059669' : '#f3f4f6',
                  color: statusFilter === s ? '#fff' : '#6b7280',
                }}
              >
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Ticket list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredTickets.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No tickets</div>
          ) : (
            filteredTickets.map(ticket => {
              const statusStyle = getStatusStyle(ticket.status);
              const isActive = selected?.id === ticket.id;
              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelected(ticket)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    background: isActive ? 'rgba(5,150,105,0.04)' : 'transparent',
                    borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{ticket.subject}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 6,
                      background: statusStyle.bg, color: statusStyle.color,
                    }}>
                      {statusStyle.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{ticket.customerName || 'Customer'}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ''}
                    {ticket.priority === 'high' && (
                      <span style={{ marginLeft: 6, color: '#ef4444', fontWeight: 600 }}>HIGH</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right: Conversation Panel */}
      {selected ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f9fafb' }}>
          {/* Conversation header */}
          <div style={{
            padding: '14px 20px',
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{selected.subject}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                {selected.customerName || 'Customer'} &middot; {selected.category || 'General'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {selected.status !== 'resolved' && selected.status !== 'closed' && (
                <>
                  <select
                    value={selected.status}
                    onChange={(e) => handleStatusChange(selected.id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: 8,
                      border: '1px solid #e5e7eb',
                      fontSize: 12,
                      fontWeight: 600,
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="waiting_customer">Awaiting Reply</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => handleEscalate(selected.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '6px 12px',
                      borderRadius: 8,
                      border: '1px solid rgba(239,68,68,0.3)',
                      background: 'rgba(239,68,68,0.05)',
                      color: '#ef4444',
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <ArrowUpRight size={14} />
                    Escalate to Admin
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Original message */}
            <div style={{
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px 12px 12px 4px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              alignSelf: 'flex-start',
            }}>
              <div style={{ fontSize: 13, color: '#111827', lineHeight: 1.5 }}>{selected.message || selected.description || 'No message content'}</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
                {selected.customerName || 'Customer'} &middot; {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}
              </div>
            </div>

            {/* Replies */}
            {replies.map((reply, i) => {
              const isStaff = reply.sender === 'staff' || reply.senderType === 'STAFF' || reply.authorRole === 'staff' || reply.authorRole === 'STAFF';
              return (
                <div key={reply.id || i} style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: isStaff ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  background: isStaff ? '#059669' : '#fff',
                  color: isStaff ? '#fff' : '#111827',
                  border: isStaff ? 'none' : '1px solid #e5e7eb',
                  alignSelf: isStaff ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>{reply.message}</div>
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
                    {isStaff ? 'You' : selected.customerName || 'Customer'} &middot; {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ''}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply input */}
          {selected.status !== 'resolved' && selected.status !== 'closed' && (
            <div style={{
              padding: '14px 20px',
              background: '#fff',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: 10,
            }}>
              <input
                type="text"
                placeholder="Type your reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #e5e7eb',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSendReply}
                disabled={!newReply.trim() || sending}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  background: newReply.trim() ? 'linear-gradient(135deg, #059669, #10b981)' : '#d1d5db',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: newReply.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                <Send size={14} />
                Send
              </button>
            </div>
          )}
        </div>
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f9fafb',
          color: '#9ca3af',
        }}>
          <Headphones size={48} color="#d1d5db" style={{ marginBottom: 12 }} />
          <div style={{ fontSize: 16, fontWeight: 600 }}>Select a ticket to view conversation</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Choose from the inbox on the left</div>
        </div>
      )}
    </div>
  );
}
