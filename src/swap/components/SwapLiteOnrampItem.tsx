import { cn, color } from '../../styles/theme';
import { appleSvg } from '../../internal/svg/appleSvg';
import { coinbaseLogoSvg } from '../../internal/svg/coinbaseLogoSvg';
import { cardSvg } from '../../internal/svg/cardSvg';
import { useSwapLiteContext } from './SwapLiteProvider';
import { useCallback } from 'react';

type OnrampItemReact = {
  name: string;
  description: string;
  onClick: () => void;
  svg?: React.ReactNode;
  icon: string;
};

const ONRAMP_ICON_MAP: Record<string, React.ReactNode> = {
  applePay: appleSvg,
  coinbasePay: coinbaseLogoSvg,
  creditCard: cardSvg,
};

export function SwapLiteOnrampItem({
  name,
  description,
  onClick,
  icon,
}: OnrampItemReact) {
  const { setIsDropdownOpen } = useSwapLiteContext();

  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    onClick();
  }, [onClick, setIsDropdownOpen]);

  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        'hover:bg-[var(--ock-bg-inverse)]',
      )}
      onClick={handleClick}
      type="button"
    >
      <div className="flex h-9 w-9 items-center justify-center">
        {ONRAMP_ICON_MAP[icon]}
      </div>
      <div className="flex flex-col items-start">
        <div>{name}</div>
        <div className={cn('text-xs', color.foregroundMuted)}>
          {description}
        </div>
      </div>
    </button>
  );
}
