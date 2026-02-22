import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

const AUTH_KEY = 'lssis_token';

type User = { id: string; email: string; role: string };

type AuthContextValue = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem(AUTH_KEY));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('lssis_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const setToken = useCallback((t: string | null) => {
    setTokenState(t);
    if (t) localStorage.setItem(AUTH_KEY, t);
    else localStorage.removeItem(AUTH_KEY);
  }, []);

  const login = useCallback((t: string, u: User) => {
    setToken(t);
    setUser(u);
    localStorage.setItem('lssis_user', JSON.stringify(u));
  }, [setToken]);

  const logout = useCallback(() => {
    setTokenState(null);
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('lssis_user');
  }, []);

  useEffect(() => {
    if (token) setTokenState(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
