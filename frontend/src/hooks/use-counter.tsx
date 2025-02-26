'use client';

import { useState, useRef, useEffect } from 'react';

export const useAnimatedCounter = (end: number, duration = 1500): number => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef(0);

  useEffect(() => {
    countRef.current = 0;
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTimeRef.current) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);

      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
};
