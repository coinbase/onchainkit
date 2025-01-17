import { background, cn } from '@/styles/theme';
import { zIndex } from '@/styles/constants';

type MobileTrayProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onAnimationEnd?: () => void;
  onOverlayClick: () => void;
  onEscKeyPress: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  animation?: string;
  className?: string;
};

export function MobileTray({
  children,
  className,
  animation,
  isOpen,
  onAnimationEnd,
  onOverlayClick,
  onEscKeyPress,
}: MobileTrayProps) {
  return (
    <>
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0',
            'bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-10',
            zIndex.modal,
          )}
          onClick={onOverlayClick}
          onKeyDown={onEscKeyPress}
          role="button"
          tabIndex={0}
        />
      )}
      <div
        onAnimationEnd={onAnimationEnd}
        className={cn(
          background.default,
          zIndex.tray,
          'fixed right-0 bottom-0 left-0',
          'transform rounded-t-3xl p-2 transition-transform',
          animation
            ? animation
            : `${isOpen ? 'translate-y-0' : 'translate-y-full'}`,
          className,
        )}
        data-testid="ockMobileTray"
      >
        {children}
      </div>
    </>
  );
}
