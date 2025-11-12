import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header/Header';
import ModePanel from './components/ModePanel/ModePanel';
import ChatInterface from './components/Chat/ChatInterface';
import SpoonsDisplay from './components/Spoons/SpoonsDisplay';
import SettingsModal from './components/Settings/SettingsModal';
import { getAELIResponse } from './personality/AELIPersonality';
import './styles/theme.css';
import './styles/app-structured.css';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Track user activity for idle reminders
  useEffect(() => {
    const handleActivity = () => setLastActivity(Date.now());
    
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Periodic check for idle reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const idleTime = Date.now() - lastActivity;
      
      // After 30 minutes of inactivity
      if (idleTime > 1800000 && idleTime < 1860000) {
        const reminder = getAELIResponse('reminder', { lastActivity });
        console.log('AELI Reminder:', reminder);
        // Could trigger a notification here
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastActivity]);

  return (
    <AppProvider>
      <div className="app" data-mode="chat">
        <Header onSettingsClick={() => setShowSettings(true)} />
        
        <main className="app-main">
          <aside className="app-sidebar">
            <SpoonsDisplay />
            <ChatInterface />
          </aside>
          
          <section className="app-content">
            <ModePanel />
          </section>
        </main>

        <SettingsModal 
          isOpen={showSettings} 
          onClose={() => setShowSettings(false)} 
        />
      </div>
    </AppProvider>
  );
}

export default App;
