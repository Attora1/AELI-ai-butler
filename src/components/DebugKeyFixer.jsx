// Temporary debug component - add this to your app temporarily
import React from 'react';
import { useApp } from '../context/useApp.js';

export function DebugKeyFixer() {
  const { fixDuplicateKeys, clearChat } = useApp();

  const forceFixKeys = () => {
    console.log('🧹 Force clearing localStorage...');
    localStorage.removeItem('AELI_CHAT_HISTORY');
    localStorage.removeItem('AELI_FACTS');
    clearChat();
    window.location.reload();
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      zIndex: 9999,
      background: '#ff4444',
      color: 'white',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px'
    }}>
      <div>🚫 {/* Show error count */} Duplicate Key Errors</div>
      <button 
        onClick={forceFixKeys}
        style={{
          background: 'white',
          color: '#ff4444',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          marginTop: '5px',
          fontSize: '11px'
        }}
      >
        🔧 Force Fix Keys
      </button>
    </div>
  );
}
