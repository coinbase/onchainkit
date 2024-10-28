import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'light' | 'dark';
type ThemeContextProps = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    const rootElement = document.documentElement;
    const observer = new MutationObserver(() => {
      if (rootElement.classList.contains('dark')) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    });

    observer.observe(rootElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    if (rootElement.classList.contains('dark')) {
      setTheme('dark');
    }

    return () => observer.disconnect();
  }, []);

  const values = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
}
