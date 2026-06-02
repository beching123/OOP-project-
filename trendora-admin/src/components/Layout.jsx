import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import { LayoutDashboard, Activity, Package, FolderTree, Users, UserCog, Settings, ShoppingCart, Headphones, LogOut, Menu } from 'lucide-react';

const allLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN'] },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders', roles: ['ADMIN'] },
  { to: '/admin/support', icon: Headphones, label: 'Support', roles: ['ADMIN'] },
  { to: '/admin/activity', icon: Activity, label: 'Activity Monitor', roles: ['ADMIN'] },
  { to: '/admin/products', icon: Package, label: 'Products', roles: ['ADMIN'] },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories', roles: ['ADMIN'] },
  { to: '/admin/customers', icon: Users, label: 'Customers', roles: ['ADMIN'] },
  { to: '/admin/staff', icon: UserCog, label: 'Staff', roles: ['ADMIN'] },
  { to: '/admin/settings', icon: Settings, label: 'Settings', roles: ['ADMIN'] },
];

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = (user?.role || '').replace('ROLE_', '');

  const links = allLinks.filter((l) => l.roles.includes(role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase()
    : user?.username?.[0]?.toUpperCase() || 'A';

  return (
    <div className="app-layout">
      <aside className="sidebar" style={mobileOpen ? { width: 260 } : {}}>
        <div className="sidebar-brand">
          <h1>Trend<span>ora</span></h1>
          <p>{role === 'ADMIN' ? 'Admin Panel' : 'Staff Panel'}</p>
        </div>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout}>
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.fullName || user?.username || 'Staff'}</div>
              <div className="sidebar-user-role">{role}</div>
            </div>
            <LogOut size={16} color="#94a3b8" />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <button className="btn btn-secondary btn-sm" style={{ display: 'none' }} onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={18} />
          </button>
          <div className="topbar-actions">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user?.fullName || user?.username}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{role}</div>
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
