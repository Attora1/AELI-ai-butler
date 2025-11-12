import React from 'react';
import { useApp } from '../../context/useApp';
import './SpoonsDisplay.css';

function SpoonsDisplay() {
  const { spoons, setSpoons } = useApp();
  const maxSpoons = 12;
  
  const getSpoonStatus = () => {
    if (spoons <= 0) return { text: 'Completely depleted', color: 'critical' };
    if (spoons < 3) return { text: 'Running on fumes', color: 'critical' };
    if (spoons < 6) return { text: 'Low reserves', color: 'low' };
    if (spoons < 9) return { text: 'Moderate energy', color: 'medium' };
    return { text: 'Well rested', color: 'high' };
  };
  
  const status = getSpoonStatus();
  
  const handleSpoonChange = (delta) => {
    const newValue = Math.max(0, Math.min(maxSpoons, spoons + delta));
    setSpoons(newValue);
  };
  
  // Generate visual spoons
  const spoonIcons = Array.from({ length: maxSpoons }, (_, i) => (
    <span 
      key={i} 
      className={`spoon-icon ${i < spoons ? 'filled' : 'empty'}`}
      aria-hidden="true"
    >
      🍃
    </span>
  ));

  return (
    <div className="spoons-display">
      <div className="spoons-header">
        <h3 className="spoons-title">Energy Reserve</h3>
        <div className="spoons-counter">
          <span className="spoons-value">{spoons}</span>
          <span className="spoons-max">/{maxSpoons}</span>
        </div>
      </div>
      
      <div className="spoons-visual" aria-label={`${spoons} out of ${maxSpoons} spoons`}>
        {spoonIcons}
      </div>
      
      <div className="spoons-bar-container">
        <div className="spoons-bar">
          <div 
            className={`spoons-fill ${status.color}`}
            style={{ width: `${(spoons / maxSpoons) * 100}%` }}
            role="progressbar"
            aria-valuenow={spoons}
            aria-valuemin={0}
            aria-valuemax={maxSpoons}
          />
        </div>
      </div>
      
      <div className={`spoons-status ${status.color}`}>
        {status.text}
      </div>
      
      <div className="spoons-controls">
        <button 
          onClick={() => handleSpoonChange(-1)}
          className="spoon-btn decrease"
          aria-label="Decrease energy by 1"
          disabled={spoons === 0}
        >
          <span aria-hidden="true">−</span>
        </button>
        
        <button 
          onClick={() => handleSpoonChange(-3)}
          className="spoon-btn decrease-major"
          aria-label="Decrease energy by 3"
          disabled={spoons === 0}
        >
          <span aria-hidden="true">−3</span>
        </button>
        
        <button 
          onClick={() => setSpoons(Math.floor(maxSpoons / 2))}
          className="spoon-btn reset"
          aria-label="Reset to half energy"
        >
          Reset
        </button>
        
        <button 
          onClick={() => handleSpoonChange(3)}
          className="spoon-btn increase-major"
          aria-label="Increase energy by 3"
          disabled={spoons === maxSpoons}
        >
          <span aria-hidden="true">+3</span>
        </button>
        
        <button 
          onClick={() => handleSpoonChange(1)}
          className="spoon-btn increase"
          aria-label="Increase energy by 1"
          disabled={spoons === maxSpoons}
        >
          <span aria-hidden="true">+</span>
        </button>
      </div>
      
      <div className="spoons-tips">
        <p className="tip-text">
          {spoons < 4 
            ? "⚠️ Critical energy. Only essentials today."
            : spoons < 8
            ? "📊 Budget energy carefully."
            : "✓ Good energy levels for activities."}
        </p>
      </div>
    </div>
  );
}

export default SpoonsDisplay;
