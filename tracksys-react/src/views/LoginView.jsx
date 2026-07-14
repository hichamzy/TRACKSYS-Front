import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { ApiError } from '../api/httpClient.js';

export default function LoginView() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Connexion impossible.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand-name" style={{ color: 'var(--plum)', marginBottom: 4 }}>
          TRACK<span style={{ color: 'var(--cyan)' }}>SYS</span>
        </div>
        <div className="brand-sub" style={{ color: 'var(--muted)', marginBottom: 24 }}>
          FLEET &amp; CIVIC
        </div>

        <div className="field">
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div style={{ color: 'var(--hot)', fontSize: 12.5, marginTop: 12 }} role="alert">
            {error}
          </div>
        )}

        <button className="b b-cyan" type="submit" disabled={submitting} style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
