import React from 'react';

function FocusMode() {
  return (
    <div className="mode-content focus-mode">
      <h2>Focus Mode</h2>
      <p>Time to tackle the impossible. Or at least, the mildly inconvenient.</p>
      
      <div className="task-section">
        <input type="text" placeholder="What's the mission?" className="task-input" />
        <button className="lock-btn">Lock In</button>
      </div>
      
      <div className="timer-section">
        <button className="timer-btn">10 min</button>
        <button className="timer-btn">25 min</button>
        <button className="timer-btn">45 min</button>
      </div>
    </div>
  );
}

export default FocusMode;
