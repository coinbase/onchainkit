import type { PortfolioTokenWithFiatValue } from '@/api/types';
import { formatFiatAmount } from '@/internal/utils/formatFiatAmount';
import { truncateDecimalPlaces } from '@/internal/utils/truncateDecimalPlaces';
import { border, cn, color, text } from '@/styles/theme';
import { TokenImage } from '@/token';
import { formatUnits } from 'viem';

type TokenBalanceProps = {
  token: PortfolioTokenWithFiatValue;
  subtitle: string;
  showImage?: boolean;
  onClick?: (token: PortfolioTokenWithFiatValue) => void;
  className?: string;
  tokenSize?: number;
  tokenNameClassName?: string;
  tokenValueClassName?: string;
  fiatValueClassName?: string;
  actionClassName?: string;
} & (
  | { showAction?: true; actionText?: string; onActionPress?: () => void }
  | { showAction?: false; actionText?: never; onActionPress?: never }
);

export function TokenBalance({
  onClick,
  className,
  token,
  ...contentProps
}: TokenBalanceProps) {
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      {...(onClick && {
        type: 'button',
        onClick: () => onClick(token),
      })}
      className={cn(
        'flex w-full items-center justify-start gap-4 px-2 py-1',
        className,
      )}
      data-testid="ockTokenBalanceButton"
    >
      <TokenBalanceContent token={token} {...contentProps} />
    </Wrapper>
  );
}

function TokenBalanceContent({
  token,
  subtitle,
  showImage = true,
  showAction = false,
  actionText = 'Use max',
  onActionPress,
  tokenSize = 40,
  tokenNameClassName,
  tokenValueClassName,
  fiatValueClassName,
  actionClassName,
}: TokenBalanceProps) {
  const formattedFiatValue = formatFiatAmount({
    amount: token.fiatBalance,
    currency: 'USD',
  });

  const formattedCryptoValue = truncateDecimalPlaces(
    formatUnits(BigInt(token.cryptoBalance), token.decimals),
    3,
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
            tokenNameClassName,
          )}
        >
          {token.name?.trim()}
        </span>
        <span
          className={cn(
            text.label2,
            color.foregroundMuted,
            tokenValueClassName,
          )}
        >
          {`${formattedCryptoValue} ${token.symbol} ${subtitle}`}
        </span>
      </div>
      <div className="text-right">
        {showAction ? (
          <div
            role="button"
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
              'ml-auto cursor-pointer p-0.5 font-bold',
              'border border-transparent hover:border-[--ock-line-primary]',
              actionClassName,
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
              fiatValueClassName,
            )}
          >
            {formattedFiatValue}
          </span>
        )}
      </div>
    </div>
  );
}
