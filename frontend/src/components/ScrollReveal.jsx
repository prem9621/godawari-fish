import React from 'react';
import { useScrollReveal } from '../utils/useScrollReveal';

/**
 * Wraps children with a scroll-triggered reveal animation.
 * Adds the 'scroll-reveal visible' class pair when the element enters the viewport.
 */
const ScrollReveal = ({ children, className = '', as: Tag = 'div', delay = 0 }) => {
  const [ref, isVisible] = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={`scroll-reveal ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export default ScrollReveal;
