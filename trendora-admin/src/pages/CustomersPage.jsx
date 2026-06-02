import { useState, useEffect } from 'react';
import { customerService } from '../services/adminService';
import { Search, ChevronLeft, ChevronRight, Eye, X, ShoppingCart } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);

  useEffect(() => { loadCustomers(); }, [page]);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const params = { page: page + 1, limit: 12 };
      if (search) params.search = search;
      const { data } = await customerService.getCustomers(params);
      const list = Array.isArray(data) ? data : (data.content || []);
      setCustomers(list);
      setTotalPages(data.totalPages || Math.max(1, Math.ceil((data.totalElements || list.length) / 12)));
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCustomer = async (customer) => {
    setSelectedCustomer(customer);
    try {
      const { data } = await customerService.getCustomerOrders(customer.id);
      setCustomerOrders(Array.isArray(data) ? data : (data.content || []));
    } catch {
      setCustomerOrders([]);
    }
  };

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>Customers</h2>
        <div style={{ position: 'relative' }}>
          <input className="form-input" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && loadCustomers()} style={{ width: 260, paddingLeft: 36 }} />
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
      </div>

      {selectedCustomer ? (
        <div>
          <button className="btn btn-secondary btn-sm" onClick={() => setSelectedCustomer(null)} style={{ marginBottom: 16 }}>
            <ChevronLeft size={16} /> Back to list
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
            <div className="card">
              <div className="card-header"><span className="card-title">Customer Profile</span></div>
              <div className="card-body">
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <div className="sidebar-avatar" style={{ width: 64, height: 64, fontSize: 22, margin: '0 auto 12px' }}>
                    {(selectedCustomer.fullName || selectedCustomer.name || 'U')[0]}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{selectedCustomer.fullName || selectedCustomer.name}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selectedCustomer.email}</p>
                  {selectedCustomer.phone && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{selectedCustomer.phone}</p>}
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Orders</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{customerOrders.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Joined</span>
                    <span style={{ fontSize: 13 }}>{selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : '--'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Order History</span></div>
              <div className="table-container">
                <table>
                  <thead><tr><th>Order #</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {customerOrders.length === 0 ? (
                      <tr><td colSpan={4} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>No orders</td></tr>
                    ) : (
                      customerOrders.map((o) => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 600 }}>#{o.id}</td>
                          <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '--'}</td>
                          <td style={{ fontWeight: 600 }}>{(o.totalAmount || o.total || 0).toLocaleString()} XAF</td>
                          <td><span className={`badge badge-${o.status?.toLowerCase() === 'delivered' ? 'success' : o.status?.toLowerCase() === 'cancelled' ? 'danger' : 'warning'}`}>{o.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Customer</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 6 }).map((_, j) => <td key={j}><div className="skeleton" style={{ width: 70, height: 16 }} /></td>)}</tr>
                  ))
                ) : customers.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>No customers found</td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>#{c.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="sidebar-avatar" style={{ width: 32, height: 32, fontSize: 12 }}>
                            {(c.fullName || c.name || 'U')[0]}
                          </div>
                          <span style={{ fontWeight: 500 }}>{c.fullName || c.name}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>{c.email}</td>
                      <td>{c.phone || '--'}</td>
                      <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '--'}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleViewCustomer(c)}>
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
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
