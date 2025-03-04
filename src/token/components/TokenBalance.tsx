import { formatFiatAmount } from '@/internal/utils/formatFiatAmount';
import { truncateDecimalPlaces } from '@/internal/utils/truncateDecimalPlaces';
import { border, cn, color, text } from '@/styles/theme';
import { TokenImage } from '@/token/components/TokenImage';
import { useCallback } from 'react';
import { formatUnits } from 'viem';
import type { TokenBalanceProps } from '../types';

export function TokenBalance({
  token,
  onClick,
  classNames,
  ...contentProps
}: TokenBalanceProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(token)}
        className={cn(
          'flex w-full items-center justify-start gap-4 px-2 py-1',
          classNames?.container,
        )}
        data-testid="ockTokenBalanceButton"
      >
        <TokenBalanceContent
          token={token}
          {...contentProps}
          classNames={classNames}
        />
      </button>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-start gap-4 px-2 py-1',
        classNames?.container,
      )}
      data-testid="ockTokenBalance"
    >
      <TokenBalanceContent
        token={token}
        {...contentProps}
        classNames={classNames}
      />
    </div>
  );
}

function TokenBalanceContent({
  token,
  subtitle,
  showImage = true,
  actionText = 'Use max',
  onActionPress,
  tokenSize = 40,
  classNames,
}: TokenBalanceProps) {
  const formattedFiatValue = formatFiatAmount({
    amount: token.fiatBalance,
    currency: 'USD',
  });

  const formattedCryptoValue = truncateDecimalPlaces(
    formatUnits(BigInt(token.cryptoBalance), token.decimals),
    3,
  );

  const handleActionPress = useCallback(
    (
      e:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.KeyboardEvent<HTMLDivElement>,
    ) => {
      e.stopPropagation();
      onActionPress?.();
    },
    [onActionPress],
  );

  return (
    <div className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3">
      <div className="h-10 w-10">
        {showImage && <TokenImage token={token} size={tokenSize} />}
      </div>
      <div className="flex min-w-0 flex-col text-left">
        <span
          className={cn(
            text.headline,
            color.foreground,
            'overflow-hidden text-ellipsis whitespace-nowrap',
            classNames?.tokenName,
          )}
        >
          {token.name?.trim()}
        </span>
        <span
          className={cn(
            text.label2,
            color.foregroundMuted,
            classNames?.tokenValue,
          )}
        >
          {`${formattedCryptoValue} ${token.symbol} ${subtitle ?? ''}`}
        </span>
      </div>
      <div className="text-right">
        {onActionPress ? (
          <div
            role="button"
            data-testid="ockTokenBalanceAction"
            aria-label={actionText}
            onClick={handleActionPress}
            onKeyDown={handleActionPress}
            className={cn(
              text.label2,
              color.primary,
              border.radius,
              'ml-auto cursor-pointer p-0.5 font-bold',
              'border border-transparent hover:border-[--ock-line-primary]',
              classNames?.action,
            )}
          >
            {actionText}
          </div>
        ) : (
          <span
            className={cn(
              text.label2,
              color.foregroundMuted,
              'whitespace-nowrap',
              classNames?.fiatValue,
            )}
          >
            {formattedFiatValue}
          </span>
        )}
      </div>
    </div>
  );
}
