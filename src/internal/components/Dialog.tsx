import { useTheme } from '@/internal/hooks/useTheme';
import { zIndex } from '@/styles/constants';
import { cn } from '@/styles/theme';
import type React from 'react';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { DismissableLayer } from './DismissableLayer';
import { FocusTrap } from './FocusTrap';

type DialogProps = {
  children?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
  modal?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
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
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
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
        zIndex.modal,
        'fixed inset-0 flex items-center justify-center',
        'bg-black/50 transition-opacity duration-200',
        'fade-in animate-in duration-200',
      )}
      data-portal-origin="true"
    >
      <FocusTrap active={isOpen}>
        <DismissableLayer onDismiss={onClose}>
          <div
            aria-describedby={ariaDescribedby}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-modal={modal}
            className="zoom-in-95 animate-in duration-200"
            data-testid="ockDialog"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation();
              }
            }}
            ref={dialogRef}
            role="dialog"
          >
            {children}
          </div>
        </DismissableLayer>
      </FocusTrap>
    </div>
  );

  return createPortal(dialog, document.body);
}
