import React, { useState } from 'react';
import './Auth.css';

export function Register({ onRegister, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://wydatki-app.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Blad rejestracji');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onRegister(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Rejestracja</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Imie</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jan Kowalski"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="twoj@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Haslo</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              minLength={6}
            />
          </div>
          {error && <div className="error-msg">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Rejestracja...' : 'Zarejestruj sie'}
          </button>
        </form>
        <p className="switch-text">
          Masz juz konto?{' '}
          <span onClick={onSwitchToLogin}>Zaloguj sie</span>
        </p>
      </div>
    </div>
  );
}
