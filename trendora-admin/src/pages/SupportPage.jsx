import { useState, useEffect } from 'react';
import { supportService } from '../services/adminService';
import { MessageSquare, ChevronLeft, ChevronRight, Search, AlertCircle } from 'lucide-react';

const statusConfig = {
  open: { label: 'Open', className: 'badge-warning' },
  in_progress: { label: 'In Progress', className: 'badge-info' },
  escalated: { label: 'Escalated', className: 'badge-danger' },
  waiting_customer: { label: 'Waiting Customer', className: 'badge-purple' },
  resolved: { label: 'Resolved', className: 'badge-success' },
  closed: { label: 'Closed', className: 'badge-success' },
};

export default function SupportPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadTickets();
  }, [page, statusFilter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await supportService.getTickets(params);
      const list = Array.isArray(data) ? data : (data.content || []);
      setTickets(list);
      setTotalPages(data.totalPages || Math.max(1, Math.ceil((data.totalElements || list.length) / 12)));
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = async (ticket) => {
    try {
      const { data } = await supportService.getTicket(ticket.id);
      setSelectedTicket(data);
    } catch {
      setSelectedTicket(ticket);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setSending(true);
    try {
      await supportService.reply(selectedTicket.id, replyText);
      setReplyText('');
      const { data } = await supportService.getTicket(selectedTicket.id);
      setSelectedTicket(data);
    } catch {
      alert('Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await supportService.updateStatus(ticketId, newStatus);
      setTickets((prev) => prev.map((t) => t.id === ticketId ? { ...t, status: newStatus } : t));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Support Tickets</h2>
        <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} style={{ width: 180 }}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="escalated">Escalated</option>
          <option value="waiting_customer">Waiting Customer</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {selectedTicket ? (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedTicket(null)} style={{ marginBottom: 16 }}>
            <ChevronLeft size={16} /> Back to list
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <div>
                  <span className="card-title">#{selectedTicket.id} — {selectedTicket.subject || selectedTicket.title}</span>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleString() : ''}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 24 }}>
                  {selectedTicket.description || selectedTicket.message || 'No description'}
                </p>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 20 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Conversation</h4>
                  {(selectedTicket.replies || []).map((reply, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                      <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 11, flexShrink: 0 }}>
                        {(reply.staffName || reply.author || 'S')[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{reply.staffName || reply.author || 'Staff'}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                          {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : ''}
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.6 }}>{reply.message || reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16, marginTop: 8 }}>
                  <textarea
                    className="form-textarea"
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={3}
                    style={{ minHeight: 80 }}
                  />
                  <button className="btn btn-primary btn-sm" onClick={handleReply} disabled={sending || !replyText.trim()} style={{ marginTop: 8 }}>
                    {sending ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="card-header"><span className="card-title">Details</span></div>
                <div className="card-body">
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Status</div>
                    <select className="form-select" value={selectedTicket.status} onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)} style={{ width: '100%' }}>
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ESCALATED">Escalated</option>
                      <option value="WAITING_CUSTOMER">Waiting Customer</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Priority</div>
                    <span className={`badge ${(selectedTicket.priority || 'medium') === 'high' ? 'badge-danger' : (selectedTicket.priority || 'medium') === 'low' ? 'badge-success' : 'badge-warning'}`}>
                      {selectedTicket.priority || 'Medium'}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Customer</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{selectedTicket.customerName || selectedTicket.customer?.name || '--'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Subject</th>
                  <th>Customer</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => <td key={j}><div className="skeleton" style={{ width: 70, height: 16 }} /></td>)}
                    </tr>
                  ))
                ) : tickets.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>No tickets found</td></tr>
                ) : (
                  tickets.map((t) => {
                    const st = statusConfig[t.status?.toLowerCase()] || { label: t.status, className: 'badge-info' };
                    return (
                      <tr key={t.id}>
                        <td style={{ fontWeight: 600 }}>#{t.id}</td>
                        <td>{t.subject || t.title}</td>
                        <td>{t.customerName || t.customer?.name || '--'}</td>
                        <td>
                          <span className={`badge ${(t.priority || 'medium') === 'high' ? 'badge-danger' : (t.priority || 'medium') === 'low' ? 'badge-success' : 'badge-warning'}`}>
                            {t.priority || 'Medium'}
                          </span>
                        </td>
                        <td><span className={`badge ${st.className}`}>{st.label}</span></td>
                        <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '--'}</td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleViewTicket(t)}>
                            <MessageSquare size={14} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 0} onClick={() => setPage(page - 1)}><ChevronLeft size={16} /></button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <button key={i} className={page === i ? 'active' : ''} onClick={() => setPage(i)}>{i + 1}</button>
              ))}
              <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
