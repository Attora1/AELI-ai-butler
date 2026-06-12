import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App-clean.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './styles/tokens.css'
import './styles/theme.css'

/* ── Layout & component styles ─────────────────────────────────────────── */
const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: var(--font-sans, system-ui, sans-serif);
    color: var(--text, #f3f5f7);
    line-height: var(--leading-normal, 1.6);
    overflow-x: hidden;
    background: var(--color-background, #1a1a1a);
  }

  /* ── App shell ── */
  .app {
    min-height: 100vh;
    background: var(--mode-gradient, linear-gradient(135deg, #2a2535 0%, #3a3548 100%));
    transition: background 0.6s ease;
    position: relative;
  }

  .app::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(circle at 20% 80%, rgba(107,166,143,0.06) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(214,228,154,0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ── */
  .app-header {
    position: sticky;
    top: 0;
    z-index: var(--z-header, 900);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) var(--space-6);
    background: rgba(255,255,255,0.03);
    border-bottom: 1px solid var(--border-subtle, rgba(255,255,255,0.08));
    backdrop-filter: blur(16px);
  }

  .header-brand { display: flex; align-items: baseline; gap: var(--space-3); }

  .header-brand h1 {
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    color: var(--text-strong, #e8edf2);
  }

  .header-mode-tag {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--mode-accent, #7db9a3);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    opacity: 0.85;
  }

  .header-controls { display: flex; gap: var(--space-2); align-items: center; }

  /* ── Main grid ── */
  .app-body {
    display: grid;
    grid-template-columns: 240px 1fr 260px;
    gap: var(--space-5);
    padding: var(--space-5) var(--space-6);
    align-items: start;
    position: relative;
    z-index: 1;
  }

  /* ── Cards ── */
  .card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 16px;
    padding: var(--space-5);
    backdrop-filter: blur(12px);
    box-shadow: 0 6px 24px rgba(0,0,0,0.25);
  }

  /* ── Buttons ── */
  .btn {
    background: var(--mode-primary, #4a5a6b);
    color: var(--text, #f3f5f7);
    border: 1px solid rgba(255,255,255,0.12);
    padding: var(--space-2) var(--space-4);
    border-radius: 9999px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    font-family: inherit;
    line-height: 1.4;
  }

  .btn:hover:not(:disabled) {
    background: var(--mode-accent, #5a6b8b);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  }

  .btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .btn:active:not(:disabled) { transform: translateY(0) scale(0.97); }

  .btn.small { padding: 3px var(--space-3); font-size: 0.8rem; }

  .btn.ghost {
    background: transparent;
    border-color: rgba(255,255,255,0.12);
    color: var(--text-dim, rgba(243,245,247,0.7));
    font-size: 1rem;
    padding: var(--space-2) var(--space-3);
  }

  .btn.ghost:hover:not(:disabled) {
    background: rgba(255,255,255,0.07);
    color: var(--text, #f3f5f7);
    transform: none;
    box-shadow: none;
  }

  /* ── Mode selector (left col) ── */
  .mode-selector { display: flex; flex-direction: column; gap: var(--space-2); }

  .mode-btn {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-dim, rgba(243,245,247,0.7));
    padding: var(--space-3) var(--space-4);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    text-align: left;
  }

  .mode-btn:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.15);
    color: var(--text, #f3f5f7);
  }

  .mode-btn.active {
    background: var(--mode-primary, #4a5a6b);
    border-color: var(--mode-accent, #5a6b8b);
    color: var(--text, #f3f5f7);
    box-shadow: 0 0 14px rgba(107,166,143,0.18);
  }

  .mode-icon { font-size: 1rem; flex-shrink: 0; }
  .mode-name { font-weight: 500; }

  /* ── Chat ── */
  .chat-interface {
    display: flex;
    flex-direction: column;
    height: 72vh;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .message { display: flex; }
  .message.user { justify-content: flex-end; }
  .message.aeli { justify-content: flex-start; }

  .message-content {
    max-width: 78%;
    padding: var(--space-3) var(--space-4);
    border-radius: 12px;
    line-height: 1.5;
    font-size: 0.925rem;
  }

  .message.user .message-content {
    background: var(--mode-primary, #4a5a6b);
    color: var(--text, #f3f5f7);
    border-bottom-right-radius: 4px;
  }

  .message.aeli .message-content {
    background: rgba(255,255,255,0.06);
    color: var(--text, #f3f5f7);
    border: 1px solid rgba(255,255,255,0.07);
    border-bottom-left-radius: 4px;
  }

  .chat-input-wrapper {
    display: flex;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .chat-input {
    flex: 1;
    padding: var(--space-3) var(--space-4);
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px;
    color: var(--text, #f3f5f7);
    font-family: inherit;
    font-size: 0.925rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .chat-input:focus {
    outline: none;
    border-color: var(--mode-accent, #5a6b8b);
    box-shadow: 0 0 0 2px rgba(107,166,143,0.12);
  }

  .chat-input::placeholder { color: rgba(243,245,247,0.3); }

  /* ── Facts panel ── */
  .facts-panel { display: flex; flex-direction: column; height: 38vh; }

  .facts-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
  }

  .facts-header h3 {
    color: var(--text-strong, #e8edf2);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  .facts-header div { display: flex; gap: var(--space-2); }
  .facts-content { flex: 1; overflow-y: auto; }
  .facts-list { list-style: none; padding: 0; }

  .facts-list li {
    padding: var(--space-2) var(--space-3);
    margin-bottom: var(--space-2);
    background: rgba(255,255,255,0.04);
    border-radius: 8px;
    border-left: 2px solid var(--mode-accent, #5a6b8b);
    font-size: 0.85rem;
    color: var(--text-dim, rgba(243,245,247,0.8));
  }

  .wellness-snapshot {
    margin-bottom: var(--space-3);
    padding: var(--space-3);
    background: rgba(107,166,143,0.08);
    border-radius: 8px;
    border: 1px solid rgba(107,166,143,0.18);
  }

  .wellness-snapshot h4 {
    color: var(--text-strong, #e8edf2);
    margin-bottom: var(--space-1);
    font-size: 0.825rem;
    font-weight: 600;
  }

  .wellness-snapshot p { font-size: 0.825rem; color: var(--text-dim); }

  .no-facts {
    color: var(--text-dim, rgba(243,245,247,0.5));
    font-style: italic;
    text-align: center;
    padding: var(--space-4);
    font-size: 0.875rem;
  }

  .facts-toggle { width: 100%; }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.65);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(8px);
  }

  .modal-content {
    background: rgba(22,22,26,0.97);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: var(--space-8);
    max-width: 480px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  }

  .modal-content h2 {
    color: var(--text-strong, #e8edf2);
    margin-bottom: var(--space-6);
    text-align: center;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.2px;
  }

  .setting-group { margin-bottom: var(--space-4); }

  .setting-group label {
    display: block;
    margin-bottom: var(--space-2);
    color: var(--text-dim, rgba(243,245,247,0.75));
    font-weight: 500;
    font-size: 0.875rem;
  }

  .setting-group input,
  .setting-group select {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: var(--text, #f3f5f7);
    font-family: inherit;
    font-size: 0.875rem;
  }

  .setting-group input:focus,
  .setting-group select:focus {
    outline: none;
    border-color: var(--mode-accent, #5a6b8b);
  }

  .setting-group input[type="checkbox"] { width: auto; margin-right: var(--space-2); }

  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: var(--space-4);
    margin-top: var(--space-6);
  }

  /* ── Notification ── */
  .notification {
    position: fixed;
    top: var(--space-5);
    right: var(--space-5);
    padding: var(--space-3) var(--space-5);
    border-radius: 10px;
    color: var(--text, #f3f5f7);
    font-weight: 500;
    font-size: 0.875rem;
    z-index: 10000;
    animation: slideInRight 0.25s ease-out;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
  }

  .notification.success { background: rgba(74,122,90,0.88); }
  .notification.warning { background: rgba(122,106,74,0.88); }
  .notification.error   { background: rgba(122,74,74,0.88); }

  /* ── Animations ── */
  @keyframes slideInRight {
    from { transform: translateX(260px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }

  @keyframes modeGlow {
    0%   { opacity: 0.7; }
    100% { opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.45; }
  }

  @keyframes leafFloat {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%       { transform: translateY(-3px) rotate(2deg); }
  }

  /* ── Smooth transitions on theme switch ── */
  .app, .card, .btn, .mode-btn, .message-content {
    transition: background-color 0.5s ease, border-color 0.4s ease;
  }

  /* ── Scrollbars ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.22); }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .app-body {
      grid-template-columns: 1fr;
      gap: var(--space-4);
      padding: var(--space-4);
    }
    .chat-interface { height: 60vh; }
    .facts-panel { height: auto; }
  }
`

const styleSheet = document.createElement('style')
styleSheet.innerText = styles
document.head.appendChild(styleSheet)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
