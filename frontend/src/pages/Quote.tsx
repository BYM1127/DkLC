import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Quote = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: '',
    dateNeeded: '',
    guestCount: '',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
      <section className="page" style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="wrap" style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--cream-deep)', padding: '60px 40px', borderRadius: 'var(--radius)', border: '1px solid var(--cream-line)' }}>
          <h2 style={{ color: 'var(--burgundy)', marginBottom: '16px' }}>Quote Request Sent!</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '30px' }}>Thank you, {formData.name}. We have received your details and will get back to you shortly with a personalized quote.</p>
          <Link to="/" className="btn btn-outline">Return to Home</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page" data-page="quote">
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow on-dark">Custom Orders</span>
          <h1>Get a Quote</h1>
          <p>Tell us about your upcoming event, and we'll craft a personalized menu and quote to suit your needs and budget.</p>
        </div>
      </div>

      <section className="section">
        <div className="wrap" style={{ maxWidth: '700px' }}>
          <form onSubmit={handleSubmit} className="form-card">
            <h3 style={{ marginBottom: '24px', textAlign: 'center' }}>Event Details</h3>
            
            {status === 'error' && (
              <div className="admin-login-error" style={{ marginBottom: '20px' }}>There was an error submitting your request. Please try again or contact us directly.</div>
            )}

            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Your Name *</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone / WhatsApp *</label>
                <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="field">
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
              <div className="field">
                <label htmlFor="dateNeeded">Event Date</label>
                <input type="date" id="dateNeeded" name="dateNeeded" value={formData.dateNeeded} onChange={handleChange} />
              </div>
              <div className="field">
                <label htmlFor="guestCount">Estimated Guests</label>
                <input type="number" id="guestCount" name="guestCount" min="1" value={formData.guestCount} onChange={handleChange} />
              </div>
              <div className="field full">
                <label htmlFor="notes">Special Requests / Dietary Needs</label>
                <textarea id="notes" name="notes" rows={4} value={formData.notes} onChange={handleChange} placeholder="Tell us more about your menu preferences, venue, or any specific requirements..."></textarea>
              </div>
            </div>

            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Submitting...' : 'Request Quote'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </section>
  );
};
