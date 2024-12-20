import { Tooltip } from '@/ui-react/internal/components/Tooltip';
import { useCallback } from 'react';
import { appleSvg } from '../../internal/svg/appleSvg';
import { cardSvg } from '../../internal/svg/cardSvg';
import { coinbaseLogoSvg } from '../../internal/svg/coinbaseLogoSvg';
import { cn, color, text } from '../../styles/theme';
import { useBuyContext } from './BuyProvider';

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

export function BuyOnrampItem({
  name,
  description,
  onClick,
  icon,
}: OnrampItemReact) {
  const { setIsDropdownOpen } = useBuyContext();

  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    onClick();
  }, [onClick, setIsDropdownOpen]);

  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg p-2',
        'hover:bg-[var(--ock-bg-inverse)]',
        text.label2,
      )}
      onClick={handleClick}
      type="button"
      data-testid={`ock-${icon}OnrampItem`}
    >
      <div className="flex h-9 w-9 items-center justify-center">
        {ONRAMP_ICON_MAP[icon]}
      </div>
      <div className="flex flex-col items-start">
        <div className="relative flex items-center gap-1">
          <div>{name}</div>
          {name === 'Apple Pay' && (
            <Tooltip content="Only on mobile and Safari" />
          )}
        </div>
        <div className={cn('text-xs', color.foregroundMuted)}>
          {description}
        </div>
      </div>
    </button>
  );
}
