'use client';

import { Avatar, Name } from '@/identity';
import { Spinner } from '@/internal/components/Spinner';
import { zIndex } from '@/styles/constants';
import { border, cn, color, pressable, text } from '@/styles/theme';
import { useCallback, useState } from 'react';
import { useWalletContext } from './WalletProvider';
import { usePortfolio } from '../hooks/usePortfolio';
import { RequestContext } from '@/core/network/constants';
import { useAccount } from 'wagmi';

type WalletAdvancedAddressDetailsProps = {
  classNames?: {
    container?: string;
    avatar?: string;
    nameButton?: string;
    fiatBalance?: string;
  };
};

export function WalletAdvancedAddressDetails({
  classNames,
}: WalletAdvancedAddressDetailsProps) {
  const { address, chain, animations } = useWalletContext();
  const [copyText, setCopyText] = useState('Copy');

  const handleCopyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(String(address));
      setCopyText('Copied');
      setTimeout(() => setCopyText('Copy'), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
      setCopyText('Failed to copy');
      setTimeout(() => setCopyText('Copy'), 2000);
    }
  }, [address]);

  if (!address || !chain) {
    return <div className="mt-1 h-28 w-10 px-4 py-3" />; // Prevent layout shift
  }

  return (
    <div
      data-testid="ockWalletAdvanced_AddressDetails"
      className={cn(
        'mt-2 flex w-88 flex-col items-center justify-center px-4 py-3',
        color.foreground,
        text.body,
        animations.content,
        classNames?.container,
      )}
    >
      <Avatar
        address={address}
        chain={chain}
        className={cn('pointer-events-none h-10 w-10', classNames?.avatar)}
      />
      <div className="group relative mt-2 text-base">
        <button
          type="button"
          onClick={handleCopyAddress}
          data-testid="ockWalletAdvanced_NameButton"
        >
          <Name
            address={address}
            chain={chain}
            className={cn(
              'hover:text-[var(--ock-text-foreground-muted)] active:text-[var(--ock-text-primary)]',
              classNames?.nameButton,
            )}
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
            zIndex.tooltip,
            'absolute top-full right-0 mt-0.5 px-1.5 py-0.5 opacity-0 transition-opacity group-hover:opacity-100',
          )}
          aria-live="polite"
          data-testid="ockWalletAdvanced_NameTooltip"
        >
          {copyText}
        </button>
      </div>
      <AddressBalanceInFiat className={classNames?.fiatBalance} />
    </div>
  );
}

function AddressBalanceInFiat({ className }: { className?: string }) {
  const { address } = useAccount();

  const { data: portfolioData, isFetching: isFetchingPortfolioData } =
    usePortfolio({ address }, RequestContext.Wallet);

  const portfolioFiatValue = portfolioData?.portfolioBalanceInUsd;

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
      className={cn(text.title1, 'mt-1 font-normal', className)}
      data-testid="ockWalletAdvanced_AddressBalance"
    >
      {formattedValueInFiat}
    </div>
  );
}
