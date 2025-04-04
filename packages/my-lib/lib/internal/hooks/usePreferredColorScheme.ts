import { useEffect, useState } from 'react';

export function usePreferredColorScheme(): 'light' | 'dark' {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(mediaQuery.matches ? 'dark' : 'light');

    function updateColorScheme(event: MediaQueryListEvent) {
      setColorScheme(event.matches ? 'dark' : 'light');
    }

    mediaQuery.addEventListener('change', updateColorScheme);
    return () => mediaQuery.removeEventListener('change', updateColorScheme);
  }, []);

  return colorScheme;
}
