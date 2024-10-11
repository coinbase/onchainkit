import { useEffect, useState } from 'react';

export function usePreferredColorScheme(): 'light' | 'dark' {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    mediaQuery.matches ? 'dark' : 'light',
  );

  useEffect(() => {
    function updateColorScheme(event: MediaQueryListEvent) {
      setColorScheme(event.matches ? 'dark' : 'light');
    }

    mediaQuery.addEventListener('change', updateColorScheme);
    return () => mediaQuery.removeEventListener('change', updateColorScheme);
  }, [mediaQuery]);

  return colorScheme;
}
