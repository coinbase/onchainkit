'use client';

import { cn, color, text } from '@/styles/theme';
import { TokenImage } from '@/token';
import type {
  WalletAdvancedTokenHoldingsProps,
  WalletAdvancedTokenDetailsProps,
} from '../types';
import { useWalletAdvancedContext } from './WalletAdvancedProvider';

export function WalletAdvancedTokenHoldings({
  classNames,
}: WalletAdvancedTokenHoldingsProps) {
  const { tokenBalances, isFetchingPortfolioData, animations } =
    useWalletAdvancedContext();

  if (isFetchingPortfolioData || !tokenBalances || tokenBalances.length === 0) {
    return (
      <div
        data-testid="ockWalletAdvanced_LoadingPlaceholder"
        className="my-2 h-44 w-80"
      />
    ); // Prevent layout shift
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4',
        'my-2 h-44 max-h-44 w-full',
        'scrollbar-hidden overflow-y-auto',
        animations.content,
        classNames?.container,
      )}
      data-testid="ockWalletAdvanced_TokenHoldings"
    >
      {tokenBalances.map((tokenBalance, index) => (
        <TokenDetails
          key={`${tokenBalance.address}-${index}`}
          token={{
            address: tokenBalance.address,
            chainId: tokenBalance.chainId,
            decimals: tokenBalance.decimals,
            image: tokenBalance.image,
            name: tokenBalance.name,
            symbol: tokenBalance.symbol,
          }}
          balance={
            Number(tokenBalance.cryptoBalance) /
            10 ** Number(tokenBalance.decimals)
          }
          valueInFiat={Number(tokenBalance.fiatBalance)}
        />
      ))}
    </div>
  );
}

function TokenDetails({
  token,
  balance,
  valueInFiat,
  classNames,
  tokenImgSize = 32,
}: WalletAdvancedTokenDetailsProps) {
  const formattedBalance = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(balance);

  const formattedValueInFiat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(valueInFiat);

  return (
    <div
      className={cn(
        'flex w-full flex-row items-center justify-between',
        classNames?.container,
      )}
    >
      <div
        className={cn('flex flex-row items-center gap-2', classNames?.tokenImg)}
      >
        <TokenImage token={token} size={tokenImgSize} />
        <div className="flex flex-col">
          <span
            className={cn(
              text.label1,
              color.foreground,
              'max-w-52 overflow-hidden text-ellipsis whitespace-nowrap text-left',
              classNames?.tokenName,
            )}
          >
            {token.name?.trim()}
          </span>
          <span
            className={cn(
              text.legal,
              color.foregroundMuted,
              classNames?.tokenBalance,
            )}
          >
            {`${formattedBalance} ${token.symbol}`}
          </span>
        </div>
      </div>
      <span
        className={cn(
          text.label2,
          color.foregroundMuted,
          classNames?.fiatValue,
        )}
      >
        {formattedValueInFiat}
      </span>
    </div>
  );
}
