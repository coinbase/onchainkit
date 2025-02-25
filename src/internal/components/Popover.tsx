import { useTheme } from '@/internal/hooks/useTheme';
import { zIndex } from '@/styles/constants';
import { cn } from '@/styles/theme';
import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { DismissableLayer } from './DismissableLayer';
import { FocusTrap } from './FocusTrap';

type Position = 'top' | 'right' | 'bottom' | 'left';
type Alignment = 'start' | 'center' | 'end';

type PopoverProps = {
  /** Determines how the popover aligns with the anchor */
  align?: Alignment;
  /** The element that the popover will be positioned relative to. */
  anchor: HTMLElement | null;
  children?: React.ReactNode;
  onClose?: () => void;
  /** Spacing (in pixels) between the anchor element and the popover content. */
  offset?: number;
  /** Determines which side of the anchor element the popover will appear. */
  position?: Position;
  isOpen?: boolean;
  /** Reference to the element that triggered the popover (e.g., a button that opened it). */
  trigger?: React.RefObject<HTMLElement>;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
};

/** Calculates the initial position of the popover based on the position prop. */
function getInitialPosition(
  triggerRect: DOMRect,
  contentRect: DOMRect,
  position: Position,
  offset: number,
): { top: number; left: number } {
  let top = 0;
  let left = 0;

  switch (position) {
    case 'top':
      top = triggerRect.top - contentRect.height - offset;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset;
      break;
    case 'left':
      left = triggerRect.left - contentRect.width - offset;
      break;
    case 'right':
      left = triggerRect.right + offset;
      break;
  }

  return { top, left };
}

/** Adjusts the initial position based on the alignment prop. */
function adjustAlignment(
  triggerRect: DOMRect,
  contentRect: DOMRect,
  initialPosition: { top: number; left: number },
  align: Alignment,
  position: Position,
): { top: number; left: number } {
  const { top: initialTop, left: initialLeft } = initialPosition;
  let top = initialTop;
  let left = initialLeft;

  const isVerticalPosition = position === 'top' || position === 'bottom';

  switch (align) {
    case 'start':
      if (isVerticalPosition) {
        left = triggerRect.left;
      } else {
        top = triggerRect.top;
      }
      break;
    case 'center':
      if (isVerticalPosition) {
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      } else {
        top = triggerRect.top + (triggerRect.height - contentRect.height) / 2;
      }
      break;
    case 'end':
      if (isVerticalPosition) {
        left = triggerRect.right - contentRect.width;
      } else {
        top = triggerRect.bottom - contentRect.height;
      }
      break;
  }

  return { top, left };
}

/** Popover primitive that handles:
 * - Positioning relative to anchor element
 * - Focus management
 * - Click outside and escape key dismissal
 * - Portal rendering
 * - Proper ARIA attributes */
export function Popover({
  children,
  anchor,
  isOpen,
  onClose,
  position = 'bottom',
  align = 'center',
  offset = 8,
  trigger,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'aria-describedby': ariaDescribedby,
}: PopoverProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const componentTheme = useTheme();

  const updatePosition = useCallback(() => {
    if (!anchor || !contentRef.current) {
      return;
    }

    const triggerRect = anchor.getBoundingClientRect();
    const contentRect = contentRef.current?.getBoundingClientRect();

    if (!triggerRect || !contentRect) {
      return;
    }

    const initialPosition = getInitialPosition(
      triggerRect,
      contentRect,
      position,
      offset,
    );
    const finalPosition = adjustAlignment(
      triggerRect,
      contentRect,
      initialPosition,
      align,
      position,
    );

    contentRef.current.style.top = `${finalPosition.top}px`;
    contentRef.current.style.left = `${finalPosition.left}px`;
  }, [anchor, position, offset, align]);

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

  const popover = (
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
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
            className={cn('pointer-events-auto fixed')}
            data-testid="ockPopover"
            ref={contentRef}
            role="dialog"
          >
            {children}
          </div>
        </DismissableLayer>
      </FocusTrap>
    </div>
  );

  return createPortal(popover, document.body);
}
