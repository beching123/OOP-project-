import { useState, useEffect } from 'react';
import { staffService } from '../services/adminService';
import { Plus, Edit, Trash2, X, Users, UserCheck, UserX, Search, ChevronLeft, ChevronRight, Eye, Key } from 'lucide-react';

const STAFF_ROLES = [
  { value: 'CASHIER', label: 'Cashier', desc: 'Process payments and checkout', color: 'blue' },
  { value: 'ORDER_PROCESSOR', label: 'Order Processor', desc: 'Handle order fulfillment and shipping', color: 'green' },
  { value: 'SUPPORT_AGENT', label: 'Support Agent', desc: 'Manage customer support tickets', color: 'purple' },
  { value: 'INVENTORY_MANAGER', label: 'Inventory Manager', desc: 'Manage products and stock levels', color: 'yellow' },
];

const DAILY_PERMISSIONS = {
  CASHIER: ['Process payments', 'View orders', 'Handle refunds'],
  ORDER_PROCESSOR: ['Update order status', 'Manage shipping', 'View orders', 'Process returns'],
  SUPPORT_AGENT: ['Reply to tickets', 'Update ticket status', 'View customer info', 'Escalate issues'],
  INVENTORY_MANAGER: ['Add/edit products', 'Manage stock', 'Update prices', 'View reports'],
};

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editStaff, setEditStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [form, setForm] = useState({
    username: '', fullName: '', email: '', phone: '', role: 'CASHIER', password: '',
  });

  useEffect(() => { loadStaff(); }, [page]);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const params = { page, size: 12 };
      if (search) params.search = search;
      const { data } = await staffService.getStaff(params);
      const list = Array.isArray(data) ? data : (data.content || []);
      setStaff(list);
      setTotalPages(data.totalPages || Math.max(1, Math.ceil((data.totalElements || list.length) / 12)));
    } catch {
      setStaff([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditStaff(null);
    setForm({ username: '', fullName: '', email: '', phone: '', role: 'CASHIER', password: '' });
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditStaff(s);
    setForm({
      username: s.username || '', fullName: s.fullName || '', email: s.email || '',
      phone: s.phone || '', role: s.role || 'CASHIER', password: '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editStaff) {
        await staffService.update(editStaff.id, form);
      } else {
        await staffService.create(form);
      }
      setShowModal(false);
      loadStaff();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save staff member');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this staff member?')) return;
    try {
      await staffService.delete(id);
      loadStaff();
    } catch {
      alert('Failed to delete staff member');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await staffService.updateStatus(id, newStatus);
      setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
    } catch {
      setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
    }
  };

  const getRoleInfo = (role) => {
    const cleanRole = (role || '').replace('ROLE_', '');
    return STAFF_ROLES.find((r) => r.value === cleanRole) || STAFF_ROLES[0];
  };

  const stats = {
    total: staff.length,
    active: staff.filter((s) => s.status === 'active').length,
    inactive: staff.filter((s) => s.status !== 'active').length,
  };

  const filtered = search
    ? staff.filter((s) => {
        const name = (s.fullName || s.username || '').toLowerCase();
        return name.includes(search.toLowerCase());
      })
    : staff;

  return (
    <div className="page-content">
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Users size={22} /></div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Staff</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><UserCheck size={22} /></div>
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><UserX size={22} /></div>
          <div className="stat-value">{stats.inactive}</div>
          <div className="stat-label">Inactive</div>
        </div>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Staff Management</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <input className="form-input" placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 220, paddingLeft: 36 }} />
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Staff</button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Staff</th>
                <th>Role</th>
                <th>Daily Permissions</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j}><div className="skeleton" style={{ width: 70, height: 16 }} /></td>)}</tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>No staff members found</td></tr>
              ) : (
                filtered.map((s) => {
                  const roleInfo = getRoleInfo(s.role);
                  return (
                    <tr key={s.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="sidebar-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>
                            {s.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{s.fullName}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{s.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${roleInfo.color}`}>{roleInfo.label}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {(DAILY_PERMISSIONS[getRoleInfo(s.role).value] || []).slice(0, 2).map((p) => (
                            <span key={p} style={{ fontSize: 10, padding: '2px 6px', background: 'var(--border-light)', borderRadius: 4, color: 'var(--text-secondary)' }}>{p}</span>
                          ))}
                          {(DAILY_PERMISSIONS[getRoleInfo(s.role).value] || []).length > 2 && (
                            <span style={{ fontSize: 10, padding: '2px 6px', background: 'var(--primary-bg)', borderRadius: 4, color: 'var(--primary)' }}>+{(DAILY_PERMISSIONS[getRoleInfo(s.role).value] || []).length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(s.id, s.status)}
                          style={{
                            padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
                            background: s.status === 'active' ? 'var(--success-bg)' : 'var(--danger-bg)',
                            color: s.status === 'active' ? 'var(--success)' : 'var(--danger)',
                          }}
                        >
                          {s.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '--'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedStaff(s)}><Eye size={14} /></button>
                          <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}><Edit size={14} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}><Trash2 size={14} /></button>
                        </div>
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

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="modal-overlay" onClick={() => setSelectedStaff(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 560 }}>
            <div className="modal-header">
              <span className="modal-title">Staff Details</span>
              <button className="modal-close" onClick={() => setSelectedStaff(null)}><X size={20} /></button>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div className="sidebar-avatar" style={{ width: 64, height: 64, fontSize: 22, margin: '0 auto 12px' }}>
                {selectedStaff.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase()}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedStaff.fullName}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>@{selectedStaff.username}</p>
              <span className={`badge badge-${getRoleInfo(selectedStaff.role).color}`} style={{ marginTop: 8 }}>
                {getRoleInfo(selectedStaff.role).label}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Email</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{selectedStaff.email || '--'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Phone</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{selectedStaff.phone || '--'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Status</div>
                <span className={`badge ${selectedStaff.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                  {selectedStaff.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Joined</div>
                <div style={{ fontSize: 13 }}>{selectedStaff.createdAt ? new Date(selectedStaff.createdAt).toLocaleDateString() : '--'}</div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Daily Permissions</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {(DAILY_PERMISSIONS[getRoleInfo(selectedStaff.role).value] || []).map((p) => (
                  <span key={p} style={{ fontSize: 12, padding: '4px 10px', background: 'var(--primary-bg)', borderRadius: 6, color: 'var(--primary)', fontWeight: 500 }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editStaff ? 'Edit Staff' : 'Add Staff Member'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="e.g. Marie Ndi" />
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="e.g. marie" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@trendora.cm" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+237 6XX XXX XXX" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {STAFF_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>
                ))}
              </select>
            </div>
            {form.role && (
              <div style={{ background: 'var(--border-light)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Daily Permissions for {getRoleInfo(form.role).label}:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(DAILY_PERMISSIONS[form.role] || []).map((p) => (
                    <span key={p} style={{ fontSize: 11, padding: '2px 8px', background: '#fff', borderRadius: 4, color: 'var(--text)' }}>{p}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="form-group">
              <label className="form-label">{editStaff ? 'New Password (leave blank to keep)' : 'Password'}</label>
              <input className="form-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editStaff ? '••••••••' : 'Enter password'} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editStaff ? 'Update' : 'Create Account'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
