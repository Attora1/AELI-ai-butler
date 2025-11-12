import React, { createContext, useState, useEffect } from 'react';
import { DEFAULT_SETTINGS } from '../constants.js';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('AELI_SETTINGS');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : {
      ...DEFAULT_SETTINGS,
      name: '',
      nameFormal: 'miss',
      nameCasual: '',
      title: 'none',
      userPronouns: {
        subject: "they",
        object: "them",
        possessive: "their",
        reflexive: "themselves"
      },
      partnerPronouns: {
        subject: "they",
        object: "them",
        possessive: "their",
        reflexive: "themselves"
      },
      tone: 'dry',
      mood: 'neutral',
      mode: 'chat',
      voiceEnabled: false,
      voiceGender: 'female',
      voiceAccent: 'american',
      enableWeather: false,
      zip: '',
      humorLevel: 'british',
      theme: 'auto', // auto, light, dark
      reduceMotion: false,
      fontSize: 'normal', // small, normal, large
      fontFamily: 'sans-serif',
      memoryLimit: 5,
      highContrast: false
    };
  });

  const [spoons, setSpoons] = useState(8);
  const [mode, setMode] = useState(() => {
    return settings.mode || 'chat';
  });
  
  const [facts, setFacts] = useState(() => {
    const saved = localStorage.getItem('AELI_FACTS');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('AELI_CHAT_HISTORY');
    
    // Check if we need to force-clear problematic data
    const needsReset = localStorage.getItem('AELI_KEYS_FIXED');
    if (!needsReset) {
      console.log('🔧 First run after key fix - clearing old data');
      localStorage.removeItem('AELI_CHAT_HISTORY');
      localStorage.setItem('AELI_KEYS_FIXED', 'true');
      return [];
    }
    
    if (saved) {
      try {
        const parsedMessages = JSON.parse(saved);
        // Fix any messages that don't have proper IDs
        return parsedMessages.map((msg, index) => {
          if (!msg.id) {
            // Create stable ID for legacy messages
            return {
              ...msg,
              id: `legacy-${index}-${msg.text?.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')}-${msg.isUser ? 'user' : 'ai'}`
            };
          }
          return msg;
        });
      } catch (e) {
        console.warn('Failed to parse saved messages, starting fresh');
        return [];
      }
    }
    return [];
  });

  // Persist settings
  useEffect(() => {
    localStorage.setItem('AELI_SETTINGS', JSON.stringify(settings));
  }, [settings]);

  // Persist facts
  useEffect(() => {
    localStorage.setItem('AELI_FACTS', JSON.stringify(facts));
  }, [facts]);
  
  // Persist messages
  useEffect(() => {
    localStorage.setItem('AELI_CHAT_HISTORY', JSON.stringify(messages));
  }, [messages]);

  // Update data-mode attribute for CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  // Apply accessibility settings
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', settings.reduceMotion);
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.setAttribute('data-font-size', settings.fontSize);
    
    // Apply font family
    if (settings.fontFamily) {
      document.documentElement.style.setProperty('--font-family', settings.fontFamily);
    }
  }, [settings]);

  // Sync mode with settings
  useEffect(() => {
    if (settings.mode && settings.mode !== mode) {
      setMode(settings.mode);
    }
  }, [settings.mode, mode]);

  const addFact = (fact) => {
    setFacts(prev => [...prev, fact]);
  };

  const clearFacts = () => {
    setFacts([]);
    localStorage.removeItem('AELI_FACTS');
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('AELI_CHAT_HISTORY');
  };

  // Emergency function to fix duplicate key issues
  const fixDuplicateKeys = () => {
    console.log('🔧 Fixing duplicate keys in stored messages...');
    
    // Clear localStorage and reset messages
    localStorage.removeItem('AELI_CHAT_HISTORY');
    
    // Regenerate all message IDs
    const fixedMessages = messages.map((msg, index) => ({
      ...msg,
      id: `fixed-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    setMessages(fixedMessages);
    console.log('✅ Fixed', fixedMessages.length, 'messages with new unique IDs');
  };

  const value = {
    settings,
    setSettings,
    spoons,
    setSpoons,
    mode,
    setMode,
    facts,
    addFact,
    clearFacts,
    messages,
    setMessages,
    clearChat,
    fixDuplicateKeys
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
