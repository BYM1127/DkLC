import { useState, useEffect } from 'react';

export const Contact = () => {
  const [aboutText, setAboutText] = useState('Loading...');
  const [settings, setSettings] = useState({
    contactPhone: '+27 79 692 9591',
    contactEmail: '',
    address: 'Phaphadi, Mamaila Village, 0832',
    deliveryAreas: 'Limpopo, Gauteng',
    hoursOfOperation: 'Mon-Sat: 08:00 - 17:00, Sun: Closed',
  });

  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.aboutText) {
          setAboutText(data.aboutText);
          setSettings({
            contactPhone: data.contactPhone || settings.contactPhone,
            contactEmail: data.contactEmail || settings.contactEmail,
            address: data.address || settings.address,
            deliveryAreas: data.deliveryAreas || settings.deliveryAreas,
            hoursOfOperation: data.hoursOfOperation || settings.hoursOfOperation,
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit message');

      setStatus('success');
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section className="page" data-page="contact">
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow on-dark">About & Contact</span>
          <h1>We’d love to hear from you.</h1>
          <p>Get in touch for general enquiries, or to discuss how we can serve your next event.</p>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="contact-grid">
            
            {/* About & Info */}
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '24px' }}>About DkLC</h2>
              <p style={{ marginBottom: '36px', fontSize: '1.05rem', lineHeight: '1.8' }}>{aboutText}</p>

              <div className="info-row">
                <div className="icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </div>
                <div>
                  <strong>Phone / WhatsApp</strong>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{settings.contactPhone}</span>
                </div>
              </div>
              
              {settings.contactEmail && (
                <div className="info-row">
                  <div className="icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <strong>Email</strong>
                    <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{settings.contactEmail}</span>
                  </div>
                </div>
              )}

              <div className="info-row">
                <div className="icon-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                </div>
                <div>
                  <strong>Location & Areas</strong>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{settings.address}</span>
                  <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gold-deep)', marginTop: '2px' }}>Serving: {settings.deliveryAreas}</span>
                </div>
              </div>

              <div className="info-row" style={{ marginTop: '36px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Hours</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--ink-soft)' }}>{settings.hoursOfOperation}</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <form onSubmit={handleSubmit} className="form-card">
                <h3 style={{ marginBottom: '6px' }}>Send a Message</h3>
                <p style={{ fontSize: '0.88rem', marginBottom: '24px' }}>Have a general question? Fill out the form below. For catering quotes, please use our <a href="/quote" style={{ color: 'var(--gold-deep)', textDecoration: 'underline' }}>Quote Form</a>.</p>
                
                {status === 'success' && (
                  <div className="confirm-msg show" style={{ marginBottom: '20px' }}>
                    Thank you! Your message has been sent. We'll be in touch soon.
                  </div>
                )}
                {status === 'error' && (
                  <div className="admin-login-error" style={{ marginBottom: '20px' }}>
                    There was an error sending your message. Please try again.
                  </div>
                )}

                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="name">Name *</label>
                    <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className="field full">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="field full">
                    <label htmlFor="message">Your Message *</label>
                    <textarea id="message" name="message" required rows={5} value={formData.message} onChange={handleChange}></textarea>
                  </div>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
