import { formatFiatAmount } from '@/internal/utils/formatFiatAmount';
import { truncateDecimalPlaces } from '@/internal/utils/truncateDecimalPlaces';
import { border, cn, color, text } from '@/styles/theme';
import { TokenImage } from '@/token/components/TokenImage';
import { useMemo } from 'react';
import { formatUnits } from 'viem';
import type { TokenBalanceProps } from '../types';

export function TokenBalance({
  token,
  onClick,
  onActionPress,
  actionText = 'Max',
  classNames,
  'aria-label': ariaLabel,
  ...contentProps
}: TokenBalanceProps) {
  if (onClick) {
    return (
      <div className="relative">
        <button
          type="button"
          aria-label={ariaLabel ?? `${token.name} token balance`}
          onClick={() => onClick(token)}
          className={cn(
            'flex w-full items-center justify-start gap-4 px-2 py-1',
            classNames?.container,
          )}
          data-testid="ockTokenBalanceButton"
        >
          <TokenBalanceContent
            token={token}
            classNames={classNames}
            onActionPress={onActionPress}
            {...contentProps}
          />
        </button>
        {onActionPress && (
          <ActionButton
            actionText={actionText}
            onActionPress={onActionPress}
            className={classNames?.action}
          />
        )}
      </div>
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
      {onActionPress && (
        <ActionButton
          actionText={actionText}
          onActionPress={onActionPress}
          className={classNames?.action}
        />
      )}
    </div>
  );
}

function TokenBalanceContent({
  token,
  subtitle,
  showImage = true,
  onActionPress,
  tokenSize = 40,
  classNames,
}: TokenBalanceProps) {
  const formattedFiatValue = useMemo(
    () =>
      formatFiatAmount({
        amount: token.fiatBalance,
        currency: 'USD',
      }),
    [token.fiatBalance],
  );

  const formattedCryptoValue = useMemo(
    () =>
      truncateDecimalPlaces(
        formatUnits(BigInt(token.cryptoBalance), token.decimals),
        3,
      ),
    [token.cryptoBalance, token.decimals],
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
        {!onActionPress && (
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

function ActionButton({
  actionText,
  onActionPress,
  className,
}: Pick<TokenBalanceProps, 'actionText' | 'onActionPress'> & {
  className?: string;
}) {
  return (
    <button
      type="button"
      data-testid="ockTokenBalanceAction"
      aria-label={actionText}
      onClick={onActionPress}
      className={cn(
        text.label2,
        color.primary,
        border.radius,
        'cursor-pointer p-0.5 font-bold',
        'border border-transparent hover:border-[--ock-line-primary]',
        '-translate-y-1/2 absolute top-1/2 right-2',
        className,
      )}
    >
      {actionText}
    </button>
  );
}
