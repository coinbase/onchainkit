import { background, border, cn, color, text } from '@/styles/theme';
import { TokenImage, type Token } from '@/token';

type TokenBalanceProps = {
  className?: string;
  onActionPress: () => void;
  token: Token;
  amount: string;
  subtitle: string;
  showAction?: boolean;
  showImage?: boolean;
};

export function TokenBalance({
  className,
  onActionPress,
  token,
  amount,
  subtitle,
  showAction = false,
  showImage = true,
}: TokenBalanceProps) {
  return (
    <div
      className={cn(
        background.alternate,
        border.radius,
        'flex items-center justify-start gap-4 p-3 px-4',
        className,
      )}
      data-testid="ockEarnBalance"
    >
      {showImage && <TokenImage token={token} size={28} />}
      <div className={cn('flex flex-col', color.foreground)}>
        <div className={text.headline}>{`${amount} ${token.symbol}`}</div>
        <div className={cn(text.label2, color.foregroundMuted)}>{subtitle}</div>
      </div>
      {showAction && (
        <button
          onClick={onActionPress}
          className={cn(text.label2, color.primary, 'ml-auto')}
          type="button"
          aria-label="Use max"
        >
          Use max
        </button>
      )}
    </div>
  );
}
