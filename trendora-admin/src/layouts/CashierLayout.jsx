import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { notificationService } from '../services/adminService';
import { LayoutDashboard, CreditCard, ShoppingCart, MessageCircle, Bell, LogOut } from 'lucide-react';

const links = [
  { to: '/cashier/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/cashier/payments', icon: CreditCard, label: 'Payments' },
  { to: '/cashier/orders', icon: ShoppingCart, label: 'All Orders' },
  { to: '/cashier/messages', icon: MessageCircle, label: 'Messages' },
];

function getNotifRedirect(type, referenceId) {
  if (type === 'order') return '/cashier/orders';
  if (type === 'payment') return '/cashier/payments';
  if (type === 'ticket') return '/cashier/orders';
  return '/cashier/dashboard';
}

export default function CashierLayout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const loadNotifications = async () => {
    try {
      const { data } = await notificationService.getNotifications(user?.id || 1, 20);
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  };

  const handleNotifClick = async (notif) => {
    try {
      await notificationService.markAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
    setShowNotif(false);
    navigate(getNotifRedirect(notif.type, notif.referenceId));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'C';

  return (
    <div className="app-layout">
      <aside style={{
        width: 260, background: '#ffffff', display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, borderRight: '1px solid #e5e7eb',
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #f3f4f6' }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#059669', letterSpacing: '-0.5px' }}>
            Trend<span style={{ color: '#d4af37' }}>ora</span>
          </h1>
          <p style={{ fontSize: 11, color: '#6b7280', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
            Cashier Portal
          </p>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8,
                color: isActive ? '#059669' : '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500,
                background: isActive ? 'rgba(5, 150, 105, 0.08)' : 'transparent', transition: 'all 0.2s ease',
              })}>
              <link.icon size={18} /> {link.label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px', borderRadius: 8, cursor: 'pointer' }} onClick={handleLogout}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
              {initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user?.fullName || user?.username || 'Cashier'}</div>
              <div style={{ fontSize: 11, color: '#d4af37', fontWeight: 500 }}>Cashier</div>
            </div>
            <LogOut size={16} color="#9ca3af" />
          </div>
        </div>
      </aside>
      <main style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ height: 56, background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', gap: 16 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowNotif(!showNotif)} style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid #e5e7eb', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} color="#6b7280" />
              {unreadCount > 0 && <span style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: '50%', background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</span>}
            </button>
            {showNotif && (
              <div style={{ position: 'absolute', top: 44, right: 0, width: 320, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 200, overflow: 'hidden', maxHeight: 400, overflowY: 'auto' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
                  {unreadCount > 0 && <span style={{ fontSize: 11, color: '#059669', cursor: 'pointer' }} onClick={async () => { await notificationService.markAllAsRead(user?.id || 1); loadNotifications(); }}>Mark all read</span>}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: 30, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No notifications</div>
                ) : notifications.map(n => (
                  <div key={n.id} onClick={() => handleNotifClick(n)} style={{ padding: '10px 16px', borderBottom: '1px solid #f9fafb', background: n.read ? 'transparent' : 'rgba(5,150,105,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}>
                    <div style={{ fontSize: 12, color: '#374151', fontWeight: n.read ? 400 : 600 }}>{n.title}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{n.message}</div>
                    <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 3 }}>{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>{initials}</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{user?.fullName || user?.username}</div>
              <div style={{ fontSize: 11, color: '#d4af37', fontWeight: 500 }}>Cashier</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 24 }}>{children}</div>
      </main>
    </div>
  );
}
