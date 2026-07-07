import { useEffect, useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { QuoteModal } from '../../components/QuoteModal';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  isPackage: boolean;
}

interface Order {
  id: number;
  orderRef: string;
  name: string;
  phone: string;
  email: string;
  fulfilmentType: string;
  deliveryAddress: string;
  dateNeeded: string;
  timeNeeded: string;
  notes: string;
  originalAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponApplied: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  deliveryFee: number;
  distanceKm: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUSES = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Completed', 'Cancelled'];

export const AdminOrders = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [quoteTarget, setQuoteTarget] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetchWithAuth('/api/admin/orders');
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetchWithAuth(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const updatePaymentStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetchWithAuth(`/api/admin/orders/${orderId}/paymentStatus`, {
        method: 'PUT',
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: newStatus } : o));
      }
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'delivered': case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const filtered = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Orders</h1>
        <p className="admin-page-subtitle">Manage all customer orders and send quotes.</p>
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
            {s !== 'All' && <span className="admin-filter-count">{orders.filter(o => o.status === s).length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">No orders found{statusFilter !== 'All' ? ` with status "${statusFilter}"` : ''}.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Type</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <>
                  <tr key={order.id} className={expandedId === order.id ? 'row-expanded' : ''}>
                    <td>
                      <button className="admin-ref admin-expand-btn" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                        {expandedId === order.id ? '▾' : '▸'} {order.orderRef}
                      </button>
                    </td>
                    <td>{order.name}</td>
                    <td className="admin-phone">{order.phone}</td>
                    <td><span className="admin-chip">{order.fulfilmentType}</span></td>
                    <td className="admin-amount">R{order.totalAmount?.toFixed(2)}</td>
                    <td>
                      <select
                        className={`admin-status-select ${getStatusClass(order.status)}`}
                        value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="admin-date">{new Date(order.createdAt).toLocaleDateString('en-ZA')}</td>
                    <td>
                      <button
                        className="btn-admin-small btn-admin-primary"
                        onClick={() => setQuoteTarget(order)}
                      >
                        Send Quote
                      </button>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`${order.id}-detail`} className="admin-detail-row">
                      <td colSpan={8}>
                        <div className="admin-order-detail">
                          <div className="admin-detail-grid">
                            <div>
                              <strong>Email:</strong> {order.email || '—'}
                            </div>
                            <div>
                              <strong>Date Needed:</strong> {order.dateNeeded || '—'}
                            </div>
                            <div>
                              <strong>Time:</strong> {order.timeNeeded || '—'}
                            </div>
                            {order.deliveryAddress && (
                              <div>
                                <strong>Delivery Address:</strong> {order.deliveryAddress}
                                {order.distanceKm > 0 && <span> ({order.distanceKm} km)</span>}
                              </div>
                            )}
                            {order.couponApplied && (
                              <div>
                                <strong>Coupon:</strong> {order.couponApplied} (−R{order.discountAmount?.toFixed(2)})
                              </div>
                            )}
                            <div>
                              <strong>Payment Method:</strong> {order.paymentMethod}
                            </div>
                            <div>
                              <strong>Payment Status:</strong>{' '}
                              <select
                                style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.8rem', padding: '2px 4px' }}
                                value={order.paymentStatus}
                                onChange={e => updatePaymentStatus(order.id, e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Failed">Failed</option>
                              </select>
                            </div>
                            {order.notes && (
                              <div className="admin-detail-full">
                                <strong>Notes:</strong> {order.notes}
                              </div>
                            )}
                          </div>

                          <div className="admin-items-list">
                            <h4>Order Items</h4>
                            <table className="admin-items-table">
                              <thead>
                                <tr>
                                  <th>Item</th>
                                  <th>Price</th>
                                  <th>Qty</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, idx) => (
                                  <tr key={idx}>
                                    <td>
                                      {item.name}
                                      {item.isPackage && <span className="admin-chip admin-chip-gold" style={{ marginLeft: '6px' }}>Package</span>}
                                    </td>
                                    <td>R{item.price?.toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>R{(item.price * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="admin-items-total">
                              {order.discountAmount > 0 && (
                                <>
                                  <div><span>Subtotal:</span> <span>R{order.originalAmount?.toFixed(2)}</span></div>
                                  <div className="admin-discount"><span>Discount:</span> <span>−R{order.discountAmount?.toFixed(2)}</span></div>
                                </>
                              )}
                              {order.deliveryFee > 0 && (
                                <div><span>Delivery Fee:</span> <span>R{order.deliveryFee?.toFixed(2)}</span></div>
                              )}
                              <div className="admin-grand-total"><span>Total:</span> <span>R{order.totalAmount?.toFixed(2)}</span></div>
                            </div>
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
          orderRef={quoteTarget.orderRef}
          entityType="order"
          entityId={quoteTarget.id}
          fetchWithAuth={fetchWithAuth}
        />
      )}
    </div>
  );
};
