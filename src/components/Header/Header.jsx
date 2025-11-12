import React from 'react';
import { useApp } from '../../context/useApp';
import './Header.css';

function Header({ onSettingsClick }) {
  const { mode, setMode, settings, setSettings } = useApp();

  const modes = [
    { 
      id: 'dashboard', 
      name: 'Chat', 
      icon: '💬',
      description: 'General conversation',
      subtitle: 'Open dialogue'
    },
    { 
      id: 'lowSpoon', 
      name: 'Low Spoon', 
      icon: '🍃',
      description: 'Energy conservation mode',
      subtitle: 'Gentle support'
    },
    { 
      id: 'focus', 
      name: 'Focus', 
      icon: '🎯',
      description: 'Task management',
      subtitle: 'Get things done'
    },
    { 
      id: 'partner_support', 
      name: 'Partner', 
      icon: '👥',
      description: 'Collaborative support',
      subtitle: 'Team up'
    },
  ];

  const handleModeChange = (modeId) => {
    // Update mode in app context
    setMode(modeId);
    // Update settings to persist the change
    setSettings(prev => ({ ...prev, mode: modeId }));
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="header-title">
          <span className="header-icon">🧠</span>
          AELI
        </h1>
        <span className="header-tagline">Your Adaptive Butler</span>
      </div>

      <nav className="mode-selector" role="navigation" aria-label="Mode selection">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`mode-btn ${mode === m.id ? 'active' : ''}`}
            aria-label={`${m.name} mode: ${m.description}`}
            aria-pressed={mode === m.id}
            title={m.description}
          >
            <span className="mode-icon" aria-hidden="true">{m.icon}</span>
            <div className="mode-text">
              <span className="mode-name">{m.name}</span>
              <span className="mode-subtitle">{m.subtitle}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="header-actions">
        <button 
          onClick={onSettingsClick} 
          className="settings-btn"
          aria-label="Open settings"
        >
          <span aria-hidden="true">⚙️</span>
          <span className="btn-text">Settings</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
