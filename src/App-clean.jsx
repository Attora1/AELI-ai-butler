import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from './context/useApp';
import SettingsModal from './components/Settings/SettingsModal';

const INACTIVITY_MS = 5 * 60 * 1000;
const INACTIVITY_LINES = [
  "You've gone quiet. Signal me when you return and we'll pick up where we left off.",
  "It appears you've stepped away. Let me know when you're back.",
  "You've gone quiet — ping me when you're ready to continue.",
];

const MODE_LABELS = {
  chat:     'Chat Mode',
  lowSpoon: 'Low Spoon Mode',
  focus:    'Focus Mode',
  partner:  'Partner Mode',
};

// ── Energy Display ──────────────────────────────────────────────────────────

const LeafEnergyDisplay = () => {
  const { spoons, setSpoons } = useApp();
  const max = 12;

  const getEnergyLabel = () => {
    if (spoons >= 10) return 'High energy';
    if (spoons >= 7)  return 'Good energy';
    if (spoons >= 4)  return 'Moderate energy';
    if (spoons >= 2)  return 'Low energy';
    return 'Very low energy';
  };

  const getBarColor = () => {
    if (spoons >= 10) return 'var(--spoon-high, #4a7a5a)';
    if (spoons >= 7)  return 'var(--spoon-high, #4a7a5a)';
    if (spoons >= 4)  return 'var(--spoon-medium, #7a6a4a)';
    if (spoons >= 2)  return 'var(--spoon-low, #7a4a4a)';
    return 'var(--spoon-critical, #8a3a3a)';
  };

  return (
    <div className="card" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-strong, #e8edf2)', letterSpacing: '0.2px' }}>
          Energy Reserve 🍃
        </span>
        <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-dim, rgba(243,245,247,0.7))' }}>
          {spoons}<span style={{ fontSize: '0.75rem', opacity: 0.6 }}>/{max}</span>
        </span>
      </div>

      {/* Leaves */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '3px', margin: '10px 0' }}>
        {Array.from({ length: max }, (_, i) => (
          <span key={i} style={{
            fontSize: '1.4rem',
            opacity: i < spoons ? 1 : 0.2,
            filter: i < spoons ? 'none' : 'grayscale(1)',
            transform: i < spoons ? 'scale(1)' : 'scale(0.88)',
            transition: 'all 0.3s ease',
            display: 'inline-block',
          }}>🍃</span>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden', margin: '12px 0 8px' }}>
        <div style={{
          width: `${(spoons / max) * 100}%`,
          height: '100%',
          background: getBarColor(),
          borderRadius: '3px',
          transition: 'width 0.5s ease, background 0.5s ease',
        }} />
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--text-dim, rgba(243,245,247,0.6))', marginBottom: '14px', textAlign: 'center' }}>
        {getEnergyLabel()}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <button onClick={() => setSpoons(Math.max(0, spoons - 1))} disabled={spoons <= 0}
          className="btn small" style={{ minWidth: '36px' }}>−</button>
        <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-strong)', minWidth: '28px', textAlign: 'center' }}>{spoons}</span>
        <button onClick={() => setSpoons(Math.min(max, spoons + 1))} disabled={spoons >= max}
          className="btn small" style={{ minWidth: '36px' }}>+</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <button onClick={() => setSpoons(Math.floor(max / 2))} className="btn ghost"
          style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '6px' }}>
          Reset to mid
        </button>
      </div>
    </div>
  );
};

// ── Mode Selector ───────────────────────────────────────────────────────────

const ModeSelector = () => {
  const { mode, setMode } = useApp();

  const modes = [
    { id: 'chat',     name: 'Chat',      icon: '💬' },
    { id: 'lowSpoon', name: 'Low Spoon', icon: '🍃' },
    { id: 'focus',    name: 'Focus',     icon: '🎯' },
    { id: 'partner',  name: 'Partner',   icon: '👥' },
  ];

  return (
    <div className="mode-selector card">
      {modes.map(m => (
        <button key={m.id} onClick={() => setMode(m.id)}
          className={`mode-btn ${mode === m.id ? 'active' : ''}`}>
          <span className="mode-icon">{m.icon}</span>
          <span className="mode-name">{m.name}</span>
        </button>
      ))}
    </div>
  );
};

// ── Chat ────────────────────────────────────────────────────────────────────

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

const ChatInterface = () => {
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
    const resetActivity = () => {
      lastActivityRef.current = Date.now();
      inactivitySentRef.current = false;
    };
    const check = () => {
      if (Date.now() - lastActivityRef.current > INACTIVITY_MS && !inactivitySentRef.current) {
        const line = INACTIVITY_LINES[Math.floor(Math.random() * INACTIVITY_LINES.length)];
        setMessages(prev => [...prev, { id: `inactivity-${Date.now()}`, isUser: false, text: `[AELI] ${line}` }]);
        inactivitySentRef.current = true;
      }
    };
    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keydown', resetActivity);
    window.addEventListener('click', resetActivity);
    const interval = setInterval(check, 10_000);
    return () => {
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('click', resetActivity);
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
    else if (mode === 'partner')  response = "Partner support engaged. How can I help coordinate?";
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
    <div className="chat-interface card">
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
        <button onClick={handleSubmit} disabled={isResponding || !input.trim()} className="btn" style={{ borderRadius: '10px', flexShrink: 0 }}>
          Send
        </button>
      </div>
    </div>
  );
};

// ── Command Center ──────────────────────────────────────────────────────────

const AELICommandCenter = () => {
  const { spoons, mode, addFact } = useApp();
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerActive, setTimerActive] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [memoryInput, setMemoryInput] = useState('');

  const spoonMax = 12;
  const spoonStatus = spoons >= 8 ? 'Well resourced' : spoons >= 5 ? 'Moderate' : spoons >= 3 ? 'Low energy' : 'Critical';

  const statusMessages = {
    chat:     'Ready for conversation.',
    lowSpoon: 'Energy conservation active.',
    focus:    'Focus modules online.',
    partner:  'Collaborative mode active.',
  };

  const startTimer = () => { setTimerRemaining(timerMinutes * 60); setTimerActive(true); };
  const resetTimer = () => { setTimerActive(false); setTimerRemaining(0); };
  const saveMemory = () => { if (memoryInput.trim()) { addFact(memoryInput.trim()); setMemoryInput(''); } };
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  useEffect(() => {
    if (!timerActive || timerRemaining === 0) return;
    const id = setInterval(() => setTimerRemaining(p => { if (p <= 1) { setTimerActive(false); return 0; } return p - 1; }), 1000);
    return () => clearInterval(id);
  }, [timerActive, timerRemaining]);

  const sectionStyle = {
    marginBottom: '16px',
    padding: '14px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
  };

  const labelStyle = {
    display: 'block',
    color: 'var(--text-dim, rgba(243,245,247,0.7))',
    fontSize: '0.8rem',
    fontWeight: '500',
    marginBottom: '8px',
    letterSpacing: '0.2px',
  };

  return (
    <div className="card" style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '16px', paddingBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: '0.925rem', fontWeight: '600', color: 'var(--text-strong, #e8edf2)', letterSpacing: '0.2px', marginBottom: '6px' }}>
          Command Center
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '0.78rem', color: 'var(--text-dim)', opacity: '0.8' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--mode-accent, #7db9a3)', animation: 'pulse 2s infinite', display: 'inline-block', flexShrink: 0 }} />
          {statusMessages[mode] || 'All systems optimal.'}
        </div>
      </div>

      {/* Energy snapshot */}
      <div style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '500' }}>Energy</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-strong, #e8edf2)' }}>
            {spoons}/{spoonMax} — {spoonStatus}
          </span>
        </div>
      </div>

      {/* Timer */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Focus Timer</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: timerRemaining > 0 ? '10px' : '0' }}>
          <input type="number" value={timerMinutes}
            onChange={e => setTimerMinutes(parseInt(e.target.value) || 0)}
            style={{ width: '56px', padding: '5px 8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'inherit' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', opacity: 0.8 }}>min</span>
          {!timerActive && timerRemaining === 0
            ? <button onClick={startTimer} className="btn small">▶ Start</button>
            : <button onClick={resetTimer} className="btn small ghost">↺ Reset</button>}
        </div>
        {timerRemaining > 0 && (
          <div style={{ textAlign: 'center', fontSize: '1.3rem', fontWeight: '700', color: 'var(--mode-accent, #7db9a3)', letterSpacing: '1px' }}>
            {fmt(timerRemaining)}
          </div>
        )}
      </div>

      {/* Memory */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Memory Bank</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input type="text" placeholder="Archive this knowledge…" value={memoryInput}
            onChange={e => setMemoryInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveMemory()}
            className="chat-input"
            style={{ flex: 1, fontSize: '0.85rem', padding: '6px 10px' }} />
          <button onClick={saveMemory} disabled={!memoryInput.trim()} className="btn small">
            Save
          </button>
        </div>
      </div>

      {/* Recovery */}
      <div style={{ ...sectionStyle, marginBottom: 0 }}>
        <label style={labelStyle}>Recovery</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { icon: '☕', name: 'Tea break',   detail: '+1 energy · 10 min' },
            { icon: '🐱', name: 'Cuddle cats', detail: '+2 energy · 15 min' },
            { icon: '💤', name: 'Power nap',   detail: '+3 energy · 20 min' },
          ].map(item => (
            <button key={item.name} className="btn ghost"
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', textAlign: 'left', justifyContent: 'flex-start' }}>
              <span>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '500' }}>{item.name}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.65 }}>{item.detail}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Facts Panel ─────────────────────────────────────────────────────────────

const FactsDisplay = () => {
  const { facts, clearFacts, spoons } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn ghost facts-toggle"
        style={{ borderRadius: '10px', padding: '10px', fontSize: '0.85rem' }}>
        📝 Memories ({facts.length})
      </button>
    );
  }

  return (
    <div className="facts-panel card">
      <div className="facts-header">
        <h3>Memories</h3>
        <div>
          <button onClick={clearFacts} className="btn small ghost">Clear</button>
          <button onClick={() => setIsOpen(false)} className="btn small ghost">Hide</button>
        </div>
      </div>
      <div className="facts-content">
        <div className="wellness-snapshot">
          <h4>Wellness Snapshot</h4>
          <p>Energy: {spoons}/12</p>
        </div>
        {facts.length === 0
          ? <p className="no-facts">No memories yet. Tell me to "remember" something.</p>
          : <ul className="facts-list">{facts.map((f, i) => <li key={i}>{f}</li>)}</ul>}
      </div>
    </div>
  );
};

// ── Notification ────────────────────────────────────────────────────────────

const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return <div className={`notification ${type}`}>{message}</div>;
};

// ── App Root ────────────────────────────────────────────────────────────────

export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState(null);
  const { mode } = useApp();

  const notify = (message, type = 'success') => setNotification({ message, type });

  return (
    <div className="app" data-mode={mode}>
      <header className="app-header">
        <div className="header-brand">
          <h1>AELI</h1>
          <span className="header-mode-tag">{MODE_LABELS[mode]}</span>
        </div>
        <div className="header-controls">
          <button onClick={() => setShowSettings(true)} className="btn ghost" title="Settings">
            ⚙
          </button>
          <button
            onClick={() => {
              if (window.confirm('Reset all data? This cannot be undone.')) {
                localStorage.clear();
                notify('Data reset.', 'warning');
                setTimeout(() => window.location.reload(), 800);
              }
            }}
            className="btn ghost"
            title="Reset all data"
          >
            ↺
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ModeSelector />
          <LeafEnergyDisplay />
        </div>

        {/* Center — chat */}
        <ChatInterface />

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AELICommandCenter />
          <FactsDisplay />
        </div>
      </div>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />
      )}
    </div>
  );
}
