import { useState } from 'react';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const orderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  fulfil: z.string().optional(),
  address: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  notes: z.string().optional()
});

export const Order = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items from the Menu first.');
      return;
    }

    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());

    const result = orderSchema.safeParse(dataObj);
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

    const data = {
      name: dataObj.name,
      phone: dataObj.phone,
      email: dataObj.email,
      fulfilmentType: dataObj.fulfil,
      deliveryAddress: dataObj.address,
      dateNeeded: dataObj.date,
      timeNeeded: dataObj.time,
      notes: dataObj.notes,
      items: cartItems.map(item => ({
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        isPackage: item.isPackage || false
      }))
    };

    setSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const result = await response.json();
        const refEl = document.getElementById('orderRefNumber');
        if (refEl) refEl.textContent = result.orderRef || '';

        // Set WhatsApp / email links if returned
        const waLink = document.getElementById('orderWaLink') as HTMLAnchorElement | null;
        const mailLink = document.getElementById('orderMailLink') as HTMLAnchorElement | null;
        if (waLink && result.customerWhatsappLink) waLink.href = result.customerWhatsappLink;
        if (mailLink && result.businessWhatsappLink) mailLink.href = result.businessWhatsappLink;

        // Show confirmation, hide form fields
        const formFields = document.getElementById('orderFormFields');
        const confirmDiv = document.getElementById('orderConfirm');
        if (formFields) formFields.style.display = 'none';
        if (confirmDiv) confirmDiv.style.display = 'block';

        e.target.reset();
      } else {
        const err = await response.json().catch(() => null);
        alert(err?.message || 'Failed to submit order.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page" data-page="order">

  <div className="page-banner">
    <div className="wrap">
      <span className="eyebrow on-dark">Order Online</span>
      <h1>Review your order.</h1>
      <p>Add dishes or packages from the Menu, then complete your details below to send your order straight to us.</p>
    </div>
  </div>

  <section className="section">
    <div className="wrap" style={{ maxWidth: '760px' }}>

      <div className="order-summary" id="orderSummaryWrap">
        <h3>Your Order</h3>
        <div className="ornate-divider left"><span className="line"></span><span className="diamond"></span></div>

        {cartItems.length === 0 ? (
          <p style={{ color: '#999', padding: '18px 0' }}>
            Your cart is empty. <Link to="/menu" style={{ color: 'var(--gold-deep)', textDecoration: 'underline' }}>Browse the menu</Link> to add items.
          </p>
        ) : (
          <div id="orderSummaryItems">
            {cartItems.map(item => (
              <div key={item.id} className="order-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--cream-line, #e8e0d4)' }}>
                <div style={{ flex: 1 }}>
                  <strong>{item.name}</strong>
                  {item.isPackage && <span className="chip gold" style={{ marginLeft: '6px', fontSize: '0.7rem' }}>Package</span>}
                  <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '2px' }}>
                    R{item.price} × {item.qty} = R{item.price * item.qty}
                  </div>
                </div>
                <div className="qty-stepper" style={{ marginRight: '10px' }}>
                  <button type="button" className="qty-btn" onClick={() => updateQuantity(item.id, item.qty - 1)}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button type="button" className="qty-btn" onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  style={{ background: 'none', border: 'none', color: '#c44', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="order-total-row" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', padding: '14px 0 4px' }}>
          <span>Total</span>
          <span id="orderSummaryTotal">R{cartTotal}</span>
        </div>
      </div>

      <div className="form-card" id="orderFormCard">
        <form id="orderForm" onSubmit={handleSubmit}>
          <div id="orderFormFields">
            <h3 style={{ marginTop: '0' }}>Your details</h3>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="od-name">Full name</label>
                <input id="od-name" name="name" type="text" placeholder="Your name" />
                {errors.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="od-phone">Phone number</label>
                <input id="od-phone" name="phone" type="tel" placeholder="+27 ..." />
                {errors.phone && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.phone}</span>}
              </div>
              <div className="field full">
                <label htmlFor="od-email">Email address</label>
                <input id="od-email" name="email" type="email" placeholder="you@example.com" />
                {errors.email && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.email}</span>}
              </div>

              <div className="field full">
                <label>Delivery or collection?</label>
                <div className="radio-row">
                  <label className="radio-opt"><input type="radio" name="fulfil" value="Delivery" defaultChecked /> Delivery to venue</label>
                  <label className="radio-opt"><input type="radio" name="fulfil" value="Collection" /> Collection from Phaphadi</label>
                </div>
              </div>

              <div className="field full" id="orderAddressField">
                <label htmlFor="od-address">Delivery address</label>
                <input id="od-address" name="address" type="text" placeholder="Street, suburb, town" />
              </div>

              <div className="field"><label htmlFor="od-date">Needed by (date)</label><input id="od-date" name="date" type="date" /></div>
              <div className="field"><label htmlFor="od-time">Preferred time</label><input id="od-time" name="time" type="time" /></div>

              <div className="field full"><label htmlFor="od-notes">Anything else we should know?</label>
                <textarea id="ord-notes" name="notes" rows={2} placeholder="Allergies, delivery instructions, etc."></textarea>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: '22px', width: '100%', justifyContent: 'center' }}
              disabled={submitting || cartItems.length === 0}
            >
              {submitting ? 'Placing Order...' : cartItems.length === 0 ? 'Add items to order first' : 'Place Order'}
            </button>
            <p className="field-help" style={{ marginTop: '14px' }}>Placing an order sends your details and order summary to us directly — we'll confirm availability, final pricing and payment within 24 hours.</p>
          </div>

          <div className="order-confirm" id="orderConfirm">
            <h3>Thank you, your order is ready to send!</h3>
            <p>Order reference: <span className="order-ref" id="orderRefNumber"></span></p>
            <p style={{ marginTop: '10px' }}>Tap a button below to send your order to Dimpho ke Lesego Catering. We'll confirm availability, final pricing and payment details with you shortly.</p>
            <div className="order-actions">
              <a href="#" id="orderWaLink" target="_blank" rel="noopener" className="btn btn-primary">Send via WhatsApp</a>
              <a href="#" id="orderMailLink" className="btn btn-outline">Send via Email</a>
            </div>
            <button type="button" className="btn btn-outline" id="orderNewBtn" style={{ marginTop: '18px' }}>Start a New Order</button>
          </div>
        </form>
        <p className="field-help" style={{ marginTop: '18px' }}>Prefer to talk it through? Call or WhatsApp <strong>+27 79 692 9591</strong> or email <strong>dimphokelesego@gmail.com</strong>. For full event planning, you can also <Link to="/book" style={{ color: 'var(--gold-deep)', textDecoration: 'underline' }}>submit an event enquiry</Link> instead.</p>
      </div>
    </div>
  </section>

</section>
  );
};
