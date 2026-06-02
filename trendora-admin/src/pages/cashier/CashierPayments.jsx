import { useState, useEffect } from 'react';
import { Search, CreditCard, Smartphone, Banknote, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';
import { orderService } from '../../services/adminService';

const PAYMENT_METHODS = [
  { id: 'mtn_momo', label: 'MTN MoMo', icon: Smartphone, color: '#ffcc00', bg: 'rgba(255,204,0,0.1)' },
  { id: 'orange_money', label: 'Orange Money', icon: Smartphone, color: '#ff6600', bg: 'rgba(255,102,0,0.1)' },
  { id: 'bank_card', label: 'Bank Card', icon: CreditCard, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: Banknote, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
];

export default function CashierPayments() {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders({ limit: 100 });
        const data = res.data?.content || res.data || [];
        setOrders(data);
        setFiltered(data);
      } catch {}
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(o =>
        (o.orderId || `ORD-${o.id}`).toLowerCase().includes(q) ||
        (o.customerName || '').toLowerCase().includes(q)
      );
    }
    if (methodFilter !== 'all') {
      result = result.filter(o => o.paymentMethod === methodFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(o => o.status === statusFilter);
    }
    setFiltered(result);
  }, [search, methodFilter, statusFilter, orders]);

  const handleMarkPaid = async (orderId) => {
    setProcessing(orderId);
    try {
      await orderService.updateStatus(orderId, 'PAID');
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'PAID' } : o));
    } catch {}
    setProcessing(null);
  };

  const getMethodInfo = (method) => {
    return PAYMENT_METHODS.find(m => m.id === method) || PAYMENT_METHODS[3];
  };

  const getTotalByMethod = (method) => {
    return orders
      .filter(o => o.paymentMethod === method && (o.status === 'PAID' || o.status === 'SHIPPED'))
      .reduce((sum, o) => sum + (o.totals?.total || 0), 0);
  };

  const todayTotal = orders
    .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + (o.totals?.total || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Payment Processing</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Process payments and manage transactions</p>
      </div>

      {/* Today's Summary Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 12,
        marginBottom: 24,
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #059669, #10b981)',
          borderRadius: 12,
          padding: '16px 18px',
          color: '#fff',
        }}>
          <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>TODAY&apos;S TOTAL</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 4 }}>{todayTotal.toLocaleString()} XAF</div>
        </div>
        {PAYMENT_METHODS.map(m => (
          <div key={m.id} style={{
            background: '#fff',
            borderRadius: 12,
            padding: '16px 18px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <m.icon size={14} color={m.color} />
              </div>
              <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>{m.label.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{getTotalByMethod(m.id).toLocaleString()} XAF</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 20,
        alignItems: 'center',
      }}>
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 10,
          padding: '10px 14px',
        }}>
          <Search size={16} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, background: 'transparent' }}
          />
        </div>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            fontSize: 13,
            background: '#fff',
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Methods</option>
          {PAYMENT_METHODS.map(m => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            fontSize: 13,
            background: '#fff',
            color: '#374151',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Status</option>
          <option value="DRAFT">New</option>
          <option value="PENDING_VERIFICATION">Pending Payment</option>
          <option value="PAID">Paid</option>
          <option value="SHIPPED">Shipped</option>
        </select>
      </div>

      {/* Orders List — POS-style large rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 12,
            padding: 60,
            textAlign: 'center',
            border: '1px solid #e5e7eb',
          }}>
            <CreditCard size={40} color="#d1d5db" style={{ marginBottom: 12 }} />
            <div style={{ color: '#9ca3af', fontSize: 14 }}>No orders found</div>
          </div>
        ) : (
          filtered.map(order => {
            const method = getMethodInfo(order.paymentMethod);
            const total = order.totals?.total || 0;
            const isPending = order.status === 'DRAFT' || order.status === 'PENDING_VERIFICATION';
            return (
              <div key={order.id} style={{
                background: '#fff',
                borderRadius: 12,
                border: isPending ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                transition: 'all 0.15s ease',
              }}>
                {/* Method icon */}
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: method.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <method.icon size={22} color={method.color} />
                </div>

                {/* Order info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                      {order.orderId || `ORD-${order.id}`}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 8,
                      background: isPending ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      color: isPending ? '#f59e0b' : '#10b981',
                    }}>
                      {order.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                    {order.customerName || 'Customer'} &middot; {method.label}
                  </div>
                </div>

                {/* Total */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{total.toLocaleString()} XAF</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                  </div>
                </div>

                {/* Action button */}
                {isPending && (
                  <button
                    onClick={() => handleMarkPaid(order.id)}
                    disabled={processing === order.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '10px 20px',
                      borderRadius: 10,
                      border: 'none',
                      background: processing === order.id ? '#d1d5db' : 'linear-gradient(135deg, #059669, #10b981)',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: processing === order.id ? 'not-allowed' : 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    {processing === order.id ? 'Processing...' : 'Confirm Payment'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
