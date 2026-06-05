import React, { useEffect, useRef, useState } from 'react';
import { useCountUp } from '../utils/useScrollReveal';

/**
 * A metric card whose numeric value counts up from 0 when scrolled into view.
 */
const AnimatedStat = ({ value, label, delay = 0 }) => {
  const numeric = parseInt(String(value).replace(/\D/g, ''), 10) || 0;
  const prefix = String(value).match(/^\D*/)?.[0] || '';
  const [domRef, setDomRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!domRef) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setInView(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(domRef);
    return () => obs.disconnect();
  }, [domRef, delay]);

  const count = useCountUp(numeric, 1600, inView);

  return (
    <div
      ref={setDomRef}
      className="glow-card bg-white p-8 rounded-2xl shadow-md text-center reveal"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-5xl font-extrabold gradient-text mb-2">
        {prefix}
        {count}
      </p>
      <p className="text-gray-700 font-semibold tracking-wide uppercase text-sm">
        {label}
      </p>
    </div>
  );
};

export default AnimatedStat;
