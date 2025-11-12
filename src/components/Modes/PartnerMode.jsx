import React from 'react';

function PartnerMode() {
  return (
    <div className="mode-content partner-mode">
      <h2>Partner Support Mode</h2>
      <p>Two humans, one goal. What could possibly go wrong?</p>
      
      <div className="shared-goal">
        <input type="text" placeholder="What are you working on together?" className="goal-input" />
      </div>
      
      <div className="task-columns">
        <div className="your-tasks">
          <h3>Your Tasks</h3>
          <ul>
            <li>Add your tasks here</li>
          </ul>
        </div>
        <div className="partner-tasks">
          <h3>Partner's Tasks</h3>
          <ul>
            <li>Add partner's tasks here</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PartnerMode;
