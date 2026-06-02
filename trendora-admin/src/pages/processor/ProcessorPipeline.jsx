import { useState, useEffect } from 'react';
import { Package, Truck, Clock, ArrowRight, ChevronRight } from 'lucide-react';
import { orderService, notificationService } from '../../services/adminService';
import useAuthStore from '../../stores/authStore';

const COLUMNS = [
  { id: 'PENDING_VERIFICATION', label: 'Awaiting Payment', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
  { id: 'PAID', label: 'Ready to Ship', icon: Package, color: '#059669', bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.2)' },
  { id: 'SHIPPED', label: 'Shipped', icon: Truck, color: '#3b82f6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)' },
];

const NEXT_STATUS = {
  PENDING_VERIFICATION: 'PAID',
  PAID: 'SHIPPED',
};

export default function ProcessorPipeline() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [moving, setMoving] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getOrders({ limit: 100 });
        setOrders(res.data?.content || res.data || []);
      } catch {}
    };
    fetchOrders();
  }, []);

  const moveOrder = async (orderId, currentStatus) => {
    const next = NEXT_STATUS[currentStatus];
    if (!next) return;
    setMoving(orderId);
    try {
      const order = orders.find(o => o.id === orderId);
      await orderService.updateStatus(orderId, next);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: next } : o));
      const label = next.charAt(0) + next.slice(1).toLowerCase();
      try {
        await notificationService.create({
          userId: order?.customerId || order?.customer?.id || 1,
          title: `Order ${orderId ? `#${orderId}` : ''} is now ${label}`,
          message: `Your order has been ${label.toLowerCase()} and is on its way`,
          type: 'order',
          referenceId: orderId,
        });
      } catch {}
    } catch {}
    setMoving(null);
  };

  const getColumnOrders = (status) => orders.filter(o => o.status === status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 112px)' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Order Pipeline</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Track and advance orders through fulfillment</p>
      </div>

      {/* Pipeline flow indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
        marginBottom: 24,
        background: '#fff',
        borderRadius: 12,
        padding: '12px 20px',
        border: '1px solid #e5e7eb',
      }}>
        {COLUMNS.map((col, i) => (
          <div key={col.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 8,
              background: col.bg,
            }}>
              <col.icon size={14} color={col.color} />
              <span style={{ fontSize: 12, fontWeight: 600, color: col.color }}>{col.label}</span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                background: col.color,
                color: '#fff',
                padding: '1px 7px',
                borderRadius: 10,
                minWidth: 20,
                textAlign: 'center',
              }}>
                {getColumnOrders(col.id).length}
              </span>
            </div>
            {i < COLUMNS.length - 1 && (
              <ArrowRight size={16} color="#d1d5db" style={{ margin: '0 4px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Kanban columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, flex: 1, minHeight: 0 }}>
        {COLUMNS.map(col => {
          const colOrders = getColumnOrders(col.id);
          const NextIcon = NEXT_STATUS[col.id] ? ChevronRight : null;
          return (
            <div key={col.id} style={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 12,
              background: col.bg,
              border: `1px solid ${col.border}`,
              overflow: 'hidden',
            }}>
              {/* Column header */}
              <div style={{
                padding: '14px 16px',
                borderBottom: `1px solid ${col.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <col.icon size={16} color={col.color} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: col.color }}>{col.label}</span>
                </div>
                <span style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: col.color,
                  background: '#fff',
                  padding: '2px 8px',
                  borderRadius: 8,
                }}>
                  {colOrders.length}
                </span>
              </div>

              {/* Order cards */}
              <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colOrders.length === 0 ? (
                  <div style={{
                    padding: 30,
                    textAlign: 'center',
                    color: '#9ca3af',
                    fontSize: 12,
                  }}>
                    No orders
                  </div>
                ) : (
                  colOrders.map(order => {
                    const isMoving = moving === order.id;
                    return (
                      <div key={order.id} style={{
                        background: '#fff',
                        borderRadius: 10,
                        padding: 14,
                        border: '1px solid #e5e7eb',
                        opacity: isMoving ? 0.5 : 1,
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                              {order.orderId || `ORD-${order.id}`}
                            </div>
                            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                              {order.customerName || 'Customer'}
                            </div>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                            {(order.totals?.total || 0).toLocaleString()} XAF
                          </div>
                        </div>

                        <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8 }}>
                          {order.items?.length || 0} items &middot; {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                        </div>

                        {NEXT_STATUS[col.id] && (
                          <button
                            onClick={() => moveOrder(order.id, col.id)}
                            disabled={isMoving}
                            style={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 4,
                              padding: '8px 0',
                              borderRadius: 8,
                              border: `1px solid ${col.border}`,
                              background: isMoving ? '#f3f4f6' : '#fff',
                              color: col.color,
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: isMoving ? 'not-allowed' : 'pointer',
                            }}
                          >
                            Move to {COLUMNS.find(c => c.id === NEXT_STATUS[col.id])?.label}
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
