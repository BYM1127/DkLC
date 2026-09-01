import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLogin = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();

  // Already logged in — redirect immediately
  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    
    if (isRegistering) {
      const result = await register(email, password);
      setLoading(false);
      
      if (result.ok) {
        setMessage('Registration successful! You can now sign in.');
        setIsRegistering(false);
        setPassword('');
      } else {
        setError(result.error || 'Failed to register. Please try again.');
      }
    } else {
      const result = await login(email, password);
      setLoading(false);

      if (result.ok) {
        navigate('/admin', { replace: true });
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">🔐</div>
          <h1>{isRegistering ? 'Register Admin' : 'Admin Panel'}</h1>
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
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}
          {message && <div style={{ color: 'green', marginTop: '10px', fontSize: '0.9rem' }}>{message}</div>}

          <button
            type="submit"
            className="btn-admin btn-admin-primary admin-login-btn"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? (isRegistering ? 'Registering…' : 'Signing in…') : (isRegistering ? 'Register' : 'Sign In')}
          </button>
          
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError('');
                setMessage('');
              }}
              style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {isRegistering ? 'Already have an account? Sign In' : 'Need to register? Create Admin Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
