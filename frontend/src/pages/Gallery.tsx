
export const Gallery = () => {
  return (
    <section className="page" data-page="gallery">

  <div className="page-banner">
    <div className="wrap">
      <span className="eyebrow on-dark">Gallery</span>
      <h1>A taste of what we serve.</h1>
      <p>Placeholder visuals shown below — swap these for your own event and food photography.</p>
    </div>
  </div>

  <section className="section">
    <div className="wrap">
      <div className="filter-row" id="filterRow">
        <button className="filter-btn active" data-filter="all">All</button>
        <button className="filter-btn" data-filter="mains">Mains</button>
        <button className="filter-btn" data-filter="platters">Platters & Spreads</button>
        <button className="filter-btn" data-filter="desserts">Desserts</button>
        <button className="filter-btn" data-filter="setups">Event Setups</button>
      </div>

      <div className="gallery-grid" id="galleryGrid">
        <div className="gallery-item" data-cat="mains"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><path d="M5 11h14l-1.5 7a2 2 0 0 1-2 1.6H8.5a2 2 0 0 1-2-1.6L5 11Z" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Oxtail Stew<span className="tag">Mains</span></div></div>
        <div className="gallery-item" data-cat="mains"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Grilled Chicken Quarters<span className="tag">Mains</span></div></div>
        <div className="gallery-item" data-cat="platters"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><rect x="4" y="9" width="16" height="9" rx="2" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Full Feast Spread<span className="tag">Platters</span></div></div>
        <div className="gallery-item" data-cat="platters"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#5F0C0C" strokeWidth="1.4"/><circle cx="12" cy="12" r="4" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Salad & Sides Table<span className="tag">Platters</span></div></div>
        <div className="gallery-item" data-cat="desserts"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#5F0C0C" strokeWidth="1.4"/><path d="M12 8v8M8 12h8" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Malva Pudding<span className="tag">Desserts</span></div></div>
        <div className="gallery-item" data-cat="desserts"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><path d="M6 18c0-7 3-12 6-12s6 5 6 12" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Koeksisters<span className="tag">Desserts</span></div></div>
        <div className="gallery-item" data-cat="setups"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><path d="M4 20h16M6 20V8h12v12" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Reception Table Setup<span className="tag">Event Setups</span></div></div>
        <div className="gallery-item" data-cat="setups"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3v18M3 12h18" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Wedding Buffet Layout<span className="tag">Event Setups</span></div></div>
        <div className="gallery-item" data-cat="mains"><div className="gallery-photo"><svg viewBox="0 0 24 24" fill="none"><path d="M6 4v16M6 4h6a4 4 0 0 1 0 8H6" stroke="#5F0C0C" strokeWidth="1.4"/></svg></div><div className="gallery-cap">Morogo & Pap<span className="tag">Mains</span></div></div>
      </div>

      <p className="gallery-note">These tiles are stylised placeholders. Send us your event photos and we'll set them directly into this grid.</p>
    </div>
  </section>

</section>
  );
};
