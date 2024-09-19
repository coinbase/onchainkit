import { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { closeSvg } from '../../internal/svg/closeSvg';
import { background, cn, color, text } from '../../styles/theme';

import { useSwapContext } from './SwapProvider';
import { successSvg } from '../../internal/svg/successSvg';

type SwapToastReact = {
  className?: string; // An optional CSS class name for styling the toast component.
  durationMs?: number; // An optional value to customize time until toast disappears
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right'; // An optional position property to specify the toast's position on the screen.
};

export function SwapToast({
  className,
  durationMs = 3000,
  position = 'bottom-center',
}: SwapToastReact) {
  const { isToastVisible, setIsToastVisible } = useSwapContext();

  const closeToast = useCallback(() => {
    setIsToastVisible?.(false);
  }, [setIsToastVisible]);

  const positionClass = useMemo(() => {
    if (position === 'bottom-right') {
      return 'bottom-5 left-3/4';
    }
    if (position === 'top-right') {
      return 'top-[100px] left-3/4';
    }
    if (position === 'top-center') {
      return 'top-[100px] left-2/4';
    }
    return 'bottom-5 left-2/4';
  }, [position]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isToastVisible) {
        setIsToastVisible?.(false);
      }
    }, durationMs);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [durationMs, isToastVisible, setIsToastVisible]);

  if (!isToastVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        background.default,
        'flex animate-enter items-center justify-between rounded-lg',
        'p-2 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]',
        '-translate-x-2/4 fixed z-20',
        positionClass,
        className,
      )}
    >
      <div className="flex items-center gap-4 p-2">
        <div className={cn(text.label2, className)}>{successSvg}</div>
      </div>
      <div className={cn(text.label1, 'text-nowrap', className)}>
        <p className={color.foreground}>Successful!</p>
      </div>
      <button
        className="p-2"
        onClick={closeToast}
        type="button"
        data-testid="ockCloseButton"
      >
        {closeSvg}
      </button>
    </div>
  );
}
