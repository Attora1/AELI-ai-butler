import React, { useEffect, useRef, useMemo, useState } from 'react';
import useAELIVoice from '../../hooks/useAELIVoice.js';
import { debugMessages } from '../../utils/messageHelpers.js';

export default function MessageList({ messages, settings, poweredDown }) {
  const containerRef = useRef(null);
  const [debugMode, setDebugMode] = useState(false);

  // Ensure all messages have unique IDs - but make them stable!
  const messagesWithIds = useMemo(() => {
    return messages.map((msg, index) => {
      if (msg.id) {
        return msg; // Already has ID, don't change it
      }
      // For messages without IDs, create a stable one based on content + index
      const stableId = `msg-${index}-${msg.text?.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')}-${msg.isUser ? 'user' : 'ai'}`;
      return {
        ...msg,
        id: stableId
      };
    });
  }, [messages]);

  // Memoize last Aeli message
  const lastAeliMessage = useMemo(() => {
    const reversed = [...messagesWithIds].reverse();
    return reversed.find((msg) => !msg.isUser && msg.text);
  }, [messagesWithIds]);

  // Debug functions using helper
  const runAllDebugChecks = () => {
    const debugInfo = debugMessages(messagesWithIds);
    
    console.log('=== MESSAGE LIST DEBUG ===');
    console.log('Messages with keys:', debugInfo.messagesWithKeys);
    console.log('Debug stats:', debugInfo.stats);
    
    console.log('=== DUPLICATE ANALYSIS ===');
    console.log('Duplicate timestamps:', debugInfo.duplicateTimestamps);
    console.log('Messages grouped by duplicate timestamps:', debugInfo.duplicateGroups);
    
    if (debugInfo.stats.hasDuplicateIds) {
      console.warn('⚠️ DUPLICATE IDs DETECTED!');
    }
    if (debugInfo.stats.hasDuplicateTimestamps) {
      console.warn('⚠️ DUPLICATE TIMESTAMPS DETECTED!');
    }
    
    return debugInfo;
  };

  // Auto-run debug when messages change (if debug mode is on)
  useEffect(() => {
    if (debugMode && messagesWithIds.length > 0) {
      runAllDebugChecks();
    }
  }, [messagesWithIds, debugMode]);

  const aeliText = lastAeliMessage?.text?.replace(/^\[AELI\] |\[User\] /, '');

  useAELIVoice(aeliText, settings, poweredDown);

  useEffect(() => {
    if (containerRef.current && messagesWithIds.length > 0) {
      const container = containerRef.current;
      const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
      
      // Only auto-scroll if user is already near the bottom or if it's a new message
      if (isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [messagesWithIds]);

  const filteredMessages = messagesWithIds.filter(m => typeof m?.text === "string" && m.text.trim().length > 0);

  return (
    <>
      {/* Debug Controls */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          padding: '8px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '4px', 
          marginBottom: '8px',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
            <button
              onClick={() => setDebugMode(!debugMode)}
              style={{
                padding: '4px 8px',
                backgroundColor: debugMode ? '#f59e0b' : '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Debug: {debugMode ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={runAllDebugChecks}
              style={{
                padding: '4px 8px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Run Debug
            </button>
            <span style={{ color: '#6b7280' }}>
              Messages: {filteredMessages.length} | Unique IDs: {new Set(filteredMessages.map(m => m.id)).size}
            </span>
          </div>
          {debugMode && (
            <div style={{ color: '#6b7280', fontSize: '10px' }}>
              Open console (F12) to see detailed debug output
            </div>
          )}
        </div>
      )}

      <div className="messages" ref={containerRef} style={{ overflowY: 'auto', maxHeight: '70vh' }}>
        {messagesWithIds.length === 0 && (
          <div className="message-bubble ai">
            <p>Systems operational. Awaiting instructions. ♦tea sip♦</p>
          </div>
        )}
        {filteredMessages.map((msg) => (
          // ✅ Using unique ID instead of array index
          <div
            key={msg.id}
            className={`message-bubble ${msg?.isUser ? 'user' : 'ai'}`}
          >
            <p>{msg.text.replace(/^\[AELI\] |\[User\] /, '')}</p>
            {debugMode && (
              <div style={{ 
                fontSize: '9px', 
                color: '#9ca3af', 
                marginTop: '4px',
                fontFamily: 'monospace'
              }}>
                ID: {msg.id} | TS: {msg.timestamp}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
