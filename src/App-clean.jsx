import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from './context/useApp';
import SettingsModal from './components/Settings/SettingsModal';

const INACTIVITY_MS = 5 * 60 * 1000;
const INACTIVITY_LINES = [
  "You've gone quiet. Signal me when you return and we'll pick up where we left off.",
  "It appears you've stepped away. Let me know when you're back.",
  "You've gone quiet — ping me when you're ready to continue.",
];

const ENERGY_LABELS = ['Very low', 'Very low', 'Low', 'Low', 'Moderate', 'Moderate', 'Moderate', 'Good', 'Good', 'Good', 'High', 'High', 'High'];

// ── Energy Panel (left) ──────────────────────────────────────────────────────

const EnergyPanel = () => {
  const { spoons, setSpoons } = useApp();
  const max = 12;

  return (
    <div className="panel-left">
      <div className="panel-heading">Energy Reserve</div>

      <div className="energy-grid">
        {Array.from({ length: max }, (_, i) => (
          <div key={i} className={`energy-cell ${i < spoons ? 'on' : 'off'}`} />
        ))}
      </div>

      <div className="energy-label">{ENERGY_LABELS[spoons]} — {spoons}/{max}</div>

      <div className="energy-controls">
        <button className="energy-btn" onClick={() => setSpoons(Math.max(0, spoons - 1))} disabled={spoons <= 0}>−</button>
        <span className="energy-count">{spoons}</span>
        <button className="energy-btn" onClick={() => setSpoons(Math.min(max, spoons + 1))} disabled={spoons >= max}>+</button>
      </div>

      <button className="energy-reset" onClick={() => setSpoons(Math.floor(max / 2))}>
        Reset to mid
      </button>
    </div>
  );
};

// ── Chat Panel (center) ──────────────────────────────────────────────────────

const MessageList = ({ messages }) => {
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <div className="messages-container">
      {messages.map((msg, i) => (
        <div key={msg.id || `msg-${i}`} className={`message ${msg.isUser ? 'user' : 'aeli'}`}>
          <div className="message-content">{msg.text}</div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

const ChatPanel = () => {
  const { settings, mode, spoons, addFact } = useApp();
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('AELI_CHAT_HISTORY');
      return saved ? JSON.parse(saved) : [{ id: 'init', isUser: false, text: "Good day. I'm AELI, your adaptive assistant. How may I assist you today?" }];
    } catch {
      return [{ id: 'init', isUser: false, text: "Good day. I'm AELI, your adaptive assistant. How may I assist you today?" }];
    }
  });
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const inactivitySentRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('AELI_CHAT_HISTORY', JSON.stringify(messages));
  }, [messages]);

  // Inactivity detection
  useEffect(() => {
    const reset = () => { lastActivityRef.current = Date.now(); inactivitySentRef.current = false; };
    const check = () => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_MS && !inactivitySentRef.current) {
        const line = INACTIVITY_LINES[Math.floor(Math.random() * INACTIVITY_LINES.length)];
        setMessages(prev => [...prev, { id: `inactivity-${Date.now()}`, isUser: false, text: `[AELI] ${line}` }]);
        inactivitySentRef.current = true;
      }
    };
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    window.addEventListener('click', reset);
    const interval = setInterval(check, 10_000);
    return () => {
      window.removeEventListener('mousemove', reset);
      window.removeEventListener('keydown', reset);
      window.removeEventListener('click', reset);
      clearInterval(interval);
    };
  }, []);

  const generateLocalResponse = useCallback((userInput) => {
    const lower = userInput.toLowerCase();

    const rememberMatch = userInput.match(/remember (that )?(.*)/i);
    if (rememberMatch?.[2]) {
      addFact(rememberMatch[2]);
      setMessages(prev => [...prev, { id: `msg-${Date.now()}`, isUser: false, text: `[AELI] Noted. I'll remember: "${rememberMatch[2]}"` }]);
      return;
    }

    if (lower.includes('timer')) {
      const match = userInput.match(/(\d+)\s*(minute|min|m|second|sec|s)/i);
      if (match) {
        const amount = parseInt(match[1]);
        const isMinutes = match[2].toLowerCase().startsWith('m');
        setMessages(prev => [...prev, { id: `msg-${Date.now()}`, isUser: false, text: `[AELI] ⏱️ Timer set for ${amount} ${isMinutes ? 'minute' : 'second'}${amount !== 1 ? 's' : ''}.` }]);
        return;
      }
    }

    let response;
    if (spoons < 4)               response = "You're running low on energy. Let's keep this simple.";
    else if (mode === 'lowSpoon') response = "I'm here, keeping things gentle. What do you need?";
    else if (mode === 'focus')    response = "Focus mode active. What's your priority task?";
    else if (mode === 'partner')  response = "Partner support engaged. How can I help?";
    else                          response = `Certainly, ${settings.nameFormal || 'friend'}. How may I assist?`;

    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, isUser: false, text: `[AELI] ${response}` }]);
  }, [spoons, mode, settings, addFact]);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isResponding) return;
    const text = input;
    setMessages(prev => [...prev, { id: `msg-${Date.now()}-user`, isUser: true, text }]);
    setInput('');
    setIsResponding(true);
    try {
      const res = await fetch('/.netlify/functions/chat-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, settings, mode, spoons, userId: settings.name || 'default' }),
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { id: `msg-${Date.now()}-aeli`, isUser: false, text: `[AELI] ${data.reply || data.message || "I'm here to help."}` }]);
      } else {
        generateLocalResponse(text);
      }
    } catch {
      generateLocalResponse(text);
    } finally {
      setIsResponding(false);
    }
  }, [input, isResponding, settings, mode, spoons, generateLocalResponse]);

  return (
    <div className="panel-center">
      <MessageList messages={messages} />
      <div className="chat-input-wrapper">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          placeholder={isResponding ? 'AELI is thinking…' : 'Type a message…'}
          disabled={isResponding}
          className="chat-input"
        />
        <button onClick={handleSubmit} disabled={isResponding || !input.trim()} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
};

// ── Suggestions Panel (right) ────────────────────────────────────────────────

const SuggestionsPanel = () => {
  return (
    <div className="panel-right">
      <div className="panel-heading">Suggestions</div>
      <div className="suggestions-empty">
        <span className="suggestions-empty-icon">✦</span>
        <span className="suggestions-empty-text">AELI will surface<br />suggestions here.</span>
      </div>
    </div>
  );
};

// ── Notification ─────────────────────────────────────────────────────────────

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`notification ${type}`}>{message}</div>;
};

// ── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState(null);
  const { mode } = useApp();

  const notify = (msg, type = 'success') => setNotification({ message: msg, type });

  return (
    <div className="app" data-mode={mode}>

      <header className="app-header">
        <div className="header-logo">AELI</div>
        <div className="header-status">
          <span className="status-dot" />
          <span className="status-label">Online</span>
        </div>
        <div className="header-spacer" />
        <button
          className="settings-btn"
          title="Settings"
          onClick={() => setShowSettings(true)}
        >
          ⚙
        </button>
        <div className="header-scan-line" />
      </header>

      <div className="app-body">
        <EnergyPanel />
        <ChatPanel />
        <SuggestionsPanel />
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
