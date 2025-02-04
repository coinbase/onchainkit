'use client';

import type { WalletAdvancedReact } from '../types';
import { WalletAdvancedContent } from './WalletAdvancedContent';
import { WalletAdvancedProvider } from './WalletAdvancedProvider';

export function WalletAdvanced({
  children,
  classNames,
  swappableTokens,
}: WalletAdvancedReact) {
  return (
    <WalletAdvancedProvider>
      <WalletAdvancedContent
        classNames={classNames}
        swappableTokens={swappableTokens}
      >
        {children}
      </WalletAdvancedContent>
    </WalletAdvancedProvider>
  );
}
