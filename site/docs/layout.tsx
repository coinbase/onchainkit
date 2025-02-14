import type { ReactNode } from 'react';
import ThemeProvider from './contexts/Theme.tsx';

export default function Layout({ children }: { children: ReactNode }) {
  // Fixes loading of dynamic imports during deployments
  // https://vite.dev/guide/build#load-error-handling
  if (typeof window !== 'undefined') {
    window.addEventListener('vite:preloadError', () => {
      window.location.reload();
    });
  }
  return <ThemeProvider>{children}</ThemeProvider>;
}
