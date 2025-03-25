import { DismissableLayer } from '@/internal/components/DismissableLayer';
import { FocusTrap } from '@/internal/components/FocusTrap';
import { useTheme } from '@/internal/hooks/useTheme';
import { zIndex } from '@/styles/constants';
import { background, cn } from '@/styles/theme';
import { createPortal } from 'react-dom';

type BottomSheetProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
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
  triggerRef,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: BottomSheetProps) {
  const componentTheme = useTheme();

  if (!isOpen) {
    return null;
  }

  const bottomSheet = (
    <div data-portal-origin="true">
      <FocusTrap active={isOpen}>
        <DismissableLayer
          onDismiss={onClose}
          triggerRef={triggerRef}
          preventTriggerEvents={!!triggerRef}
        >
          <div
            aria-describedby={ariaDescribedby}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            data-testid="ockBottomSheet"
            role="dialog"
            className={cn(
              componentTheme,
              background.default,
              zIndex.modal,
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
    </div>
  );

  return createPortal(bottomSheet, document.body);
}
