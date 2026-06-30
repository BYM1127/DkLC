import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { QuoteModal } from '../../components/QuoteModal';

interface Booking {
  id: number;
  name: string;
  phone: string;
  email: string;
  eventType: string;
  eventDate: string;
  estimatedGuests: number | null;
  preferredPackage: string;
  fulfilmentType: string;
  notes: string;
  status: string;
  createdAt: string;
}

const STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export const AdminBookings = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [quoteTarget, setQuoteTarget] = useState<Booking | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/bookings');
      if (res.ok) setBookings(await res.json());
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: number, newStatus: string) => {
    try {
      const res = await fetchWithAuth(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'in progress': return 'status-preparing';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const filtered = statusFilter === 'All' ? bookings : bookings.filter(b => b.status === statusFilter);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Bookings</h1>
        <p className="admin-page-subtitle">Manage event bookings and send quotes to customers.</p>
      </div>

      {/* Filter bar */}
      <div className="admin-filter-bar">
        {['All', ...STATUSES].map(s => (
          <button
            key={s}
            className={`admin-filter-btn ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s}
            {s !== 'All' && <span className="admin-filter-count">{bookings.filter(b => b.status === s).length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">No bookings found{statusFilter !== 'All' ? ` with status "${statusFilter}"` : ''}.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Event</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => (
                <>
                  <tr key={booking.id} className={expandedId === booking.id ? 'row-expanded' : ''}>
                    <td>
                      <button className="admin-expand-btn" onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}>
                        {expandedId === booking.id ? '▾' : '▸'} {booking.name}
                      </button>
                    </td>
                    <td className="admin-phone">{booking.phone}</td>
                    <td><span className="admin-chip">{booking.eventType || '—'}</span></td>
                    <td className="admin-date">{booking.eventDate || '—'}</td>
                    <td>{booking.estimatedGuests || '—'}</td>
                    <td>
                      <select
                        className={`admin-status-select ${getStatusClass(booking.status)}`}
                        value={booking.status}
                        onChange={e => updateStatus(booking.id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="admin-date">{new Date(booking.createdAt).toLocaleDateString('en-ZA')}</td>
                    <td>
                      <button
                        className="btn-admin-small btn-admin-primary"
                        onClick={() => setQuoteTarget(booking)}
                      >
                        Send Quote
                      </button>
                    </td>
                  </tr>
                  {expandedId === booking.id && (
                    <tr key={`${booking.id}-detail`} className="admin-detail-row">
                      <td colSpan={8}>
                        <div className="admin-order-detail">
                          <div className="admin-detail-grid">
                            <div>
                              <strong>Email:</strong> {booking.email || '—'}
                            </div>
                            <div>
                              <strong>Preferred Package:</strong> {booking.preferredPackage || '—'}
                            </div>
                            <div>
                              <strong>Fulfilment:</strong> {booking.fulfilmentType || '—'}
                            </div>
                            {booking.notes && (
                              <div className="admin-detail-full">
                                <strong>Notes:</strong> {booking.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quote Modal */}
      {quoteTarget && (
        <QuoteModal
          isOpen={!!quoteTarget}
          onClose={() => setQuoteTarget(null)}
          customerName={quoteTarget.name}
          customerPhone={quoteTarget.phone}
          customerEmail={quoteTarget.email}
          entityType="booking"
          entityId={quoteTarget.id}
          fetchWithAuth={fetchWithAuth}
        />
      )}
    </div>
  );
};
