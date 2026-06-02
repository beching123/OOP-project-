import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="admin-layout flex h-screen bg-bg-secondary overflow-hidden">
      {/* Sidebar placeholder */}
      <aside className="w-64 bg-surface border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <h1 className="text-lg font-bold text-primary">TRENDORA Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="p-2 hover:bg-bg-secondary rounded cursor-pointer">Dashboard</div>
          <div className="p-2 hover:bg-bg-secondary rounded cursor-pointer">Products</div>
          <div className="p-2 hover:bg-bg-secondary rounded cursor-pointer">Orders</div>
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar placeholder */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
          <div className="font-medium">Admin Panel</div>
          <div className="text-sm">Admin User</div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
