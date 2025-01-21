'use client';

import type { WalletAdvancedReact } from '../types';
import { WalletAdvancedContent } from './WalletAdvancedContent';
import { WalletAdvancedProvider } from './WalletAdvancedProvider';

export function WalletAdvanced({ children }: WalletAdvancedReact) {
  return (
    <WalletAdvancedProvider>
      <WalletAdvancedContent>{children}</WalletAdvancedContent>
    </WalletAdvancedProvider>
  );
}
