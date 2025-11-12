import React from 'react';
import { useApp } from '../context/useApp.js';
import '../styles/BackgroundEffects.css';

const BackgroundEffects = () => {
  const { mode } = useApp();

  const renderModeEffect = () => {
    switch (mode) {
      case 'lowspoon':
        return (
          <div className="background-effects low-spoon-effects">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="floating-leaf"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              >
                🍃
              </div>
            ))}
          </div>
        );
      case 'focus':
        return (
          <div className="background-effects focus-effects">
            <div className="pulsing-glow"></div>
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="focus-ring"
                style={{
                  animationDelay: `${i * 2}s`
                }}
              ></div>
            ))}
          </div>
        );
      case 'partnersupport':
        return (
          <div className="background-effects partner-effects">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i} 
                className="connection-line"
                style={{
                  left: `${25 + i * 25}%`,
                  animationDelay: `${i * 1.5}s`
                }}
              ></div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return renderModeEffect();
};

export default BackgroundEffects;
