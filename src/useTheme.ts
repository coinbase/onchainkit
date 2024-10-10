import { useEffect, useState } from 'react';
import type { ComponentTheme, UseThemeReact } from './types';
import { useOnchainKit } from './useOnchainKit';

export function useTheme(): UseThemeReact {
  const { appearance } = useOnchainKit();
  const { theme, mode } = appearance || {};

  // Start with the default theme
  const [currentTheme, setCurrentTheme] =
    useState<UseThemeReact>('default-light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Helper to get the theme variant based on user preference (light/dark)
    const getThemeVariant = (
      baseTheme: ComponentTheme,
      prefersDarkMode: boolean,
    ): UseThemeReact => {
      // If the theme doesn't support light/dark variants, return it as is
      if (
        baseTheme === 'cyberpunk' ||
        baseTheme === 'base' ||
        baseTheme === 'minimal'
      ) {
        return baseTheme;
      }

      // For 'default', return the appropriate light/dark variant
      return prefersDarkMode ? 'default-dark' : 'default-light';
    };

    // Determine the theme based on mode and system preference
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: TODO Refactor this component
    const getTheme = (prefersDarkMode: boolean): UseThemeReact => {
      if (theme) {
        if (mode === 'auto') {
          return getThemeVariant(theme, prefersDarkMode);
        }
        if (mode === 'light') {
          return getThemeVariant(theme, false); // Force light variant
        }
        if (mode === 'dark') {
          return getThemeVariant(theme, true); // Force dark variant
        }
        return getThemeVariant(theme, prefersDarkMode); // Fallback to auto behavior if no mode is specified
      }

      // If no theme is provided, default to light/dark variants of 'default'
      return mode === 'light'
        ? 'default-light'
        : mode === 'dark'
          ? 'default-dark'
          : prefersDarkMode
            ? 'default-dark'
            : 'default-light';
    };

    // Update the theme when mode, theme, or OS preference changes
    const updateTheme = () => {
      const newTheme = getTheme(mediaQuery.matches);
      console.log('Mode:', mode, 'Theme:', newTheme); // Log mode and theme

      if (newTheme !== currentTheme) {
        setCurrentTheme(newTheme);
      }
    };

    updateTheme(); // Set initial theme
    mediaQuery.addEventListener('change', updateTheme); // Listen for OS theme changes

    return () => mediaQuery.removeEventListener('change', updateTheme); // Cleanup listener
  }, [theme, mode, currentTheme]);
  console.log('currentTheme: ', currentTheme);
  return currentTheme;
}
