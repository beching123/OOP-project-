import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Clock, CheckCircle2, CreditCard, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/adminService';

export default function CashierDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingPayments: 0,
    completed: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await orderService.getOrders({ limit: 50 });
        const orders = res.data?.content || res.data || [];
        const today = new Date().toDateString();
        const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
        const pending = orders.filter(o => o.status === 'DRAFT' || o.status === 'PENDING_VERIFICATION');
        const completed = orders.filter(o => o.status === 'PAID' || o.status === 'SHIPPED');
        const revenue = todayOrders.reduce((sum, o) => sum + (o.totals?.total || 0), 0);

        // Count by payment method
        const methods = {};
        orders.forEach(o => {
          const m = o.paymentMethod || 'unknown';
          methods[m] = (methods[m] || 0) + 1;
        });

        setStats({ todayOrders: todayOrders.length, todayRevenue: revenue, pendingPayments: pending.length, completed: completed.length });
        setRecentOrders(orders.filter(o => o.status === 'DRAFT' || o.status === 'PENDING_VERIFICATION').slice(0, 6));
        setPaymentMethods(methods);
      } catch {}
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Hero stat — large single card */}
      <div style={{
        background: 'linear-gradient(135deg, #059669, #10b981)',
        borderRadius: 16,
        padding: '28px 32px',
        color: '#fff',
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{ fontSize: 13, opacity: 0.8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Today&apos;s Revenue</div>
          <div style={{ fontSize: 40, fontWeight: 800, marginTop: 4 }}>{stats.todayRevenue.toLocaleString()} XAF</div>
          <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>{stats.todayOrders} orders today</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            padding: '16px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stats.pendingPayments}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Pending</div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 12,
            padding: '16px 20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{stats.completed}</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Completed</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Pending payments queue — large actionable list */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="#f59e0b" />
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>Awaiting Payment</h3>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10,
                background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
              }}>{stats.pendingPayments}</span>
            </div>
            <button
              onClick={() => navigate('/cashier/payments')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 12, color: '#059669', fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
              All payments processed
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentOrders.map(order => (
                <div key={order.id} style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10,
                    background: 'rgba(245,158,11,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <CreditCard size={18} color="#f59e0b" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                      {order.orderId || `ORD-${order.id}`}
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{order.customerName || 'Customer'}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#111827' }}>
                    {(order.totals?.total || 0).toLocaleString()} XAF
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Payment method breakdown */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: 20,
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>
              Payment Methods
            </h3>
            {Object.entries(paymentMethods).length === 0 ? (
              <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: 20 }}>No data</div>
            ) : (
              Object.entries(paymentMethods).map(([method, count]) => (
                <div key={method} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid #f9fafb',
                }}>
                  <span style={{ fontSize: 13, color: '#374151', textTransform: 'capitalize' }}>
                    {method.replace('_', ' ')}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>{count}</span>
                </div>
              ))
            )}
          </div>

          {/* Quick actions */}
          <div style={{
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #e5e7eb',
            padding: 20,
          }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 }}>
              Quick Actions
            </h3>
            <button
              onClick={() => navigate('/cashier/payments')}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10,
                border: '1px solid #e5e7eb', background: '#fff',
                fontSize: 13, fontWeight: 600, color: '#059669',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                marginBottom: 8,
              }}
            >
              <CreditCard size={16} /> Process Payment
            </button>
            <button
              onClick={() => navigate('/cashier/orders')}
              style={{
                width: '100%', padding: '12px 0', borderRadius: 10,
                border: '1px solid #e5e7eb', background: '#fff',
                fontSize: 13, fontWeight: 600, color: '#374151',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <ShoppingCart size={16} /> View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
