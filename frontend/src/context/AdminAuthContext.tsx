import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

const SESSION_KEY = 'admin_session_token';

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_KEY)
  );

  const isAuthenticated = !!token;

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          sessionStorage.setItem(SESSION_KEY, data.token);
          setToken(data.token);
          return { ok: true };
        }
        return { ok: false, error: 'No token returned from server.' };
      }

      const err = await res.json().catch(() => ({}));
      return { ok: false, error: err.message || 'Invalid email or password.' };
    } catch {
      return { ok: false, error: 'Could not reach the server. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null);
  }, []);

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const storedToken = token || sessionStorage.getItem(SESSION_KEY);
      if (!storedToken) throw new Error('Not authenticated');

      const headers = new Headers(options.headers || {});
      headers.set('Authorization', `Bearer ${storedToken}`);

      if (options.body && typeof options.body === 'string') {
        headers.set('Content-Type', 'application/json');
      }

      return fetch(url, { ...options, headers });
    },
    [token]
  );

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, fetchWithAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
