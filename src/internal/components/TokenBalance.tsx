import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { truncateDecimalPlaces } from '@/internal/utils/truncateDecimalPlaces';
import { border, cn, color, text } from '@/styles/theme';
import { TokenImage } from '@/token';
import { useMemo } from 'react';

type TokenBalanceProps = {
  token: PortfolioTokenWithFiatValue;
  subtitle: string;
  showImage?: boolean;
  onClick?: (token: PortfolioTokenWithFiatValue) => void;
  className?: string;
} & (
  | { showAction?: true; actionText?: string; onActionPress?: () => void }
  | { showAction?: false; actionText?: never; onActionPress?: never }
);

export function TokenBalance({
  token,
  subtitle,
  showImage = true,
  onClick,
  showAction = false,
  actionText = 'Use max',
  onActionPress,
  className,
}: TokenBalanceProps) {
  const formattedValueInFiat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(token.fiatBalance);

  const tokenContent = useMemo(() => {
    return (
      <div className="grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3">
        <div className="h-10 w-10">
          {showImage && <TokenImage token={token} size={40} />}
        </div>
        <div className="flex min-w-0 flex-col text-left">
          <span
            className={cn(
              text.headline,
              color.foreground,
              'overflow-hidden text-ellipsis whitespace-nowrap',
            )}
          >
            {token.name?.trim()}
          </span>
          <span className={cn(text.label2, color.foregroundMuted)}>
            {`${truncateDecimalPlaces(
              token.cryptoBalance / 10 ** token.decimals,
              2,
            )} ${token.symbol} ${subtitle}`}
          </span>
        </div>
        <div className="text-right">
          {showAction ? (
            <span
              aria-label={actionText}
              onClick={(e) => {
                e.stopPropagation();
                onActionPress?.();
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                onActionPress?.();
              }}
              className={cn(
                text.label2,
                color.primary,
                border.radius,
                'ml-auto p-0.5 font-bold',
                'border border-transparent hover:border-[--ock-line-primary]',
              )}
            >
              {actionText}
            </span>
          ) : (
            <span
              className={cn(
                text.label2,
                color.foregroundMuted,
                'whitespace-nowrap',
              )}
            >
              {formattedValueInFiat}
            </span>
          )}
        </div>
      </div>
    );
  }, [
    showImage,
    token,
    subtitle,
    showAction,
    actionText,
    onActionPress,
    formattedValueInFiat,
  ]);

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(token)}
        className={cn(
          'flex w-full items-center justify-start gap-4 px-2 py-1',
          className,
        )}
        data-testid="ockTokenBalanceButton"
      >
        {tokenContent}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-start gap-4 px-2 py-1',
        className,
      )}
      data-testid="ockTokenBalanceDiv"
    >
      {tokenContent}
    </div>
  );
}
