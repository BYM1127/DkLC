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

  if (loading) return <div className="admin-loading"><div className="admin-spinner" /></div>;

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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: 'var(--cream-deep)', padding: '16px', borderRadius: 'var(--radius)' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', display: 'block' }}>Customer</span>
                  <strong>{selectedQuote.name}</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>{selectedQuote.phone}</div>
                  <div style={{ fontSize: '0.9rem' }}>{selectedQuote.email}</div>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', display: 'block' }}>Event Details</span>
                  <strong>{selectedQuote.eventType || 'Not specified'}</strong>
                  <div style={{ fontSize: '0.9rem', marginTop: '4px' }}>Date: {selectedQuote.dateNeeded ? new Date(selectedQuote.dateNeeded).toLocaleDateString() : 'N/A'}</div>
                  <div style={{ fontSize: '0.9rem' }}>Guests: {selectedQuote.guestCount || 'N/A'}</div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Notes / Special Requests</h3>
                <div style={{ background: '#fff', padding: '12px', border: '1px solid var(--cream-line)', borderRadius: 'var(--radius)', minHeight: '80px', whiteSpace: 'pre-wrap' }}>
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
