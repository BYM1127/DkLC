import { useState } from 'react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const Contact = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSent(false);

    const formData = new FormData(e.currentTarget);
    const dataObj = Object.fromEntries(formData.entries());
    const result = contactSchema.safeParse(dataObj);

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0] !== undefined) {
          formattedErrors[String(issue.path[0])] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (response.ok) {
        setSent(true);
        e.currentTarget.reset();
      } else {
        const err = await response.json().catch(() => null);
        alert(err?.message || 'Failed to send your message. Please WhatsApp us at +27 79 692 9591 if this continues.');
      }
    } catch (error) {
      console.error('Contact submission error:', error);
      alert('We could not send your message right now. Please WhatsApp us at +27 79 692 9591.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page" data-page="contact">
      <div className="page-banner">
        <div className="wrap">
          <span className="eyebrow on-dark">Contact Us</span>
          <h1>Talk to our team.</h1>
          <p>Send a quick message and we'll come back to you within 24 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="wrap contact-grid">
          <div>
            <span className="eyebrow">Reach Us Directly</span>
            <h2>Dimpho ke Lesego Catering Services</h2>
            <p className="lead">For orders, event bookings, delivery questions, or custom menus, contact us by phone, WhatsApp, email, or the form.</p>
            <p><strong>Phone / WhatsApp:</strong> <a href="tel:+27796929591">+27 79 692 9591</a></p>
            <p><strong>Email:</strong> <a href="mailto:dimphokelesegocatering@gmail.com">dimphokelesegocatering@gmail.com</a></p>
            <p><strong>Location:</strong> Phaphadi, South Africa</p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="ct-name">Full name</label>
                  <input id="ct-name" name="name" type="text" placeholder="Your name" />
                  {errors.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="ct-phone">Phone number</label>
                  <input id="ct-phone" name="phone" type="tel" placeholder="+27 ..." />
                  {errors.phone && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</span>}
                </div>
                <div className="field full">
                  <label htmlFor="ct-email">Email address</label>
                  <input id="ct-email" name="email" type="email" placeholder="you@example.com" />
                  {errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</span>}
                </div>
                <div className="field full">
                  <label htmlFor="ct-message">Message</label>
                  <textarea id="ct-message" name="message" rows={5} placeholder="Tell us what you need help with..." />
                  {errors.message && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.message}</span>}
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '22px', width: '100%', justifyContent: 'center' }} disabled={submitting}>
                {submitting ? 'Sending Message...' : 'Send Message'}
              </button>
              {sent && <div className="confirm-msg show">Thank you. Your message has been received and we'll reply within 24 hours.</div>}
            </form>
          </div>
        </div>
      </section>
    </section>
  );
};
