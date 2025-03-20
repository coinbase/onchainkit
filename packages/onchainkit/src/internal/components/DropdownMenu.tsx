import { useTheme } from '@/internal/hooks/useTheme';
import { getHorizontalPosition } from '@/internal/utils/getHorizontalPosition';
import { zIndex } from '@/styles/constants';
import { cn } from '@/styles/theme';
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DismissableLayer } from './DismissableLayer';
import { FocusTrap } from './FocusTrap';

type DropdownMenuProps = {
  /** Determines how the menu aligns with the trigger element */
  align?: 'start' | 'center' | 'end';
  /** Content of the dropdown menu */
  children: React.ReactNode;
  isOpen?: boolean;
  /** Space between the trigger and menu in pixels */
  offset?: number;
  /** Callback for when the dropdown should close */
  onClose?: () => void;
  /** The element that triggers the dropdown menu */
  trigger: React.RefObject<HTMLElement>;
  'aria-label'?: string;
};

/**
 * DropdownMenu primitive that handles:
 * - Menu positioning relative to trigger
 * - Focus management
 * - Click outside and escape key dismissal
 * - Keyboard navigation
 * - Proper ARIA attributes for accessibility
 */
export function DropdownMenu({
  align = 'start',
  children,
  isOpen,
  offset = 8,
  onClose,
  trigger,
  'aria-label': ariaLabel,
}: DropdownMenuProps) {
  const componentTheme = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!trigger?.current || !contentRef.current) {
      return;
    }

    const triggerRect = trigger.current.getBoundingClientRect();
    const menuRect = contentRef.current.getBoundingClientRect();

    if (!triggerRect || !menuRect) {
      return;
    }

    const left = getHorizontalPosition({
      triggerRect,
      contentRect: menuRect,
      align,
    });

    contentRef.current.style.top = `${triggerRect.bottom + offset}px`;
    contentRef.current.style.left = `${left}px`;
  }, [trigger, offset, align]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, updatePosition]);

  if (!isOpen) {
    return null;
  }

  const dropdownMenu = (
    <div
      className={cn(
        componentTheme,
        zIndex.dropdown,
        'pointer-events-none fixed',
      )}
      data-portal-origin="true"
    >
      <FocusTrap active={isOpen}>
        <DismissableLayer onDismiss={onClose} triggerRef={trigger}>
          <div
            ref={contentRef}
            className={cn('pointer-events-auto fixed')}
            role="listbox"
            data-testid="ockDropdownMenu"
            aria-label={ariaLabel}
          >
            {children}
          </div>
        </DismissableLayer>
      </FocusTrap>
    </div>
  );

  return createPortal(dropdownMenu, document.body);
}
