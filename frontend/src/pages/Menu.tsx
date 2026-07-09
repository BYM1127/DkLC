import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type MenuItemProps = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageBase64: string;
};

export const Menu = () => {
  const [items, setItems] = useState<MenuItemProps[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const buildWhatsAppLink = (itemName: string) => {
    const text = `Hi, I'd like to order ${itemName}`;
    return `https://wa.me/27796929591?text=${encodeURIComponent(text)}`;
  };

  const categories = ['All', ...Array.from(new Set(items.map(i => i.category)))].filter(Boolean);
  const filteredItems = activeCategory === 'All' ? items : items.filter(i => i.category === activeCategory);

  return (
    <section className="page" data-page="menu">
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow on-dark">Our Menu</span>
          <h1>Choose your feast.</h1>
          <p>Browse our selection of refined, home-cooked dishes. All orders are processed directly on WhatsApp.</p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner"></div>
              <p>Loading menu...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="admin-empty">
              <p>Our menu is currently being updated. Check back soon!</p>
            </div>
          ) : (
            <>
              {categories.length > 2 && (
                <div className="filter-row" style={{ marginBottom: '40px' }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid-3">
                {filteredItems.map(item => (
                  <div key={item.id} className="dish-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {item.imageBase64 ? (
                      <div className="dish-photo dish-photo-real">
                        <img src={item.imageBase64} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div className="dish-photo">
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                      </div>
                    )}
                    <div className="dish-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3>{item.name}</h3>
                      <span className="dish-price">R{item.price}</span>
                      <p className="dish-desc" style={{ flex: 1, marginBottom: '20px' }}>{item.description}</p>
                      
                      <a href={buildWhatsAppLink(item.name)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
                        Order on WhatsApp
                      </a>
                      <span style={{ fontSize: '0.75rem', color: 'var(--ink-soft)' }}>Custom quantities or bulk? <Link to="/quote" style={{ textDecoration: 'underline' }}>Get a quote</Link></span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </section>
  );
};
