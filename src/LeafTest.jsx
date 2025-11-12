import React, { useState } from 'react';

// Quick test component with leaves
export default function LeafTest() {
  const [spoons, setSpoons] = useState(8);
  const maxSpoons = 12;

  const renderLeaves = () => {
    const leaves = [];
    for (let i = 0; i < maxSpoons; i++) {
      leaves.push(
        <span 
          key={i} 
          style={{
            fontSize: '1.5rem',
            opacity: i < spoons ? 1 : 0.3,
            filter: i < spoons ? 'brightness(1.2)' : 'grayscale(0.8)',
            transition: 'all 0.3s ease',
            margin: '0 4px'
          }}
        >
          🍃
        </span>
      );
    }
    return leaves;
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'rgba(28, 60, 105, 0.8)', 
      borderRadius: '12px',
      color: 'white',
      textAlign: 'center',
      margin: '20px'
    }}>
      <h3>Energy Reserve {spoons}/{maxSpoons}</h3>
      <div style={{ margin: '20px 0' }}>
        {renderLeaves()}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          onClick={() => setSpoons(Math.max(0, spoons - 1))}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          -
        </button>
        <button 
          onClick={() => setSpoons(Math.min(maxSpoons, spoons + 1))}
          style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          +
        </button>
      </div>
    </div>
  );
}
