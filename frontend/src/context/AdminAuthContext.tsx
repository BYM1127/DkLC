import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface AdminAuthContextType {
  apiKey: string | null;
  isAuthenticated: boolean;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(
    () => sessionStorage.getItem('admin_api_key')
  );

  const isAuthenticated = !!apiKey;

  const login = useCallback(async (key: string): Promise<boolean> => {
    try {
      // Verify the key by hitting a protected endpoint
      const res = await fetch('/api/admin/contacts', {
        headers: { 'x-admin-api-key': key },
      });
      if (res.ok) {
        sessionStorage.setItem('admin_api_key', key);
        setApiKey(key);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('admin_api_key');
    setApiKey(null);
  }, []);

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}): Promise<Response> => {
      const storedKey = apiKey || sessionStorage.getItem('admin_api_key');
      if (!storedKey) throw new Error('Not authenticated');

      const headers = new Headers(options.headers || {});
      headers.set('x-admin-api-key', storedKey);

      if (options.body && typeof options.body === 'string') {
        headers.set('Content-Type', 'application/json');
      }

      return fetch(url, { ...options, headers });
    },
    [apiKey]
  );

  return (
    <AdminAuthContext.Provider value={{ apiKey, isAuthenticated, login, logout, fetchWithAuth }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
