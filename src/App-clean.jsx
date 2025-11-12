import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from './context/useApp';
import SettingsModal from './components/Settings/SettingsModal';

// ============= COMPONENTS =============



// NEW LEAF ENERGY COMPONENT - COMPLETELY REWRITTEN
const LeafEnergyDisplay = () => {
  const { spoons, setSpoons } = useApp();
  const maxSpoons = 12;

  console.log('LeafEnergyDisplay rendering with spoons:', spoons); // Debug log

  const renderLeaves = () => {
    const leaves = [];
    for (let i = 0; i < maxSpoons; i++) {
      const isActive = i < spoons;
      leaves.push(
        <span 
          key={`leaf-${i}`}
          className={`energy-leaf ${isActive ? 'active' : 'inactive'}`}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            fontSize: '1.8rem',
            margin: '0 2px',
            display: 'inline-block',
            transition: 'all 0.3s ease',
            opacity: isActive ? 1 : 0.3,
            filter: isActive ? 'brightness(1.2) saturate(1.3)' : 'grayscale(0.8) brightness(0.6)',
            transform: isActive ? 'scale(1.1)' : 'scale(0.9)'
          }}
        >
          🍃
        </span>
      );
    }
    return leaves;
  };

  const getEnergyLevel = () => {
    if (spoons >= 10) return 'High energy';
    if (spoons >= 7) return 'Good energy';
    if (spoons >= 4) return 'Moderate energy';
    if (spoons >= 2) return 'Low energy';
    return 'Very low energy';
  };

  const getEnergyColor = () => {
    if (spoons >= 10) return 'rgba(34, 197, 94, 0.8)';
    if (spoons >= 7) return 'rgba(101, 163, 13, 0.8)';
    if (spoons >= 4) return 'rgba(234, 179, 8, 0.8)';
    if (spoons >= 2) return 'rgba(249, 115, 22, 0.8)';
    return 'rgba(239, 68, 68, 0.8)';
  };

  return (
    <div className="leaf-energy-display card" style={{
      background: 'rgba(28, 60, 105, 0.8)',
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        <span>Energy Reserve 🍃</span>
        <span style={{
          color: 'rgba(156, 163, 175, 0.8)',
          fontSize: '1.2rem'
        }}>
          {spoons}/{maxSpoons}
        </span>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '4px',
        margin: '16px 0'
      }}>
        {renderLeaves()}
      </div>
      
      <div style={{
        width: '100%',
        height: '24px',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        margin: '16px 0',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
      }}>
        <div 
          style={{ 
            width: `${(spoons / maxSpoons) * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${getEnergyColor()}, rgba(34, 197, 94, 0.9))`,
            transition: 'all 0.5s ease',
            borderRadius: 'inherit',
            boxShadow: '0 0 8px rgba(34, 197, 94, 0.3)'
          }}
        />
      </div>
      
      <div style={{
        fontSize: '0.95rem',
        color: 'rgba(214, 228, 154, 0.8)',
        margin: '12px 0',
        fontWeight: '600'
      }}>
        {getEnergyLevel()}
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        margin: '16px 0'
      }}>
        <button 
          onClick={() => setSpoons(Math.max(0, spoons - 1))} 
          className="btn small"
          disabled={spoons <= 0}
          style={{
            minWidth: '40px',
            height: '36px',
            opacity: spoons <= 0 ? 0.4 : 1
          }}
        >
          -
        </button>
        <button 
          onClick={() => setSpoons(Math.max(0, spoons - 3))} 
          className="btn small"
          disabled={spoons <= 0}
          style={{
            minWidth: '40px',
            height: '36px',
            opacity: spoons <= 0 ? 0.4 : 1
          }}
        >
          -3
        </button>
        <button 
          onClick={() => setSpoons(Math.floor(maxSpoons / 2))} 
          className="btn small"
          style={{
            minWidth: '60px',
            height: '36px',
            background: 'rgba(100, 116, 139, 0.7)',
            color: 'rgba(243, 245, 247, 0.95)'
          }}
        >
          Reset
        </button>
        <button 
          onClick={() => setSpoons(Math.min(maxSpoons, spoons + 3))} 
          className="btn small"
          disabled={spoons >= maxSpoons}
          style={{
            minWidth: '40px',
            height: '36px',
            opacity: spoons >= maxSpoons ? 0.4 : 1
          }}
        >
          +3
        </button>
        <button 
          onClick={() => setSpoons(Math.min(maxSpoons, spoons + 1))} 
          className="btn small"
          disabled={spoons >= maxSpoons}
          style={{
            minWidth: '40px',
            height: '36px',
            opacity: spoons >= maxSpoons ? 0.4 : 1
          }}
        >
          +
        </button>
      </div>
      
      <div style={{
        fontSize: '0.85rem',
        color: 'rgba(243, 245, 247, 0.7)',
        marginTop: '12px',
        padding: '8px',
        background: 'rgba(107, 166, 143, 0.1)',
        borderRadius: '6px',
        borderLeft: '3px solid rgba(107, 166, 143, 0.5)'
      }}>
        ✓ Good energy levels for activities.
      </div>
    </div>
  );
};

// Mode Selector
const ModeSelector = () => {
  const { mode, setMode } = useApp();

  const modes = [
    { id: 'chat', name: 'Chat', icon: '💬', subtitle: 'Open dialogue' },
    { id: 'lowSpoon', name: 'Low Spoon', icon: '🍃', subtitle: 'Gentle support' },
    { id: 'focus', name: 'Focus', icon: '🎯', subtitle: 'Get things done' },
    { id: 'partner', name: 'Partner', icon: '👥', subtitle: 'Team up' },
  ];

  return (
    <div className="mode-selector card">
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`mode-btn ${mode === m.id ? 'active' : ''}`}
          style={{
            position: 'relative',
            ...(mode === m.id ? {
              boxShadow: '0 0 15px rgba(214, 228, 154, 0.4), 0 2px 8px rgba(0, 0, 0, 0.1)',
              animation: 'modeGlow 2s ease-in-out infinite alternate'
            } : {})
          }}
        >
          <span className="mode-icon">{m.icon}</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
            <span className="mode-name">{m.name}</span>
            <span style={{
              fontSize: '0.7rem',
              opacity: mode === m.id ? 0.9 : 0.7,
              color: mode === m.id ? 'inherit' : 'rgba(243, 245, 247, 0.6)',
              fontWeight: '400'
            }}>{m.subtitle}</span>
          </div>
          {mode === m.id && (
            <div style={{
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, rgba(214, 228, 154, 0.8), transparent)',
              borderRadius: '999px'
            }} />
          )}
        </button>
      ))}
    </div>
  );
};

// Message List
const MessageList = ({ messages }) => {
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.map((msg, index) => (
        <div key={`msg-${index}-${msg.text.substring(0, 10)}`} className={`message ${msg.isUser ? 'user' : 'aeli'}`}>
          <div className="message-content">
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

// Chat Interface
const ChatInterface = () => {
  const { settings, mode, spoons, addFact } = useApp();
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('AELI_CHAT_HISTORY');
    return saved ? JSON.parse(saved) : [{
      isUser: false,
      text: "Good day. I'm AELI, your adaptive assistant. How may I assist you today?"
    }];
  });
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    localStorage.setItem('AELI_CHAT_HISTORY', JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = useCallback(async () => {
    if (!input.trim() || isResponding) return;

    const userMessage = { isUser: true, text: input };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = input;
    setInput('');
    setIsResponding(true);

    const generateLocalResponse = (userInput) => {
      const lowerInput = userInput.toLowerCase();
      
      // Check for remember intent
      const rememberMatch = userInput.match(/remember (that )?(.*)/i);
      if (rememberMatch && rememberMatch[2]) {
        addFact(rememberMatch[2]);
        setMessages(prev => [...prev, { 
          isUser: false, 
          text: `[AELI] Noted. I'll remember: "${rememberMatch[2]}"` 
        }]);
        return;
      }
  
      // Timer intents
      if (lowerInput.includes('timer')) {
        const match = userInput.match(/(\d+)\s*(minute|min|m|second|sec|s)/i);
        if (match) {
          const amount = parseInt(match[1]);
          const unit = match[2].toLowerCase();
          const isMinutes = unit.startsWith('m');
          setMessages(prev => [...prev, { 
            isUser: false, 
            text: `[AELI] ⏱️ Timer set for ${amount} ${isMinutes ? 'minute' : 'second'}${amount !== 1 ? 's' : ''}.` 
          }]);
          return;
        }
      }
  
      // Context-aware responses
      let response;
      if (spoons < 4) {
        response = "You're running low on energy. Let's keep this simple and essential.";
      } else if (mode === 'lowSpoon') {
        response = "I'm here, keeping things gentle. What do you need?";
      } else if (mode === 'focus') {
        response = "Focus mode active. What's your priority task?";
      } else if (mode === 'partner') {
        response = "Partner support engaged. How can I help coordinate?";
      } else {
        response = `Certainly, ${settings.nameFormal || 'friend'}. How may I assist?`;
      }
  
      setMessages(prev => [...prev, { isUser: false, text: `[AELI] ${response}` }]);
    };

    try {
      // Try to call the actual API endpoint
      const response = await fetch('/.netlify/functions/chat-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          settings,
          mode,
          spoons,
          userId: settings.name || 'default'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          isUser: false, 
          text: `[AELI] ${data.reply || data.message || "I'm here to help."}` 
        }]);
      } else {
        // Fallback to local response generation
        generateLocalResponse(currentInput);
      }
    } catch {
      // If API fails, use local response generation
      console.log('Using local response generation');
      generateLocalResponse(currentInput);
    } finally {
      setIsResponding(false);
    }
  }, [input, isResponding, settings, mode, spoons, addFact]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-interface card">
      <MessageList messages={messages} />
      <div className="chat-input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isResponding ? "AELI is thinking..." : "Type your message..."}
          disabled={isResponding}
          className="chat-input"
        />
        <button onClick={handleSubmit} disabled={isResponding || !input.trim()} className="send-btn btn">
          Send
        </button>
      </div>
    </div>
  );
};

// AELI Command Center
const AELICommandCenter = () => {
  const { spoons, mode } = useApp();
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerActive, setTimerActive] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [memoryInput, setMemoryInput] = useState('');
  const [weather] = useState({ temp: 72, suggestion: 'T-shirt weather!' });
  
  // Debug log to check if weather is working
  console.log('Weather data:', weather);

  const spoonMax = 12;
  const spoonStatus = spoons >= 8 ? "Well resourced" : spoons >= 5 ? "Moderate energy" : spoons >= 3 ? "Low energy" : "Critical";
  
  const getStatusMessage = () => {
    const statusMessages = {
      chat: 'Systems ready for general conversation.',
      lowSpoon: 'Energy conservation protocols active.',
      focus: 'Focus enhancement modules online.',
      partner: 'Collaborative support systems engaged.'
    };
    return statusMessages[mode] || 'All systems optimal.';
  };

  const startTimer = () => {
    setTimerRemaining(timerMinutes * 60);
    setTimerActive(true);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerRemaining(0);
  };

  const saveMemory = () => {
    if (memoryInput.trim()) {
      console.log('Saving memory:', memoryInput);
      setMemoryInput('');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timerActive && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerRemaining]);

  return (
    <div className="card" style={{ textAlign: 'left' }}>
      {/* Header */}
      <div style={{
        marginBottom: 'var(--space-4)',
        paddingBottom: 'var(--space-3)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <h3 style={{ 
          margin: '0 0 var(--space-2) 0', 
          color: 'var(--gold-soft)', 
          fontSize: 'calc(1.2rem * var(--ui-font-scale))',
          fontWeight: '600'
        }}>🧠 AELI Command Center - TEST UPDATE</h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)', 
          fontSize: 'calc(0.85rem * var(--ui-font-scale))',
          color: 'var(--text-light)',
          opacity: '0.8'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--gold-soft)',
            animation: 'pulse 2s infinite',
            display: 'inline-block'
          }}></span>
          {getStatusMessage()}
        </div>
      </div>

      {/* Energy Reserve */}
      <div style={{
        marginBottom: 'var(--space-4)',
        padding: 'var(--space-3)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: '3px solid var(--gold-soft)'
      }}>
        <h4 style={{ 
          margin: '0 0 var(--space-1) 0', 
          color: 'var(--gold-soft)', 
          fontSize: 'calc(0.9rem * var(--ui-font-scale))',
          fontWeight: '600'
        }}>Energy Reserve Analysis</h4>
        <p style={{ 
          margin: '0 0 var(--space-3) 0', 
          color: 'var(--text-light)', 
          fontSize: 'calc(0.75rem * var(--ui-font-scale))',
          opacity: '0.7',
          fontStyle: 'italic'
        }}>Track today's spoons</p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-4)', 
          marginBottom: 'var(--space-3)' 
        }}>
          <div style={{ color: 'var(--gold-soft)' }}>
            <span style={{ 
              fontSize: 'calc(1.5rem * var(--ui-font-scale))', 
              fontWeight: 'bold' 
            }}>{spoons}</span>
            <span style={{ 
              fontSize: 'calc(1rem * var(--ui-font-scale))', 
              opacity: '0.7' 
            }}>/{spoonMax}</span>
          </div>
          <div>
            <div style={{ 
              color: 'var(--text-light)', 
              fontWeight: '600', 
              fontSize: 'calc(0.85rem * var(--ui-font-scale))' 
            }}>{spoonStatus}</div>
            <div style={{ 
              color: 'var(--text-light)', 
              fontSize: 'calc(0.75rem * var(--ui-font-scale))',
              opacity: '0.8' 
            }}>Good reserves for today's adventures.</div>
          </div>
        </div>
      </div>

      {/* Quick Deploy */}
      <div style={{
        marginBottom: 'var(--space-4)',
        padding: 'var(--space-3)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: '3px solid var(--gold-deep)'
      }}>
        <h4 style={{ 
          margin: '0 0 var(--space-1) 0', 
          color: 'var(--gold-soft)', 
          fontSize: 'calc(0.9rem * var(--ui-font-scale))',
          fontWeight: '600'
        }}>Quick Deploy</h4>
        <p style={{ 
          margin: '0 0 var(--space-3) 0', 
          color: 'var(--text-light)', 
          fontSize: 'calc(0.75rem * var(--ui-font-scale))',
          opacity: '0.7',
          fontStyle: 'italic'
        }}>Focus tools and memory</p>
        
        {/* Timer Section */}
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label style={{ 
            display: 'block', 
            color: 'var(--text-light)', 
            fontSize: 'calc(0.85rem * var(--ui-font-scale))',
            fontWeight: '600',
            marginBottom: 'var(--space-2)' 
          }}>Focus Timer</label>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-2)', 
            alignItems: 'center', 
            marginBottom: 'var(--space-2)' 
          }}>
            <input 
              type="number" 
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
              style={{
                width: '60px',
                padding: 'var(--space-2)',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-light)',
                fontSize: 'calc(0.85rem * var(--ui-font-scale))',
                fontFamily: 'inherit'
              }}
            />
            <span style={{ 
              color: 'var(--text-light)', 
              fontSize: 'calc(0.85rem * var(--ui-font-scale))',
              opacity: '0.8'
            }}>min</span>
            {!timerActive && timerRemaining === 0 ? (
              <button onClick={startTimer} className="btn small" style={{
                borderRadius: 'var(--radius-lg)'
              }}>▶️ Start</button>
            ) : (
              <button onClick={resetTimer} className="btn small" style={{
                borderRadius: 'var(--radius-lg)'
              }}>🔄 Reset</button>
            )}
          </div>
          {timerRemaining > 0 && (
            <div style={{
              padding: 'var(--space-3)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center'
            }}>
              <div style={{ 
                fontSize: 'calc(1.2rem * var(--ui-font-scale))', 
                fontWeight: 'bold', 
                color: 'var(--gold-soft)' 
              }}>
                {formatTime(timerRemaining)}
              </div>
            </div>
          )}
        </div>

        {/* Memory Bank */}
        <div>
          <label style={{ 
            display: 'block', 
            color: 'var(--text-light)', 
            fontSize: 'calc(0.85rem * var(--ui-font-scale))',
            fontWeight: '600',
            marginBottom: 'var(--space-2)' 
          }}>Memory Bank</label>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--space-2)' 
          }}>
            <input 
              type="text" 
              placeholder="Archive this knowledge..."
              value={memoryInput}
              onChange={(e) => setMemoryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && saveMemory()}
              className="chat-input"
              style={{
                flex: 1,
                fontSize: 'calc(0.85rem * var(--ui-font-scale))'
              }}
            />
            <button 
              onClick={saveMemory}
              disabled={!memoryInput.trim()}
              className="btn small"
              style={{
                borderRadius: 'var(--radius-lg)',
                opacity: memoryInput.trim() ? 1 : 0.5
              }}
            >
              💾 Save
            </button>
          </div>
        </div>
      </div>

      {/* Weather Scan */}
      <div style={{
        marginBottom: 'var(--space-4)',
        padding: 'var(--space-3)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: '3px solid var(--gold-deep)'
      }}>
        <h4 style={{ 
          margin: '0 0 var(--space-1) 0', 
          color: 'var(--gold-soft)', 
          fontSize: 'calc(0.9rem * var(--ui-font-scale))',
          fontWeight: '600'
        }}>☀️ Weather Scan</h4>
        <p style={{ 
          margin: '0 0 var(--space-3) 0', 
          color: 'var(--text-light)', 
          fontSize: 'calc(0.75rem * var(--ui-font-scale))',
          opacity: '0.7',
          fontStyle: 'italic'
        }}>Environment check</p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-3)',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <div style={{ 
            fontSize: 'calc(1.5rem * var(--ui-font-scale))', 
            fontWeight: 'bold', 
            color: 'var(--gold-soft)' 
          }}>{weather.temp}°F</div>
          <div style={{ 
            fontSize: 'calc(0.85rem * var(--ui-font-scale))', 
            color: 'var(--text-light)',
            opacity: '0.8',
            fontStyle: 'italic' 
          }}>{weather.suggestion}</div>
        </div>
      </div>

      {/* Recovery Protocols */}
      <div style={{
        padding: 'var(--space-3)',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        borderLeft: '3px solid var(--gold-soft)'
      }}>
        <h4 style={{ 
          margin: '0 0 var(--space-1) 0', 
          color: 'var(--gold-soft)', 
          fontSize: 'calc(0.9rem * var(--ui-font-scale))',
          fontWeight: '600'
        }}>Recovery Protocols</h4>
        <p style={{ 
          margin: '0 0 var(--space-3) 0', 
          color: 'var(--text-light)', 
          fontSize: 'calc(0.75rem * var(--ui-font-scale))',
          opacity: '0.7',
          fontStyle: 'italic'
        }}>Select appropriate restoration method</p>
        <div style={{ 
          display: 'grid', 
          gap: 'var(--space-2)' 
        }}>
          {[
            { icon: '☕', name: 'Tea break', details: '+1 energy • 10 min' },
            { icon: '🐱', name: 'Cuddle cats', details: '+2 energy • 15 min' },
            { icon: '💤', name: 'Power nap', details: '+3 energy • 20 min' }
          ].map((item, i) => (
            <button key={i} className="btn" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'calc(0.85rem * var(--ui-font-scale))',
              textAlign: 'left',
              justifyContent: 'flex-start'
            }}>              <span style={{ fontSize: 'calc(1.1rem * var(--ui-font-scale))' }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>{item.name}</div>
                <div style={{ 
                  fontSize: 'calc(0.75rem * var(--ui-font-scale))', 
                  opacity: '0.8',
                  color: 'inherit'
                }}>{item.details}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
const FactsDisplay = () => {
  const { facts, clearFacts, spoons } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn facts-toggle">
        📝 Memories ({facts.length})
      </button>
    );
  }

  return (
    <div className="facts-panel card">
      <div className="facts-header">
        <h3>My Memories</h3>
        <div>
          <button onClick={clearFacts} className="btn small">Clear All</button>
          <button onClick={() => setIsOpen(false)} className="btn small">Hide</button>
        </div>
      </div>
      <div className="facts-content">
        <div className="wellness-snapshot">
          <h4>Wellness Status</h4>
          <p>Current Energy: {spoons}/12 spoons</p>
        </div>
        {facts.length === 0 ? (
          <p className="no-facts">No memories stored yet. Tell me to "remember" something!</p>
        ) : (
          <ul className="facts-list">
            {facts.map((fact, idx) => (
              <li key={idx}>{fact}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Notification component
const Notification = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

// Main App
export default function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [notification, setNotification] = useState(null);
  const { mode } = useApp();

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const clearNotification = () => {
    setNotification(null);
  };

  // Enhanced button handlers with feedback
  const handleSettingsClick = () => {
    setShowSettings(true);
    showNotification('Settings opened');
    console.log('Settings button clicked');
  };

  const handleResetClick = () => {
    if (window.confirm('Are you sure you want to reset everything?')) {
      localStorage.clear();
      showNotification('All data reset!', 'warning');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className={`app ${mode}-theme`} data-mode={mode}>
      <header className="app-header card">
        <h1>🧠 AELI - UPDATED VERSION</h1>
        <div className="header-controls">
          <button onClick={handleSettingsClick} className="btn">
            ⚙️ Settings
          </button>
          <button onClick={handleResetClick} className="btn">
            🔄 Reset All
          </button>
        </div>
      </header>

      <div className="app-body">
        <ModeSelector />
        <LeafEnergyDisplay />
        <ChatInterface />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <AELICommandCenter />
          <FactsDisplay />
        </div>
      </div>

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      
      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={clearNotification}
        />
      )}
    </div>
  );
}
