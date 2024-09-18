'use client';
import type { ReactNode } from 'react';
import App from './App.tsx';

type WalletComponentsReact = {
  children: ReactNode;
};

export default function WalletComponents({ children }: WalletComponentsReact) {
  return (
    <App>
      <div className="my-10 flex justify-center">{children}</div>
    </App>
  );
}
