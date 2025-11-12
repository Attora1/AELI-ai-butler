import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/useApp';
import { getAELIResponse, modeResponses } from '../../personality/AELIPersonality';
import { createMessage, addMessage } from '../../utils/messageHelpers.js';
import './ChatInterface.css';

function ChatInterface() {
  const { 
    messages, 
    setMessages, 
    mode, 
    spoons, 
    addFact 
  } = useApp();
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const prevModeRef = useRef();

  // Smart auto-scroll behavior
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAtBottom]);

  // Check if user is at bottom of chat
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      setIsAtBottom(isBottom);
    }
  };

  // Initial greeting if no messages
  useEffect(() => {
    if (messages.length === 0) {
      const greeting = getAELIResponse('greeting');
      setMessages([createMessage({ 
        text: greeting, 
        isUser: false
      })]);
    }
  }, [messages.length, setMessages]);

  // Mode change announcement
  useEffect(() => {
    if (prevModeRef.current !== mode && messages.length > 0 && !messages[messages.length - 1].isSystem) {
      const modeResponse = getAELIResponse('modeSwitch', { mode });
      setMessages(prev => [...prev, createMessage({
        text: modeResponse,
        isUser: false,
        isSystem: true
      })]);
    }
    prevModeRef.current = mode;
  }, [mode, messages, setMessages]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = createMessage({
      text: input.trim(),
      isUser: true
    });

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input.toLowerCase();
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    let response = '';

    // Check for specific intents
    if (currentInput.includes('timer')) {
      const match = input.match(/(\d+)\s*(minute|min|m|second|sec|s)/i);
      if (match) {
        const amount = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const timeStr = `${amount} ${unit.startsWith('m') ? 'minute' : 'second'}${amount !== 1 ? 's' : ''}`;
        response = getAELIResponse('timerSet', { time: timeStr });
      } else {
        response = "Timer requires specificity. Try '5 minutes' or '30 seconds'. I'm not a mind reader.";
      }
    } 
    else if (currentInput.includes('remember')) {
      const match = input.match(/remember\s+(?:that\s+)?(.*)/i);
      if (match && match[1]) {
        addFact(match[1]);
        response = `Noted. Though why you'd trust my memory over yours is beyond me.`;
      }
    }
    else if (currentInput.includes('spoon') || currentInput.includes('energy')) {
      response = getAELIResponse('spoonCheck', { spoons });
    }
    else if (currentInput.includes('help')) {
      response = "I can manage timers, remember things you'll forget, track your energy levels, and provide commentary on your life choices. Current mode: " + mode + ". What disaster shall we address?";
    }
    else if (currentInput.includes('thank')) {
      response = "You're welcome. Though thanking me for doing my job is rather like applauding a fish for swimming.";
    }
    else if (currentInput.includes('sorry')) {
      response = "Apologies are unnecessary. Save them for something that matters. Shall we continue?";
    }
    else if (currentInput.includes('how are you')) {
      response = "Functioning within parameters. Which is more than I can say for your sleep schedule.";
    }
    else {
      // Mode-specific responses
      if (mode === 'lowSpoon') {
        const responses = modeResponses.lowSpoon;
        const category = spoons < 4 ? responses.encouragement : responses.suggestions;
        response = category[Math.floor(Math.random() * category.length)];
      } else if (mode === 'focus') {
        const responses = modeResponses.focus.encouragement;
        response = responses[Math.floor(Math.random() * responses.length)];
      } else if (mode === 'partner') {
        const responses = modeResponses.partner.support;
        response = responses[Math.floor(Math.random() * responses.length)];
      } else {
        // Default chat mode sass
        response = getAELIResponse('default', { spoons, mode });
      }
    }

    const aeliMessage = createMessage({
      text: response,
      isUser: false
    });

    setMessages(prev => [...prev, aeliMessage]);
    setIsTyping(false);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="chat-status">
          <span className="status-dot"></span>
          AELI {isTyping ? 'is typing...' : 'Online'}
        </div>
      </div>

      <div className="messages-container" ref={messagesContainerRef} onScroll={handleScroll}>
        {messages.map((msg, index) => {
          // Create stable ID for messages that don't have one
          const messageId = msg.id || `chat-${index}-${msg.text?.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')}-${msg.isUser ? 'user' : 'ai'}`;
          return (
            <div 
              key={messageId}
              className={`message ${msg.isUser ? 'user' : 'aeli'} ${msg.isSystem ? 'system' : ''}`}
            >
            <div className="message-bubble">
              {msg.text}
            </div>
            <div className="message-time">
              {new Date(msg.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
          );
        })}
        {isTyping && (
          <div className="message aeli typing">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isTyping ? "AELI is formulating a response..." : "Type your message..."}
          disabled={isTyping}
          className="chat-input"
          aria-label="Chat message input"
        />
        <button 
          type="submit" 
          disabled={isTyping || !input.trim()} 
          className="send-btn"
          aria-label="Send message"
        >
          <span aria-hidden="true">↑</span>
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;
