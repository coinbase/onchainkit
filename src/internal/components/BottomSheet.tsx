import { DismissableLayer } from '@/internal/components/primitives/DismissableLayer';
import { FocusTrap } from '@/internal/components/primitives/FocusTrap';
import { useTheme } from '@/internal/hooks/useTheme';
import { background, cn } from '@/styles/theme';
import { createPortal } from 'react-dom';

type BottomSheetProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
};

export function BottomSheet({
  children,
  className,
  isOpen,
  onClose,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: BottomSheetProps) {
  const componentTheme = useTheme();

  const bottomSheet = (
    <>
      {isOpen && (
        <div
          className={cn('fixed inset-0', 'bg-black bg-opacity-20')}
          data-testid="ockBottomSheetOverlay"
        />
      )}
      <FocusTrap active={isOpen}>
        <DismissableLayer onDismiss={onClose} preventTriggerEvents={true}>
          <div
            aria-describedby={ariaDescribedby}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            data-testid="ockBottomSheet"
            role="dialog"
            className={cn(
              componentTheme,
              background.default,
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

  return createPortal(bottomSheet, document.body);
}
