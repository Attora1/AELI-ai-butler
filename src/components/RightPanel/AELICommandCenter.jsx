import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp.js';
import styles from '../../styles/AELICommandCenter.module.css';

const AELICommandCenter = () => {
  const { spoons, mode } = useApp();
  const [weather, setWeather] = useState(null);
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerActive, setTimerActive] = useState(false);
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [memoryInput, setMemoryInput] = useState('');
  const [aeliStatus, setAeliStatus] = useState('Analyzing conditions... all systems optimal.');

  const spoonMax = 12;
  const spoonStatus = spoons >= 8 ? "Well resourced" : spoons >= 5 ? "Moderate energy" : spoons >= 3 ? "Low energy" : "Critical";
  const spoonMessage = spoons >= 8 ? "Good reserves for today's adventures." : 
                      spoons >= 5 ? "Steady progress, mind your limits." : 
                      spoons >= 3 ? "Energy conservation mode recommended." : 
                      "Emergency rest protocols needed.";

  // Mock weather data - in real implementation, fetch from API
  useEffect(() => {
    const mockWeather = {
      temp: 72,
      condition: 'sunny',
      suggestion: 'T-shirt weather!'
    };
    setWeather(mockWeather);

    // Update AELI status based on mode
    const statusMessages = {
      chat: 'Systems ready for general conversation.',
      lowspoon: 'Energy conservation protocols active.',
      focus: 'Focus enhancement modules online.',
      partnersupport: 'Collaborative support systems engaged.'
    };
    setAeliStatus(statusMessages[mode] || 'All systems optimal.');
  }, [mode]);

  // Timer functionality
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

  const startTimer = () => {
    setTimerRemaining(timerMinutes * 60);
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerRemaining(0);
  };

  const saveMemory = () => {
    if (memoryInput.trim()) {
      // In real implementation, save to memory system
      console.log('Saving memory:', memoryInput);
      setMemoryInput('');
    }
  };

  const handleMemoryKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveMemory();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerProgress = () => {
    if (timerMinutes === 0) return 0;
    return ((timerMinutes * 60 - timerRemaining) / (timerMinutes * 60)) * 100;
  };

  return (
    <div className={styles["aeli-command-center"]}>
      <div className={styles["command-header"]}>
        <h2>AELI Command Center</h2>
        <div className={styles["status-indicator"]}>
          <span className={`${styles["status-dot"]} ${styles["ready"]}`}></span>
          <span>{aeliStatus}</span>
        </div>
      </div>

      {/* Energy Reserve Analysis */}
      <div className={`${styles["command-section"]} ${styles["energy-section"]}`}>
        <h3>Energy Reserve Analysis</h3>
        <p className={styles["section-subtitle"]}>Track today's spoons</p>
        <div className={styles["energy-display"]}>
          <div className={styles["energy-level"]}>
            <span className={styles["energy-number"]}>{spoons}</span>
            <span className={styles["energy-max"]}>/{spoonMax}</span>
          </div>
          <div className={styles["energy-status"]}>
            <div className={styles["status-label"]}>{spoonStatus}</div>
            <div className={styles["status-message"]}>{spoonMessage}</div>
          </div>
        </div>
        
        {/* Energy Indicators */}
        <div className={styles["energy-indicators"]}>
          {Array.from({ length: spoonMax }, (_, i) => (
            <div 
              key={i} 
              className={`${styles["energy-indicator"]} ${i < spoons ? styles["filled"] : styles["empty"]}`}
            >
              🥄
            </div>
          ))}
        </div>

        {/* Task Complete Badge */}
        <div className={styles["task-badge"]}>
          <span className={styles["task-complete"]}>Task Complete (-1)</span>
          <span className={styles["wisdom-badge"]}>🧠 Wisdom</span>
        </div>
      </div>

      {/* Quick Deploy */}
      <div className={`${styles["command-section"]} ${styles["quick-deploy"]}`}>
        <h3>Quick Deploy</h3>
        <p className={styles["section-subtitle"]}>Focus tools and memory</p>
        <div className={styles["deploy-controls"]}>
          <div className={styles["focus-timer"]}>
            <label>Focus Timer</label>
            <div className={styles["timer-controls"]}>
              <div className={styles["timer-input"]}>
                <input 
                  type="number" 
                  value={timerMinutes} 
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                  min="1" 
                  max="60" 
                  disabled={timerActive}
                />
                <span>min</span>
              </div>
              <div className={styles["timer-buttons"]}>
                {!timerActive && timerRemaining === 0 && (
                  <button className={styles["deploy-btn"]} onClick={startTimer}>
                    ▶️ Start
                  </button>
                )}
                {timerActive && (
                  <button className={styles["pause-btn"]} onClick={pauseTimer}>
                    ⏸️ Pause
                  </button>
                )}
                {!timerActive && timerRemaining > 0 && (
                  <button className={styles["resume-btn"]} onClick={pauseTimer}>
                    ▶️ Resume
                  </button>
                )}
                {timerRemaining > 0 && (
                  <button className={styles["reset-btn"]} onClick={resetTimer}>
                    🔄 Reset
                  </button>
                )}
              </div>
            </div>
            {timerRemaining > 0 && (
              <div className={styles["timer-display"]}>
                <div className={styles["timer-time"]}>{formatTime(timerRemaining)}</div>
                <div className={styles["timer-progress"]}>
                  <div 
                    className={styles["timer-progress-bar"]} 
                    style={{ width: `${getTimerProgress()}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles["memory-bank"]}>
            <label>Memory Bank</label>
            <div className={styles["memory-input-container"]}>
              <input 
                type="text" 
                placeholder="Archive this knowledge..." 
                className={styles["memory-input"]}
                value={memoryInput}
                onChange={(e) => setMemoryInput(e.target.value)}
                onKeyPress={handleMemoryKeyPress}
              />
              <button 
                className={styles["archive-btn"]} 
                onClick={saveMemory}
                disabled={!memoryInput.trim()}
              >
                💾 Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Scan */}
      <div className={`${styles["command-section"]} ${styles["weather-section"]}`}>
        <h3>☀️ Weather Scan</h3>
        <p className={styles["section-subtitle"]}>Environment check</p>
        {weather ? (
          <div className={styles["weather-widget"]}>
            <div className={styles["weather-temp"]}>{weather.temp}°F</div>
            <div className={styles["weather-suggestion"]}>{weather.suggestion}</div>
          </div>
        ) : (
          <div className={styles["weather-loading"]}>
            <div className={styles["weather-bar"]}>
              <div className={styles["weather-progress"]}></div>
            </div>
            <span>Scanning conditions...</span>
          </div>
        )}
        <div className={styles["weather-divider"]}></div>
      </div>

      {/* Recovery Protocols */}
      <div className={`${styles["command-section"]} ${styles["recovery-section"]}`}>
        <h3>Recovery Protocols</h3>
        <p className={styles["section-subtitle"]}>Select appropriate restoration method</p>
        <div className={styles["recovery-options"]}>
          <button className={`${styles["recovery-btn"]} ${styles["tea"]}`}>
            <span className={styles["recovery-icon"]}>☕</span>
            <div className={styles["recovery-text"]}>
              <span className={styles["recovery-name"]}>Tea break</span>
              <span className={styles["recovery-details"]}>+1 energy • 10 min</span>
            </div>
          </button>
          <button className={`${styles["recovery-btn"]} ${styles["cuddle"]}`}>
            <span className={styles["recovery-icon"]}>🐱</span>
            <div className={styles["recovery-text"]}>
              <span className={styles["recovery-name"]}>Cuddle cats</span>
              <span className={styles["recovery-details"]}>+2 energy • 15 min</span>
            </div>
          </button>
          <button className={`${styles["recovery-btn"]} ${styles["nap"]}`}>
            <span className={styles["recovery-icon"]}>💤</span>
            <div className={styles["recovery-text"]}>
              <span className={styles["recovery-name"]}>Power nap</span>
              <span className={styles["recovery-details"]}>+3 energy • 20 min</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AELICommandCenter;