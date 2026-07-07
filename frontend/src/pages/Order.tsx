import { useState, useRef } from 'react';
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

// Business banking details
const BANKING = {
  bank: 'Capitec Bank',
  accountName: 'Dimpho ke Lesego Catering',
  accountNumber: '1234567890',       // ← replace with real number
  accountType: 'Savings',
  branchCode: '470010',
  reference: 'Your order reference',
};

const WA_NUMBER = '27796929591';

export const Order = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [fulfilmentType, setFulfilmentType] = useState('Delivery');
  const [distanceKm, setDistanceKm] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [quotationRef, setQuotationRef] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const minimumDate = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const deliveryFee =
    fulfilmentType === 'Delivery' && distanceKm && !isNaN(parseFloat(distanceKm))
      ? 100 + Math.ceil(parseFloat(distanceKm) / 200) * 50
      : 0;

  const grandTotal = cartTotal + deliveryFee;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErrors({});

    if (fulfilmentType === 'Delivery') {
      const dist = parseFloat(distanceKm);
      if (isNaN(dist) || dist < 0) {
        setErrors({ distanceKm: 'Please enter a valid delivery distance in km' });
        return;
      }
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items from the Menu first.');
      return;
    }

    const formData = new FormData(e.target);
    const dataObj = Object.fromEntries(formData.entries());
    dataObj.fulfil = fulfilmentType;
    dataObj.distanceKm = distanceKm;
    dataObj.paymentMethod = 'EFT';

    if (fulfilmentType === 'Delivery' && !String(dataObj.address || '').trim()) {
      setErrors({ address: 'Delivery address is required for delivery orders' });
      return;
    }

    if (dataObj.date && String(dataObj.date) < minimumDate) {
      setErrors({ date: 'Please allow at least 72 hours notice for orders' });
      return;
    }

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
      paymentMethod: 'EFT',
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
        const res = await response.json();
        const ref = res.orderRef || '';
        setOrderRef(ref);
        setOrderTotal(res.total || grandTotal);
        clearCart();
        setConfirmed(true);
      } else {
        const err = await response.json().catch(() => null);
        alert(err?.message || `Failed to submit order. Please WhatsApp us at +27 79 692 9591 if this continues.`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('We could not submit your order right now. Please WhatsApp us at +27 79 692 9591.');
    } finally {
      setSubmitting(false);
    }
  };

  // Build WhatsApp message for sending proof of payment
  const buildPopWaLink = () => {
    const msg = encodeURIComponent(
      `Hi Dimpho ke Lesego Catering 👋\n\n` +
      `I have made payment for my order.\n\n` +
      `📋 Order Reference: ${orderRef}\n` +
      `💰 Amount Paid: R${orderTotal}\n` +
      `${quotationRef ? `📄 Quotation Reference: ${quotationRef}\n` : ''}` +
      `\nI am attaching my proof of payment and quotation to this message. Please confirm receipt. 🙏`
    );
    return `https://wa.me/${WA_NUMBER}?text=${msg}`;
  };

  return (
    <section className="page" data-page="order">

  <div className="page-banner">
    <div className="wrap">
      <span className="eyebrow on-dark">Order Online</span>
      <h1>Review your order.</h1>
      <p>Add dishes or packages from the Menu, then complete your details below to confirm your order and receive banking details for payment.</p>
    </div>
  </div>

  <section className="section">
    <div className="wrap" style={{ maxWidth: '760px' }}>

      {/* ── ORDER SUMMARY ── */}
      <div className="order-summary" id="orderSummaryWrap">
        <h3>Your Order</h3>
        <div className="ornate-divider left"><span className="line"></span><span className="diamond"></span></div>

        {cartItems.length === 0 && !confirmed ? (
          <p style={{ color: '#999', padding: '18px 0' }}>
            Your cart is empty. <Link to="/menu" style={{ color: 'var(--gold-deep)', textDecoration: 'underline' }}>Browse the menu</Link> to add items.
          </p>
        ) : confirmed ? (
          <p style={{ padding: '10px 0', color: 'var(--ink-soft)' }}>Order <strong style={{ color: 'var(--burgundy)' }}>{orderRef}</strong> — thank you!</p>
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

        {!confirmed && (
          <>
            <div className="order-total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '0.9rem', color: '#666' }}>
              <span>Subtotal</span>
              <span>R{cartTotal}</span>
            </div>
            {fulfilmentType === 'Delivery' && (
              <div className="order-total-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.9rem', color: '#666' }}>
                <span>Delivery Fee</span>
                <span>R{deliveryFee}</span>
              </div>
            )}
            <div className="order-total-row" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', padding: '14px 0 4px', borderTop: '1px solid var(--cream-line, #e8e0d4)', marginTop: '8px' }}>
              <span>Total</span>
              <span id="orderSummaryTotal">R{grandTotal}</span>
            </div>
          </>
        )}
      </div>

      {/* ── FORM CARD ── */}
      <div className="form-card" id="orderFormCard">

        {/* ── CONFIRMATION / BANKING DETAILS ── */}
        {confirmed ? (
          <div className="order-confirm show" id="orderConfirm">
            <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>🎉</div>
            <h3>Order received — please make payment</h3>
            <p>Order reference: <span className="order-ref">{orderRef}</span></p>

            {/* ── BANKING DETAILS BOX ── */}
            <div className="banking-details">
              <div className="banking-header">
                <span>🏦</span>
                <span>Banking Details — EFT / Direct Deposit</span>
              </div>
              <div className="banking-body">
                <div className="banking-row">
                  <span className="banking-label">Bank</span>
                  <span className="banking-val">{BANKING.bank}</span>
                </div>
                <div className="banking-row">
                  <span className="banking-label">Account Name</span>
                  <span className="banking-val">{BANKING.accountName}</span>
                </div>
                <div className="banking-row">
                  <span className="banking-label">Account Number</span>
                  <span className="banking-val banking-highlight">{BANKING.accountNumber}</span>
                </div>
                <div className="banking-row">
                  <span className="banking-label">Account Type</span>
                  <span className="banking-val">{BANKING.accountType}</span>
                </div>
                <div className="banking-row">
                  <span className="banking-label">Branch Code</span>
                  <span className="banking-val">{BANKING.branchCode}</span>
                </div>
                <div className="banking-row banking-ref-row">
                  <span className="banking-label">Payment Reference</span>
                  <span className="banking-val banking-highlight">{orderRef}</span>
                </div>
                <div className="banking-amount-row">
                  <span>Amount to pay</span>
                  <span className="banking-amount">R{orderTotal}</span>
                </div>
              </div>
            </div>

            {/* ── PROOF OF PAYMENT INSTRUCTIONS ── */}
            <div className="pop-instructions">
              <h4>📎 After making payment — send us the following via WhatsApp:</h4>
              <ol className="pop-list">
                <li>
                  <strong>Proof of Payment (PoP)</strong>
                  <span>Screenshot or PDF of your EFT / deposit confirmation</span>
                </li>
                <li>
                  <strong>Your Quotation</strong>
                  <span>The quotation you received before placing this order (whether for pickup/collection or delivery)</span>
                </li>
              </ol>

              <div className="pop-ref-field">
                <label htmlFor="quotation-ref">Quotation Reference <span style={{ fontWeight: 400, color: 'var(--ink-soft)' }}>(optional — add before sending WhatsApp)</span></label>
                <input
                  id="quotation-ref"
                  type="text"
                  placeholder="e.g. QT-2026-001"
                  value={quotationRef}
                  onChange={e => setQuotationRef(e.target.value)}
                />
              </div>

              <a
                href={buildPopWaLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ marginTop: '18px', width: '100%', justifyContent: 'center' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.524 3.655 1.435 5.16L2 22l4.978-1.407A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm4.93 13.563c-.207.581-1.213 1.11-1.656 1.162-.422.049-.958.069-1.547-.097-.357-.103-.814-.24-1.396-.471-2.454-.999-4.055-3.448-4.178-3.608-.122-.16-.993-1.32-.993-2.518 0-1.197.629-1.787.852-2.031.222-.245.484-.306.646-.306.161 0 .322.002.463.009.147.007.344-.056.54.412.2.477.68 1.657.739 1.777.06.12.099.26.02.42-.08.16-.12.26-.239.4-.12.14-.252.313-.36.42-.12.12-.244.249-.105.488.14.24.621.976 1.333 1.58.916.777 1.688 1.018 1.927 1.133.24.115.38.097.52-.058.14-.155.6-.702.76-.942.16-.24.32-.2.54-.12.22.08 1.397.659 1.636.779.24.12.4.18.46.28.06.1.06.579-.147 1.16Z"/>
                </svg>
                Send Proof of Payment &amp; Quotation via WhatsApp
              </a>

              <p className="pop-note">
                Once we receive and verify your payment, we'll confirm your order within a few hours. 
                Questions? Call or WhatsApp <strong>+27 79 692 9591</strong>.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline"
              style={{ marginTop: '22px', width: '100%', justifyContent: 'center' }}
              onClick={() => { setConfirmed(false); setOrderRef(''); setQuotationRef(''); setDistanceKm(''); setFulfilmentType('Delivery'); if (formRef.current) formRef.current.reset(); }}
            >
              Place Another Order
            </button>
          </div>
        ) : (
          /* ── ORDER FORM ── */
          <form id="orderForm" onSubmit={handleSubmit} ref={formRef}>
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
                    <label className="radio-opt"><input type="radio" name="fulfil" value="Delivery" checked={fulfilmentType === 'Delivery'} onChange={() => setFulfilmentType('Delivery')} /> Delivery to venue</label>
                    <label className="radio-opt"><input type="radio" name="fulfil" value="Collection" checked={fulfilmentType === 'Collection'} onChange={() => setFulfilmentType('Collection')} /> Collection from Phaphadi</label>
                  </div>
                </div>

                {fulfilmentType === 'Delivery' && (
                  <>
                    <div className="field full" id="orderAddressField">
                      <label htmlFor="od-address">Delivery Address</label>
                      <input id="od-address" name="address" type="text" placeholder="Full street address" />
                      {errors.address && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</span>}
                    </div>
                    <div className="field full" id="orderDistanceField">
                      <label htmlFor="od-distanceKm">Distance to venue (km)</label>
                      <input id="od-distanceKm" name="distanceKm" type="number" step="0.1" min="0" placeholder="e.g. 15" value={distanceKm} onChange={(e) => setDistanceKm(e.target.value)} />
                      {errors.distanceKm && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.distanceKm}</span>}
                    </div>
                  </>
                )}

                <div className="field"><label htmlFor="od-date">Needed by (date)</label><input id="od-date" name="date" type="date" min={minimumDate} />{errors.date && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.date}</span>}</div>
                <div className="field"><label htmlFor="od-time">Preferred time</label><input id="od-time" name="time" type="time" /></div>

                <div className="field full"><label htmlFor="ord-notes">Anything else we should know?</label>
                  <textarea id="ord-notes" name="notes" rows={2} placeholder="Allergies, delivery instructions, etc."></textarea>
                </div>
              </div>

              {/* ── PAYMENT INFO BANNER (before submit) ── */}
              <div className="eft-info-banner">
                <span>🏦</span>
                <div>
                  <strong>Payment by EFT / Bank Transfer</strong>
                  <p>After placing your order you'll receive our banking details on screen. Make your EFT and send us your proof of payment + quotation via WhatsApp to confirm.</p>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-gold"
                style={{ marginTop: '22px', width: '100%', justifyContent: 'center' }}
                disabled={submitting || cartItems.length === 0}
              >
                {submitting ? 'Placing Order…' : cartItems.length === 0 ? 'Add items to order first' : '✓  Place Order & Get Banking Details'}
              </button>
              <p className="field-help" style={{ marginTop: '14px' }}>Placing your order saves your details and generates an order reference. You'll then make payment via EFT and send us your proof of payment.</p>
            </div>
          </form>
        )}

        <p className="field-help" style={{ marginTop: '18px' }}>Prefer to talk it through? Call or WhatsApp <strong>+27 79 692 9591</strong> or email <strong>dimphokelesego@gmail.com</strong>. For full event planning, you can also <Link to="/book" style={{ color: 'var(--gold-deep)', textDecoration: 'underline' }}>submit an event enquiry</Link> instead.</p>
      </div>
    </div>
  </section>

</section>
  );
};
