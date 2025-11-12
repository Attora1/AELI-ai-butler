import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/modes-css/LowSpoon.css';
import petalImage from '../../assets/petal-flower.png';
import { SPOON_MAX } from '../../constants/spoons';
import { useSpoons } from '../../hooks/useSpoons.js';

function LowSpoonMode() {
  // Use the hook version which is more reliable
  const { spoons, setSpoonsLocal } = useSpoons();
  
  // Convert hook data to match expected interface
  const spoonMax = SPOON_MAX;
  const isUnset = spoons === null || spoons === undefined;
  const currentSpoons = spoons ?? 0;
  
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale'); // 'inhale' or 'exhale'
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(1); // minutes
  const [showDimOverlay, setShowDimOverlay] = useState(false);
  
  const breathingIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const phaseTimeoutRef = useRef(null);
  
  const max = spoonMax;
  const current = Math.min(Math.max(Number(currentSpoons), 0), max);

  // Breathing cycle timing (in seconds)
  const INHALE_DURATION = 8.5;
  const EXHALE_DURATION = 8.5;

  // Start breathing exercise
  const startBreathing = useCallback(() => {
    setIsBreathing(true);
    setBreathingTimer(selectedDuration * 60); // Convert minutes to seconds
    setShowIntroModal(true);
    setShowDimOverlay(true);
    
    // Hide intro modal after 3 seconds
    setTimeout(() => {
      setShowIntroModal(false);
    }, 3000);

    // Start the breathing cycle
    const runBreathingCycle = () => {
      setBreathingPhase('inhale');
      
      phaseTimeoutRef.current = setTimeout(() => {
        setBreathingPhase('exhale');
        
        phaseTimeoutRef.current = setTimeout(() => {
          if (breathingIntervalRef.current) {
            runBreathingCycle(); // Continue the cycle
          }
        }, EXHALE_DURATION * 1000);
      }, INHALE_DURATION * 1000);
    };

    runBreathingCycle();

    // Start timer countdown
    timerIntervalRef.current = setInterval(() => {
      setBreathingTimer(prev => {
        if (prev <= 1) {
          stopBreathing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Keep reference for cleanup
    breathingIntervalRef.current = timerIntervalRef.current;
  }, [selectedDuration]);

  // Stop breathing exercise
  const stopBreathing = useCallback(() => {
    setIsBreathing(false);
    setBreathingTimer(0);
    setShowIntroModal(false);
    setShowDimOverlay(false);
    
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    if (phaseTimeoutRef.current) {
      clearTimeout(phaseTimeoutRef.current);
      phaseTimeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopBreathing();
    };
  }, [stopBreathing]);

  // Format timer display
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Petal falling animation
  const createFallingPetal = useCallback(() => {
    if (!isBreathing) return;
    
    const petal = document.createElement('img');
    petal.src = petalImage;
    petal.className = 'falling-spoon fall';
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.setProperty('--drift-x', (Math.random() - 0.5) * 2);
    
    const layer = document.querySelector('.petal-fall-layer');
    if (layer) {
      layer.appendChild(petal);
      
      setTimeout(() => {
        if (petal.parentNode) {
          petal.parentNode.removeChild(petal);
        }
      }, 12000);
    }
  }, [isBreathing]);

  // Create falling petals during breathing
  useEffect(() => {
    if (isBreathing) {
      const interval = setInterval(createFallingPetal, 2000);
      return () => clearInterval(interval);
    }
  }, [isBreathing, createFallingPetal]);

  // Breathing Ring Component
  const BreathingRing = () => {
    return (
      <div className="spoon-circle-wrapper">
        <div className={`breathing-ring-wrapper ${breathingPhase}`}>
          <div
            className={`breathing-ring ${isBreathing ? 'is-running' : 'is-paused'} ${breathingPhase}`}
            role="img"
            aria-label={`Breathing ring — spoons ${current} of ${max}`}
          >
            <div className="breathing-ring-inner">
              <img
                src={petalImage}
                alt=""
                className={`breathing-petal-image ${isBreathing ? 'animate-spin-drag' : ''}`}
                draggable="false"
              />
            </div>
          </div>
        </div>

      </div>
    );
  };

  // Gentle suggestions
  const suggestions = [
    "Take a warm bath",
    "Listen to calming music",
    "Do gentle stretches",
    "Practice gratitude",
    "Have some tea",
    "Read something light",
    "Pet an animal",
    "Look at nature photos"
  ];

  const [currentSuggestion, setCurrentSuggestion] = useState(0);

  const refreshSuggestion = () => {
    setCurrentSuggestion((prev) => (prev + 1) % suggestions.length);
  };

  return (
    <div className="low-spoon-theme">
      {/* Background */}
      <div className="low-spoon-bg" />
      
      {/* Petal falling layer */}
      <div className="petal-fall-layer" />
      
      {/* Breathing intro modal */}
      <div className={`breathing-intro-modal ${showIntroModal ? 'show' : ''}`}>
        Follow the gentle rhythm. Breathe in as it grows, breathe out as it shrinks.
      </div>

      {/* Header */}
      <header className="mode-header">
        <h1 className="mode-title">Low Spoon Mode</h1>
        <p className="mode-subtitle">
          Energy conservation mode active. Let's keep things gentle and nurturing.
        </p>
      </header>

      {/* Main content */}
      <div className="mode-layout-columns">
        <div className="left-column">
          <BreathingRing />
          
          <div className="breathing-controls">
            <div 
              className="breathing-timer"
              onClick={() => {
                if (!isBreathing) {
                  const durations = [1, 3, 5, 10, 15]; // Added 1 minute to the options
                  const currentIndex = durations.indexOf(selectedDuration);
                  const nextIndex = (currentIndex + 1) % durations.length;
                  setSelectedDuration(durations[nextIndex]);
                }
              }}
            >
              {isBreathing ? formatTimer(breathingTimer) : `${selectedDuration} min`}
            </div>
            
            {!isBreathing ? (
              <button 
                className="start-breathing-button btn"
                onClick={startBreathing}
              >
                Start Breathing
              </button>
            ) : (
              <button 
                className="stop-breathing-button btn"
                onClick={stopBreathing}
              >
                Stop
              </button>
            )}
            
            <a 
              className="crisis-support-button"
              href="sms:741741"
              aria-label="Crisis Text Line - Text 741741 for support"
            >
              First Aid
            </a>
          </div>
        </div>

        <div className="right-column">          
          <div className="suggestions-card">
            <div className="suggestions-header">
              <h3>Gentle Suggestions</h3>
              <button 
                className="refresh-suggestion-button"
                onClick={refreshSuggestion}
                aria-label="Get new suggestion"
              >
                <span className="refresh-icon">↻</span>
              </button>
            </div>
            
            <div className="suggestion-content">
              <button className="suggestion-btn">
                {suggestions[currentSuggestion]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LowSpoonMode;