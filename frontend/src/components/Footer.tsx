import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer>
  <div className="wrap">
    <div className="footer-grid">
      <div className="footer-brand">
        <img src="/logo.png" alt="Dimpho ke Lesego Catering Services logo" style={{ borderRadius: '50%' }} />
        <div>
          <h4>Dimpho ke Lesego</h4>
          <p style={{ fontSize: '0.9rem', color: '#D8C6A8' }}>Distinguished, home-cooked catering for weddings, celebrations, memorials and gatherings.</p>
          <span className="motto">"Good Food, Great Service, No Regrets."</span>
        </div>
      </div>
      <div>
        <h4>Explore</h4>
        <Link to="/menu" className="footer-link">Menu</Link>
        <Link to="/gallery" className="footer-link">Gallery</Link>
        <Link to="/contact" className="footer-link">Contact / About</Link>
      </div>
      <div>
        <h4>Legal</h4>
        <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
        <Link to="/accessibility" className="footer-link">Accessibility Statement</Link>
        <Link to="/terms" className="footer-link">Terms & Conditions</Link>
        <Link to="/refund-policy" className="footer-link">Refund Policy</Link>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Dimpho ke Lesego Catering. All rights reserved.</span>
      <span>Phaphadi, Mamaila Village, 0832 · +27 79 692 9591</span>
    </div>
  </div>
</footer>
  );
};
