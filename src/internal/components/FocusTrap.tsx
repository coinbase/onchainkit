import type React from 'react';
import { useEffect, useRef } from 'react';

const FOCUSABLE_ELEMENTS_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface FocusTrapProps {
  active?: boolean;
  children?: React.ReactNode;
}

/**
 * FocusTrap ensures keyboard focus remains within a contained area for accessibility
 */
export function FocusTrap({ active = true, children }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }
    // Store currently focused element to restore later
    previousFocusRef.current = document.activeElement as HTMLElement;

    if (containerRef.current) {
      // Query all interactive elements that can receive focus
      const firstFocusable = containerRef.current.querySelector<HTMLElement>(
        FOCUSABLE_ELEMENTS_SELECTOR,
      );
      firstFocusable?.focus();
    }

    return () => {
      // Restore focus to previous element when trap is destroyed
      previousFocusRef.current?.focus();
    };
  }, [active]);

  const getFocusableElements = () =>
    containerRef.current?.querySelectorAll<HTMLElement>(
      FOCUSABLE_ELEMENTS_SELECTOR,
    );

  const handleTabNavigation = (
    event: React.KeyboardEvent,
    elements: NodeListOf<HTMLElement>,
  ) => {
    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];
    const isFirstElement = document.activeElement === firstElement;
    const isLastElement = document.activeElement === lastElement;

    if (event.shiftKey && isFirstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && isLastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!active || event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements();
    if (!focusableElements?.length) {
      return;
    }

    handleTabNavigation(event, focusableElements);
  };

  return (
    <div
      data-testid="ockFocusTrap"
      onKeyDown={handleKeyDown}
      ref={containerRef}
    >
      {children}
    </div>
  );
}
