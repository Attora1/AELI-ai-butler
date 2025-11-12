import React, { useState } from 'react';
import { useApp } from '../../context/useApp';
import { createMessage } from '../../utils/messageHelpers.js';
import '../../styles/modes-css/ModeLayout.css';

function ChatMode() {
  const { setMessages, spoons, setSpoons } = useApp();
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [memoryText, setMemoryText] = useState('');
  
  const handleSetTimer = () => {
    if (setMessages) {
      setMessages(prev => [...prev, 
        createMessage({ isUser: true, text: `Set a ${timerMinutes} minute timer` }),
        createMessage({ isUser: false, text: `[AELI] Timer set for ${timerMinutes} minutes. I'll notify you when it's complete.` })
      ]);
    }
  };
  
  const handleAddMemory = () => {
    if (memoryText.trim() && setMessages) {
      setMessages(prev => [...prev, 
        createMessage({ isUser: true, text: `Remember: ${memoryText}` }),
        createMessage({ isUser: false, text: `[AELI] Memory saved: "${memoryText}". I'll keep this in mind for our conversations.` })
      ]);
      setMemoryText('');
    }
  };
  
  const handleCheckWeather = () => {
    if (setMessages) {
      setMessages(prev => [...prev, 
        createMessage({ isUser: true, text: "What's the weather like?" }),
        createMessage({ isUser: false, text: `[AELI] Let me check the current weather conditions for you.` })
      ]);
    }
  };
  
  const handleSpoonQuote = () => {
    const quotes = [
      "I've calculated your spoon reserve. You may do exactly one foolish thing today—use it wisely.",
      "You've done more than you think and rested less than you need. Shall we rebalance the equation?",
      "You don't need motivation. You need hydration, a snack, and one human gesture of kindness. I volunteer as tribute.",
      "You're not lazy. You're under-resourced and over-stimulated. Let's reset.",
      "Your blood sugar and your search history both concern me. Shall we have some toast and delete Pinterest?"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    if (setMessages) {
      setMessages(prev => [...prev, 
        createMessage({ isUser: true, text: "I need some encouragement" }),
        createMessage({ isUser: false, text: `[AELI] ${randomQuote}` })
      ]);
    }
  };
  
  const getSpoonStatus = () => {
    if (spoons <= 2) return { text: 'Critical reserves', color: '#ff6b6b', advice: 'Essential tasks only. Rest is not optional.' };
    if (spoons <= 4) return { text: 'Running low', color: '#feca57', advice: 'Choose your battles wisely today.' };
    if (spoons <= 7) return { text: 'Moderate energy', color: '#48dbfb', advice: 'Steady progress, mind your limits.' };
    return { text: 'Well resourced', color: '#1dd1a1', advice: 'Good reserves for today\'s adventures.' };
  };
  
  const status = getSpoonStatus();
  
  const recoveryOptions = [
    { name: '☕ Tea break', spoons: 1, time: '10 min' },
    { name: '🐱 Cuddle cats', spoons: 2, time: '15 min' },
    { name: '😴 Power nap', spoons: 3, time: '20 min' }
  ];
  
  const handleRecovery = (option) => {
    const newSpoons = Math.min(12, spoons + option.spoons);
    setSpoons(newSpoons);
    if (setMessages) {
      setMessages(prev => [...prev, 
        createMessage({ isUser: true, text: `Taking a ${option.name.toLowerCase()}` }),
        createMessage({ isUser: false, text: `[AELI] Excellent choice. ${option.name} recovery complete. Energy restored: +${option.spoons} spoons.` })
      ]);
    }
  };
  
  return (
    <div className="mode-layout-container">
      <div className="dashboard-header">
        <h2>AELI Command Center</h2>
        <p className="system-status">All functions operating at peak condition. ♦️ Ready for service.</p>
      </div>
      
      <div className="dashboard-grid">
        {/* Spoon Management Panel */}
        <div className="spoon-panel">
          <h3>Energy Reserve Analysis</h3>
          <div className="spoon-meter">
            <div className="spoon-circle">
              <div className="spoon-value">{spoons}</div>
              <div className="spoon-max">/12</div>
            </div>
            <div className="spoon-bar">
              <div 
                className="spoon-fill" 
                style={{ 
                  width: `${(spoons / 12) * 100}%`,
                  backgroundColor: status.color 
                }}
              ></div>
            </div>
          </div>
          <div className="spoon-status" style={{ color: status.color }}>
            <strong>{status.text}</strong>
            <p>{status.advice}</p>
          </div>
          
          <div className="spoon-controls">
            <button 
              className="spoon-btn decrease" 
              onClick={() => setSpoons(Math.max(0, spoons - 1))}
              disabled={spoons === 0}
            >
              Task Complete (-1)
            </button>
            <button className="spoon-btn quote" onClick={handleSpoonQuote}>
              💬 Wisdom
            </button>
          </div>
        </div>
        
        {/* Quick Actions Panel */}
        <div className="actions-panel">
          <h3>Quick Deploy</h3>
          
          <div className="action-item">
            <label>Focus Timer</label>
            <div className="timer-setup">
              <input 
                type="number" 
                value={timerMinutes} 
                onChange={(e) => setTimerMinutes(e.target.value)}
                min="5" 
                max="120"
                className="timer-input"
              />
              <span>min</span>
              <button className="deploy-btn" onClick={handleSetTimer}>
                🎯 Deploy
              </button>
            </div>
          </div>
          
          <div className="action-item">
            <label>Memory Bank</label>
            <div className="memory-setup">
              <input 
                type="text" 
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Archive this knowledge..."
                className="memory-input"
                onKeyPress={(e) => e.key === 'Enter' && handleAddMemory()}
              />
              <button 
                className="deploy-btn" 
                onClick={handleAddMemory} 
                disabled={!memoryText.trim()}
              >
                💾 Store
              </button>
            </div>
          </div>
          
          <div className="quick-actions">
            <button className="quick-btn" onClick={handleCheckWeather}>
              🌤️ Weather Scan
            </button>
          </div>
        </div>
        
        {/* Recovery Station */}
        <div className="recovery-panel">
          <h3>Recovery Protocols</h3>
          <p className="recovery-note">Select appropriate restoration method:</p>
          
          <div className="recovery-options">
            {recoveryOptions.map((option, index) => (
              <button 
                key={index}
                className="recovery-btn"
                onClick={() => handleRecovery(option)}
                disabled={spoons >= 12}
              >
                <span className="recovery-icon">{option.name}</span>
                <span className="recovery-details">
                  +{option.spoons} energy • {option.time}
                </span>
              </button>
            ))}
          </div>
          
          {spoons <= 3 && (
            <div className="emergency-protocol">
              <p>⚠️ <strong>Emergency Protocol Active</strong></p>
              <p>Immediate rest recommended. All non-essential functions suspended.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMode;
