import { useState, useEffect } from 'react';
import { Headphones, MessageCircle, Clock, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supportService } from '../../services/adminService';

const STATUS_CONFIG = {
  open: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Open' },
  in_progress: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'In Progress' },
  waiting_customer: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Awaiting' },
  resolved: { color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Resolved' },
};

export default function SupportDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0, waiting: 0, escalated: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await supportService.getTickets({ limit: 50 });
        const data = res.data?.content || res.data || [];
        setTickets(data);
        setStats({
          open: data.filter(t => t.status === 'open').length,
          inProgress: data.filter(t => t.status === 'in_progress').length,
          resolved: data.filter(t => t.status === 'resolved').length,
          waiting: data.filter(t => t.status === 'waiting_customer').length,
          escalated: data.filter(t => t.status === 'escalated').length,
        });
      } catch {}
    };
    fetchData();
  }, []);

  const urgentTickets = tickets.filter(t => (t.priority === 'high' || t.status === 'escalated') && t.status !== 'resolved' && t.status !== 'closed');
  const recentTickets = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').slice(0, 5);

  return (
    <div>
      {/* Split layout: left = stats + urgent, right = recent tickets list */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20 }}>
        {/* Left: Status cards + urgent */}
        <div>
          {/* Status cards — vertical stack */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: 12, padding: '18px 16px', color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Headphones size={16} />
                <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>OPEN</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.open}</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: 12, padding: '18px 16px', color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Clock size={16} />
                <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>IN PROGRESS</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.inProgress}</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: 12, padding: '18px 16px', color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <MessageCircle size={16} />
                <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>AWAITING</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.waiting}</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: 12, padding: '18px 16px', color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <CheckCircle2 size={16} />
                <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>RESOLVED</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.resolved}</div>
            </div>
            <div style={{
              background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
              borderRadius: 12, padding: '18px 16px', color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <AlertTriangle size={16} />
                <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>ESCALATED</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800 }}>{stats.escalated}</div>
            </div>
          </div>

          {/* Urgent tickets */}
          <div style={{
            background: '#fff', borderRadius: 12,
            border: '1px solid rgba(239,68,68,0.2)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px', borderBottom: '1px solid #f3f4f6',
              background: 'rgba(239,68,68,0.03)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <AlertTriangle size={14} color="#ef4444" />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ef4444' }}>Urgent Tickets</span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                background: '#ef4444', color: '#fff',
              }}>{urgentTickets.length}</span>
            </div>
            {urgentTickets.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#10b981', fontSize: 13, fontWeight: 600 }}>
                No urgent tickets
              </div>
            ) : (
              urgentTickets.slice(0, 3).map(ticket => (
                <div key={ticket.id} style={{
                  padding: '12px 16px', borderBottom: '1px solid #f3f4f6',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{ticket.subject}</div>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>{ticket.customerName || 'Customer'}</div>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 6,
                    background: STATUS_CONFIG[ticket.status]?.bg || '#f3f4f6',
                    color: STATUS_CONFIG[ticket.status]?.color || '#6b7280',
                  }}>
                    {STATUS_CONFIG[ticket.status]?.label || ticket.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Recent ticket list — conversation-style */}
        <div style={{
          background: '#fff', borderRadius: 12,
          border: '1px solid #e5e7eb', overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Active Tickets</h3>
            <button
              onClick={() => navigate('/support/inbox')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, color: '#059669', fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              Open Inbox <ArrowRight size={14} />
            </button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {recentTickets.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No active tickets</div>
            ) : (
              recentTickets.map(ticket => {
                const statusStyle = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                return (
                  <div key={ticket.id} style={{
                    padding: '14px 20px', borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer', transition: 'background 0.15s',
                  }}
                  onClick={() => navigate('/support/inbox')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{ticket.subject}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 6,
                        background: statusStyle.bg, color: statusStyle.color,
                      }}>
                        {statusStyle.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                      {ticket.customerName || 'Customer'} &middot; {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ''}
                    </div>
                    {ticket.priority === 'high' && (
                      <span style={{
                        display: 'inline-block', marginTop: 4,
                        fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                        background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                      }}>
                        HIGH PRIORITY
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
