import { useState, useEffect } from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Menu, X } from 'lucide-react';

export const AdminLayout = () => {
  const { isAuthenticated, logout } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-shell">
      {/* Mobile Topbar */}
      <div className="admin-mobile-topbar no-print">
        <div className="admin-brand-icon" style={{ width: 36, height: 36, fontSize: '0.9rem' }}>DkL</div>
        <span style={{ fontWeight: 'bold', fontFamily: 'var(--display)' }}>Admin Panel</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-main)' }}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon">DkL</div>
          <div>
            <div className="admin-brand-name">Admin Panel</div>
            <div className="admin-brand-sub">Dimpho ke Lesego</div>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">Management</div>
          <NavLink to="/admin" end className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">📊</span>
            Dashboard
          </NavLink>
          <NavLink to="/admin/quotes" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">📄</span>
            Quotes
          </NavLink>
          <NavLink to="/admin/menu" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">🍽️</span>
            Menu Items
          </NavLink>
          <NavLink to="/admin/preset-menus" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">📋</span>
            Preset Menus
          </NavLink>
          <NavLink to="/admin/portfolio" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">🖼️</span>
            Portfolio
          </NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">⚙️</span>
            Site Settings
          </NavLink>
          <NavLink to="/admin/contacts" className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}>
            <span className="admin-nav-icon">💬</span>
            Messages
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" className="admin-nav-link" target="_blank" rel="noopener">
            <span className="admin-nav-icon">🌐</span>
            View Site
          </a>
          <button className="admin-nav-link admin-logout-btn" onClick={logout}>
            <span className="admin-nav-icon">🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};
