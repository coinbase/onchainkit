import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { truncateDecimalPlaces } from '@/internal/utils/truncateDecimalPlaces';
import { cn, color, text } from '@/styles/theme';
import { TokenImage } from '@/token';
import { useMemo } from 'react';

type TokenBalanceProps = {
  token: PortfolioTokenWithFiatValue;
  subtitle: string;
  showImage?: boolean;
  onClick?: (token: PortfolioTokenWithFiatValue) => void;
  className?: string;
} & (
  | { showAction?: true; onActionPress?: () => void }
  | { showAction?: false; onActionPress?: never }
);

export function TokenBalance({
  token,
  subtitle,
  showImage = true,
  onClick,
  showAction = false,
  onActionPress,
  className,
}: TokenBalanceProps) {
  const formattedValueInFiat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(token.fiatBalance);

  const tokenContent = useMemo(() => {
    return (
      <>
        {showImage && <TokenImage token={token} size={32} />}
        <div className="flex flex-col text-left">
          <span
            className={cn(
              text.label1,
              color.foreground,
              'max-w-52 overflow-hidden text-ellipsis whitespace-nowrap text-left',
            )}
          >
            {token.name?.trim()}
          </span>
          <span className={cn(text.legal, color.foregroundMuted)}>
            {`${truncateDecimalPlaces(
              token.cryptoBalance / 10 ** token.decimals,
              2,
            )} ${token.symbol} ${subtitle}`}
          </span>
        </div>
        {showAction ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onActionPress?.();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.stopPropagation();
                onActionPress?.();
              }
            }}
            className={cn(
              text.label2,
              color.primary,
              'ml-auto p-0.5 hover:font-bold',
            )}
            aria-label="Use max"
          >
            Use max
          </span>
        ) : (
          <span className={cn(text.label2, color.foregroundMuted, 'ml-auto')}>
            {formattedValueInFiat}
          </span>
        )}
      </>
    );
  }, [
    showAction,
    token,
    formattedValueInFiat,
    showImage,
    onActionPress,
    subtitle,
  ]);

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(token)}
        className={cn(
          'flex w-full items-center justify-start gap-4 p-3 px-4',
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
        'flex w-full items-center justify-start gap-4 p-3 px-4',
        className,
      )}
      data-testid="ockTokenBalanceDiv"
    >
      {tokenContent}
    </div>
  );
}
