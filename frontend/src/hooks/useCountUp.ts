import { useState, useEffect } from 'react';

/**
 * Animates a number from 0 → target using requestAnimationFrame.
 * Applies an ease-out-cubic curve for a premium deceleration feel.
 */
export function useCountUp(
  target: number,
  duration = 1400,
  decimals = 0,
): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let rafId: number;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, decimals]);

  return count;
}
