import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/useApp.js';
import styles from '../../styles/DailyMissionBriefing.module.css';

const DailyMissionBriefing = () => {
  const { spoons } = useApp();
  const spoonMax = 12; // Define spoonMax
  const [currentTime, setCurrentTime] = useState(new Date());
  const [samReturnTime] = useState("5:30 PM"); // You can make this dynamic later

  // Sample schedule data - you can replace this with real data
  const [todaysSchedule] = useState([
    { time: "9:00 AM", task: "Morning routine", spoonCost: 2 },
    { time: "11:00 AM", task: "Project work", spoonCost: 4 },
    { time: "2:00 PM", task: "Grocery run", spoonCost: 3 },
    { time: "4:00 PM", task: "Rest/recharge", spoonCost: -2 }
  ]);

  const [quickWins] = useState([
    "Water the plants (1 spoon)",
    "Sort today's mail (1 spoon)",
    "Text Sam back (1 spoon)",
    "Make grocery list (2 spoons)"
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Calculate spoon predictions
  const totalSpoonCost = todaysSchedule.reduce((sum, item) => sum + Math.max(0, item.spoonCost), 0);
  const spoonsAfterSchedule = spoons - totalSpoonCost;

  // Get personality-based system status
  const getSystemStatus = () => {
    const hour = currentTime.getHours();
    if (hour < 8) return "Early bird protocols active. Cats remain unimpressed.";
    if (hour < 12) return "Morning systems operational. Coffee levels: adequate.";
    if (hour < 17) return "Afternoon mode engaged. Energy levels monitored.";
    return "Evening protocols. Winding down sequence initiated.";
  };

  const getSpoonStatus = () => {
    const percentage = (spoons / spoonMax) * 100;
    if (percentage > 70) return "Energy reserves strong. Ready for action.";
    if (percentage > 40) return "Moderate energy. Choose battles wisely.";
    if (percentage > 20) return "Running lean. Prioritize essentials only.";
    return "Critical energy levels. Emergency protocols recommended.";
  };

  return (
    <div className={styles["daily-mission-briefing"]}>
      <div className={styles["briefing-header"]}>
        <h3>📋 Daily Mission Briefing</h3>
        <div className={styles["current-time"]}>
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* System Status */}
      <div className={styles["briefing-section"]}>
        <h4>🤖 System Status</h4>
        <p className={styles["status-report"]}>{getSystemStatus()}</p>
        <div className={styles["status-grid"]}>
          <div className={styles["status-item"]}>
            <span className={styles["status-label"]}>Cats fed:</span>
            <span className={styles["status-value"]}>No. Their revolution begins at dawn.</span>
          </div>
          <div className={styles["status-item"]}>
            <span className={styles["status-label"]}>Energy:</span>
            <span className={styles["status-value"]}>{getSpoonStatus()}</span>
          </div>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className={styles["briefing-section"]}>
        <h4>📅 Today's Schedule</h4>
        <div className={styles["schedule-list"]}>
          {todaysSchedule.map((item, index) => (
            <div key={index} className={styles["schedule-item"]}>
              <span className={styles["schedule-time"]}>{item.time}</span>
              <span className={styles["schedule-task"]}>{item.task}</span>
              <span className={`${styles["spoon-cost"]} ${item.spoonCost < 0 ? styles["positive"] : ''}`}>
                {item.spoonCost > 0 ? `-${item.spoonCost}` : `+${Math.abs(item.spoonCost)}`} 🥄
              </span>
            </div>
          ))}
        </div>
        <div className={styles["spoon-prediction"]}>
          <strong>Predicted spoons after schedule: {spoonsAfterSchedule}/12</strong>
        </div>
      </div>

      {/* Sam's Return Time */}
      <div className={`${styles["briefing-section"]} ${styles["sam-return"]}`}>
        <h4>🏠 Sam Returns</h4>
        <div className={styles["sam-time"]}>{samReturnTime}</div>
        <p className={styles["sam-note"]}>Survival countdown: in progress</p>
      </div>

      {/* Quick Wins */}
      <div className={styles["briefing-section"]}>
        <h4>⚡ Quick Wins Available</h4>
        <div className={styles["quick-wins-list"]}>
          {quickWins.map((win, index) => (
            <div key={index} className={styles["quick-win-item"]}>
              • {win}
            </div>
          ))}
        </div>
      </div>

      {/* Weather & Clothing */}
      <div className={styles["briefing-section"]}>
        <h4>🌤️ Weather Advisory</h4>
        <p>Detroit: 72°F, partly cloudy</p>
        <p className={styles["clothing-suggestion"]}>
          <strong>Jameson suggests:</strong> Light layers. The outside world remains unpredictable.
        </p>
      </div>
    </div>
  );
};

export default DailyMissionBriefing;