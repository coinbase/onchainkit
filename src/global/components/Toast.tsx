import { useEffect, useMemo } from 'react';
import { background, cn } from '../../styles/theme';
import { closeSvg } from '../../internal/svg/closeSvg';

type ToastProps = {
  className?: string;
  durationMs?: number;
  position: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
  transactionHash: string;
  isToastVisible: boolean;
  closeToast: () => void;
  children: React.ReactNode;
};

export function Toast({
  className,
  durationMs = 3000,
  position = 'bottom-center',
  isToastVisible,
  closeToast,
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
        isToastVisible = false;
      }
    }, durationMs);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [durationMs, isToastVisible]);

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
        className
      )}
      data-testid="GlobalToast"
    >
      <div className="flex items-center gap-4 p-2">
        {children}
        {/* swap success toast */}
        {/* <div className={cn(text.label2)}>{successSvg}</div>
        <div className={cn(text.label1, 'text-nowrap')}>
          <p className={color.foreground}>Successful</p>
        </div>
        <div className={cn(text.label1, 'text-nowrap')}>
          <a
            href={`${chainExplorer}/tx/${transactionHash}`}
            target="_blank"
            rel="noreferrer"
          >
            <span className={cn(text.label1, color.primary)}>
              View transaction
            </span>
          </a>
        </div> */}
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
