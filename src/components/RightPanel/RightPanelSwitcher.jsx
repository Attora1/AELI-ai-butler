import React, { useState } from 'react';
import DailyMissionBriefing from './DailyMissionBriefing.jsx';
import JamesonContextualWisdom from './JamesonContextualWisdom.jsx';
import AELICommandCenter from './AELICommandCenter.jsx';



import styles from '../../styles/DailyMissionBriefing.module.css';

const RightPanelSwitcher = () => {
  const [activePanel, setActivePanel] = useState('command'); // 'briefing', 'wisdom', or 'command'

  return (
    <div className={styles["right-panel-container"]}>
      {/* Panel Switcher */}
      <div className={styles["panel-switcher"]}>
        <button 
          className={`${styles["panel-switch-btn"]} ${activePanel === 'command' ? styles["active"] : ''}`}
          onClick={() => setActivePanel('command')}
        >
          🎛️ Command
        </button>
        <button 
          className={`${styles["panel-switch-btn"]} ${activePanel === 'briefing' ? styles["active"] : ''}`}
          onClick={() => setActivePanel('briefing')}
        >
          📋 Briefing
        </button>
        <button 
          className={`${styles["panel-switch-btn"]} ${activePanel === 'wisdom' ? styles["active"] : ''}`}
          onClick={() => setActivePanel('wisdom')}
        >
          🎭 Wisdom
        </button>
      </div>

      {/* Active Panel */}
      <div className={styles["panel-content"]}>
        {activePanel === 'command' ? (
          <AELICommandCenter />
        ) : activePanel === 'briefing' ? (
          <DailyMissionBriefing />
        ) : (
          <JamesonContextualWisdom />
        )}
      </div>
    </div>
  );
};

export default RightPanelSwitcher;