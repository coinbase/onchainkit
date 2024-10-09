import { useEffect, useState } from 'react';

export function usePreferredColorScheme(): 'light' | 'dark' {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  useEffect(() => {
    function updateColorScheme(event: MediaQueryListEvent) {
      setColorScheme(event.matches ? 'dark' : 'light');
    }

    mediaQuery.addEventListener('change', updateColorScheme); // Listen for OS theme changes

    return () => mediaQuery.removeEventListener('change', updateColorScheme); // Cleanup listener
  }, [mediaQuery])

  return colorScheme;
};

