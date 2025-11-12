import React, { useState, useEffect } from 'react';
import '../styles/App.css';

import { useChat } from '../hooks/useChat.jsx';
import { usePersistentTimerPolling } from '../hooks/useTimer.js';

import MessageList from './Chat/MessageList.jsx';
import ChatInput from './Chat/ChatInput.jsx';
import ChatInterface from './Chat/ChatInterface.jsx';
import WakeUpInput from './Chat/WakeUpInput.jsx';
import SettingsModal from './SettingsModal.jsx';
import HealthProfileEditor from './HealthProfileEditor.jsx';
import Header from './Header/Header.jsx';
import BackgroundEffects from './BackgroundEffects.jsx';
import { STORAGE_KEY } from '../constants.js';
import { useApp } from '../context/useApp.js';
import { getMoodReflection } from '../utils/introAndMood.js';
import { composeMemoryEntries } from '../utils/memoriesBridge.js';
import ModeRouter from './ModeRouter.jsx';

export default function AppContent() {
  const { mode, spoons, settings, setSettings, facts, addFact, clearFacts } = useApp();
  const [showFacts, setShowFacts] = useState(false);
  const [poweredDown, setPoweredDown] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Add error handling for chat hook
  const chatHookResult = useChat(settings, setSettings, facts, addFact, spoons, poweredDown, setPoweredDown) || {};
  const { messages, setMessages, input, setInput, isResponding, handleSubmit } = chatHookResult || {};

  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [inactivityMessageSent, setInactivityMessageSent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hpOpen, setHpOpen] = useState(false);
  
  // Add error handling for timer polling
  try {
    usePersistentTimerPolling(setMessages, poweredDown, settings);
  } catch (error) {
    console.warn('Timer polling hook error:', error);
  }

  // Enhanced button handlers with error handling
  const handleClearMemory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (setMessages) {
        setMessages([]);
      }
      console.log('Memory cleared successfully');
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  };

  const handleToggleFacts = () => {
    try {
      setShowFacts(prev => !prev);
      console.log('Facts visibility toggled');
    } catch (error) {
      console.error('Error toggling facts:', error);
    }
  };

  const handleClearFacts = () => {
    try {
      if (clearFacts) {
        clearFacts();
        console.log('Facts cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing facts:', error);
    }
  };

  const handleVoiceToggle = () => {
    try {
      if (setSettings) {
        setSettings(prev => ({ ...prev, voiceEnabled: !prev.voiceEnabled }));
        console.log('Voice toggled:', !settings.voiceEnabled);
      }
    } catch (error) {
      console.error('Error toggling voice:', error);
    }
  };

  const handleShowSettings = () => {
    try {
      setShowSettings(true);
      console.log('Settings modal opened');
    } catch (error) {
      console.error('Error opening settings:', error);
    }
  };

  const handleHealthProfileOpen = () => {
    try {
      setHpOpen(true);
      console.log('Health profile editor opened');
    } catch (error) {
      console.error('Error opening health profile:', error);
    }
  };

  useEffect(() => {
    // Preserve scroll position when mode changes
    const scrollY = window.scrollY;
    document.body.setAttribute('data-mode', mode);
    
    // Restore scroll position after a brief delay to allow layout changes
    const timer = setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [mode]);

  useEffect(() => {
    if (poweredDown) {
      const timer = setTimeout(() => setShowOverlay(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowOverlay(false);
    }

    const INACTIVITY_THRESHOLD = 5 * 60 * 1000;
    let inactivityTimer;

    const resetActivity = () => {
      setLastActivityTime(Date.now());
      setInactivityMessageSent(false);
    };

    const checkInactivity = () => {
      if (Date.now() - lastActivityTime > INACTIVITY_THRESHOLD && !inactivityMessageSent && setMessages) {
        const inactivityMessages = [
          "It appears you've either stepped away or achieved the rare miracle of sleep. Signal me when you return, and we'll pick up where we left off.",
          "You've gone quiet—either you've stepped away or slipped too deep into the feed. Let me know when you're back, and we'll carry on.",
          "You've gone quiet—either you've stepped away or been pulled into something shiny. Ping me when you're back, and we'll continue.",
        ];
        const randomMessage = inactivityMessages[Math.floor(Math.random() * inactivityMessages.length)];
        setMessages(prev => [...prev, { isUser: false, text: `[AELI] ${randomMessage}` }]);
        setInactivityMessageSent(true);
      }
    };

    window.addEventListener('mousemove', resetActivity);
    window.addEventListener('keydown', resetActivity);
    window.addEventListener('click', resetActivity);
    inactivityTimer = setInterval(checkInactivity, 5000);

    return () => {
      clearInterval(inactivityTimer);
      window.removeEventListener('mousemove', resetActivity);
      window.removeEventListener('keydown', resetActivity);
      window.removeEventListener('click', resetActivity);
    };
  }, [poweredDown, lastActivityTime, inactivityMessageSent, setMessages]);

  useEffect(() => {
    async function fetchInitialWeather() {
      if (settings?.enableWeather && settings?.zip) {
        try {
          const response = await fetch(`/api/weather?zip=${settings.zip}`);
          const weather = await response.json();
          if (response.ok) {
            // setTemperature(weather.temperature);
          } else {
            console.error("Error fetching weather:", weather.error);
          }
        } catch (error) {
          console.error("Failed to fetch weather data:", error);
        }
      }
    }
    fetchInitialWeather();
  }, [settings?.zip, settings?.enableWeather]);

  useEffect(() => {
    const hasSeen = localStorage.getItem("AELI_INTRO_SHOWN") === "true";

    if (
      !hasSeen &&
      settings?.nameFormal &&
      settings?.tone &&
      settings?.mood &&
      messages?.length > 0 &&
      setMessages
    ) {
      try {
        const moodLine = getMoodReflection(settings.mood);
        const line = `[AELI] Ah, ${settings.nameFormal}. Pleasure to make your acquaintance. I see you prefer a ${settings.tone} conversation. ${moodLine}`;
        setMessages((prev) => [...prev, { isUser: false, text: line }]);
        localStorage.setItem("AELI_INTRO_SHOWN", "true");
      } catch (error) {
        console.error('Error showing intro:', error);
      }
    }
  }, [settings, messages?.length, setMessages]);

  // Safe memory entries composition
  let memoryEntries = [];
  const spoonMax = 12; // Define spoonMax
  try {
    memoryEntries = composeMemoryEntries({ spoons, spoonMax });
  } catch (error) {
    console.error('Error composing memory entries:', error);
    memoryEntries = [];
  }

  return (
    <>
      <BackgroundEffects />
      <Header onSettingsClick={handleShowSettings} />
      <div className={`App ${mode}-theme`}>
        <div className="main-content">
          <div className="header-buttons">
            <button 
              onClick={handleShowSettings} 
              className="settings-button btn"
              title="Open Settings"
            >
              ⚙️
            </button>
            <button
              onClick={handleClearMemory}
              className="clear-memory-button btn"
              title="Clear Chat Memory"
            >
              Clear Memory
            </button>
            <button
              onClick={handleToggleFacts}
              className="show-facts-button btn"
              title="Toggle Memory Display"
            >
              {showFacts ? "Hide Memories" : "Show Memories"}
            </button>
            <button
              onClick={handleClearFacts}
              className="clear-facts-button btn"
              title="Clear All Memories"
            >
              Clear Memories
            </button>
            <button
              onClick={handleVoiceToggle}
              className="voice-toggle-button btn"
              title="Toggle Voice Output"
            >
              {settings?.voiceEnabled ? "🔈 Voice On" : "🔇 Voice Off"}
            </button>
          </div>

          <div className={`chat-container ${mode}-theme`}>
            {showFacts && (
              <div className="memory-facts" style={{ background: '#feffe8', border: '1px solid #eee', margin: '8px', padding: '8px' }}>
                <b>My Memories:</b>
                <button 
                  onClick={handleHealthProfileOpen} 
                  className="btn small"
                  title="Edit Health Profile"
                >
                  Edit Health Profile
                </button>

                {/* Wellness snapshot at the top */}
                {memoryEntries.map((entry, idx) => (
                  <section key={`wellness-${idx}`} className="memory-block">
                    <h4>{entry.title}</h4>
                    <pre className="memory-pre" style={{ whiteSpace: 'pre-wrap' }}>
                      {entry.content}
                    </pre>
                  </section>
                ))}

                {/* Your existing facts render */}
                {facts?.map((f, i) => (
                  <section key={i} className="memory-block">
                    <p>{typeof f === 'string' ? f : String(f)}</p>
                  </section>
                ))}
                <HealthProfileEditor open={hpOpen} onClose={() => setHpOpen(false)} />
              </div>
            )}
            <ChatInterface 
              messages={messages} 
              setMessages={setMessages} 
              input={input} 
              setInput={setInput} 
              isResponding={isResponding} 
              handleSubmit={handleSubmit} 
              poweredDown={poweredDown} 
            />
          </div>

          <div className="right-panel-container">
            <ModeRouter />
          </div>

          {showSettings && SettingsModal && (
            <SettingsModal
              isOpen={showSettings}
              onClose={() => setShowSettings(false)}
              settings={settings}
              setSettings={setSettings}
              setMessages={setMessages}
            />
          )}
        </div>
      </div>
      {showOverlay && (
        <div className="aeli-poweroff-overlay fade-in">
          <p>AELI is powered down. Say "wake up" to restore functions.</p>
        </div>
      )}
    </>
  );
}
