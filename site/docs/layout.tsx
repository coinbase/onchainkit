import type { ReactNode } from 'react';
import ThemeProvider from './contexts/Theme.tsx';

export default function Layout({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
