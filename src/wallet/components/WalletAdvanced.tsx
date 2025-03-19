'use client';

import { cn } from '@/styles/theme';
import type { WalletAdvancedReact } from '../types';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { WalletAdvancedContent } from './WalletAdvancedContent';
import { WalletAdvancedProvider } from './WalletAdvancedProvider';
import { WalletAdvancedTokenHoldings } from './WalletAdvancedTokenHoldings';
import { WalletAdvancedTransactionActions } from './WalletAdvancedTransactionActions';
import { WalletAdvancedWalletActions } from './WalletAdvancedWalletActions';
import { useWalletContext } from './WalletProvider';

const defaultWalletAdvancedChildren = (
  <>
    <WalletAdvancedWalletActions />
    <WalletAdvancedAddressDetails />
    <WalletAdvancedTransactionActions />
    <WalletAdvancedTokenHoldings />
  </>
);

export function WalletAdvanced({
  children,
  classNames,
  swappableTokens,
}: WalletAdvancedReact) {
  const { isSubComponentOpen, showSubComponentAbove, alignSubComponentRight } =
    useWalletContext();

  if (!isSubComponentOpen) {
    return null;
  }

  return (
    <WalletAdvancedProvider>
      <div
        data-testid="ockWalletAdvancedContainer"
        className={cn(
          'absolute',
          showSubComponentAbove ? 'bottom-full' : 'top-full',
          alignSubComponentRight ? 'right-0' : 'left-0',
        )}
      >
        <WalletAdvancedContent
          classNames={classNames}
          swappableTokens={swappableTokens}
        >
          {children || defaultWalletAdvancedChildren}
        </WalletAdvancedContent>
      </div>
    </WalletAdvancedProvider>
  );
}
