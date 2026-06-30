import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLogin = () => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Already logged in
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!key.trim()) {
      setError('Please enter the API key.');
      return;
    }

    setLoading(true);
    const success = await login(key.trim());
    setLoading(false);

    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid API key. Please try again.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">🔐</div>
          <h1>Admin Panel</h1>
          <p className="admin-login-subtitle">Dimpho ke Lesego Catering Services</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="field">
            <label htmlFor="admin-key">Admin API Key</label>
            <input
              id="admin-key"
              type="password"
              placeholder="Enter your admin API key"
              value={key}
              onChange={e => setKey(e.target.value)}
              autoFocus
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button
            type="submit"
            className="btn-admin btn-admin-primary admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <p className="admin-login-hint">
          The API key is set as <code>ADMIN_API_KEY</code> in your environment variables.
        </p>
      </div>
    </div>
  );
};
