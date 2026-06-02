import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/adminService';
import { Eye, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

const statusConfig = {
  draft: { label: 'New', className: 'badge-warning' },
  pending_verification: { label: 'Pending Payment', className: 'badge-warning' },
  paid: { label: 'Paid', className: 'badge-info' },
  shipped: { label: 'Shipped', className: 'badge-purple' },
  void: { label: 'Cancelled', className: 'badge-danger' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await orderService.getOrders(params);
      const list = Array.isArray(data) ? data : (data.content || []);
      setOrders(list);
      setTotalPages(data.totalPages || Math.max(1, Math.ceil((data.totalElements || list.length) / 12)));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert('Failed to update status');
    }
  };

  const filteredOrders = searchId
    ? orders.filter((o) => String(o.id).includes(searchId))
    : orders;

  return (
    <div className="page-content">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Orders</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ position: 'relative' }}>
            <input
              className="form-input"
              placeholder="Search by ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ width: 180, paddingLeft: 36 }}
            />
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <select className="form-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} style={{ width: 160 }}>
            <option value="">All Status</option>
            <option value="DRAFT">New</option>
            <option value="PENDING_VERIFICATION">Pending Payment</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="VOID">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => <td key={j}><div className="skeleton" style={{ width: j === 6 ? 80 : 70, height: 16 }} /></td>)}
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>No orders found</td></tr>
              ) : (
                filteredOrders.map((o) => {
                  const st = statusConfig[o.status?.toLowerCase()] || { label: o.status, className: 'badge-info' };
                  return (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 600 }}>#{o.id}</td>
                      <td>{o.customerName || o.customer?.name || '--'}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '--'}</td>
                      <td>{o.totalItems || o.items?.length || '--'}</td>
                      <td style={{ fontWeight: 600 }}>{(o.totalAmount || o.total || 0).toLocaleString()} XAF</td>
                      <td style={{ fontSize: 13 }}>{o.paymentMethod || '--'}</td>
                      <td>
                        <select
                          className="form-select"
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          style={{ width: 130, padding: '6px 10px', fontSize: 12 }}
                        >
                          <option value="DRAFT">New</option>
                          <option value="PENDING_VERIFICATION">Pending Payment</option>
                          <option value="PAID">Paid</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="VOID">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                          <Eye size={14} /> View
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
    </div>
  );
}
