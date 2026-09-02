import { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { X, Search } from 'lucide-react';

interface Quote {
  id: number;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  dateNeeded: string;
  guestCount: number;
  venueLocation: string;
  providerType: string;
  selectedMenu: string;
  notes: string;
  status: string;
  createdAt: string;
}

export const AdminQuotes = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const fetchQuotes = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/quotes');
      if (res.ok) {
        setQuotes(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [fetchWithAuth]);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetchWithAuth(`/api/admin/quotes/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
        if (selectedQuote?.id === id) {
          setSelectedQuote(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuotes = quotes.filter(q => 
    q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.phone.includes(searchTerm) ||
    q.id.toString() === searchTerm
  );

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'sent': return 'status-preparing';
      case 'accepted': return 'status-confirmed';
      case 'rejected': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const text = `Hi ${name},\n\nThank you for reaching out to Dimpho ke Lesego Catering regarding your quote.`;
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const [isPrinting, setIsPrinting] = useState(false);
  
  // Custom Quotation State
  const [clientAddress, setClientAddress] = useState('');
  const [fulfillment, setFulfillment] = useState('Delivery');
  const [quoteItems, setQuoteItems] = useState([
    { id: '1', name: 'Catering Service Package', unitPrice: 0, quantity: 1 }
  ]);
  const [specialRequests, setSpecialRequests] = useState('None');
  const [validDays] = useState('14');

  useEffect(() => {
    if (selectedQuote) {
      setQuoteItems([
        { id: '1', name: `Catering Package: ${selectedQuote.selectedMenu || 'Custom'}`, unitPrice: 0, quantity: selectedQuote.guestCount || 1 }
      ]);
      setSpecialRequests(selectedQuote.notes || 'None');
      setClientAddress(selectedQuote.venueLocation || '');
    }
  }, [selectedQuote]);

  const handleAddItem = () => {
    setQuoteItems([...quoteItems, { id: Math.random().toString(), name: '', unitPrice: 0, quantity: 1 }]);
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    setQuoteItems(quoteItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return quoteItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  if (isPrinting && selectedQuote) {
    const totalAmount = calculateTotal();
    
    return (
      <div style={{ padding: '40px', background: 'white', color: '#333', minHeight: '100vh', fontFamily: 'serif' }}>
        <div className="no-print" style={{ marginBottom: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px', fontFamily: 'sans-serif' }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Quote Generator Controls</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Client Address</label>
              <input type="text" value={clientAddress} onChange={e => setClientAddress(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>Fulfillment (e.g., Delivery, Collection)</label>
              <input type="text" value={fulfillment} onChange={e => setFulfillment(e.target.value)} style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0 }}>Items</h4>
              <button className="btn-admin-small btn-admin-outline" onClick={handleAddItem}>+ Add Item</button>
            </div>
            {quoteItems.map((item) => (
              <div key={item.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                <input type="text" value={item.name} onChange={e => handleUpdateItem(item.id, 'name', e.target.value)} placeholder="Item description" style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="number" value={item.unitPrice} onChange={e => handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))} placeholder="Unit Price" style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <input type="number" value={item.quantity} onChange={e => handleUpdateItem(item.id, 'quantity', Number(e.target.value))} placeholder="Qty" style={{ width: '80px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
                <button style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', padding: '8px' }} onClick={() => handleRemoveItem(item.id)}><X size={16} /></button>
              </div>
            ))}
            <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '10px' }}>
              Calculated Total: R {totalAmount.toLocaleString()}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <button className="btn-admin btn-admin-primary" onClick={() => window.print()}>Print / Save as PDF</button>
            <button className="btn-admin btn-admin-outline" onClick={() => setIsPrinting(false)}>Back to Admin</button>
          </div>
        </div>
        
        {/* Printable Area */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ color: '#5F0C0C', margin: '0 0 5px 0', fontSize: '2rem', fontFamily: 'serif' }}>Dimpho ke Lesego</h1>
              <h2 style={{ margin: 0, fontSize: '0.85rem', color: '#888', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>Catering Services</h2>
            </div>
            <div style={{ textAlign: 'right', color: '#555' }}>
              <h1 style={{ margin: '0 0 5px 0', color: '#333', fontSize: '1.4rem', fontStyle: 'italic', fontFamily: 'serif' }}>Event Catering Quotation</h1>
              <p style={{ margin: '2px 0', fontSize: '0.9rem' }}>Date: {new Date().toLocaleDateString()}</p>
              <p style={{ margin: '2px 0', fontSize: '0.9rem' }}>Valid For: {validDays} Days</p>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#5F0C0C', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Client Details</h3>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                <div><strong>Name:</strong> {selectedQuote.name}</div>
                <div><strong>Phone:</strong> {selectedQuote.phone}</div>
                <div><strong>Address:</strong> {clientAddress || '_____________________'}</div>
              </div>
            </div>
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#5F0C0C', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Event & Fulfillment Details</h3>
              <div style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                <div><strong>Date:</strong> {selectedQuote.dateNeeded ? new Date(selectedQuote.dateNeeded).toLocaleDateString() : 'TBD'}</div>
                <div><strong>Type:</strong> {selectedQuote.eventType || 'N/A'}</div>
                <div><strong>Fulfillment:</strong> {fulfillment}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#5F0C0C' }}>Description / Items</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderTop: '1px solid #ddd', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '10px 0', textAlign: 'left', fontWeight: 'bold' }}>Item / Package</th>
                  <th style={{ padding: '10px 0', textAlign: 'center', fontWeight: 'bold' }}>Unit Price</th>
                  <th style={{ padding: '10px 0', textAlign: 'center', fontWeight: 'bold' }}>Quantity</th>
                  <th style={{ padding: '10px 0', textAlign: 'right', fontWeight: 'bold' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quoteItems.map((item, i) => (
                  <tr key={item.id || i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 0', paddingRight: '15px' }}>{item.name}</td>
                    <td style={{ padding: '12px 0', textAlign: 'center' }}>{item.unitPrice > 0 ? `R ${item.unitPrice.toLocaleString()}` : '-'}</td>
                    <td style={{ padding: '12px 0', textAlign: 'center' }}>{item.quantity}</td>
                    <td style={{ padding: '12px 0', textAlign: 'right' }}>R {(item.unitPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '30px' }}>
            <div><strong>Preferred Menu / Package Option:</strong> {selectedQuote.selectedMenu || 'Custom'}</div>
            <div><strong>Estimated Guests:</strong> {selectedQuote.guestCount || 'N/A'}</div>
            <div><strong>Special Requests:</strong> {specialRequests}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#5F0C0C' }}>
              Total: R {totalAmount.toLocaleString()}
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#555', borderTop: '1px solid #ddd', paddingTop: '20px', marginBottom: '40px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Terms & Conditions</h4>
            <p style={{ margin: '0', lineHeight: '1.5' }}>
              This quotation is valid for {validDays} days. To secure your event date, a 50% non-refundable deposit is required upon final confirmation. Final headcount and balance are due 7 days prior to the event date. Standard terms and conditions apply.
            </p>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', fontWeight: 'bold', color: '#333', marginTop: '60px' }}>
            Thank you for choosing Dimpho ke Lesego Catering! Good Food | Great Service | No Regrets
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Quotes</h1>
          <p className="admin-page-subtitle">Manage customer quote requests.</p>
        </div>
      </div>

      <div className="admin-section">
        <div className="admin-toolbar">
          <div className="admin-search">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone, or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Event</th>
                <th>Date Needed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map(quote => (
                <tr key={quote.id}>
                  <td><span className="admin-ref">#{quote.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{quote.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{quote.phone}</div>
                  </td>
                  <td>
                    <div>{quote.eventType || 'N/A'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--ink-soft)' }}>{quote.guestCount} guests</div>
                  </td>
                  <td>{quote.dateNeeded ? new Date(quote.dateNeeded).toLocaleDateString() : 'N/A'}</td>
                  <td><span className={`admin-status ${getStatusClass(quote.status)}`}>{quote.status}</span></td>
                  <td>
                    <button className="btn-admin-small btn-admin-outline" onClick={() => setSelectedQuote(quote)}>View</button>
                    <button 
                      className="btn-admin-small btn-admin-outline" 
                      style={{ color: 'var(--burgundy)', borderColor: 'var(--burgundy)', marginLeft: '8px' }}
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this quote?')) {
                          try {
                            const res = await fetchWithAuth(`/api/admin/quotes/${quote.id}`, { method: 'DELETE' });
                            if (res.ok) setQuotes(prev => prev.filter(q => q.id !== quote.id));
                          } catch (e) {
                            console.error(e);
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredQuotes.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>No quotes found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Details Modal */}
      {selectedQuote && (
        <div className="admin-modal-overlay" onClick={() => setSelectedQuote(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h2>Quote #{selectedQuote.id}</h2>
              <button className="admin-modal-close" onClick={() => setSelectedQuote(null)}><X size={20} /></button>
            </div>
            
            <div className="admin-modal-body" style={{ display: 'grid', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--bg-alt)', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Customer</span>
                  <strong>{selectedQuote.name}</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>{selectedQuote.phone}</div>
                  <div style={{ fontSize: '0.9rem' }}>{selectedQuote.email}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Event Details</span>
                  <strong>{selectedQuote.eventType || 'Not specified'}</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>Date: {selectedQuote.dateNeeded ? new Date(selectedQuote.dateNeeded).toLocaleDateString() : 'N/A'}</div>
                  <div style={{ fontSize: '0.9rem' }}>Guests: {selectedQuote.guestCount || 'N/A'}</div>
                </div>
                <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px', marginTop: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Logistics & Menu</span>
                  <div style={{ fontSize: '0.9rem', marginTop: '4px' }}><strong>Venue:</strong> {selectedQuote.venueLocation || 'Not provided'}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '4px' }}><strong>Provisioning:</strong> {selectedQuote.providerType || 'Not provided'}</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '4px', color: 'var(--burgundy)', fontWeight: '600' }}><strong>Selected Menu:</strong> {selectedQuote.selectedMenu || 'None'}</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Notes / Special Requests</h3>
                <div style={{ background: '#fff', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius)', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
                  {selectedQuote.notes || 'None'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>Update Status:</span>
                <select 
                  className="admin-select" 
                  value={selectedQuote.status} 
                  onChange={e => updateStatus(selectedQuote.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Sent">Quote Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

            </div>
            <div className="admin-modal-footer" style={{ flexWrap: 'wrap' }}>
              <button className="btn-admin btn-admin-outline" onClick={() => setSelectedQuote(null)}>Close</button>
              <button 
                className="btn-admin btn-admin-primary" 
                style={{ background: '#3b82f6', color: '#fff', border: 'none', marginLeft: 'auto' }} 
                onClick={() => setIsPrinting(true)}
              >
                Make & Download Quote
              </button>
              {selectedQuote.email && (
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedQuote.email)}&su=${encodeURIComponent(`Quote Request #${selectedQuote.id} - Dimpho ke Lesego Catering`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-admin btn-admin-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Reply via Gmail
                </a>
              )}
              <button className="btn-admin btn-admin-primary" style={{ background: '#25D366', color: '#fff', border: 'none' }} onClick={() => handleWhatsApp(selectedQuote.phone, selectedQuote.name)}>
                WhatsApp Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
