import { infoSvg } from '@/internal/svg/infoSvg';
import { background, border, cn, text } from '@/styles/theme';
import { useCallback, useState } from 'react';

type TooltipReact = {
  children?: React.ReactNode;
  content: React.ReactNode;
};

export function Tooltip({ children = infoSvg, content }: TooltipReact) {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const showOverlay = useCallback(() => {
    setIsOverlayVisible(true);
  }, []);

  const hideOverlay = useCallback(() => {
    setIsOverlayVisible(false);
  }, []);

  return (
    <>
      <div
        data-testid="ockBuyApplePayInfo"
        className={cn('h-2.5 w-2.5 cursor-pointer object-cover')}
        onMouseEnter={showOverlay}
        onMouseLeave={hideOverlay}
      >
        {children}
      </div>
      {isOverlayVisible && (
        <div
          className={cn(
            'absolute top-0 right-0 flex translate-x-[100%] translate-y-[-100%]',
            'whitespace-nowrap p-2',
            border.radius,
            background.inverse,
            text.legal,
            border.lineDefault,
          )}
        >
          {content}
        </div>
      )}
    </>
  );
}
