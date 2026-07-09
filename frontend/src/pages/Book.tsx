import { useState } from 'react';
import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Please enter a valid email address'),
  event: z.string().optional(),
  date: z.string().optional(),
  guests: z.string().optional(),
  package: z.string().optional(),
  fulfil: z.string().optional(),
  notes: z.string().optional()
});

export const Book = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [ingredientSourcing, setIngredientSourcing] = useState('DkLC Provides Ingredients');

  const minimumDate = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());

    if (dataObj.date && String(dataObj.date) < minimumDate) {
      setErrors({ date: 'Please allow at least 72 hours notice for bookings' });
      return;
    }

    const result = bookingSchema.safeParse(dataObj);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => {
        formattedErrors[String(issue.path[0])] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    const data = {
      name: dataObj.name,
      phone: dataObj.phone,
      email: dataObj.email,
      eventType: dataObj.event,
      eventDate: dataObj.date,
      estimatedGuests: Number(dataObj.guests) || null,
      preferredPackage: dataObj.package,
      fulfilmentType: dataObj.fulfil ? 'Delivery' : 'Collection',
      ingredientSourcing: ingredientSourcing,
      estimatedHours: dataObj.estimatedHours ? Number(dataObj.estimatedHours) : null,
      staffHourlyRate: dataObj.staffHourlyRate || '',
      notes: dataObj.notes
    };

    setSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const confirmMsg = document.getElementById('bookConfirm');
        if (confirmMsg) confirmMsg.style.display = 'block';
        e.target.reset();
      } else {
        const err = await response.json().catch(() => null);
        alert(err?.message || 'Failed to submit booking request. Please WhatsApp us at +27 79 692 9591 if this continues.');
      }
    } catch (error) {
      alert('We could not submit your booking right now. Please WhatsApp us at +27 79 692 9591.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page" data-page="book">

  <div className="page-banner">
    <div className="wrap">
      <span className="eyebrow on-dark">Reserve Your Date</span>
      <h1>Let's plan your event.</h1>
      <p>Complete the details below and we'll respond within 24 hours to confirm availability and pricing.</p>
    </div>
  </div>

  <section className="section">
    <div className="wrap" style={{ maxWidth: '760px' }}>
      <div className="form-card">
        <form id="bookingForm" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="bk-name">Full name</label>
              <input id="bk-name" name="name" type="text" placeholder="Your name" />
              {errors.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</span>}
            </div>
            <div className="field">
              <label htmlFor="bk-phone">Phone number</label>
              <input id="bk-phone" name="phone" type="tel" placeholder="+27 ..." />
              {errors.phone && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</span>}
            </div>
            <div className="field full">
              <label>Ingredient Sourcing</label>
              <div className="radio-row">
                <label className="radio-opt"><input type="radio" name="sourcing" value="DkLC Provides Ingredients" checked={ingredientSourcing === 'DkLC Provides Ingredients'} onChange={() => setIngredientSourcing('DkLC Provides Ingredients')} /> DkLC Provides Ingredients (Turnkey)</label>
                <label className="radio-opt"><input type="radio" name="sourcing" value="Client Provides Ingredients" checked={ingredientSourcing === 'Client Provides Ingredients'} onChange={() => setIngredientSourcing('Client Provides Ingredients')} /> Client Provides Ingredients (Labor Only)</label>
              </div>
            </div>

            {ingredientSourcing === 'Client Provides Ingredients' && (
              <>
                <div className="field">
                  <label htmlFor="bk-estimatedHours">Estimated Event Hours</label>
                  <input id="bk-estimatedHours" name="estimatedHours" type="number" min="1" placeholder="e.g., 6" />
                </div>
                <div className="field">
                  <label htmlFor="bk-staffRate">Staff Hourly Rate Option</label>
                  <select id="bk-staffRate" name="staffHourlyRate">
                    <option value="">Select a rate</option>
                    <option value="R150/hr (Standard Staff)">R150/hr (Standard Staff)</option>
                    <option value="R350/hr (Head Chef)">R350/hr (Head Chef)</option>
                  </select>
                </div>
              </>
            )}

            <div className="field full">
              <label htmlFor="bk-email">Email address</label>
              <input id="bk-email" name="email" type="email" placeholder="you@example.com" />
              {errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</span>}
            </div>

            <div className="field"><label htmlFor="bk-event">Event type</label>
              <select id="bk-event" name="event">
                <option>Wedding</option><option>Milestone Birthday</option><option>Memorial</option>
                <option>Family Gathering</option><option>Corporate Event</option><option>Community Function</option><option>Other</option>
              </select>
            </div>
            <div className="field"><label htmlFor="bk-date">Event date</label><input id="bk-date" name="date" type="date" min={minimumDate} />{errors.date && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.date}</span>}</div>

            <div className="field"><label htmlFor="bk-guests">Estimated guests</label><input id="bk-guests" name="guests" type="number" min="1" placeholder="e.g. 80" /></div>
            <div className="field"><label htmlFor="bk-package">Preferred package</label>
              <select id="bk-package" name="package">
                <option>Bronze Feast — R120pp</option><option>Silver Feast — R165pp</option>
                <option>Gold Feast — R220pp</option><option>Custom — compose my own menu</option>
              </select>
            </div>

            <div className="field full">
              <label>Delivery or collection?</label>
              <div className="radio-row">
                <label className="radio-opt"><input type="radio" name="fulfil" value="Delivery" defaultChecked /> Delivery to venue</label>
                <label className="radio-opt"><input type="radio" name="fulfil" value="Collection" /> Collection from Phaphadi</label>
              </div>
            </div>

            <div className="field full"><label htmlFor="bk-notes">Anything else we should know?</label>
              <textarea id="bk-notes" name="notes" rows={4} placeholder="Dietary needs, venue address, theme, special requests..."></textarea>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '22px', width: '100%', justifyContent: 'center' }} disabled={submitting}>{submitting ? 'Sending Request...' : 'Send Booking Request'}</button>
          <div className="confirm-msg" id="bookConfirm">Thank you — your booking request has been received. We'll contact you within 24 hours at the phone or email you provided.</div>
        </form>
        <p className="field-help" style={{ marginTop: '18px' }}>Prefer to talk it through? Call or WhatsApp <strong>+27 79 692 9591</strong> or email <strong>dimphokelesegocatering@gmail.com</strong>.</p>
      </div>
    </div>
  </section>

</section>
  );
};
