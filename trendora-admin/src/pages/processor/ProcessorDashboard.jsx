import { useState, useEffect } from 'react';
import { Clock, Package, Truck, ArrowRight, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/adminService';

const STAGES = [
  { id: 'PENDING_VERIFICATION', label: 'Awaiting Payment', icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.15)' },
  { id: 'PAID', label: 'Ready to Ship', icon: Package, color: '#059669', bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.15)' },
  { id: 'SHIPPED', label: 'Shipped', icon: Truck, color: '#3b82f6', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.15)' },
];

export default function ProcessorDashboard() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [moving, setMoving] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await orderService.getOrders({ limit: 50 });
        setOrders(res.data?.content || res.data || []);
      } catch {}
    };
    fetchData();
  }, []);

  const getColumnOrders = (status) => orders.filter(o => o.status === status);

  const moveOrder = async (orderId, currentStatus) => {
    const nextMap = { PENDING_VERIFICATION: 'PAID', PAID: 'SHIPPED' };
    const next = nextMap[currentStatus];
    if (!next) return;
    setMoving(orderId);
    try {
      await orderService.updateStatus(orderId, next);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: next } : o));
    } catch {}
    setMoving(null);
  };

  return (
    <div>
      {/* Pipeline flow header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>Fulfillment Pipeline</h2>
            <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Track orders from receipt to delivery</p>
          </div>
          <button
            onClick={() => navigate('/processor/pipeline')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 10,
              border: '1px solid #e5e7eb', background: '#fff',
              fontSize: 13, fontWeight: 600, color: '#059669',
              cursor: 'pointer',
            }}
          >
            Full Pipeline <ArrowRight size={14} />
          </button>
        </div>

        {/* Flow indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
          padding: '14px 24px', gap: 0,
        }}>
          {STAGES.map((stage, i) => (
            <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 10,
                background: stage.bg, border: `1px solid ${stage.border}`,
              }}>
                <stage.icon size={16} color={stage.color} />
                <span style={{ fontSize: 13, fontWeight: 600, color: stage.color }}>{stage.label}</span>
                <span style={{
                  fontSize: 12, fontWeight: 800, color: '#fff',
                  background: stage.color, padding: '2px 8px', borderRadius: 8,
                  minWidth: 24, textAlign: 'center',
                }}>
                  {getColumnOrders(stage.id).length}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <ArrowRight size={16} color="#d1d5db" style={{ margin: '0 6px' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Compact kanban — 4 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {STAGES.map(stage => {
          const colOrders = getColumnOrders(stage.id);
          return (
            <div key={stage.id} style={{
              display: 'flex', flexDirection: 'column',
              borderRadius: 12, background: stage.bg,
              border: `1px solid ${stage.border}`,
              overflow: 'hidden',
            }}>
              <div style={{
                padding: '12px 16px', borderBottom: `1px solid ${stage.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <stage.icon size={14} color={stage.color} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: stage.color }}>{stage.label}</span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: stage.color,
                  background: '#fff', padding: '2px 8px', borderRadius: 8,
                }}>
                  {colOrders.length}
                </span>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colOrders.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#9ca3af', fontSize: 11 }}>Empty</div>
                ) : (
                  colOrders.slice(0, 4).map(order => {
    const nextMap = { PENDING_VERIFICATION: 'PAID', PAID: 'SHIPPED' };
                    const nextStatus = nextMap[order.id ? stage.id : ''];
                    const isMoving = moving === order.id;
                    return (
                      <div key={order.id} style={{
                        background: '#fff', borderRadius: 8, padding: 12,
                        border: '1px solid #e5e7eb', opacity: isMoving ? 0.5 : 1,
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                          {order.orderId || `ORD-${order.id}`}
                        </div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>
                          {order.customerName || 'Customer'}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: stage.color, marginTop: 4 }}>
                          {(order.totals?.total || 0).toLocaleString()} XAF
                        </div>
                        {nextStatus && (
                          <button
                            onClick={() => moveOrder(order.id, stage.id)}
                            disabled={isMoving}
                            style={{
                              width: '100%', marginTop: 8,
                              padding: '6px 0', borderRadius: 6,
                              border: `1px solid ${stage.border}`,
                              background: '#fff', color: stage.color,
                              fontSize: 11, fontWeight: 600,
                              cursor: isMoving ? 'not-allowed' : 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                            }}
                          >
                            Advance <ChevronRight size={12} />
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
