import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface Stats {
  totalOrders: number;
  totalBookings: number;
  totalContacts: number;
  totalRevenue: number;
  pendingOrders: number;
  pendingBookings: number;
}

interface RecentOrder {
  id: number;
  orderRef: string;
  name: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export const AdminDashboard = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetchWithAuth('/api/admin/stats'),
          fetchWithAuth('/api/admin/orders'),
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        if (ordersRes.ok) {
          const orders = await ordersRes.json();
          setRecentOrders(orders.slice(0, 8));
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchWithAuth]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0, icon: '🛒', color: '#5F0C0C', link: '/admin/orders' },
    { label: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: '⏳', color: '#C2902F', link: '/admin/orders' },
    { label: 'Total Bookings', value: stats?.totalBookings ?? 0, icon: '📅', color: '#430707', link: '/admin/bookings' },
    { label: 'Pending Bookings', value: stats?.pendingBookings ?? 0, icon: '📋', color: '#7A1414', link: '/admin/bookings' },
    { label: 'Contact Messages', value: stats?.totalContacts ?? 0, icon: '💬', color: '#2A1B12', link: '/admin/contacts' },
    { label: 'Total Revenue', value: `R${(stats?.totalRevenue ?? 0).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, icon: '💰', color: '#A6791F', link: '/admin/orders' },
  ];

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

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p className="admin-page-subtitle">Welcome back. Here's an overview of your business.</p>
      </div>

      {/* Stats grid */}
      <div className="admin-stats-grid">
        {statCards.map(card => (
          <Link to={card.link} key={card.label} className="admin-stat-card" style={{ '--accent': card.color } as any}>
            <div className="admin-stat-icon">{card.icon}</div>
            <div className="admin-stat-value">{card.value}</div>
            <div className="admin-stat-label">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="btn-admin-small btn-admin-outline">View All →</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="admin-empty">No orders yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td><span className="admin-ref">{order.orderRef}</span></td>
                    <td>{order.name}</td>
                    <td className="admin-amount">R{order.totalAmount?.toFixed(2)}</td>
                    <td><span className={`admin-status ${getStatusClass(order.status)}`}>{order.status}</span></td>
                    <td className="admin-date">{new Date(order.createdAt).toLocaleDateString('en-ZA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
