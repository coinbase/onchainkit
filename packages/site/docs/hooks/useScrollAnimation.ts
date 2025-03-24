import { animate } from 'motion';
import { useEffect, useRef } from 'react';

export function useScrollAnimation(
  options = {
    threshold: 0.2,
    springConfig: { mass: 1, stiffness: 100, damping: 15 },
  },
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(
            element,
            {
              opacity: [0, 1],
              y: [50, 0],
            } as const as { opacity: number[]; y: number[] },
            {
              duration: 0.8,
              ease: [0.22, 0.03, 0.26, 1],
              delay: 0.2,
            },
          );
          observer.disconnect();
        }
      },
      { threshold: options.threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold]);

  return ref;
}
