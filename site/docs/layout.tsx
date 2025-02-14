import type { ReactNode } from 'react';
import ThemeProvider from './contexts/Theme.tsx';

export default function Layout({ children }: { children: ReactNode }) {
  // Fixes loading of dynamic imports during deployments
  if (typeof window !== 'undefined') {
    window.addEventListener('vite:preloadError', () => {
      window.location.reload();
    });
  }
  return <ThemeProvider>{children}</ThemeProvider>;
}
