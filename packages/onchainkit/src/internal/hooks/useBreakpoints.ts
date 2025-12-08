import { useEffect, useState } from 'react';

// Tailwind breakpoints
const BREAKPOINTS = {
  sm: '(max-width: 640px)',
  md: '(min-width: 641px) and (max-width: 768px)',
  lg: '(min-width: 769px) and (max-width: 1023px)',
  xl: '(min-width: 1024px) and (max-width: 1279px)',
  '2xl': '(min-width: 1280px)',
};

export function useBreakpoints() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<
    string | undefined
  >(undefined);

  // handles SSR case where window would be undefined,
  // once component mounts on client, hook sets correct breakpoint
  useEffect(() => {
    // get the current breakpoint based on media queries
    const getCurrentBreakpoint = () => {
      const entries = Object.entries(BREAKPOINTS) as Array<[string, string]>;
      for (const [key, query] of entries) {
        if (window.matchMedia(query).matches) {
          return key;
        }
      }
      return 'md';
    };

    // set initial breakpoint
    setCurrentBreakpoint(getCurrentBreakpoint());

    // listen changes in the window size
    const handleResize = () => {
      setCurrentBreakpoint(getCurrentBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return currentBreakpoint;
}
