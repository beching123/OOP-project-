import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore, { isAuthenticated, isAdmin } from './stores/authStore';

// Layouts
import Layout from './components/Layout';
import CashierLayout from './layouts/CashierLayout';
import ProcessorLayout from './layouts/ProcessorLayout';
import SupportLayout from './layouts/SupportLayout';
import InventoryLayout from './layouts/InventoryLayout';

// Login
import LoginPage from './pages/LoginPage';

// Admin pages
import DashboardPage from './pages/DashboardPage';
import ActivityMonitorPage from './pages/ActivityMonitorPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import CustomersPage from './pages/CustomersPage';
import StaffPage from './pages/StaffPage';
import SettingsPage from './pages/SettingsPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SupportPage from './pages/SupportPage';

// Cashier pages
import CashierDashboard from './pages/cashier/CashierDashboard';
import CashierPayments from './pages/cashier/CashierPayments';

// Processor pages
import ProcessorDashboard from './pages/processor/ProcessorDashboard';
import ProcessorPipeline from './pages/processor/ProcessorPipeline';

// Support pages
import SupportDashboard from './pages/support/SupportDashboard';
import SupportInbox from './pages/support/SupportInbox';

// Inventory pages
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import InventoryStock from './pages/inventory/InventoryStock';

// Shared staff pages
import StaffMessaging from './pages/StaffMessaging';

function getRole() {
  const state = useAuthStore.getState();
  return (state.user?.role || '').replace('ROLE_', '');
}

function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (allowedRoles) {
    const role = getRole();
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  }
  return children;
}

// Admin routes
function AdminRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

// Cashier routes
function CashierRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['CASHIER']}>
      <CashierLayout>{children}</CashierLayout>
    </ProtectedRoute>
  );
}

// Processor routes
function ProcessorRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['ORDER_PROCESSOR']}>
      <ProcessorLayout>{children}</ProcessorLayout>
    </ProtectedRoute>
  );
}

// Support routes
function SupportRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['SUPPORT_AGENT']}>
      <SupportLayout>{children}</SupportLayout>
    </ProtectedRoute>
  );
}

// Inventory routes
function InventoryRoute({ children }) {
  return (
    <ProtectedRoute allowedRoles={['INVENTORY_MANAGER']}>
      <InventoryLayout>{children}</InventoryLayout>
    </ProtectedRoute>
  );
}

function RoleRedirect() {
  const role = getRole();
  const redirects = {
    ADMIN: '/admin/dashboard',
    CASHIER: '/cashier/dashboard',
    ORDER_PROCESSOR: '/processor/dashboard',
    SUPPORT_AGENT: '/support/dashboard',
    INVENTORY_MANAGER: '/inventory/dashboard',
  };
  return <Navigate to={redirects[role] || '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminRoute><DashboardPage /></AdminRoute>} />
        <Route path="/admin/activity" element={<AdminRoute><ActivityMonitorPage /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><ProductsPage /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><CategoriesPage /></AdminRoute>} />
        <Route path="/admin/customers" element={<AdminRoute><CustomersPage /></AdminRoute>} />
        <Route path="/admin/staff" element={<AdminRoute><StaffPage /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><SettingsPage /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><OrdersPage /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><OrderDetailPage /></AdminRoute>} />
        <Route path="/admin/support" element={<AdminRoute><SupportPage /></AdminRoute>} />

        {/* Cashier routes */}
        <Route path="/cashier/dashboard" element={<CashierRoute><CashierDashboard /></CashierRoute>} />
        <Route path="/cashier/payments" element={<CashierRoute><CashierPayments /></CashierRoute>} />
        <Route path="/cashier/orders" element={<CashierRoute><OrdersPage /></CashierRoute>} />
        <Route path="/cashier/orders/:id" element={<CashierRoute><OrderDetailPage /></CashierRoute>} />
        <Route path="/cashier/messages" element={<CashierRoute><StaffMessaging /></CashierRoute>} />

        {/* Order Processor routes */}
        <Route path="/processor/dashboard" element={<ProcessorRoute><ProcessorDashboard /></ProcessorRoute>} />
        <Route path="/processor/pipeline" element={<ProcessorRoute><ProcessorPipeline /></ProcessorRoute>} />
        <Route path="/processor/orders" element={<ProcessorRoute><OrdersPage /></ProcessorRoute>} />
        <Route path="/processor/orders/:id" element={<ProcessorRoute><OrderDetailPage /></ProcessorRoute>} />
        <Route path="/processor/messages" element={<ProcessorRoute><StaffMessaging /></ProcessorRoute>} />

        {/* Support Agent routes */}
        <Route path="/support/dashboard" element={<SupportRoute><SupportDashboard /></SupportRoute>} />
        <Route path="/support/inbox" element={<SupportRoute><SupportInbox /></SupportRoute>} />
        <Route path="/support/tickets" element={<SupportRoute><SupportPage /></SupportRoute>} />
        <Route path="/support/messages" element={<SupportRoute><StaffMessaging /></SupportRoute>} />

        {/* Inventory Manager routes */}
        <Route path="/inventory/dashboard" element={<InventoryRoute><InventoryDashboard /></InventoryRoute>} />
        <Route path="/inventory/stock" element={<InventoryRoute><InventoryStock /></InventoryRoute>} />
        <Route path="/inventory/products" element={<InventoryRoute><ProductsPage /></InventoryRoute>} />
        <Route path="/inventory/categories" element={<InventoryRoute><CategoriesPage /></InventoryRoute>} />
        <Route path="/inventory/messages" element={<InventoryRoute><StaffMessaging /></InventoryRoute>} />

        {/* Root redirect based on role */}
        <Route path="/" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
