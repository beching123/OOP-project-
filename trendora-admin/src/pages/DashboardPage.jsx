import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService, customerService, staffService, supportService, auditService } from '../services/adminService';
import { Users, Package, ShoppingCart, AlertTriangle, Activity, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ staff: 0, products: 0, customers: 0, escalated: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [staffRes, productsRes, customersRes, escalatedRes, auditRes] = await Promise.allSettled([
          staffService.getStaff({ page: 0, size: 1 }),
          productService.getProducts({ page: 0, size: 1 }),
          customerService.getCustomers({ page: 0, size: 1 }),
          supportService.getTickets({ status: 'escalated', limit: 100 }),
          auditService.getAuditRecords({ limit: 5 }),
        ]);

        const staffData = staffRes.status === 'fulfilled' ? staffRes.value.data : {};
        const productData = productsRes.status === 'fulfilled' ? productsRes.value.data : {};
        const customerData = customersRes.status === 'fulfilled' ? customersRes.value.data : {};
        const escalatedData = escalatedRes.status === 'fulfilled' ? (escalatedRes.value.data?.content || escalatedRes.value.data || []) : [];
        const auditData = auditRes.status === 'fulfilled' ? (auditRes.value.data?.content || auditRes.value.data || []) : [];

        setStats({
          staff: staffData.totalElements || staffData.length || 0,
          products: productData.totalElements || productData.length || 0,
          customers: customerData.totalElements || customerData.length || 0,
          escalated: Array.isArray(escalatedData) ? escalatedData.length : 0,
        });

        setRecentActivity(Array.isArray(auditData) ? auditData : []);
      } catch {
        setStats({ staff: 0, products: 0, customers: 0, escalated: 0 });
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    { icon: Users, label: 'Active Staff', value: stats.staff, color: 'green', onClick: () => navigate('/admin/staff') },
    { icon: Package, label: 'Products', value: stats.products, color: 'blue', onClick: () => navigate('/admin/products') },
    { icon: ShoppingCart, label: 'Customers', value: stats.customers, color: 'purple', onClick: () => navigate('/admin/customers') },
    { icon: AlertTriangle, label: 'Escalated Tickets', value: stats.escalated, color: 'yellow', onClick: () => navigate('/admin/activity') },
  ];

  const typeColors = { order: 'var(--info)', support: 'var(--primary)', payment: 'var(--success)', system: 'var(--warning)' };

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="page-content">
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Welcome back, Admin</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Here's what's happening with your store today</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card" onClick={s.onClick} style={{ cursor: 'pointer' }}>
            <div className={`stat-icon ${s.color}`}><s.icon size={22} /></div>
            <div className="stat-value">{loading ? '--' : s.value.toLocaleString()}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Recent Staff Activity</span>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/activity')}>View All</button>
          </div>
          <div className="card-body">
            {recentActivity.length === 0 ? (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                {loading ? 'Loading activity...' : 'No recent activity'}
              </div>
            ) : recentActivity.map((a, i) => (
              <div key={a.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: typeColors[a.type] || 'var(--text-muted)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{a.action || a.description || 'Activity'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>by {a.staffName || a.userName || a.performedBy || 'System'}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatTime(a.createdAt || a.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header"><span className="card-title">Quick Actions</span></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/staff')}>
              <Users size={16} /> Manage Staff
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/activity')}>
              <Activity size={16} /> Activity Monitor
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/products')}>
              <Package size={16} /> Manage Products
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/customers')}>
              <ShoppingCart size={16} /> View Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
