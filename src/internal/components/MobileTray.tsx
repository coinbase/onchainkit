import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { DismissableLayer } from '@/internal/primitives/DismissableLayer';
import { FocusTrap } from '@/internal/primitives/FocusTrap';
import { zIndex } from '@/styles/constants';
import { background, cn } from '@/styles/theme';

type MobileTrayProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onAnimationEnd?: () => void;
  animation?: {
    tray: string;
    overlay: string;
  };
  className?: string;
};

export function MobileTray({
  children,
  className,
  animation,
  isOpen,
  onAnimationEnd,
  onClose,
}: MobileTrayProps) {
  const componentTheme = useTheme();
  return (
    <div
      className={cn(
        componentTheme,
        'fixed inset-0',
        'bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-10',
        animation?.overlay,
        zIndex.modal,
      )}
    >
      <FocusTrap active={isOpen}>
        <DismissableLayer onDismiss={onClose}>
          <div
            onAnimationEnd={onAnimationEnd}
            className={cn(
              background.default,
              zIndex.tray,
              'fixed right-0 bottom-0 left-0',
              'transform rounded-t-3xl p-2 transition-transform',
              animation
                ? animation.tray
                : `${isOpen ? 'translate-y-0' : 'translate-y-full'}`,
              className,
            )}
            data-testid="ockMobileTray"
          >
            {children}
          </div>
        </DismissableLayer>
      </FocusTrap>
    </div>
  );
}
