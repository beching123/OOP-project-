import { useState, useEffect, useRef } from 'react';
import { Headphones, X, Send, Plus, MessageCircle, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../stores/authStore';
import { supportService } from '../../services/supportService';
import styles from './SupportChat.module.css';

const CATEGORIES = [
  { value: 'order', label: 'Order Issue' },
  { value: 'payment', label: 'Payment' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'product', label: 'Product' },
  { value: 'other', label: 'Other' },
];

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('list');
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuthStore();

  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    category: 'order',
    priority: 'medium',
    orderNumber: '',
  });
  const [sendingTicket, setSendingTicket] = useState(false);

  useEffect(() => {
    if (isOpen && view === 'list') {
      fetchTickets();
    }
  }, [isOpen, view]);

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketDetail(selectedTicket.id);
    }
  }, [selectedTicket?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.replies]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await supportService.getTickets();
      const data = res.data;
      const list = Array.isArray(data) ? data : (data.content || data.data || []);
      setTickets(list);
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetail = async (id) => {
    try {
      const res = await supportService.getTicket(id);
      setSelectedTicket(res.data);
    } catch {}
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }
    setSendingTicket(true);
    try {
      await supportService.createTicket({
        subject: newTicket.subject,
        message: newTicket.message,
        category: newTicket.category,
        priority: newTicket.priority,
        orderNumber: newTicket.orderNumber || undefined,
      });
      toast.success('Ticket created! Our team will respond soon.');
      setNewTicket({ subject: '', message: '', category: 'order', priority: 'medium', orderNumber: '' });
      setView('list');
      fetchTickets();
    } catch {
      toast.error('Failed to create ticket. Please try again.');
    } finally {
      setSendingTicket(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setSendingReply(true);
    try {
      await supportService.replyToTicket(selectedTicket.id, replyText);
      setReplyText('');
      fetchTicketDetail(selectedTicket.id);
    } catch {
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'waiting_customer': return '#f97316';
      case 'resolved': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'waiting_customer': return 'Waiting on You';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h`;
    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 7) return `${diffDays}d`;
    return d.toLocaleDateString();
  };

  return (
    <div className={styles.chatWidget}>
      {isOpen && (
        <div className={styles.chatPanel}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <Headphones size={20} />
              <div>
                <h4>Support Chat</h4>
                <span className={styles.headerStatus}>We typically reply within minutes</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => { setIsOpen(false); setView('list'); setSelectedTicket(null); }}>
              <X size={18} />
            </button>
          </div>

          {view === 'list' && (
            <div className={styles.chatBody}>
              <button className={styles.newTicketBtn} onClick={() => setView('new')}>
                <Plus size={16} /> New Ticket
              </button>
              {loading ? (
                <div className={styles.loadingState}>Loading tickets...</div>
              ) : tickets.length === 0 ? (
                <div className={styles.emptyState}>
                  <MessageCircle size={32} />
                  <p>No tickets yet</p>
                  <span>Create a ticket and we'll help you out</span>
                </div>
              ) : (
                <div className={styles.ticketList}>
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={styles.ticketItem}
                      onClick={() => { setSelectedTicket(ticket); setView('chat'); }}
                    >
                      <div className={styles.ticketHeader}>
                        <span className={styles.ticketSubject}>{ticket.subject}</span>
                        <span
                          className={styles.statusBadge}
                          style={{ background: getStatusColor(ticket.status) + '20', color: getStatusColor(ticket.status) }}
                        >
                          {getStatusLabel(ticket.status)}
                        </span>
                      </div>
                      <div className={styles.ticketPreview}>
                        <span>{ticket.message?.substring(0, 60)}{ticket.message?.length > 60 ? '...' : ''}</span>
                        <span className={styles.ticketTime}>{formatTime(ticket.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'new' && (
            <div className={styles.chatBody}>
              <button className={styles.backBtn} onClick={() => setView('list')}>
                <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} /> Back to tickets
              </button>
              <div className={styles.newTicketForm}>
                <div className={styles.formGroup}>
                  <label>Subject</label>
                  <input
                    className={styles.formInput}
                    placeholder="Brief description of your issue"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Category</label>
                  <select
                    className={styles.formSelect}
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Order Number (optional)</label>
                  <input
                    className={styles.formInput}
                    placeholder="e.g. ORD-00012345"
                    value={newTicket.orderNumber}
                    onChange={(e) => setNewTicket({ ...newTicket, orderNumber: e.target.value })}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  />
                </div>
                <button
                  className={styles.sendBtn}
                  onClick={handleCreateTicket}
                  disabled={sendingTicket}
                >
                  {sendingTicket ? 'Sending...' : 'Submit Ticket'}
                </button>
              </div>
            </div>
          )}

          {view === 'chat' && selectedTicket && (
            <div className={styles.chatBody}>
              <button className={styles.backBtn} onClick={() => { setView('list'); setSelectedTicket(null); }}>
                <ChevronDown size={16} style={{ transform: 'rotate(90deg)' }} /> Back to tickets
              </button>
              <div className={styles.chatTicketInfo}>
                <span className={styles.ticketSubject}>{selectedTicket.subject}</span>
                <span
                  className={styles.statusBadge}
                  style={{ background: getStatusColor(selectedTicket.status) + '20', color: getStatusColor(selectedTicket.status) }}
                >
                  {getStatusLabel(selectedTicket.status)}
                </span>
              </div>
              <div className={styles.messagesContainer}>
                <div className={styles.messageBubble + ' ' + styles.customerMessage}>
                  <p>{selectedTicket.message}</p>
                  <span className={styles.messageTime}>{formatTime(selectedTicket.createdAt)}</span>
                </div>
                {(selectedTicket.replies || []).map((reply) => (
                  <div
                    key={reply.id}
                    className={styles.messageBubble + ' ' + (reply.authorRole === 'customer' ? styles.customerMessage : styles.staffMessage)}
                  >
                    <p>{reply.message}</p>
                    <span className={styles.messageTime}>
                      {reply.authorRole === 'customer' ? 'You' : 'Support'} · {formatTime(reply.createdAt)}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {selectedTicket.status !== 'closed' && (
                <div className={styles.replyBar}>
                  <input
                    className={styles.replyInput}
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                  />
                  <button
                    className={styles.replySendBtn}
                    onClick={handleSendReply}
                    disabled={sendingReply || !replyText.trim()}
                  >
                    <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <button
        className={styles.floatingBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Support Chat"
      >
        {isOpen ? <X size={24} /> : <Headphones size={24} />}
      </button>
    </div>
  );
}
