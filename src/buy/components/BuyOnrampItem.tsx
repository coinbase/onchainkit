import { useCallback, useMemo, useState } from 'react';
import { appleSvg } from '../../internal/svg/appleSvg';
import { cardSvg } from '../../internal/svg/cardSvg';
import { coinbaseLogoSvg } from '../../internal/svg/coinbaseLogoSvg';
import { infoSvg } from '../../internal/svg/infoSvg';
import { background, border, cn, color, text } from '../../styles/theme';
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
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { setIsDropdownOpen } = useBuyContext();

  const handleClick = useCallback(() => {
    setIsDropdownOpen(false);
    onClick();
  }, [onClick, setIsDropdownOpen]);

  const showOverlay = useCallback(() => {
    setIsOverlayVisible(true);
  }, []);

  const hideOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

  // TODO: Remove after figuring out how to hide Apple Pay on desktop
  const tooltip = useMemo(() => {
    if (name !== 'Apple Pay') return null;
    return (
      <>
        <div
          data-testid="ockBuyApplePayInfo"
          className="h-2.5 w-2.5 cursor-pointer object-cover"
          onMouseEnter={showOverlay}
          onMouseLeave={hideOverlay}
        >
          {infoSvg}
        </div>
        {isOverlayVisible && (
          <div
            className={cn(
              'absolute top-0 right-0 translate-y-[-140%] translate-x-[100%] flex',
              'whitespace-nowrap p-2',
              border.radius,
              background.inverse,
              text.legal,
            )}
          >
            Only on mobile and Safari
          </div>
        )}
      </>
    );
  }, [isOverlayVisible, name]);

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
        <div className="flex items-center gap-1 relative">
          <div>{name}</div>
          {tooltip}
        </div>
        <div className={cn('text-xs', color.foregroundMuted)}>
          {description}
        </div>
      </div>
    </button>
  );
}
