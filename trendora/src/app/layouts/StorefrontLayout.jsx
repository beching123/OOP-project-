import { Outlet } from 'react-router-dom';
import Navbar from '../../components/storefront/Navbar';
import Footer from '../../components/storefront/Footer';
import SupportChat from '../../components/storefront/SupportChat';

export default function StorefrontLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <SupportChat />
    </div>
  );
}
