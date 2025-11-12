import React from 'react';
import { useApp } from '../../context/useApp';
import LowSpoonMode from '../Modes/LowSpoonMode';
import FocusMode from '../Modes/FocusMode';
import PartnerMode from '../Modes/PartnerMode';
import ChatMode from '../Modes/ChatMode';
import './ModePanel.css';

function ModePanel() {
  const { mode } = useApp();

  return (
    <div className="mode-panel-container">
      {mode === 'lowSpoon' && <LowSpoonMode />}
      {mode === 'focus' && <FocusMode />}
      {mode === 'partner' && <PartnerMode />}
      {mode === 'chat' && <ChatMode />}
    </div>
  );
}

export default ModePanel;
