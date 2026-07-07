import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Already logged in — redirect immediately
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.ok) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.error || 'Invalid email or password. Please try again.');
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

        <form onSubmit={handleSubmit} className="admin-login-form" noValidate>
          <div className="field">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="field" style={{ marginTop: '14px' }}>
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button
            type="submit"
            className="btn-admin btn-admin-primary admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="admin-login-hint">
          Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in your environment variables to configure admin access.
        </p>
      </div>
    </div>
  );
};
