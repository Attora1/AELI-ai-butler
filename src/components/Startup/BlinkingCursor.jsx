import React, { useState, useEffect } from 'react';

export default function BlinkingCursor({ visible = true }) {
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 2,
        height: '1.1em',
        background: '#C9A84C',
        opacity: on ? 1 : 0,
        verticalAlign: 'text-bottom',
        marginLeft: 3,
        borderRadius: 1,
      }}
    />
  );
}
