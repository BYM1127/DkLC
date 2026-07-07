import { useState, useEffect } from 'react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderRef?: string;
  entityType: 'order' | 'booking' | 'contact';
  entityId: number;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
  ingredientSourcing?: string;
  estimatedHours?: number;
  staffHourlyRate?: string;
  estimatedGuests?: number;
  preferredPackage?: string;
}

interface QuoteItem {
  description: string;
  amount: string;
}

export const QuoteModal = ({
  isOpen,
  onClose,
  customerName,
  customerPhone,
  customerEmail,
  orderRef,
  entityType,
  entityId,
  fetchWithAuth,
  ingredientSourcing,
  estimatedHours,
  staffHourlyRate,
  estimatedGuests,
  preferredPackage,
}: QuoteModalProps) => {
  const [message, setMessage] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([{ description: '', amount: '' }]);
  const [totalAmount, setTotalAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; whatsappLink?: string; error?: string } | null>(null);

  // Pre-fill quote logic
  useEffect(() => {
    if (isOpen && entityType === 'booking') {
      if (ingredientSourcing === 'Client Provides Ingredients') {
        const rateMatch = staffHourlyRate?.match(/R(\d+)/);
        const rate = rateMatch ? parseInt(rateMatch[1], 10) : 0;
        const total = (estimatedHours || 0) * rate;
        
        setItems([
          { description: `Labor: ${staffHourlyRate} x ${estimatedHours} hours`, amount: total.toString() },
          { description: 'Transport Fee', amount: '150' }
        ]);
        setTotalAmount((total + 150).toString());
      } else if (ingredientSourcing === 'DkLC Provides Ingredients') {
        const pkgMatch = preferredPackage?.match(/R(\d+)/);
        const pkgRate = pkgMatch ? parseInt(pkgMatch[1], 10) : 0;
        const total = (estimatedGuests || 0) * pkgRate;
        
        setItems([
          { description: `Package: ${preferredPackage} x ${estimatedGuests} guests`, amount: total.toString() },
          { description: 'Setup & Transport', amount: '250' }
        ]);
        setTotalAmount((total + 250).toString());
      }
    }
  }, [isOpen, entityType, ingredientSourcing, estimatedHours, staffHourlyRate, estimatedGuests, preferredPackage]);

  if (!isOpen) return null;

  const addItem = () => setItems([...items, { description: '', amount: '' }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof QuoteItem, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const calcTotal = () => {
    const sum = items.reduce((acc, it) => acc + (parseFloat(it.amount) || 0), 0);
    setTotalAmount(sum.toFixed(2));
  };

  const handleSend = async (channel: 'email' | 'whatsapp') => {
    setSending(true);
    setResult(null);

    const endpoint =
      entityType === 'contact'
        ? `/api/admin/contacts/${entityId}/reply`
        : `/api/admin/${entityType === 'order' ? 'orders' : 'bookings'}/${entityId}/send-quote`;

    const body: any = { message };
    if (entityType !== 'contact') {
      body.items = items.filter(i => i.description.trim());
      body.totalAmount = parseFloat(totalAmount) || 0;
      body.channel = channel;
    } else {
      body.channel = channel;
    }

    try {
      const res = await fetchWithAuth(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (channel === 'whatsapp' && data.whatsappLink) {
          window.open(data.whatsappLink, '_blank', 'noopener');
        }
        setResult({ success: true, whatsappLink: data.whatsappLink });
      } else {
        setResult({ error: data.message || 'Failed to send' });
      }
    } catch (err) {
      setResult({ error: 'Network error. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    setItems([{ description: '', amount: '' }]);
    setTotalAmount('');
    setResult(null);
    onClose();
  };

  const title = entityType === 'contact' ? 'Reply to Contact' : `Send Quote`;

  return (
    <div className="admin-modal-overlay" onClick={handleClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button className="admin-modal-close" onClick={handleClose}>×</button>
        </div>

        <div className="admin-modal-body">
          {/* Customer info */}
          <div className="quote-customer-info">
            <div className="quote-info-row">
              <span className="quote-label">Customer:</span>
              <span>{customerName}</span>
            </div>
            <div className="quote-info-row">
              <span className="quote-label">Phone:</span>
              <span>{customerPhone}</span>
            </div>
            {customerEmail && (
              <div className="quote-info-row">
                <span className="quote-label">Email:</span>
                <span>{customerEmail}</span>
              </div>
            )}
            {orderRef && (
              <div className="quote-info-row">
                <span className="quote-label">Reference:</span>
                <span className="quote-ref">{orderRef}</span>
              </div>
            )}
          </div>

          {/* Message */}
          <div className="field" style={{ marginTop: '16px' }}>
            <label>Message</label>
            <textarea
              rows={4}
              placeholder={entityType === 'contact'
                ? 'Type your reply...'
                : 'Include any notes about the quote, special terms, etc.'}
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </div>

          {/* Line items (only for orders/bookings) */}
          {entityType !== 'contact' && (
            <>
              <div style={{ marginTop: '16px' }}>
                <label className="admin-label">Quote Line Items</label>
                {items.map((item, idx) => (
                  <div key={idx} className="quote-item-row">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={e => updateItem(idx, 'description', e.target.value)}
                      className="quote-item-desc"
                    />
                    <input
                      type="number"
                      placeholder="R Amount"
                      value={item.amount}
                      onChange={e => updateItem(idx, 'amount', e.target.value)}
                      className="quote-item-amount"
                    />
                    {items.length > 1 && (
                      <button type="button" className="quote-item-remove" onClick={() => removeItem(idx)}>×</button>
                    )}
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button type="button" className="btn-admin-small btn-admin-outline" onClick={addItem}>
                    + Add Item
                  </button>
                  <button type="button" className="btn-admin-small btn-admin-outline" onClick={calcTotal}>
                    Calculate Total
                  </button>
                </div>
              </div>

              <div className="field" style={{ marginTop: '12px' }}>
                <label>Total Amount (R)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={totalAmount}
                  onChange={e => setTotalAmount(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Result feedback */}
          {result && (
            <div className={`quote-result ${result.success ? 'success' : 'error'}`}>
              {result.success ? '✅ Sent successfully!' : `❌ ${result.error}`}
            </div>
          )}
        </div>

        <div className="admin-modal-footer">
          <button
            className="btn-admin btn-admin-primary"
            onClick={() => handleSend('email')}
            disabled={sending || (!message.trim())}
          >
            {sending ? 'Sending...' : '📧 Send via Email'}
          </button>
          <button
            className="btn-admin btn-admin-whatsapp"
            onClick={() => handleSend('whatsapp')}
            disabled={sending || (!message.trim())}
          >
            {sending ? 'Sending...' : '💬 Send via WhatsApp'}
          </button>
          <button className="btn-admin btn-admin-ghost" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
