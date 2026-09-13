import React, { useState, useEffect, useRef } from 'react';

export default function GhostWriter({ text, speed = 35, periodPause = 1000, onComplete, className }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;

    const typeNext = () => {
      indexRef.current += 1;
      const slice = text.slice(0, indexRef.current);
      setDisplayed(slice);

      if (indexRef.current < text.length) {
        const justTyped = text[indexRef.current - 1];
        const delay = justTyped === '.' ? periodPause : speed;
        timerRef.current = setTimeout(typeNext, delay);
      } else {
        onCompleteRef.current?.();
      }
    };

    timerRef.current = setTimeout(typeNext, speed);
    return () => clearTimeout(timerRef.current);
  }, [text, speed, periodPause]);

  return <span className={className}>{displayed}</span>;
}
