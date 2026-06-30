import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <section className="page" data-page="about">

  <div className="page-banner">
    <div className="wrap">
      <span className="eyebrow on-dark">About Us</span>
      <h1>Good food, great service, no regrets.</h1>
      <p>That has been our promise since we began cooking for our own family's celebrations — and it remains so for every event we cater.</p>
    </div>
  </div>

  <section className="section">
    <div className="wrap story">
      <div>
        <h2>Our story</h2>
        <p>Dimpho ke Lesego Catering is a distinguished, home-grown catering service based in Phaphadi, Mamaila Village. We specialise in weddings, milestone celebrations, memorials and family gatherings — occasions where food is not merely a menu item, but a gesture of care.</p>
        <p style={{ marginTop: '14px' }}>We pursue customer satisfaction through high-quality, generously-portioned cooking. With a range of signature menus and bespoke options, we adapt to your occasion, your guest list and your budget, and our team remains with you from the first enquiry to the final course.</p>
      </div>
      <div className="card" style={{ textAlign: 'left' }}>
        <h3 style={{ textAlign: 'center' }}>What guides us</h3>
        <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
        <div className="chip-row">
          <span className="chip gold">Made Fresh, Same-Day</span>
          <span className="chip gold">Generous Portions</span>
          <span className="chip gold">Community First</span>
          <span className="chip gold">Every Occasion Welcomed</span>
        </div>
      </div>
    </div>
  </section>

  <section className="section" style={{ background: 'var(--cream-deep)', borderTop: '1px solid var(--cream-line)', borderBottom: '1px solid var(--cream-line)' }}>
    <div className="wrap" style={{ textAlign: 'center' }}>
      <span className="eyebrow">How Booking Works</span>
      <h2>From enquiry to your table, in four steps</h2>
      <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
      <div className="steps">
        <div className="step">
          <span className="num">I.</span>
          <h3 style={{ marginTop: '10px' }}>Enquire</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Tell us your date, occasion and approximate guest count.</p>
        </div>
        <div className="step">
          <span className="num">II.</span>
          <h3 style={{ marginTop: '10px' }}>Choose Your Feast</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Select a signature menu, a package, or compose your own.</p>
        </div>
        <div className="step">
          <span className="num">III.</span>
          <h3 style={{ marginTop: '10px' }}>Confirm</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>We secure your date and finalise headcount and timing.</p>
        </div>
        <div className="step">
          <span className="num">IV.</span>
          <h3 style={{ marginTop: '10px' }}>We Cook & Serve</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>Fresh food, delivered or served, precisely when you need it.</p>
        </div>
      </div>
    </div>
  </section>

  <section className="section">
    <div className="wrap" style={{ textAlign: 'center' }}>
      <span className="eyebrow">Occasions Served</span>
      <h2>We cater for...</h2>
      <div className="ornate-divider"><span className="line"></span><span className="diamond"></span><span className="line"></span></div>
      <div className="grid-3">
        <div className="card"><h3>Weddings</h3><p style={{ fontSize: '0.92rem', marginTop: '8px' }}>Full receptions or intimate ceremonies, handled with grace.</p></div>
        <div className="card"><h3>Milestone Birthdays</h3><p style={{ fontSize: '0.92rem', marginTop: '8px' }}>From elegant soirées to joyful family celebrations.</p></div>
        <div className="card"><h3>Memorials</h3><p style={{ fontSize: '0.92rem', marginTop: '8px' }}>Respectful, beautifully-organised service when it matters most.</p></div>
        <div className="card"><h3>Family Gatherings</h3><p style={{ fontSize: '0.92rem', marginTop: '8px' }}>Sunday lunches, reunions, and everything in between.</p></div>
        <div className="card"><h3>Corporate Events</h3><p style={{ fontSize: '0.92rem', marginTop: '8px' }}>Staff functions, launches and end-of-year celebrations.</p></div>
        <div className="card"><h3>Community Functions</h3><p style={{ fontSize: '0.92rem', marginTop: '8px' }}>Church events, stokvels and distinguished local occasions.</p></div>
      </div>
      <div style={{ marginTop: '36px' }}>
        <Link to="/book" className="btn btn-gold">Let's Plan Your Feast</Link>
      </div>
    </div>
  </section>

</section>
  );
};
