import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trpc } from '../trpc';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    return null;
  }
  const logIn = trpc.auth.logIn.useMutation({
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    },
    onError: (e) => setError(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    logIn.mutate({ email, password });
  };

  if (user) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Sign in</h1>
        <p className="auth-subtitle">Access your LSSIS account</p>
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" disabled={logIn.isPending}>
            {logIn.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
