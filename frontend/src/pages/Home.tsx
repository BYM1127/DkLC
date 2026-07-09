import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type MenuItemProps = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageBase64: string;
};

type GalleryItemProps = {
  id: string;
  eventName: string;
  description: string;
  imageBase64: string;
};

export const Home = () => {
  const [featuredItems, setFeaturedItems] = useState<MenuItemProps[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryItemProps[]>([]);
  const [aboutText, setAboutText] = useState('Dimpho ke Lesego Catering brings refined, home-cooked South African cuisine to your weddings, milestone celebrations, memorials and private gatherings, from Phaphadi, Limpopo, (Mamaila Village), to your table.');

  useEffect(() => {
    // Fetch Settings (About text)
    fetch('/api/settings').then(res => res.json()).then(data => {
      if (data && data.aboutText) setAboutText(data.aboutText);
    }).catch(console.error);

    // Fetch Menu
    fetch('/api/menu').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setFeaturedItems(data.slice(0, 3));
    }).catch(console.error);

    // Fetch Gallery
    fetch('/api/gallery').then(res => res.json()).then(data => {
      if (Array.isArray(data)) setGalleryImages(data.slice(0, 4));
    }).catch(console.error);
  }, []);

  const buildWhatsAppLink = (itemName: string) => {
    const text = `Hi, I'd like to order ${itemName}`;
    return `https://wa.me/27796929591?text=${encodeURIComponent(text)}`;
  };

  return (
    <section className="page" data-page="home">

  <div className="hero">
    <div className="wrap hero-grid">
      <div>
        <span className="eyebrow on-dark">Catering Services</span>
        <h1>Delicious catering for your special event</h1>
        <p className="lead">{aboutText}</p>
        <div className="hero-ctas">
          <Link to="/menu" className="btn btn-gold">View the Menu</Link>
          <Link to="/quote" className="btn btn-outline on-dark">Get a Quote</Link>
        </div>
      </div>
      <div className="hero-art">
        <div className="ring-frame"><img src="/logo.png" alt="Dimpho ke Lesego Catering Services logo" style={{ height: '240px', width: '240px', objectFit: 'contain' }} /></div>
      </div>
    </div>
  </div>

  <div className="motto-strip">
    <span>Good Food <span className="dot">·</span> Great Service <span className="dot">·</span> No Regrets</span>
  </div>

  <section className="section">
    <div className="wrap story">
      <div>
        <span className="eyebrow">Why Us</span>
        <h2>An elevated take on the family table.</h2>
        <p>{aboutText}</p>
        <p style={{ marginTop: '14px' }}>Every menu may be taken as our signature offering or tailored entirely to your event, your guest list and your vision. We attend to every detail so you are free to host, not manage.</p>
        <Link to="/contact" className="btn btn-outline" style={{ marginTop: '20px' }}>Discover Our Story</Link>
      </div>
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3v6M9 6h6" stroke="#C2902F" strokeWidth="1.4"/><circle cx="12" cy="14" r="7" stroke="#C2902F" strokeWidth="1.4"/></svg></div>
          <h3>Weddings</h3>
        </div>
        <div className="card">
          <div className="icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7-8-3-8-7Z" stroke="#C2902F" strokeWidth="1.4"/></svg></div>
          <h3>Celebrations</h3>
        </div>
        <div className="card">
          <div className="icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3c2 3 4 5 4 8a4 4 0 0 1-8 0c0-3 2-5 4-8Z" stroke="#C2902F" strokeWidth="1.4"/></svg></div>
          <h3>Memorials</h3>
        </div>
        <div className="card">
          <div className="icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="9" r="2.2" stroke="#C2902F" strokeWidth="1.4"/><circle cx="16" cy="9" r="2.2" stroke="#C2902F" strokeWidth="1.4"/><path d="M3 19c0-3 2.5-5 5-5s5 2 5 5M11 19c0-3 2.5-5 5-5s5 2 5 5" stroke="#C2902F" strokeWidth="1.4"/></svg></div>
          <h3>Private Gatherings</h3>
        </div>
      </div>
    </div>
  </section>

  {featuredItems.length > 0 && (
    <section className="section" style={{ background: 'var(--cream-deep)', borderTop: '1px solid var(--cream-line)', borderBottom: '1px solid var(--cream-line)' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <span className="eyebrow">Crowd Favourites</span>
        <h2>A taste of the menu</h2>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
        <div className="grid-3">
          {featuredItems.map(item => (
            <div key={item.id} className="dish-card" style={{ display: 'flex', flexDirection: 'column' }}>
              {item.imageBase64 && (
                <div className="dish-photo dish-photo-real"><img src={item.imageBase64} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
              )}
              <div className="dish-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3>{item.name}</h3>
                <span className="dish-price">R{item.price}</span>
                <p className="dish-desc" style={{ flex: 1, marginBottom: '20px' }}>{item.description}</p>
                <a href={buildWhatsAppLink(item.name)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp" style={{ width: '100%', justifyContent: 'center' }}>
                  Order on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '36px' }}>
          <Link to="/menu" className="btn btn-outline">See the Full Menu</Link>
        </div>
      </div>
    </section>
  )}

  {galleryImages.length > 0 && (
    <section className="section">
      <div className="wrap" style={{ textAlign: 'center' }}>
        <span className="eyebrow">Recent Events</span>
        <h2>Gallery Teaser</h2>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
        <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {galleryImages.map(img => (
            <div key={img.id} className="gallery-item">
              <div className="gallery-photo" style={{ height: '220px' }}>
                {img.imageBase64 ? (
                  <img src={img.imageBase64} alt={img.eventName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '36px' }}>
          <Link to="/gallery" className="btn btn-outline">See Full Gallery</Link>
        </div>
      </div>
    </section>
  )}

  <section className="section">
    <div className="wrap">
      <div className="cta-banner">
        <div>
          <h2>Ready to taste distinction?</h2>
          <p>Share your date and guest count — we'll take care of the rest.</p>
        </div>
        <Link to="/quote" className="btn btn-gold">Get a Quote</Link>
      </div>
    </div>
  </section>

</section>
  );
};
