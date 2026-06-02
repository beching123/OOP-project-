import { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Flag, MessageSquare, Send, Eye, Clock, User, Package, ShoppingCart, HeadphonesIcon, CheckCircle, XCircle, ArrowUpRight, BarChart3, TrendingUp, Filter } from 'lucide-react';
import { auditService, supportService } from '../services/adminService';

const typeConfig = {
  order: { icon: ShoppingCart, color: 'blue', label: 'Order' },
  support: { icon: HeadphonesIcon, color: 'purple', label: 'Support' },
  payment: { icon: Package, color: 'green', label: 'Payment' },
  staff: { icon: User, color: 'orange', label: 'Staff' },
};

const severityConfig = {
  high: { color: 'danger', label: 'High' },
  medium: { color: 'warning', label: 'Medium' },
  low: { color: 'info', label: 'Low' },
};

export default function ActivityMonitorPage() {
  const [activeTab, setActiveTab] = useState('activity');
  const [activities, setActivities] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [filterStaff, setFilterStaff] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [auditRes, ticketRes] = await Promise.allSettled([
        auditService.getAuditRecords({ limit: 50 }),
        supportService.getTickets({ limit: 50 }),
      ]);

      if (auditRes.status === 'fulfilled') {
        const records = auditRes.value.data || [];
        setActivities(records.map(r => ({
          id: r.id,
          staff: r.username || 'System',
          staffRole: '',
          action: r.details || r.action,
          type: (r.action || '').toLowerCase().includes('order') ? 'order' :
                (r.action || '').toLowerCase().includes('ticket') || (r.action || '').toLowerCase().includes('support') ? 'support' :
                (r.action || '').toLowerCase().includes('payment') ? 'payment' : 'staff',
          timestamp: r.timestamp,
          details: r.action,
        })));
      }

      if (ticketRes.status === 'fulfilled') {
        const tickets = ticketRes.value.data?.content || ticketRes.value.data || [];
        const escalated = tickets.filter(t => t.status === 'escalated');
        setEscalations(escalated.map(t => ({
          id: t.id,
          staff: t.staffName || 'Staff',
          staffRole: 'Support Agent',
          issue: `[${t.subject}] ${t.message || ''}`,
          timestamp: t.createdAt,
          status: 'pending',
          adminReply: null,
          ticketId: t.id,
        })));
      }
    } catch {}
    setLoading(false);
  };

  const staffNames = [...new Set(activities.map((a) => a.staff).filter(Boolean))];

  const filteredActivities = activities.filter((a) => {
    if (filterStaff && a.staff !== filterStaff) return false;
    if (filterType && a.type !== filterType) return false;
    return true;
  });

  const handleEscalationReply = async (escalation) => {
    if (!replyText.trim()) return;
    try {
      await supportService.reply(escalation.ticketId, `[Admin] ${replyText}`);
      await supportService.updateStatus(escalation.ticketId, 'in_progress');
      setEscalations((prev) => prev.map((e) => e.id === escalation.id ? { ...e, status: 'replied', adminReply: replyText } : e));
      setReplyText('');
      setSelectedEscalation(null);
    } catch {
      alert('Failed to send reply');
    }
  };

  const pendingEscalations = escalations.filter((e) => e.status === 'pending').length;

  const tabs = [
    { key: 'activity', label: 'Activity Feed', icon: Activity },
    { key: 'escalations', label: `Escalations${pendingEscalations > 0 ? ` (${pendingEscalations})` : ''}`, icon: Flag },
    { key: 'performance', label: 'Staff Performance', icon: BarChart3 },
  ];

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Activity Monitor</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Track all staff actions and system alerts</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {pendingEscalations > 0 && (
            <span className="badge badge-danger" style={{ padding: '6px 12px' }}>
              <Flag size={14} /> {pendingEscalations} Escalations
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button key={tab.key} className={`tab${activeTab === tab.key ? ' active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            <tab.icon size={15} style={{ marginRight: 6 }} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Activity Feed Tab */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Staff Activity</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <select className="form-select" value={filterStaff} onChange={(e) => setFilterStaff(e.target.value)} style={{ width: 160, padding: '6px 10px', fontSize: 12 }}>
                <option value="">All Staff</option>
                {staffNames.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
              <select className="form-select" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ width: 140, padding: '6px 10px', fontSize: 12 }}>
                <option value="">All Types</option>
                <option value="order">Orders</option>
                <option value="support">Support</option>
                <option value="payment">Payments</option>
              </select>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Staff</th><th>Action</th><th>Type</th><th>Time</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 4 }).map((_, j) => <td key={j}><div className="skeleton" style={{ width: 70, height: 16 }} /></td>)}</tr>
                  ))
                ) : filteredActivities.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>No activity recorded yet. Staff actions will appear here once the backend is running.</td></tr>
                ) : (
                  filteredActivities.map((a) => {
                    const cfg = typeConfig[a.type] || typeConfig.staff;
                    return (
                      <tr key={a.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                              {(a.staff || 'S')[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: 13 }}>{a.staff}</div>
                              {a.staffRole && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.staffRole}</div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: 13 }}>{a.action}</div>
                          {a.details && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.details}</div>}
                        </td>
                        <td><span className={`badge badge-${cfg.color}`}><cfg.icon size={12} /> {cfg.label}</span></td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                          {a.timestamp ? new Date(a.timestamp).toLocaleString() : '--'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Escalations Tab */}
      {activeTab === 'escalations' && (
        <div style={{ display: 'grid', gridTemplateColumns: selectedEscalation ? '1fr 1fr' : '1fr', gap: 20 }}>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Staff Escalations</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Tickets escalated by support staff for your intervention</span>
            </div>
            <div className="card-body">
              {escalations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 12 }} />
                  <h3 style={{ fontSize: 16, fontWeight: 600 }}>No Escalations</h3>
                  <p style={{ fontSize: 13 }}>No tickets have been escalated yet</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {escalations.map((e) => (
                    <div
                      key={e.id}
                      onClick={() => setSelectedEscalation(e)}
                      style={{
                        border: '1px solid var(--border)', borderRadius: 12, padding: 14, cursor: 'pointer',
                        background: selectedEscalation?.id === e.id ? 'var(--primary-bg)' : e.status === 'pending' ? '#fff' : 'var(--border-light)',
                        transition: 'var(--transition)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className="sidebar-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
                            {(e.staff || 'S').split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{e.staff}</span>
                        </div>
                        <span className={`badge ${e.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                          {e.status === 'pending' ? 'Needs Response' : 'Replied'}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{e.issue}</p>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                        <Clock size={11} style={{ marginRight: 4 }} />
                        {e.timestamp ? new Date(e.timestamp).toLocaleString() : '--'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reply Panel */}
          {selectedEscalation && (
            <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 84 }}>
              <div className="card-header">
                <span className="card-title">Escalation Details</span>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedEscalation(null)}>Close</button>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>From</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className="sidebar-avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                      {(selectedEscalation.staff || 'S').split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedEscalation.staff}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{selectedEscalation.staffRole}</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Issue</div>
                  <div style={{ fontSize: 13, lineHeight: 1.6, background: 'var(--border-light)', padding: 12, borderRadius: 8 }}>{selectedEscalation.issue}</div>
                </div>
                {selectedEscalation.adminReply && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Your Previous Instruction</div>
                    <div style={{ fontSize: 13, lineHeight: 1.6, background: 'var(--primary-bg)', padding: 12, borderRadius: 8, borderLeft: '3px solid var(--primary)' }}>{selectedEscalation.adminReply}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                    {selectedEscalation.adminReply ? 'Send Additional Instruction' : 'Send Instruction to Staff'}
                  </div>
                  <textarea
                    className="form-textarea"
                    placeholder="Type your instruction or decision..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    style={{ minHeight: 80 }}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleEscalationReply(selectedEscalation)}
                    disabled={!replyText.trim()}
                    style={{ marginTop: 8 }}
                  >
                    <Send size={14} /> Send Instruction
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon green"><TrendingUp size={22} /></div>
              <div className="stat-value">{activities.length}</div>
              <div className="stat-label">Total Actions Logged</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon red"><Flag size={22} /></div>
              <div className="stat-value">{escalations.length}</div>
              <div className="stat-label">Escalated Tickets</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue"><CheckCircle size={22} /></div>
              <div className="stat-value">{escalations.filter(e => e.status === 'replied').length}</div>
              <div className="stat-label">Resolved Escalations</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Audit Trail</span></div>
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>User</th><th>Action</th><th>Details</th><th>Time</th></tr>
                </thead>
                <tbody>
                  {activities.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No audit data available</td></tr>
                  ) : (
                    activities.slice(0, 20).map((a) => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600, fontSize: 13 }}>{a.staff}</td>
                        <td><span className={`badge badge-${(typeConfig[a.type] || typeConfig.staff).color}`}>{a.details}</span></td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.action}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.timestamp ? new Date(a.timestamp).toLocaleString() : '--'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
