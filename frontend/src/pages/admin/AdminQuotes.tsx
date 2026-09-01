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
  const [quotePrice, setQuotePrice] = useState('');

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

  if (isPrinting && selectedQuote) {
    return (
      <div style={{ padding: '40px', background: 'white', color: 'black', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <div className="no-print" style={{ marginBottom: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Quote Generator Controls</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold' }}>Quoted Price (ZAR): </label>
            <input type="text" value={quotePrice} onChange={e => setQuotePrice(e.target.value)} placeholder="e.g. 5000.00" style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
            <button className="btn-admin btn-admin-primary" onClick={() => window.print()}>Print / Save as PDF</button>
            <button className="btn-admin btn-admin-outline" onClick={() => setIsPrinting(false)}>Back to Admin</button>
          </div>
        </div>
        
        {/* Printable Area */}
        <div style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid #eee', padding: '40px', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #5F0C0C', paddingBottom: '20px', marginBottom: '30px' }}>
            <div>
              <h1 style={{ color: '#5F0C0C', margin: 0 }}>Dimpho ke Lesego</h1>
              <h2 style={{ margin: '5px 0 0 0', fontSize: '1.2rem', color: '#666' }}>Catering Services</h2>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem' }}>Phaphadi, Mamaila Village, 0832</p>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.9rem' }}>Phone: +27 79 692 9591</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h1 style={{ margin: 0, color: '#333' }}>QUOTE</h1>
              <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>Quote #{selectedQuote.id}</p>
              <p style={{ margin: '2px 0 0 0' }}>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <h3 style={{ margin: '0 0 10px 0', color: '#5F0C0C' }}>Prepared For:</h3>
              <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{selectedQuote.name}</p>
              <p style={{ margin: '2px 0' }}>{selectedQuote.phone}</p>
              <p style={{ margin: '2px 0' }}>{selectedQuote.email}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#5F0C0C' }}>Event Details:</h3>
              <p style={{ margin: '2px 0' }}><strong>Date:</strong> {selectedQuote.dateNeeded ? new Date(selectedQuote.dateNeeded).toLocaleDateString() : 'TBD'}</p>
              <p style={{ margin: '2px 0' }}><strong>Type:</strong> {selectedQuote.eventType || 'N/A'}</p>
              <p style={{ margin: '2px 0' }}><strong>Guests:</strong> {selectedQuote.guestCount || 'N/A'}</p>
              <p style={{ margin: '2px 0' }}><strong>Venue:</strong> {selectedQuote.venueLocation || 'N/A'}</p>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Description</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '15px 12px', borderBottom: '1px solid #eee' }}>
                  <strong style={{ display: 'block', marginBottom: '5px' }}>Catering Package: {selectedQuote.selectedMenu || 'Custom'}</strong>
                  <span style={{ color: '#666', fontSize: '0.9rem' }}>Includes provision for {selectedQuote.guestCount} guests. Provider setup: {selectedQuote.providerType || 'N/A'}.</span>
                  {selectedQuote.notes && (
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', fontStyle: 'italic' }}>Notes: {selectedQuote.notes}</p>
                  )}
                </td>
                <td style={{ padding: '15px 12px', textAlign: 'right', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>
                  R {quotePrice || '0.00'}
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
            <div style={{ width: '300px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '2px solid #5F0C0C', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total:</span>
                <span>R {quotePrice || '0.00'}</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#666', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <p style={{ margin: '0 0 5px 0' }}><strong>Terms & Conditions:</strong></p>
            <p style={{ margin: '0' }}>Valid for 14 days. A 50% deposit is required to secure your booking. The remaining balance is due 7 days prior to the event date.</p>
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
            <div className="admin-modal-footer">
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
