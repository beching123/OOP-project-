import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/adminService';
import { ArrowLeft, Package, User, MapPin, CreditCard, Truck } from 'lucide-react';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await orderService.getOrder(id);
        setOrder(data);
      } catch {
        alert('Order not found');
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await orderService.updateStatus(id, newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
    } catch {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="card"><div className="card-body" style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading order details...</div></div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = {
    draft: { label: 'New', className: 'badge-warning' },
    pending_verification: { label: 'Pending Payment', className: 'badge-warning' },
    paid: { label: 'Paid', className: 'badge-info' },
    shipped: { label: 'Shipped', className: 'badge-purple' },
    void: { label: 'Cancelled', className: 'badge-danger' },
  };
  const st = statusConfig[order.status?.toLowerCase()] || { label: order.status, className: 'badge-info' };

  return (
    <div className="page-content">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/admin/orders')} style={{ marginBottom: 20 }}>
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700 }}>Order #{order.id}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className={`badge ${st.className}`}>{st.label}</span>
          <select className="form-select" value={order.status} onChange={(e) => handleStatusChange(e.target.value)} style={{ width: 150, padding: '8px 12px' }}>
            <option value="DRAFT">New</option>
            <option value="PENDING_VERIFICATION">Pending Payment</option>
            <option value="PAID">Paid</option>
            <option value="SHIPPED">Shipped</option>
            <option value="VOID">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Order Items</span></div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
              </thead>
              <tbody>
                {(order.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500 }}>{item.productName || item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{(item.unitPrice || item.price || 0).toLocaleString()} XAF</td>
                    <td style={{ fontWeight: 600 }}>{((item.unitPrice || item.price || 0) * item.quantity).toLocaleString()} XAF</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>{(order.totalAmount || order.total || 0).toLocaleString()} XAF</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">Customer</span></div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div className="sidebar-avatar" style={{ width: 42, height: 42 }}>
                  <User size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{order.customerName || order.customer?.name || '--'}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.customerEmail || order.customer?.email || ''}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Delivery</span></div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <MapPin size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 13 }}>{order.deliveryAddress || order.shippingAddress || order.address || '--'}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Truck size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 13 }}>{order.deliveryMethod || order.shippingMethod || 'Standard Delivery'}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">Payment</span></div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 8 }}>
                <CreditCard size={16} color="var(--text-muted)" />
                <span style={{ fontSize: 13 }}>{order.paymentMethod || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
