import React, { useState, useEffect } from 'react';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { ChatInterface } from './components/Chat/ChatInterface';
import { Dashboard } from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [currentView, setCurrentView] = useState('chat');

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  if (!user) {
    if (authMode === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthMode('register')}
        />
      );
    } else {
      return (
        <Register
          onRegister={handleLogin}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
  }

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">Wydatki</span>
        </div>

        <div className="user-info">
          <span>👤 {user.name || user.email}</span>
        </div>

        <div className="nav-links">
          <button
            className={`nav-link ${currentView === 'chat' ? 'active' : ''}`}
            onClick={() => setCurrentView('chat')}
          >
            <span className="nav-icon">💬</span>
            <span className="nav-text">Chat</span>
          </button>
          <button
            className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Wyloguj
        </button>
      </nav>

      <main className="main-content">
        {currentView === 'chat' && <ChatInterface token={token} />}
        {currentView === 'dashboard' && <Dashboard token={token} />}
      </main>
    </div>
  );
}

export default App;
