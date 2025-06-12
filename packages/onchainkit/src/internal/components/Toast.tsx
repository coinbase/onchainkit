import * as ToastPrimitives from '@radix-ui/react-toast';
import { ComponentProps } from 'react';
import { cn } from '../../styles/theme';
import { CloseSvg } from '../svg/closeSvg';
import { getToastPosition } from '../utils/getToastPosition';

const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = ToastPrimitives.Viewport;
const ToastRoot = ToastPrimitives.Root;

export type ToastProps = {
  className?: string;
  startTimeout?: boolean;
  position?: 'top-center' | 'top-right' | 'bottom-center' | 'bottom-right';
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animation?: boolean;
} & Pick<ComponentProps<typeof ToastProvider>, 'duration'>;

const getSwipeDirection = (position: ToastProps['position']) => {
  if (position === 'bottom-center') {
    return 'up';
  }
  if (position === 'top-center') {
    return 'down';
  }

  return 'right';
};

const animationClassnameByPosition = {
  'top-center': 'animate-enterDown',
  'top-right': 'animate-enterRight',
  'bottom-center': 'animate-enterUp',
  'bottom-right': 'animate-enterRight',
};

export const Toast = ({
  children,
  duration = 5000,
  open,
  position = 'bottom-center',
  className,
  onClose,
  animation = true,
}: ToastProps) => {
  return (
    <ToastProvider
      swipeDirection={getSwipeDirection(position)}
      duration={duration}
    >
      <ToastRoot
        open={open}
        onOpenChange={(flag) => {
          if (!flag) {
            onClose();
          }
        }}
        className={cn(
          'ock-toast',
          'bg-ock-bg-default text-ock-text-default',
          'flex items-center justify-between rounded-lg',
          'p-2 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.12)]',
          animation && animationClassnameByPosition[position],
          animation &&
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          className,
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
          <CloseSvg />
        </button>
      </ToastRoot>
      <ToastViewport
        className={cn('fixed', getToastPosition(position))}
        data-testid="ockToastViewport"
      />
    </ToastProvider>
  );
};
