'use client';
import AppWithRK from './AppWithRK.tsx';
import type { ReactNode } from 'react';

type WalletComponentsReact = {
  children: ReactNode;
};

export default function WalletComponentsWithRK({
  children,
}: WalletComponentsReact) {
  return (
    <AppWithRK>
      <div className="mt-10 mb-28 flex justify-center">{children}</div>
    </AppWithRK>
  );
}
