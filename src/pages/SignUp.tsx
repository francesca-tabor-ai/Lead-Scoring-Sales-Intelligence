import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { trpc } from '../trpc';
import { useAuth } from '../contexts/AuthContext';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const signUp = trpc.auth.signUp.useMutation({
    onSuccess: (data) => {
      login(data.token, data.user);
      navigate('/');
    },
    onError: (e) => setError(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    signUp.mutate({ email, password });
  };

  if (user) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="auth-subtitle">Get started with LSSIS</p>
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
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </label>
          <button type="submit" disabled={signUp.isPending}>
            {signUp.isPending ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
