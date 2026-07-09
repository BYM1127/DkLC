import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Quote = () => {
  const location = useLocation();
  const preSelectedMenu = location.state?.selectedMenu || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    dateNeeded: '',
    guestCount: '',
    venueLocation: '',
    providerType: 'Caterer Provides Ingredients',
    notes: '',
    selectedMenu: preSelectedMenu,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  // If user navigated back and forth, ensure state is updated if location state changes
  useEffect(() => {
    if (preSelectedMenu && formData.selectedMenu !== preSelectedMenu) {
      setFormData(prev => ({ ...prev, selectedMenu: preSelectedMenu }));
    }
  }, [preSelectedMenu, formData.selectedMenu]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit quote');

      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <section className="page" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--bg-alt)' }}>
        <div className="wrap" style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '60px 40px', borderRadius: 'var(--radius)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ color: 'var(--burgundy)', marginBottom: '16px', fontFamily: 'var(--display)' }}>Quote Request Received</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px', color: 'var(--text-muted)' }}>Thank you, {formData.name}. We have received your details and will get back to you shortly with a personalized quote for your event at {formData.venueLocation || 'your venue'}.</p>
          <div style={{ marginBottom: '30px', padding: '16px', background: 'var(--bg-alt)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
            While you wait, please familiarize yourself with our <Link to="/refund-policy" style={{ textDecoration: 'underline', color: 'var(--text-main)', fontWeight: 600 }}>Refund Policy</Link> and <Link to="/terms" style={{ textDecoration: 'underline', color: 'var(--text-main)', fontWeight: 600 }}>Terms & Conditions</Link>.
          </div>
          <Link to="/" className="btn btn-outline" style={{ color: 'var(--text-main)', borderColor: 'var(--text-main)' }}>Return to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page" data-page="quote">
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow">Reserve Your Experience</span>
          <h1>Get a Personalized Quote</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>Tell us about your upcoming event, your venue, and your provisioning preferences. We'll craft a personalized quote to suit your needs and budget.</p>
        </div>
      </div>

      <section className="section bg-alt" style={{ paddingBottom: '120px' }}>
        <div className="wrap" style={{ maxWidth: '900px' }}>
          
          <form onSubmit={handleSubmit} className="form-card" style={{ padding: '60px' }}>
            
            {status === 'error' && (
              <div className="admin-login-error" style={{ marginBottom: '32px' }}>There was an error submitting your request. Please try again or contact us directly.</div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
              
              {/* Left Column: Event & Logistics */}
              <div>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', fontSize: '1.4rem' }}>Event Logistics</h3>
                <div className="field" style={{ marginBottom: '20px' }}>
                  <label htmlFor="eventType">Event Type</label>
                  <select id="eventType" name="eventType" value={formData.eventType} onChange={handleChange}>
                    <option value="">Select an event type...</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Birthday / Celebration">Birthday / Celebration</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Memorial / Funeral">Memorial / Funeral</option>
                    <option value="Family Gathering">Family Gathering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-grid" style={{ gap: '20px', marginBottom: '20px' }}>
                  <div className="field">
                    <label htmlFor="dateNeeded">Event Date</label>
                    <input type="date" id="dateNeeded" name="dateNeeded" value={formData.dateNeeded} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="guestCount">Guest Count</label>
                    <input type="number" id="guestCount" name="guestCount" min="1" placeholder="e.g. 50" value={formData.guestCount} onChange={handleChange} />
                  </div>
                </div>

                <div className="field" style={{ marginBottom: '20px' }}>
                  <label htmlFor="venueLocation">Venue Address (For Travel Calculation) *</label>
                  <input type="text" id="venueLocation" name="venueLocation" required placeholder="Full address or area" value={formData.venueLocation} onChange={handleChange} />
                </div>

                <div className="field" style={{ marginBottom: '20px' }}>
                  <label htmlFor="providerType">Provisioning *</label>
                  <select id="providerType" name="providerType" required value={formData.providerType} onChange={handleChange}>
                    <option value="Caterer Provides Ingredients">We provide all materials/ingredients</option>
                    <option value="Client Provides Ingredients">Client provides ingredients (We cook only)</option>
                  </select>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Let us know if you want the full service or if you're supplying the food.</span>
                </div>
              </div>

              {/* Right Column: Contact & Menu */}
              <div>
                <h3 style={{ marginBottom: '24px', color: 'var(--text-main)', fontSize: '1.4rem' }}>Contact & Menu</h3>
                
                <div className="field" style={{ marginBottom: '20px' }}>
                  <label htmlFor="name">Your Name *</label>
                  <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
                </div>
                
                <div className="form-grid" style={{ gap: '20px', marginBottom: '20px' }}>
                  <div className="field">
                    <label htmlFor="phone">Phone / WhatsApp *</label>
                    <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="field" style={{ marginBottom: '20px' }}>
                  <label htmlFor="selectedMenu">Menu Selection</label>
                  {formData.selectedMenu ? (
                    <div style={{ padding: '16px', background: 'var(--bg-alt)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--burgundy)', fontWeight: '600', fontSize: '0.9rem' }}>
                      {formData.selectedMenu}
                      <Link to="/build-menu" style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', textDecoration: 'underline', fontWeight: '400' }}>Change Menu</Link>
                    </div>
                  ) : (
                    <div style={{ padding: '16px', background: 'var(--bg-alt)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '12px' }}>No menu selected yet.</span>
                      <Link to="/build-menu" className="btn btn-outline" style={{ color: 'var(--text-main)', borderColor: 'var(--border-subtle)', padding: '8px 16px' }}>Build a Menu</Link>
                    </div>
                  )}
                  <input type="hidden" name="selectedMenu" value={formData.selectedMenu} />
                </div>

                <div className="field">
                  <label htmlFor="notes">Special Requests</label>
                  <textarea id="notes" name="notes" rows={3} value={formData.notes} onChange={handleChange} placeholder="Any dietary needs, allergies, or specific requests?"></textarea>
                </div>

              </div>

            </div>

            <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                By submitting this quote request, you agree to our <Link to="/refund-policy" style={{ textDecoration: 'underline', color: 'var(--text-main)' }}>Refund Policy</Link> and <Link to="/terms" style={{ textDecoration: 'underline', color: 'var(--text-main)' }}>Terms & Conditions</Link>.
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '1rem' }} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting...' : 'Request Quote'}
              </button>
            </div>

          </form>
        </div>
      </section>
    </section>
  );
};
