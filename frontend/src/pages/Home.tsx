import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <section className="page" data-page="home">


  <div className="hero">
    <div className="wrap hero-grid">
      <div>
        <span className="eyebrow on-dark">Catering Services</span>
        <h1>Feasts of joy,<br />served with <em>distinction.</em></h1>
        <p className="lead">Dimpho ke Lesego Catering brings refined, home-cooked South African cuisine to your weddings, milestone celebrations, memorials and private gatherings, from Phaphadi, Limpopo, (Mamaila Village), to your table.</p>
        <div className="hero-ctas">
          <Link to="/menu" className="btn btn-gold">View the Menu</Link>
          <Link to="/book" className="btn btn-outline on-dark">Reserve Your Date</Link>
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
        <span className="eyebrow">Our Story</span>
        <h2>An elevated take on the family table.</h2>
        <p>Dimpho ke Lesego Catering began the way the finest hospitality always does — around a home table, for people we love. Today we cater weddings, milestone birthdays, memorials and private functions of every size, but the standard has never changed: exceptional ingredients, generous craftsmanship, and food that honours the occasion.</p>
        <p style={{ marginTop: '14px' }}>Every menu may be taken as our signature offering or tailored entirely to your event, your guest list and your vision. We attend to every detail so you are free to host, not manage.</p>
        <Link to="/about" className="btn btn-outline" style={{ marginTop: '20px' }}>Discover Our Story</Link>
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

  <section className="section tight" style={{ background: 'var(--cream-deep)', borderTop: '1px solid var(--cream-line)', borderBottom: '1px solid var(--cream-line)' }}>
    <div className="wrap" style={{ textAlign: 'center' }}>
      <span className="eyebrow">What We Bring</span>
      <h2>Our offerings</h2>
      <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
      <div className="grid-3">
        <div className="card">
          <div className="icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12c0-4 3-7 8-7s8 3 8 7-3 7-8 7-8-3-8-7Z" stroke="#C2902F" strokeWidth="1.4"/></svg></div>
          <h3>Culinary Excellence</h3>
          <p>Refined, flavour-forward feasts for events of any size — from an intimate dinner to a 300-guest celebration.</p>
        </div>
        <div className="card">
          <div className="icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 5h14v14H5z" stroke="#C2902F" strokeWidth="1.4"/><path d="M5 10h14M10 5v14" stroke="#C2902F" strokeWidth="1.4"/></svg></div>
          <h3>Bespoke Menus</h3>
          <p>Select a signature menu or compose your own — we accommodate dietary needs, culture and budget with care.</p>
        </div>
        <div className="card">
          <div className="icon-wrap"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-4.5-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-7 10-7 10Z" stroke="#C2902F" strokeWidth="1.4"/></svg></div>
          <h3>Attentive Service</h3>
          <p>We oversee every detail — headcount, timing, setup and delivery — so your day unfolds without a thought.</p>
        </div>
      </div>
    </div>
  </section>

  <section className="section">
    <div className="wrap" style={{ textAlign: 'center' }}>
      <span className="eyebrow">Crowd Favourites</span>
      <h2>A taste of the menu</h2>
      <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
      <div className="grid-3">
        <div className="dish-card">
          <div className="dish-photo dish-photo-real"><img src="/gallery-oxtail.png" alt="Oxtail Stew" /></div>
          <div className="dish-body">
            <h3>Oxtail Stew</h3>
            <span className="dish-price">R95</span>
            <p className="dish-desc">Slow-braised until it falls from the bone, in a rich tomato-onion gravy.</p>
          </div>
        </div>
        <div className="dish-card">
          <div className="dish-photo dish-photo-real"><img src="/gallery-morogo.png" alt="Morogo & Pap" /></div>
          <div className="dish-body">
            <h3>Morogo & Pap</h3>
            <span className="dish-price">R55</span>
            <p className="dish-desc">Traditional wild spinach with onion and tomato, served with stywe pap.</p>
          </div>
        </div>
        <div className="dish-card">
          <div className="dish-photo dish-photo-real"><img src="/gallery-malva.png" alt="Malva Pudding" /></div>
          <div className="dish-body">
            <h3>Malva Pudding</h3>
            <span className="dish-price">R35</span>
            <p className="dish-desc">Warm, syrup-soaked sponge with custard — the way it's meant to be.</p>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '36px' }}>
        <Link to="/menu" className="btn btn-outline">See the Full Menu</Link>
      </div>
    </div>
  </section>

  <section className="section tight" style={{ background: 'var(--burgundy)' }}>
    <div className="wrap" style={{ textAlign: 'center' }}>
      <span className="eyebrow on-dark">Occasions We Cater</span>
      <div className="chip-row" style={{ marginTop: '18px' }}>
        <span className="chip gold">Weddings</span>
        <span className="chip gold">Milestone Birthdays</span>
        <span className="chip gold">Memorials</span>
        <span className="chip gold">Family Gatherings</span>
        <span className="chip gold">Corporate Events</span>
        <span className="chip gold">Community Functions</span>
      </div>
    </div>
  </section>


  <section className="section testi-section" style={{ background: 'var(--cream-deep)', borderTop: '1px solid var(--cream-line)', borderBottom: '1px solid var(--cream-line)' }}>
    <div className="wrap">
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <span className="eyebrow">From Our Clients</span>
        <h2>Words from happy guests</h2>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
      </div>
      <div className="grid-3">
        <div className="testi">
          <div className="testi-stars">{'★'.repeat(5)}</div>
          <span className="quote-mark">"</span>
          <p>The pap and morogo tasted exactly like my grandmother's. Our guests are still talking about the oxtail weeks later. Truly exceptional catering.</p>
          <cite>— T. Maila · Wedding Reception, Polokwane</cite>
        </div>
        <div className="testi testi-featured">
          <div className="testi-stars">{'★'.repeat(5)}</div>
          <span className="quote-mark">"</span>
          <p>They arrived early, set up quietly, and the food kept coming. Exactly what we needed on a hard day. Everyone was nourished and comforted.</p>
          <cite>— N. Sello · Memorial Service, Tzaneen</cite>
        </div>
        <div className="testi">
          <div className="testi-stars">{'★'.repeat(5)}</div>
          <span className="quote-mark">"</span>
          <p>From the malva pudding to the grilled chicken — everything was perfect. I didn't have to worry about a single thing on my birthday. Highly recommended!</p>
          <cite>— P. Chauke · 50th Birthday Celebration</cite>
        </div>
      </div>
    </div>
  </section>

  <section className="section">
    <div className="wrap">
      <div className="cta-banner">
        <div>
          <h2>Ready to taste distinction?</h2>
          <p>Share your date and guest count — we'll take care of the rest.</p>
        </div>
        <Link to="/book" className="btn btn-gold">Reserve Your Date</Link>
      </div>
    </div>
  </section>


</section>
  );
};
