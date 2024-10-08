import { useEffect, useState } from 'react';
import type { ComponentTheme } from './types';
import { useOnchainKit } from './useOnchainKit';

export function useTheme(): string {
  const {
    config: { theme, mode },
  } = useOnchainKit();

  console.log('theme:', theme, 'mode:', mode);

  const [currentTheme, setCurrentTheme] = useState<ComponentTheme>('day');

  useEffect(() => {
    // Create a media query to detect system preference for dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    console.log('System prefers dark:', mediaQuery.matches);

    const updateTheme = (prefersDarkMode: boolean) => {
      if (theme) {
        // If a theme is explicitly set, use it.
        // All themes currently have one default mode. When multiple modes are supported,
        // we can handle: setCurrentTheme(isDarkMode ? `${theme}-dark` : `${theme}-light`);
        console.log('Using explicit theme:', theme);
        setCurrentTheme(theme);
      } else {
        // If no theme is specified, determine based on mode
        // Theme selection logic:
        // 1. If mode is 'light', use 'day' theme
        // 2. If mode is 'dark', use 'midnight' theme
        // 3. If mode is 'auto' or undefined, use system preference
        if (mode === 'light') {
          console.log('Using light mode');
          setCurrentTheme('day');
        } else if (mode === 'dark') {
          console.log('Using dark mode');
          setCurrentTheme('midnight');
        } else {
          console.log(
            'Using system preference:',
            prefersDarkMode ? 'dark' : 'light',
          );
          setCurrentTheme(prefersDarkMode ? 'midnight' : 'day');
        }
      }
    };

    const handleChange = (e: MediaQueryListEvent) => updateTheme(e.matches);

    // Initial theme update
    updateTheme(mediaQuery.matches);

    // Add event listener for system preference changes
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup function to remove the event listener
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mode]); // Re-run effect if theme or mode changes

  console.log('useTheme currentTheme: ', currentTheme);
  return currentTheme;
}
