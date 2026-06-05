import React, { useMemo } from 'react';

/**
 * Decorative animated bubble field for ocean-themed sections.
 * Renders absolutely positioned bubbles with random size, position, and timing.
 */
const BubbleBackground = ({ count = 18, className = '' }) => {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 8 + Math.random() * 36,
        left: Math.random() * 100,
        duration: 8 + Math.random() * 12,
        delay: Math.random() * 10,
        opacity: 0.25 + Math.random() * 0.5,
      })),
    [count]
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {bubbles.map((b) => (
        <span
          key={b.id}
          className="bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground;
