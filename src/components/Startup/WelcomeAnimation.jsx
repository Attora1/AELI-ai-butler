import React, { useState, useEffect, useMemo, useRef } from 'react';
import './WelcomeAnimation.css';

const LEAF_PATHS = [
  'M0,0 Q5,-16 10,0 Q5,10 0,0',
  'M0,0 Q8,-20 16,0 Q8,13 0,0',
  'M0,0 Q6,-13 12,0 Q6,9 0,0',
  'M0,0 Q10,-22 20,0 Q10,15 0,0',
  'M0,0 C4,-14 10,-17 14,-6 Q8,9 0,0',
];

const LEAF_COLORS = [
  '#6B8C5A', '#8A9B6A', '#7A9070', '#9BA878',
  '#B89B6A', '#C4A882', '#7A8C68', '#A3B87A',
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function generateLeaves(count) {
  return Array.from({ length: count }, (_, i) => {
    // Bias starting positions toward the center where the text lives,
    // with enough spread to feel natural and not perfectly clustered.
    const x = randomBetween(15, 85);
    const y = randomBetween(30, 70);
    const size = randomBetween(12, 32);
    const rot0 = randomBetween(-50, 50);
    const rot1 = randomBetween(-240, 360);
    const delay = randomBetween(0, 1.4);        // wider stagger so they emerge gradually
    const dur = randomBetween(2.8, 4.2);        // slower fall

    const driftX = randomBetween(-50, 50);
    const driftY = randomBetween(-30, 30);
    const burstX = randomBetween(-60, 60);
    const burstY = randomBetween(-60, 60);

    return {
      id: i,
      x, y, size,
      color: LEAF_COLORS[i % LEAF_COLORS.length],
      path: LEAF_PATHS[i % LEAF_PATHS.length],
      rot0, rot1, delay, dur,
      driftX, driftY, burstX, burstY,
    };
  });
}

function WelcomeLetter({ char, delay, isSpace }) {
  return (
    <span
      className={`welcome-letter${isSpace ? ' space' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isSpace ? ' ' : char}
    </span>
  );
}

function AnimatedText({ text, startDelay = 0, className }) {
  const chars = text.split('');
  return (
    <div className={className}>
      {chars.map((ch, i) => (
        <WelcomeLetter
          key={i}
          char={ch}
          isSpace={ch === ' '}
          delay={startDelay + i * 70}
        />
      ))}
    </div>
  );
}

const STAGGER_MS = 70;
const LETTER_ANIM_MS = 300;

export default function WelcomeAnimation({ config, isFirstBoot, onComplete }) {
  const { preferredName = '', personality = 'nicest' } = config || {};
  const [animPhase, setAnimPhase] = useState('in');  // 'in' | 'hold' | 'out' | 'done'
  const onCompleteRef = useRef(onComplete);
  const leaves = useMemo(() => generateLeaves(35), []);

  useEffect(() => { onCompleteRef.current = onComplete; });

  const logoText = 'AELI';
  const greeting = isFirstBoot
    ? `Welcome, ${preferredName || 'friend'}`
    : `Welcome back, ${preferredName || 'friend'}`;

  const totalLetters = logoText.length + greeting.length;
  const logoStartDelay = 0;
  const greetingStartDelay = logoText.length * STAGGER_MS + 200;
  const inDuration = greetingStartDelay + greeting.length * STAGGER_MS + LETTER_ANIM_MS;

  useEffect(() => {
    const holdTimer = setTimeout(() => {
      setAnimPhase('hold');

      const outTimer = setTimeout(() => {
        setAnimPhase('out');

        const doneTimer = setTimeout(() => {
          setAnimPhase('done');
          onCompleteRef.current?.();
        }, 3600);

        return () => clearTimeout(doneTimer);
      }, 1000);

      return () => clearTimeout(outTimer);
    }, inDuration);

    return () => clearTimeout(holdTimer);
  }, []); // eslint-disable-line

  if (animPhase === 'done') return null;

  const leafClass = {
    nicest:     'leaf-fall',
    'semi-sassy': 'leaf-right',
    sarcastic:  'leaf-burst',
  }[personality] || 'leaf-fall';

  const showLeaves = animPhase === 'out';

  return (
    <div className={`welcome-overlay${animPhase === 'out' ? ' fading-out' : ''}`}>
      <AnimatedText
        text={logoText}
        startDelay={logoStartDelay}
        className="welcome-logo"
      />
      <AnimatedText
        text={greeting}
        startDelay={greetingStartDelay}
        className="welcome-message"
      />

      {showLeaves && (
        <div className="leaves-container">
          {leaves.map(leaf => (
            <svg
              key={leaf.id}
              className={`leaf ${leafClass}`}
              width={leaf.size}
              height={leaf.size}
              viewBox="0 0 20 20"
              style={{
                left: `${leaf.x}%`,
                top: `${leaf.y}%`,
                '--rot0': `${leaf.rot0}deg`,
                '--rot1': `${leaf.rot1}deg`,
                '--dur': `${leaf.dur}s`,
                '--delay': `${leaf.delay}s`,
                '--drift-x': `${leaf.driftX}px`,
                '--drift-y': `${leaf.driftY}px`,
                '--burst-x': `${leaf.burstX}px`,
                '--burst-y': `${leaf.burstY}px`,
              }}
            >
              <path
                d={leaf.path}
                fill={leaf.color}
                opacity={0.85}
                transform="translate(2, 4)"
              />
            </svg>
          ))}
        </div>
      )}
    </div>
  );
}
