import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App-clean.jsx'
import LeafTest from './LeafTest.jsx'
import { AppProvider } from './context/AppContext.jsx'
// Removed index.css import to avoid conflicts

// Original AELI themes with transparency
const styles = `
  /* Import original theme variables */
  :root {
    /* Original color palette with transparency */
    --steel-blue: rgba(28, 60, 105, 0.7);
    --gold-soft: rgba(214, 228, 154, 0.8);
    --gold-deep: rgba(189, 183, 107, 0.9);
    --gold-dark: rgba(189, 183, 107, 0.7);
    --navy-deep: rgba(3, 45, 46, 0.8);
    --cloud-gray: rgba(243, 245, 247, 0.9);
    --blue-gray: rgba(100, 116, 139, 0.6);
    --text-light: rgba(243, 245, 247, 0.95);
    --background-dark: rgba(15, 17, 21, 0.9);
    --border-subtle: rgba(255, 255, 255, 0.08);
    --border-faint: rgba(255, 255, 255, 0.05);
    
    /* Spacing tokens */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    
    /* Radius tokens */
    --radius-sm: 6px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    
    /* Transitions */
    --transition-ease: all 0.2s ease;
    
    /* UI font scale */
    --ui-font-scale: 1;
    
    /* Shadow tokens */
    --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  /* Reset */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* Base styling */
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-light);
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* Chat theme background */
  .chat-theme {
    background: linear-gradient(135deg, rgba(42, 37, 53, 0.8) 0%, rgba(58, 53, 72, 0.8) 100%);
  }

  /* Low Spoon theme background */
  .lowSpoon-theme {
    background: linear-gradient(135deg, rgba(37, 42, 39, 0.8) 0%, rgba(47, 56, 50, 0.8) 100%);
  }

  /* Focus theme background */
  .focus-theme {
    background: linear-gradient(135deg, rgba(26, 34, 53, 0.8) 0%, rgba(37, 47, 69, 0.8) 100%);
    color: #DCEFFF;
  }

  /* Partner theme background */
  .partner-theme {
    background: linear-gradient(135deg, rgba(34, 40, 53, 0.8) 0%, rgba(42, 56, 69, 0.8) 100%);
  }

  /* App layout */
  .app {
    min-height: 100vh;
    backdrop-filter: blur(8px);
    position: relative;
    overflow: hidden;
  }

  .app::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(107, 166, 143, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(214, 228, 154, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(189, 183, 107, 0.1) 0%, transparent 50%);
    z-index: -1;
  }

  /* Header */
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-6);
    margin: var(--space-4);
    background: var(--steel-blue);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
  }

  .app-header h1 {
    font-size: calc(2rem * var(--ui-font-scale));
    color: var(--gold-soft);
    text-shadow: 0 0 10px rgba(214, 228, 154, 0.3);
  }

  .header-controls {
    display: flex;
    gap: var(--space-3);
  }

  /* Main app body */
  .app-body {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: var(--space-6);
    padding: var(--space-4) var(--space-6);
    align-items: start;
  }

  /* Cards */
  .card {
    background: var(--steel-blue);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow-lg);
  }

  /* Buttons */
  .btn {
    background: var(--gold-dark);
    color: var(--navy-deep);
    border: none;
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-weight: 600;
    font-size: calc(0.9rem * var(--ui-font-scale));
    transition: var(--transition-ease);
    font-family: inherit;
  }

  .btn:hover:not(:disabled) {
    background: var(--gold-deep);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn.small {
    padding: var(--space-1) var(--space-2);
    font-size: calc(0.8rem * var(--ui-font-scale));
  }

  .btn.primary {
    background: rgba(107, 166, 143, 0.8);
    color: white;
  }

  .btn.primary:hover {
    background: rgba(107, 166, 143, 1);
  }

  /* Mode selector */
  .mode-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }

  .mode-btn {
    background: rgba(100, 116, 139, 0.3);
    border: 1px solid var(--border-subtle);
    color: var(--text-light);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: var(--transition-ease);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }

  .mode-btn:hover {
    background: rgba(100, 116, 139, 0.5);
    border-color: var(--gold-soft);
  }

  .mode-btn.active {
    background: var(--gold-dark);
    border-color: var(--gold-soft);
    color: var(--navy-deep);
  }

  .mode-icon {
    font-size: 1.5rem;
  }

  .mode-name {
    font-size: calc(0.85rem * var(--ui-font-scale));
    font-weight: 600;
  }

  /* Spoons display with leaves */
  .spoons-display {
    text-align: center;
    background: rgba(28, 60, 105, 0.8);
    padding: var(--space-6);
  }

  .spoons-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
    font-size: calc(1.1rem * var(--ui-font-scale));
    font-weight: 600;
  }

  .energy-count {
    color: rgba(156, 163, 175, 0.8);
    font-size: calc(1.2rem * var(--ui-font-scale));
  }

  .leaves-container {
    display: flex;
    justify-content: center;
    gap: var(--space-2);
    margin: var(--space-4) 0;
    flex-wrap: wrap;
  }

  .leaf {
    font-size: 1.5rem;
    transition: all 0.3s ease;
    animation: leafFloat 3s ease-in-out infinite;
    transform-origin: center;
  }

  .leaf.active {
    opacity: 1;
    filter: brightness(1.2) saturate(1.3);
    transform: scale(1.1);
  }

  .leaf.inactive {
    opacity: 0.3;
    filter: grayscale(0.8) brightness(0.6);
    transform: scale(0.9);
  }

  @keyframes leafFloat {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-3px) rotate(2deg); }
  }

  @keyframes modeGlow {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }

  .spoons-controls {
    display: flex;
    justify-content: center;
    gap: var(--space-2);
    margin: var(--space-4) 0;
  }

  .control-btn {
    min-width: 40px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }

  .control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .reset-btn {
    background: rgba(100, 116, 139, 0.7) !important;
    color: var(--text-light) !important;
    min-width: 60px;
  }

  .reset-btn:hover:not(:disabled) {
    background: rgba(100, 116, 139, 0.9) !important;
  }

  .spoons-bar {
    width: 100%;
    height: 24px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    overflow: hidden;
    position: relative;
    margin: var(--space-4) 0;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .spoons-fill {
    height: 100%;
    transition: all 0.5s ease;
    border-radius: inherit;
    position: relative;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.3);
  }

  .energy-status {
    font-size: calc(0.95rem * var(--ui-font-scale));
    color: var(--gold-soft);
    margin: var(--space-3) 0;
    font-weight: 600;
  }

  .energy-tip {
    font-size: calc(0.85rem * var(--ui-font-scale));
    color: rgba(243, 245, 247, 0.7);
    margin-top: var(--space-3);
    padding: var(--space-2);
    background: rgba(107, 166, 143, 0.1);
    border-radius: var(--radius-sm);
    border-left: 3px solid rgba(107, 166, 143, 0.5);
  }

  /* Chat interface */
  .chat-interface {
    display: flex;
    flex-direction: column;
    height: 70vh;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
  }

  .message {
    display: flex;
    margin-bottom: var(--space-3);
  }

  .message.user {
    justify-content: flex-end;
  }

  .message.aeli {
    justify-content: flex-start;
  }

  .message-content {
    max-width: 80%;
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    line-height: 1.4;
  }

  .message.user .message-content {
    background: var(--gold-dark);
    color: var(--navy-deep);
  }

  .message.aeli .message-content {
    background: rgba(13, 33, 65, 0.7);
    color: var(--text-light);
    border-left: 3px solid var(--gold-soft);
  }

  .chat-input-wrapper {
    display: flex;
    gap: var(--space-3);
    padding-top: var(--space-3);
    border-top: 1px solid var(--border-subtle);
  }

  .chat-input {
    flex: 1;
    padding: var(--space-3);
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-light);
    font-family: inherit;
    font-size: calc(1rem * var(--ui-font-scale));
  }

  .chat-input:focus {
    outline: none;
    border-color: var(--gold-soft);
    box-shadow: 0 0 0 2px rgba(214, 228, 154, 0.2);
  }

  .chat-input::placeholder {
    color: rgba(243, 245, 247, 0.5);
  }

  /* Facts panel */
  .facts-panel {
    display: flex;
    flex-direction: column;
    height: 50vh;
  }

  .facts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
  }

  .facts-header h3 {
    color: var(--gold-soft);
  }

  .facts-header div {
    display: flex;
    gap: var(--space-2);
  }

  .facts-content {
    flex: 1;
    overflow-y: auto;
  }

  .facts-list {
    list-style: none;
    padding: 0;
  }

  .facts-list li {
    padding: var(--space-2);
    margin-bottom: var(--space-2);
    background: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-sm);
    border-left: 3px solid var(--gold-soft);
  }

  .wellness-snapshot {
    margin-bottom: var(--space-4);
    padding: var(--space-3);
    background: rgba(107, 166, 143, 0.1);
    border-radius: var(--radius-sm);
    border: 1px solid rgba(107, 166, 143, 0.3);
  }

  .wellness-snapshot h4 {
    color: var(--gold-soft);
    margin-bottom: var(--space-2);
  }

  .no-facts {
    color: rgba(243, 245, 247, 0.6);
    font-style: italic;
    text-align: center;
    padding: var(--space-4);
  }

  .facts-toggle {
    width: 100%;
    margin-bottom: var(--space-4);
  }

  /* Modal styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .modal-content {
    background: rgba(28, 60, 105, 0.95);
    border: 2px solid var(--border-subtle);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    max-width: 500px;
    width: 90%;
    backdrop-filter: blur(10px);
    box-shadow: var(--shadow-lg);
  }

  .modal-content h2 {
    color: var(--gold-soft);
    margin-bottom: var(--space-6);
    text-align: center;
    font-size: calc(1.5rem * var(--ui-font-scale));
  }

  .setting-group {
    margin-bottom: var(--space-4);
  }

  .setting-group label {
    display: block;
    margin-bottom: var(--space-2);
    color: var(--text-light);
    font-weight: 600;
    font-size: calc(0.9rem * var(--ui-font-scale));
  }

  .setting-group input,
  .setting-group select {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-sm);
    color: var(--text-light);
    font-family: inherit;
    font-size: calc(0.9rem * var(--ui-font-scale));
  }

  .setting-group input:focus,
  .setting-group select:focus {
    outline: none;
    border-color: var(--gold-soft);
    box-shadow: 0 0 0 2px rgba(214, 228, 154, 0.2);
  }

  .setting-group input[type="checkbox"] {
    width: auto;
    margin-right: var(--space-2);
  }

  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    margin-top: var(--space-6);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .app-body {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto 1fr auto;
      gap: var(--space-4);
    }
    
    .mode-selector {
      grid-template-columns: repeat(4, 1fr);
    }
    
    .chat-interface {
      height: 60vh;
    }
    
    .facts-panel {
      height: auto;
    }
    
    .app-header {
      margin: var(--space-2);
      padding: var(--space-4);
    }
    
    .app-body {
      padding: var(--space-2) var(--space-4);
    }
  }

  /* Custom scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(214, 228, 154, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(214, 228, 154, 0.5);
  }

  /* Smooth transitions for theme changes */
  .app,
  .card,
  .btn,
  .mode-btn,
  .message-content {
    transition: background-color 0.6s ease, border-color 0.6s ease, color 0.6s ease;
  }

  /* Mode-specific overrides */
  .lowSpoon-theme .card {
    background: rgba(37, 42, 39, 0.8);
    box-shadow: 0 0 20px rgba(107, 166, 143, 0.2);
  }

  .focus-theme .card {
    background: rgba(26, 34, 53, 0.8);
    box-shadow: 0 0 12px rgba(0, 128, 255, 0.2);
  }

  .partner-theme .card {
    background: rgba(34, 40, 53, 0.8);
    box-shadow: 0 0 20px rgba(214, 228, 154, 0.2);
  }

  /* Working button feedback */
  .btn:active {
    transform: translateY(0px) scale(0.98);
  }

  /* Focus styles for accessibility */
  .btn:focus-visible,
  .mode-btn:focus-visible,
  .chat-input:focus-visible {
    outline: 2px solid var(--gold-soft);
    outline-offset: 2px;
  }

  /* Notification styles */
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: var(--space-4) var(--space-5);
    border-radius: var(--radius-md);
    color: white;
    font-weight: 600;
    z-index: 2000;
    animation: slideInRight 0.3s ease-out;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .notification.success {
    background: rgba(107, 166, 143, 0.9);
    border-color: rgba(107, 166, 143, 0.5);
  }

  .notification.warning {
    background: rgba(214, 228, 154, 0.9);
    color: var(--navy-deep);
    border-color: rgba(214, 228, 154, 0.5);
  }

  .notification.error {
    background: rgba(220, 53, 69, 0.9);
    border-color: rgba(220, 53, 69, 0.5);
  }

  @keyframes slideInRight {
    from {
      transform: translateX(300px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <LeafTest />
      <App />
    </AppProvider>
  </React.StrictMode>,
)
