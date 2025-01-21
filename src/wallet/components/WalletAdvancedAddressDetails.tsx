'use client';

import { Avatar, Badge, Name } from '@/identity';
import { Spinner } from '@/internal/components/Spinner';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback, useState } from 'react';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';
import { useWalletContext } from './WalletProvider';

export function WalletAdvancedAddressDetails() {
  const { address, chain, isSubComponentClosing } = useWalletContext();
  const { animations } = useWalletAdvancedContext();
  const [copyText, setCopyText] = useState('Copy');

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(address ?? '');
      setCopyText('Copied');
      setTimeout(() => setCopyText('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      setCopyText('Failed to copy');
      setTimeout(() => setCopyText('Copy'), 2000);
    }
  }, [address]);

  if (isSubComponentClosing || !chain) {
    return <div className="mt-1 h-28 w-10" />; // Prevent layout shift
  }

  return (
    <div
      className={cn(
        'mt-2 flex flex-col items-center justify-center',
        color.foreground,
        text.body,
        animations.content,
      )}
    >
      <div className="h-10 w-10">
        <Avatar address={address} chain={chain} className="pointer-events-none">
          <Badge />
        </Avatar>
      </div>
      <div className="group relative mt-2 text-base">
        <button
          type="button"
          onClick={handleCopyAddress}
          data-testid="ockWalletAdvanced_NameButton"
        >
          <Name
            address={address}
            chain={chain}
            className="hover:text-[var(--ock-text-foreground-muted)] active:text-[var(--ock-text-primary)]"
          />
        </button>
        <button
          type="button"
          onClick={handleCopyAddress}
          className={cn(
            pressable.alternate,
            text.legal,
            color.foreground,
            border.default,
            border.radius,
            'absolute top-full right-0 z-10 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
          )}
          aria-live="polite"
          data-testid="ockWalletAdvanced_NameTooltip"
        >
          {copyText}
        </button>
      </div>
      <AddressBalanceInFiat />
    </div>
  );
}

function AddressBalanceInFiat() {
  const { portfolioFiatValue, isFetchingPortfolioData } =
    useWalletAdvancedContext();

  const formattedValueInFiat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(portfolioFiatValue));

  if (isFetchingPortfolioData) {
    return (
      <div className="mt-1 h-8 w-full">
        <Spinner />
      </div>
    );
  }

  if (portfolioFiatValue === null || portfolioFiatValue === undefined) {
    return null;
  }

  return (
    <div
      className={cn(text.title1, 'mt-1 font-normal')}
      data-testid="ockWalletAdvanced_AddressBalance"
    >
      {formattedValueInFiat}
    </div>
  );
}
