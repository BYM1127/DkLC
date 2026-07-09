import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Utensils, Image, Phone, Menu as MenuIcon, X } from 'lucide-react';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header">
      <div className="nav-row">
        <Link to="/" className="brand">
          <img src="/logo.png" alt="Dimpho ke Lesego Catering Services logo" />
          <span>
            <span className="brand-name">Dimpho ke Lesego</span>
            <span className="brand-tagline">Catering Services</span>
          </span>
        </Link>
        <div className="nav-right">
          <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-link"><Home size={16} /> Home</Link>
            <Link to="/menu" className="nav-link"><Utensils size={16} /> Menu</Link>
            <Link to="/portfolio" className="nav-link"><Image size={16} /> Portfolio</Link>
            <Link to="/contact" className="nav-link"><Phone size={16} /> Contact / About</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
