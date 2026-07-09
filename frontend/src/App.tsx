import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Quote } from './pages/Quote';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminQuotes } from './pages/admin/AdminQuotes';
import { AdminMenu } from './pages/admin/AdminMenu';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminContacts } from './pages/admin/AdminContacts';
import './index.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const WA_NUMBER = '27796929591'; // +27 79 692 9591
const WA_MSG = encodeURIComponent("Hi! I'd like to enquire about catering for my event. Could you please assist?");
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

/** Floating WhatsApp button */
const WhatsAppButton = () => (
  <a
    href={WA_HREF}
    target="_blank"
    rel="noopener noreferrer"
    className="whatsapp-float"
    aria-label="Chat with us on WhatsApp"
    title="Chat on WhatsApp"
  >
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.16L2 22l4.978-1.407A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm4.93 13.563c-.207.581-1.213 1.11-1.656 1.162-.422.049-.958.069-1.547-.097-.357-.103-.814-.24-1.396-.471-2.454-.999-4.055-3.448-4.178-3.608-.122-.16-.993-1.32-.993-2.518 0-1.197.629-1.787.852-2.031.222-.245.484-.306.646-.306.161 0 .322.002.463.009.147.007.344-.056.54.412.2.477.68 1.657.739 1.777.06.12.099.26.02.42-.08.16-.12.26-.239.4-.12.14-.252.313-.36.42-.12.12-.244.249-.105.488.14.24.621.976 1.333 1.58.916.777 1.688 1.018 1.927 1.133.24.115.38.097.52-.058.14-.155.6-.702.76-.942.16-.24.32-.2.54-.12.22.08 1.397.659 1.636.779.24.12.4.18.46.28.06.1.06.579-.147 1.16Z"/>
    </svg>
    <span className="whatsapp-label">Chat with us</span>
  </a>
);

/** Public layout wrapper — shows Navbar + Footer */
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
    <WhatsAppButton />
  </>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes — with Navbar + Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/menu" element={<PublicLayout><Menu /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/quote" element={<PublicLayout><Quote /></PublicLayout>} />

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
          <Route path="quotes" element={<AdminQuotes />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="portfolio" element={<AdminGallery />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
