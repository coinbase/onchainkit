'use client';

import { cn } from '@/styles/theme';
import type { WalletAdvancedReact } from '../types';
import { WalletAdvancedAddressDetails } from './WalletAdvancedAddressDetails';
import { WalletAdvancedTokenHoldings } from './WalletAdvancedTokenHoldings';
import { WalletAdvancedTransactionActions } from './WalletAdvancedTransactionActions';
import { WalletAdvancedWalletActions } from './WalletAdvancedWalletActions';
import { WalletDropdownContent } from './WalletDropdownContent';
import { useWalletContext } from './WalletProvider';

const defaultWalletAdvancedChildren = (
  <>
    <WalletAdvancedWalletActions />
    <WalletAdvancedAddressDetails />
    <WalletAdvancedTransactionActions />
    <WalletAdvancedTokenHoldings />
  </>
);

/**
 * @deprecated Use the `WalletDropdown` component instead.
 */

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
    <div
      data-testid="ockWalletAdvancedContainer"
      className={cn(
        'absolute',
        showSubComponentAbove ? 'bottom-full' : 'top-full',
        alignSubComponentRight ? 'right-0' : 'left-0',
      )}
    >
      <WalletDropdownContent
        classNames={classNames}
        swappableTokens={swappableTokens}
      >
        {children || defaultWalletAdvancedChildren}
      </WalletDropdownContent>
    </div>
  );
}
