import React, { useState } from 'react';
import { ChatInterface } from './components/Chat/ChatInterface';
import { Dashboard } from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('chat'); // 'chat' or 'dashboard'

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <span className="logo-text">Wydatki</span>
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
      </nav>

      <main className="main-content">
        {currentView === 'chat' && <ChatInterface />}
        {currentView === 'dashboard' && <Dashboard />}
      </main>
    </div>
  );
}

export default App;
