'use client';
import App from './App.tsx';
import type { ReactNode } from 'react';

type WalletComponentsReact = {
  children: ReactNode;
};

export default function WalletComponents({ children }: WalletComponentsReact) {
  return (
    <App>
      <div className="mt-10 mb-28 flex justify-center">{children}</div>
    </App>
  );
}
