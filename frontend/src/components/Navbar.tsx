import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Info, Utensils, Image, Phone, ShoppingCart as ShoppingCartIcon, Calendar, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { toggleCart, cartCount } = useCart();
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
          <button className="cart-btn" aria-label="View your order" onClick={toggleCart}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/></svg>
            <span className="cart-badge" style={{display: cartCount > 0 ? 'flex' : 'none'}}>{cartCount}</span>
          </button>
          <button className="menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
            <Link to="/" className="nav-link"><Home size={16} /> Home</Link>
            <Link to="/about" className="nav-link"><Info size={16} /> About</Link>
            <Link to="/menu" className="nav-link"><Utensils size={16} /> Menu</Link>
            <Link to="/gallery" className="nav-link"><Image size={16} /> Gallery</Link>
            <Link to="/contact" className="nav-link"><Phone size={16} /> Contact</Link>
            <Link to="/order" className="nav-link"><ShoppingCartIcon size={16} /> Order Online</Link>
            <Link to="/book" className="nav-cta"><Calendar size={16} /> Reserve / Book</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
