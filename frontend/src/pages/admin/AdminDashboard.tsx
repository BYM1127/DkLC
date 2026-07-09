import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface Stats {
  totalQuotes: number;
  totalContacts: number;
  pendingQuotes: number;
}

interface RecentQuote {
  id: number;
  name: string;
  eventType: string;
  status: string;
  createdAt: string;
}

export const AdminDashboard = () => {
  const { fetchWithAuth } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentQuotes, setRecentQuotes] = useState<RecentQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, quotesRes] = await Promise.all([
          fetchWithAuth('/api/admin/stats'),
          fetchWithAuth('/api/admin/quotes'),
        ]);

        if (statsRes.ok) {
          setStats(await statsRes.json());
        }
        if (quotesRes.ok) {
          const quotes = await quotesRes.json();
          setRecentQuotes(quotes.slice(0, 8));
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
    { label: 'Total Quotes', value: stats?.totalQuotes ?? 0, icon: '📄', color: '#5F0C0C', link: '/admin/quotes' },
    { label: 'Pending Quotes', value: stats?.pendingQuotes ?? 0, icon: '⏳', color: '#C2902F', link: '/admin/quotes' },
    { label: 'Contact Messages', value: stats?.totalContacts ?? 0, icon: '💬', color: '#2A1B12', link: '/admin/contacts' },
  ];

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'sent': return 'status-preparing';
      case 'accepted': return 'status-confirmed';
      case 'rejected': return 'status-cancelled';
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

      {/* Recent quotes */}
      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Recent Quotes</h2>
          <Link to="/admin/quotes" className="btn-admin-small btn-admin-outline">View All →</Link>
        </div>

        {recentQuotes.length === 0 ? (
          <div className="admin-empty">No quotes yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Event Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotes.map(quote => (
                  <tr key={quote.id}>
                    <td><span className="admin-ref">#{quote.id}</span></td>
                    <td>{quote.name}</td>
                    <td>{quote.eventType || 'N/A'}</td>
                    <td><span className={`admin-status ${getStatusClass(quote.status)}`}>{quote.status}</span></td>
                    <td className="admin-date">{new Date(quote.createdAt).toLocaleDateString('en-ZA')}</td>
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
