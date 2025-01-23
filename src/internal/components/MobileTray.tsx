import { useTheme } from '@/core-react/internal/hooks/useTheme';
import { DismissableLayer } from '@/internal/primitives/DismissableLayer';
import { FocusTrap } from '@/internal/primitives/FocusTrap';
import { zIndex } from '@/styles/constants';
import { background, cn } from '@/styles/theme';

type MobileTrayProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
};

export function MobileTray({
  children,
  className,
  isOpen,
  onClose,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: MobileTrayProps) {
  const componentTheme = useTheme();

  return (
    <>
      {isOpen && (
        <div
          className={cn(
            'fixed inset-0',
            'bg-black bg-opacity-20 dark:bg-white dark:bg-opacity-10',
            zIndex.modal,
          )}
          data-testid="ockMobileTrayOverlay"
        />
      )}
      <FocusTrap active={isOpen}>
        <DismissableLayer onDismiss={onClose}>
          <div
            data-testid="ockMobileTray"
            role="dialog"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            className={cn(
              componentTheme,
              background.default,
              zIndex.tray,
              'fixed right-0 bottom-0 left-0',
              'transform rounded-t-3xl p-2 transition-transform',
              'fade-in slide-in-from-bottom-1/2 animate-in',
              className,
            )}
          >
            {children}
          </div>
        </DismissableLayer>
      </FocusTrap>
    </>
  );
}
