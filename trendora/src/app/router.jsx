import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { isAuthenticated, isStaff } from '../stores/authStore';

// Layouts
import StorefrontLayout from './layouts/StorefrontLayout';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import HomePage from '../pages/storefront/HomePage';
import CatalogPage from '../pages/storefront/CatalogPage';
import ProductDetailPage from '../pages/storefront/ProductDetailPage';
import CartPage from '../pages/storefront/CartPage';
import CheckoutPage from '../pages/storefront/CheckoutPage';
import OrderConfirmationPage from '../pages/storefront/OrderConfirmationPage';
import TrackOrderPage from '../pages/storefront/TrackOrderPage';
import LoginPage from '../pages/storefront/LoginPage';
import RegisterPage from '../pages/storefront/RegisterPage';
import ProfilePage from '../pages/storefront/ProfilePage';
import AboutPage from '../pages/storefront/AboutPage';
import ContactPage from '../pages/storefront/ContactPage';
import ReturnPolicyPage from '../pages/storefront/ReturnPolicyPage';
import LandingPage from '../pages/LandingPage';

// Placeholder for unbuilt pages
import PlaceholderPage from '../pages/PlaceholderPage';

// Route Guards
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  if (!isStaff()) return <Navigate to="/login" replace />;
  return children;
};

// Protected storefront route - requires authentication
const protectedStorefrontRoute = (path, element) => ({
  path,
  element: <StorefrontLayout />,
  children: [{ index: true, element: <ProtectedRoute>{element}</ProtectedRoute> }],
});

// Public storefront route - no auth required
const publicStorefrontRoute = (path, element) => ({
  path,
  element: <StorefrontLayout />,
  children: [{ index: true, element }],
});

const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  protectedStorefrontRoute('/about', <AboutPage />),
  protectedStorefrontRoute('/contact', <ContactPage />),
  protectedStorefrontRoute('/return-policy', <ReturnPolicyPage />),

  // Protected routes - require account
  protectedStorefrontRoute('/home', <HomePage />),
  protectedStorefrontRoute('/catalog', <CatalogPage />),
  protectedStorefrontRoute('/catalog/:category', <CatalogPage />),
  protectedStorefrontRoute('/product/:id', <ProductDetailPage />),
  protectedStorefrontRoute('/cart', <CartPage />),
  protectedStorefrontRoute('/track-order', <TrackOrderPage />),
  protectedStorefrontRoute('/profile', <ProfilePage />),
  protectedStorefrontRoute('/checkout', <CheckoutPage />),
  protectedStorefrontRoute('/order-confirmation/:id', <OrderConfirmationPage />),

  // Admin routes
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <PlaceholderPage title="Admin Dashboard" /> },
      { path: 'products', element: <PlaceholderPage title="Products List" /> },
      { path: 'products/new', element: <PlaceholderPage title="Add Product" /> },
      { path: 'products/:id/edit', element: <PlaceholderPage title="Edit Product" /> },
      { path: 'orders', element: <PlaceholderPage title="Orders List" /> },
      { path: 'orders/:id', element: <PlaceholderPage title="Order Detail" /> },
      { path: 'categories', element: <PlaceholderPage title="Categories" /> },
      { path: 'support', element: <PlaceholderPage title="Support Tickets" /> },
      { path: 'support/:id', element: <PlaceholderPage title="Ticket Detail" /> },
      { path: 'customers', element: <PlaceholderPage title="Customers" /> },
      { path: 'settings', element: <PlaceholderPage title="Settings" /> },
    ],
  },
  { path: '*', element: <PlaceholderPage title="404 - Not Found" /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
