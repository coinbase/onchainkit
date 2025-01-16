import type React from 'react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../core-react/internal/hooks/useTheme';
import { cn } from '../../styles/theme';
import { DismissableLayer } from './DismissableLayer';
import { FocusTrap } from './FocusTrap';

type DialogProps = {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  modal?: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
};

/**
 * Dialog primitive that handles:
 * Portaling to document.body
 * Focus management (trapping focus within dialog)
 * Click outside and escape key dismissal
 * Proper ARIA attributes for accessibility
 */
export function Dialog({
  children,
  isOpen,
  modal = true,
  onClose,
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
}: DialogProps) {
  const componentTheme = useTheme();
  const dialogRef = useRef<HTMLDivElement>(null);

  if (!isOpen) {
    return null;
  }

  const dialog = (
    <div
      className={cn(
        componentTheme,
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-black/50 transition-opacity duration-200',
        'fade-in animate-in duration-200',
      )}
    >
      <FocusTrap active={isOpen}>
        <DismissableLayer onDismiss={onClose}>
          <div
            aria-modal={modal}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            data-testid="ockDialog"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
              }
            }}
            ref={dialogRef}
            role="dialog"
            className="zoom-in-95 animate-in duration-200"
          >
            {children}
          </div>
        </DismissableLayer>
      </FocusTrap>
    </div>
  );

  return createPortal(dialog, document.body);
}
