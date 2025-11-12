import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/useApp.js';
import styles from '../../styles/DailyMissionBriefing.module.css';

const JamesonContextualWisdom = () => {
  const { spoons } = useApp();
  const spoonMax = 12; // Define spoonMax
  const [currentObservation, setCurrentObservation] = useState('');
  const [moodRing, setMoodRing] = useState('moderate');
  const [currentQuote, setCurrentQuote] = useState('');

  // Context-based observations
  const observations = useMemo(() => ({
    high: [
      "You're running hot today. Channel that energy wisely before it burns out.",
      "Peak performance detected. Don't let it go to your head.",
      "Full tanks and clear skies. Make the most of this window.",
      "Energy reserves optimal. Time to tackle the big stuff."
    ],
    moderate: [
      "Steady as she goes. Pace yourself for the long haul.",
      "Running on sustainable power. Smart choices ahead.",
      "Cruising altitude achieved. Maintain current trajectory.",
      "Balanced energy state. Perfect for strategic thinking."
    ],
    low: [
      "Energy reserves critical. Switch to conservation mode.",
      "Running on fumes. Prioritize the essentials only.",
      "Systems running lean. Time for tactical retreats.",
      "Low power mode engaged. Rest is not optional."
    ],
    crisis: [
      "Emergency protocols activated. All non-essential systems offline.",
      "Critical levels detected. Immediate rest required.",
      "Battery at 1%. Find a charging station, now.",
      "Mayday, mayday. Ground all operations immediately."
    ]
  }), []);

  // Core quotes that rotate
  const coreQuotes = useMemo(() => [
    "Efficiency is doing things right; effectiveness is doing the right things.",
    "The best time to rest was yesterday. The second best time is now.",
    "Energy spent on worry is energy not spent on solutions.",
    "Your limitations are suggestions, not commandments.",
    "Progress, not perfection. Always progress.",
    "The art of being wise is knowing what to overlook.",
    "Discipline is choosing between what you want now and what you want most.",
    "Simplicity is the ultimate sophistication."
  ], []);

  // Emergency advice based on state
  const getEmergencyAdvice = (type) => {
    const advice = {
      crashing: [
        "Stop. Breathe. Find the nearest horizontal surface.",
        "Emergency protocol: Cancel everything non-essential. Rest is mandatory.",
        "You're not broken, you're human. This is maintenance, not failure.",
        "Survival mode activated: hydrate, rest, repeat."
      ],
      sass: [
        "Feeling dramatic? Channel that energy into something productive.",
        "The universe isn't out to get you. You're just having a Tuesday.",
        "Your problems are real, but they're not your entire reality.",
        "Perspective check: Will this matter in 5 years? 5 months? 5 minutes?"
      ],
      gentle: [
        "You're doing better than you think. Small steps count.",
        "Be kind to yourself. You're fighting battles others can't see.",
        "Progress isn't always visible. Trust the process.",
        "You don't have to be perfect. You just have to be present."
      ]
    };
    
    const randomAdvice = advice[type] || advice.gentle;
    return randomAdvice[Math.floor(Math.random() * randomAdvice.length)];
  };

  // Determine mood ring color and current state
  useEffect(() => {
    const spoonPercentage = (spoons / spoonMax) * 100;
    const hour = new Date().getHours();
    
    let state = 'moderate';
    let mood = 'moderate';
    
    if (spoonPercentage > 80) {
      state = 'high';
      mood = 'energetic';
    } else if (spoonPercentage > 40) {
      state = 'moderate';
      mood = 'balanced';
    } else if (spoonPercentage > 15) {
      state = 'low';
      mood = 'cautious';
    } else {
      state = 'crisis';
      mood = 'critical';
    }

    // Time-based modifications
    if (hour < 8 || hour > 22) {
      mood = 'drowsy';
    }

    setMoodRing(mood);
    
    // Set observation based on state
    const stateObservations = observations[state];
    const randomObservation = stateObservations[Math.floor(Math.random() * stateObservations.length)];
    setCurrentObservation(randomObservation);
    
    // Set rotating quote
    const randomQuote = coreQuotes[Math.floor(Math.random() * coreQuotes.length)];
    setCurrentQuote(randomQuote);
  }, [spoons, spoonMax, coreQuotes, observations]);

  const handleEmergencyButton = (type) => {
    const advice = getEmergencyAdvice(type);
    setCurrentObservation(advice);
  };

  const getMoodRingColor = () => {
    const colors = {
      energetic: '#68d391',
      balanced: '#63b3ed',
      cautious: '#f6ad55',
      critical: '#fc8181',
      drowsy: '#b794f6',
      moderate: '#4fd1c7'
    };
    return colors[moodRing] || colors.moderate;
  };

  return (
    <div className={styles["jameson-wisdom"]}>
      <div className={styles["wisdom-header"]}>
        <h3>🎭 Jameson's Wisdom</h3>
        <div 
          className={styles["mood-ring"]} 
          style={{ 
            backgroundColor: getMoodRingColor(),
            boxShadow: `0 0 20px ${getMoodRingColor()}40`
          }}
          title={`Current state: ${moodRing}`}
        />
      </div>

      {/* Current Observation */}
      <div className={`${styles["wisdom-section"]} ${styles["current-observation"]}`}>
        <h4>💭 Current Observation</h4>
        <p className={styles["observation-text"]}>{currentObservation}</p>
        <button 
          className={styles["refresh-observation"]}
          onClick={() => {
            let state = 'moderate';
            const spoonPercentage = (spoons / spoonMax) * 100;
            
            if (spoonPercentage > 80) state = 'high';
            else if (spoonPercentage > 40) state = 'moderate';
            else if (spoonPercentage > 15) state = 'low';
            else state = 'crisis';
            
            const stateObservations = observations[state];
            const randomObservation = stateObservations[Math.floor(Math.random() * stateObservations.length)];
            setCurrentObservation(randomObservation);
          }}
        >
          🔄 Fresh perspective
        </button>
      </div>

      {/* Core Quote */}
      <div className={`${styles["wisdom-section"]} ${styles["core-quote"]}`}>
        <h4>📜 Today's Wisdom</h4>
        <blockquote className={styles["quote-text"]}>"{currentQuote}"</blockquote>
        <button 
          className={styles["refresh-quote"]}
          onClick={() => {
            const randomQuote = coreQuotes[Math.floor(Math.random() * coreQuotes.length)];
            setCurrentQuote(randomQuote);
          }}
        >
          🎲 New wisdom
        </button>
      </div>

      {/* What Would Jameson Say? */}
      <div className={`${styles["wisdom-section"]} ${styles["jameson-advice"]}`}>
        <h4>🤔 What would Jameson say?</h4>
        <p className={styles["advice-prompt"]}>Having a moment? Get Jameson's take on it.</p>
        <button 
          className={styles["advice-button"]}
          onClick={() => {
            const advice = [
              "Perhaps the problem isn't the situation, but your expectations of it.",
              "When in doubt, choose the path that leads to growth, not comfort.",
              "You're overthinking this. What would you tell a friend in your position?",
              "The solution you're avoiding is probably the one you need most.",
              "Stop asking 'why me?' and start asking 'what now?'",
              "Your future self is counting on the decisions you make today.",
              "Complexity is the enemy of execution. Keep it simple.",
              "The best revenge against your problems is your success despite them."
            ];
            const randomAdvice = advice[Math.floor(Math.random() * advice.length)];
            setCurrentObservation(randomAdvice);
          }}
        >
          💡 Get Jameson's take
        </button>
      </div>

      {/* Emergency Buttons */}
      <div className={`${styles["wisdom-section"]} ${styles["emergency-buttons"]}`}>
        <h4>🚨 Emergency Protocols</h4>
        <div className={styles["emergency-grid"]}>
          <button 
            className={`${styles["emergency-btn"]} ${styles["crashing"]}`}
            onClick={() => handleEmergencyButton('crashing')}
          >
            😵 I'm crashing
          </button>
          <button 
            className={`${styles["emergency-btn"]} ${styles["sass"]}`}
            onClick={() => handleEmergencyButton('sass')}
          >
            😤 Need sass
          </button>
          <button 
            className={`${styles["emergency-btn"]} ${styles["gentle"]}`}
            onClick={() => handleEmergencyButton('gentle')}
          >
            🤗 Gentle please
          </button>
        </div>
      </div>

      {/* Context Display */}
      <div className={`${styles["wisdom-section"]} ${styles["context-display"]}`}>
        <h4>📊 Current Context</h4>
        <div className={styles["context-grid"]}>
          <div className={styles["context-item"]}>
            <span className={styles["context-label"]}>Energy:</span>
            <span className={styles["context-value"]}>{spoons}/{spoonMax} spoons</span>
          </div>
          <div className={styles["context-item"]}>
            <span className={styles["context-label"]}>State:</span>
            <span className={styles["context-value"]}>{moodRing}</span>
          </div>
          <div className={styles["context-item"]}>
            <span className={styles["context-label"]}>Time:</span>
            <span className={styles["context-value"]}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JamesonContextualWisdom;