import { useEffect } from 'react';
import { background, cn } from '../../styles/theme';
import { closeSvg } from '../svg/closeSvg';
import { getToastPosition } from '../utils/getToastPosition';

type ToastProps = {
  className?: string;
  durationMs?: number;
  position: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Toast({
  className,
  durationMs = 3000,
  position = 'bottom-center',
  isVisible,
  onClose,
  children,
}: ToastProps) {
  console.log('rendering the global toast');
  const positionClass = getToastPosition(position);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isVisible) {
        onClose();
      }
    }, durationMs);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [durationMs, isVisible, onClose]);

  if (!isVisible) {
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
      data-testid="ockToast"
    >
      <div className="flex items-center gap-4 p-2">{children}</div>
      <button
        className="p-2"
        onClick={onClose}
        type="button"
        data-testid="ockCloseButton"
      >
        {closeSvg}
      </button>
    </div>
  );
}
