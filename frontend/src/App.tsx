import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Menu } from './pages/Menu';
import { Gallery } from './pages/Gallery';
import { Book } from './pages/Book';
import { Order } from './pages/Order';
import { Contact } from './pages/Contact';
import { CartProvider } from './context/CartContext';
import { CartDrawer } from './components/CartDrawer';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminBookings } from './pages/admin/AdminBookings';
import { AdminContacts } from './pages/admin/AdminContacts';
import './index.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/** Public layout wrapper — shows Navbar + Footer */
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    <CartDrawer />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public routes — with Navbar + Footer */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/menu" element={<PublicLayout><Menu /></PublicLayout>} />
          <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/book" element={<PublicLayout><Book /></PublicLayout>} />
          <Route path="/order" element={<PublicLayout><Order /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin routes — own layout, no public Navbar/Footer */}
          <Route path="/admin/login" element={
            <AdminAuthProvider>
              <AdminLogin />
            </AdminAuthProvider>
          } />
          <Route path="/admin" element={
            <AdminAuthProvider>
              <AdminLayout />
            </AdminAuthProvider>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="contacts" element={<AdminContacts />} />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
