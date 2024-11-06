import { useEffect, useMemo } from 'react';
import { background, cn } from '../../styles/theme';
import { closeSvg } from '../svg/closeSvg';

type ToastProps = {
  className?: string;
  durationMs?: number;
  position: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
  isToastVisible: boolean;
  setIsToastVisible: (isToastVisible: boolean) => void;
  children: React.ReactNode;
};

export function Toast({
  className,
  durationMs = 3000,
  position = 'bottom-center',
  isToastVisible,
  setIsToastVisible,
  children,
}: ToastProps) {
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
        setIsToastVisible(false);
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
      data-testid="ockToast"
    >
      <div className="flex items-center gap-4 p-2">{children}</div>
      <button
        className="p-2"
        onClick={() => setIsToastVisible(false)}
        type="button"
        data-testid="ockCloseButton"
      >
        {closeSvg}
      </button>
    </div>
  );
}
