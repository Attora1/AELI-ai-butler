import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App-clean.jsx'
import { AppProvider } from './context/AppContext.jsx'
import './styles/tokens.css'
import './styles/theme.css'

const styles = `
  /* ── Teal palette ── */
  :root {
    --hdr:           #7ABCB4;
    --sidebar:       #8CCCC4;
    --center:        #BAE2DA;
    --gold:          #C9A84C;
    --gold-hover:    #B8963E;
    --energy-on:     #2A7A70;
    --energy-off:    rgba(0,0,0,0.13);
    --ink:           #1a3835;
    --ink-dim:       rgba(26,56,53,0.62);
    --ink-faint:     rgba(26,56,53,0.35);
    --divider:       rgba(26,56,53,0.12);
    --msg-user-bg:   rgba(255,255,255,0.55);
    --msg-aeli-bg:   rgba(0,0,0,0.07);
  }

  * { margin:0; padding:0; box-sizing:border-box; }

  body {
    font-family: var(--font-sans, system-ui, sans-serif);
    background: var(--sidebar);
    color: var(--ink);
    overflow-x: hidden;
  }

  /* ── App shell ── */
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--sidebar);
  }

  /* ── Header ── */
  .app-header {
    position: sticky;
    top: 0;
    z-index: 900;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 24px;
    height: 56px;
    background: var(--hdr);
    position: relative;
  }

  .header-scan-line {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--gold) 25%,
      var(--gold) 75%,
      transparent 100%
    );
    opacity: 0.55;
  }

  .header-logo {
    font-size: 1.45rem;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--gold);
    line-height: 1;
  }

  .header-status {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-left: 4px;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse 2.2s ease-in-out infinite;
    flex-shrink: 0;
  }

  .status-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--ink-dim);
    letter-spacing: 0.3px;
  }

  .header-spacer { flex: 1; }

  .settings-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: rgba(0,0,0,0.1);
    border: none;
    cursor: pointer;
    color: var(--ink);
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
    font-family: inherit;
  }

  .settings-btn:hover { background: rgba(0,0,0,0.18); }

  /* ── Three-column body ── */
  .app-body {
    display: grid;
    grid-template-columns: 220px 1fr 220px;
    gap: 10px;
    padding: 10px;
    flex: 1;
    align-items: start;
  }

  /* ── Panels ── */
  .panel-left,
  .panel-right {
    background: var(--sidebar);
    border-radius: 14px;
    padding: 18px;
    position: sticky;
    top: 66px;
  }

  .panel-center {
    background: var(--center);
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 76px);
    overflow: hidden;
  }

  /* ── Panel headings ── */
  .panel-heading {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    color: var(--ink-dim);
    margin-bottom: 14px;
  }

  /* ── Energy grid ── */
  .energy-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
    margin-bottom: 14px;
  }

  .energy-cell {
    aspect-ratio: 1;
    border-radius: 5px;
    transition: background 0.35s ease, transform 0.2s ease;
  }

  .energy-cell.on  { background: var(--energy-on);  }
  .energy-cell.off { background: var(--energy-off); }
  .energy-cell.on:hover { transform: scale(1.08); }

  .energy-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--ink-dim);
    text-align: center;
    margin-bottom: 12px;
  }

  .energy-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .energy-count {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--ink);
    min-width: 28px;
    text-align: center;
  }

  .energy-btn {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    background: rgba(0,0,0,0.1);
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: var(--ink);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
    font-family: inherit;
  }

  .energy-btn:hover:not(:disabled) { background: rgba(0,0,0,0.18); }
  .energy-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .energy-reset {
    display: block;
    width: 100%;
    margin-top: 10px;
    padding: 5px;
    background: transparent;
    border: 1px solid var(--divider);
    border-radius: 8px;
    font-size: 0.75rem;
    color: var(--ink-dim);
    cursor: pointer;
    font-family: inherit;
    text-align: center;
    transition: background 0.15s;
  }

  .energy-reset:hover { background: rgba(0,0,0,0.07); }

  /* ── Chat messages ── */
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px 18px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .message { display: flex; }
  .message.user { justify-content: flex-end; }
  .message.aeli { justify-content: flex-start; }

  .message-content {
    max-width: 78%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 0.925rem;
    line-height: 1.55;
    color: var(--ink);
  }

  .message.user .message-content {
    background: var(--msg-user-bg);
    border-bottom-right-radius: 4px;
    backdrop-filter: blur(4px);
  }

  .message.aeli .message-content {
    background: var(--msg-aeli-bg);
    border-bottom-left-radius: 4px;
  }

  /* ── Chat input ── */
  .chat-input-wrapper {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--divider);
    background: rgba(0,0,0,0.04);
  }

  .chat-input {
    flex: 1;
    padding: 10px 14px;
    background: rgba(255,255,255,0.5);
    border: 1px solid rgba(26,56,53,0.18);
    border-radius: 10px;
    color: var(--ink);
    font-family: inherit;
    font-size: 0.925rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(4px);
  }

  .chat-input:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 2px rgba(201,168,76,0.2);
  }

  .chat-input::placeholder { color: var(--ink-faint); }

  .send-btn {
    padding: 10px 18px;
    background: var(--gold);
    color: #fff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.875rem;
    font-family: inherit;
    transition: background 0.2s, transform 0.15s;
    white-space: nowrap;
  }

  .send-btn:hover:not(:disabled) { background: var(--gold-hover); transform: translateY(-1px); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .send-btn:active:not(:disabled) { transform: translateY(0) scale(0.97); }

  /* ── Suggestions (right) ── */
  .suggestions-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 120px;
    gap: 8px;
    opacity: 0.38;
  }

  .suggestions-empty-icon { font-size: 1.4rem; }

  .suggestions-empty-text {
    font-size: 0.75rem;
    color: var(--ink-dim);
    text-align: center;
    line-height: 1.5;
  }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(26,56,53,0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(10px);
  }

  .modal-content {
    background: #e8f7f4;
    border: 1px solid rgba(26,56,53,0.15);
    border-radius: 18px;
    padding: 32px;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    color: var(--ink);
  }

  .modal-content h2 {
    color: var(--ink);
    margin-bottom: 24px;
    text-align: center;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.2px;
  }

  .setting-group { margin-bottom: 16px; }

  .setting-group label {
    display: block;
    margin-bottom: 6px;
    color: var(--ink-dim);
    font-weight: 500;
    font-size: 0.875rem;
  }

  .setting-group input,
  .setting-group select {
    width: 100%;
    padding: 8px 12px;
    background: rgba(255,255,255,0.7);
    border: 1px solid rgba(26,56,53,0.2);
    border-radius: 8px;
    color: var(--ink);
    font-family: inherit;
    font-size: 0.875rem;
  }

  .setting-group input:focus,
  .setting-group select:focus {
    outline: none;
    border-color: var(--gold);
    box-shadow: 0 0 0 2px rgba(201,168,76,0.2);
  }

  .setting-group input[type="checkbox"] { width: auto; margin-right: 8px; }

  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 24px;
  }

  .btn {
    padding: 9px 20px;
    border-radius: 9999px;
    border: 1px solid rgba(26,56,53,0.18);
    background: rgba(0,0,0,0.08);
    color: var(--ink);
    cursor: pointer;
    font-weight: 500;
    font-size: 0.875rem;
    font-family: inherit;
    transition: background 0.15s;
  }

  .btn:hover:not(:disabled) { background: rgba(0,0,0,0.14); }
  .btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .btn.small { padding: 4px 12px; font-size: 0.8rem; }

  /* ── Notification ── */
  .notification {
    position: fixed;
    top: 20px; right: 20px;
    padding: 10px 18px;
    border-radius: 10px;
    font-weight: 500;
    font-size: 0.875rem;
    z-index: 10000;
    animation: slideInRight 0.25s ease-out;
    border: 1px solid rgba(26,56,53,0.15);
    color: var(--ink);
  }

  .notification.success { background: #a8dcd4; }
  .notification.warning { background: #ddd4a8; }
  .notification.error   { background: #daa8a8; }

  /* ── Animations ── */
  @keyframes slideInRight {
    from { transform: translateX(240px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.55; transform: scale(0.85); }
  }

  /* ── Scrollbars ── */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(26,56,53,0.2); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(26,56,53,0.35); }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .app-body {
      grid-template-columns: 1fr;
      padding: 8px;
      gap: 8px;
    }
    .panel-left, .panel-right { position: static; }
    .panel-center { min-height: 60vh; }
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
